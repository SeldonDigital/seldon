import { z } from "zod"

import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import { EXPOSED_ACTION_TYPES, explainExposure } from "../action-whitelist"
import { ToolError } from "../errors"
import {
  type PropertySchemaView,
  buildPropertySchemaView,
  validTopLevelPropertyKeys,
} from "../property-schema-view"
import type { BatchReceipt, BatchStep } from "../receipt"
import { buildReceipt } from "../receipt"
import { redactValue } from "../redact"
import type { Session } from "../session"
import type { ToolContext } from "./context"
import type { ViewNodeFormat, ViewNodeResult } from "../render/render-target"
import { renderTarget } from "../render/render-target"

export const applyActionsInputSchema = {
  actions: z
    .array(
      z.object({
        type: z.string().describe("A whitelisted Core action type."),
        payload: z.unknown().describe("The action's payload, per its schema."),
      }),
    )
    .min(1)
    .describe(
      "Ordered batch of workspace actions. All-or-nothing: if any action is " +
        "rejected, none are applied. Actions cannot reference ids created " +
        "earlier in the same batch — create first, read the new ids from the " +
        "receipt, then style in a second batch.",
    ),
  render: z
    .object({
      target: z
        .string()
        .min(1)
        .describe("Node id or board key to render after the batch applies."),
      format: z
        .enum(["css", "html", "image"])
        .optional()
        .describe(
          'Same semantics as view_node ("image" degrades to html when ' +
            "screenshots are unavailable).",
        ),
      theme: z.string().optional(),
      width: z
        .number()
        .int()
        .min(200)
        .max(3840)
        .optional()
        .describe("Viewport width in CSS pixels for image screenshots."),
    })
    .optional()
    .describe(
      "Render the target after a successful batch (same pipeline and " +
        "options as view_node) so edit and verification are one round trip. " +
        "On batch rejection no render runs.",
    ),
}

export interface ApplyActionsResult {
  receipt: BatchReceipt
  /** The workspace file the batch was persisted to. */
  persistedTo: string
  /** The post-edit render, when the batch asked for one. */
  render?: ViewNodeResult
  /**
   * Present when the batch applied and persisted but its render failed —
   * the edit is NOT rolled back; only the preview is missing.
   */
  renderError?: { code: string; message: string; recovery: string }
}

/** Rejects the batch if any action type is outside the whitelist. */
function assertWhitelisted(actions: Array<{ type: string }>): void {
  for (let index = 0; index < actions.length; index++) {
    const type = actions[index]!.type
    const verdict = explainExposure(type)
    if (verdict.exposed) continue

    throw new ToolError({
      code: "action_not_exposed",
      message: verdict.message,
      recovery:
        "Rebuild the batch using only exposed action types (see " +
        "detail.exposedActionTypes). No actions from this batch were applied.",
      failedAction: { index, type },
      detail: {
        classification: verdict.classification,
        exposedActionTypes: EXPOSED_ACTION_TYPES,
      },
    })
  }
}

/**
 * Hard schema gate on `set_node_properties`. Every top-level property
 * key the batch touches must have had its schema served this session. Unknown
 * keys are rejected outright; unserved-but-valid keys get the "teaching
 * bounce": the rejection carries the missing schemas and marks them served,
 * so recovery is resubmitting the identical batch.
 */
function assertPropertySchemasServed(
  session: Session,
  actions: Array<{ type: string; payload?: unknown }>,
): void {
  for (let index = 0; index < actions.length; index++) {
    const action = actions[index]!
    if (action.type !== "set_node_properties") continue

    const properties = (action.payload as { properties?: unknown } | undefined)
      ?.properties
    if (properties === null || typeof properties !== "object") continue

    const unserved: string[] = []
    for (const key of Object.keys(properties)) {
      const view = buildPropertySchemaView(key)
      if (!view) {
        throw new ToolError({
          code: "unknown_property",
          message: `set_node_properties touches "${key}", which is not a node property key.`,
          recovery:
            "Remove or rename the key and resubmit the batch. Valid top-level " +
            "keys are in detail.validKeys. No actions from this batch were applied.",
          failedAction: { index, type: action.type },
          detail: { validKeys: validTopLevelPropertyKeys() },
        })
      }
      if (!session.servedPropertySchemas.has(key)) unserved.push(key)
    }
    if (unserved.length === 0) continue

    const schemas: Record<string, PropertySchemaView> = {}
    for (const key of unserved) {
      schemas[key] = buildPropertySchemaView(key)!
      session.servedPropertySchemas.add(key)
    }
    throw new ToolError({
      code: "property_schema_not_served",
      message:
        `set_node_properties touches ${unserved.length} propert` +
        `${unserved.length === 1 ? "y" : "ies"} whose schema was not yet ` +
        `served this session: ${unserved.join(", ")}.`,
      recovery:
        "The missing schemas are attached in detail.schemas and now count as " +
        "served. Check your value cells against them, then resubmit the batch " +
        "(unchanged if it already matches). No actions from this batch were applied.",
      failedAction: { index, type: action.type },
      detail: { schemas },
    })
  }
}

/**
 * The only write path. Folds the batch through Core's reducer
 * action by action (so a rejection reports its index), then — only after the
 * whole batch is accepted — runs the disk-hash conflict check and atomically
 * persists. Any failure leaves the session workspace and the disk file
 * untouched (guaranteed by the reducer-purity suite).
 *
 * With `render`, a successful batch additionally returns a fresh
 * view_node render of the target — the same code path view_node itself runs.
 * A render failure after a persisted batch does NOT fail the call (the edit
 * stands); it is reported in `renderError` instead.
 */
export async function applyActions(
  ctx: ToolContext,
  input: {
    actions: Array<{ type: string; payload?: unknown }>
    render?: {
      target: string
      format?: ViewNodeFormat
      theme?: string
      width?: number
    }
  },
): Promise<ApplyActionsResult> {
  const open = ctx.session.requireOpen()
  assertWhitelisted(input.actions)
  assertPropertySchemasServed(ctx.session, input.actions)

  const steps: BatchStep[] = []
  let current: Workspace = open.workspace

  for (let index = 0; index < input.actions.length; index++) {
    const action = input.actions[index] as WorkspaceAction
    let next: Workspace
    try {
      next = workspaceReducer(current, action)
    } catch (error) {
      throw new ToolError({
        code: "action_rejected",
        message: (error as Error).message,
        recovery:
          "Fix this action's payload and resubmit the whole batch. No actions " +
          "from this batch were applied; the workspace and its file are unchanged.",
        failedAction: { index, type: action.type },
      })
    }
    steps.push({ type: action.type, before: current, after: next })
    current = next
  }

  // Hash-checked atomic persist. On conflict the disk wins —
  // the accepted batch is discarded, the session keeps its pre-batch state,
  // and the agent re-applies after reloading.
  ctx.session.commit(current, {
    aborted: "The batch was not applied",
    retry: "resubmit this batch",
  })

  const result: ApplyActionsResult = {
    receipt: buildReceipt(steps),
    persistedTo: open.filePath,
  }

  if (input.render) {
    try {
      result.render = await renderTarget(ctx, input.render)
    } catch (error) {
      const teaching =
        error instanceof ToolError
          ? error.teaching
          : {
              code: "render_failed" as const,
              message: (error as Error).message,
              recovery: "Render separately with view_node.",
            }
      result.renderError = {
        code: teaching.code,
        message: `The batch WAS applied and persisted; only the post-edit render failed: ${teaching.message}`,
        recovery: teaching.recovery,
      }
    }
  }

  return redactValue(result)
}
