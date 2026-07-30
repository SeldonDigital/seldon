import { STOCK_THEMES_BY_ID } from "@seldon/core/themes/catalog"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import {
  buildAddCustomTokenStage,
  buildAddThemeStage,
  buildResolveThemeIdStage,
  buildSetThemeOverrideStage,
} from "../../prompt/stages/theme"
import { commit, commitFailureReason } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/** The workspace's theme entry ids, the valid targets for theme application. */
function themeIds(context: TurnContext): string[] {
  return Object.keys(context.state.workspace.themes)
}

/** One enum-constrained pick of a theme id from the workspace's real entries. */
async function resolveThemeId(
  context: TurnContext,
  purpose: string,
): Promise<
  { kind: "resolved"; themeId: string } | { kind: "message"; text: string }
> {
  const ids = themeIds(context)
  if (ids.length === 0) {
    return {
      kind: "message",
      text: "This workspace has no themes yet. Add a theme first.",
    }
  }
  if (ids.length === 1) {
    recordStep(context, "resolve_theme", true, {
      output: `Only one theme in the workspace: ${ids[0]!} (deterministic, no model call).`,
    })
    return { kind: "resolved", themeId: ids[0]! }
  }
  const { prompt, schema } = buildResolveThemeIdStage({
    message: context.message,
    purpose,
    ids,
  })
  const { value, metrics } = await callOllamaFormat<{ themeId: string }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_theme", true, {
    prompt,
    output: value.themeId,
  })
  return { kind: "resolved", themeId: value.themeId }
}

/** Handles the `set_node_theme` intent: target -> theme -> commit. */
export async function executeSetNodeTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const theme = await resolveThemeId(context, "applying a theme to a node")
  if (theme.kind === "message") return { kind: "message", text: theme.text }

  try {
    commit(context.state, {
      type: "set_node_theme",
      payload: { nodeId: target.nodeId, theme: theme.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't apply the theme: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Applied theme ${theme.themeId} to ${target.nodeId}.`,
  }
}

/** Handles the `set_component_theme` intent: active board + theme -> commit. */
export async function executeSetComponentTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const boardKey = context.resolved.resolvedKey
  if (boardKey === undefined) {
    return {
      kind: "message",
      text: "No board is active. Open the component you want to theme.",
    }
  }
  const theme = await resolveThemeId(context, "applying a theme to a component")
  if (theme.kind === "message") return { kind: "message", text: theme.text }

  try {
    commit(context.state, {
      type: "set_component_theme",
      payload: { boardKey, theme: theme.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't apply the theme: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Applied theme ${theme.themeId} to the ${boardKey} board.`,
  }
}

/** Handles the `add_theme` intent: pick a stock theme, commit its board. */
export async function executeAddTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const stockIds = Object.keys(STOCK_THEMES_BY_ID)
  const available = stockIds.filter((id) => !context.state.workspace.boards[id])
  if (available.length === 0) {
    return {
      kind: "message",
      text: "Every stock theme is already in the workspace.",
    }
  }

  const { prompt, schema } = buildAddThemeStage({
    message: context.message,
    themes: available.map((id) => ({
      id,
      name:
        STOCK_THEMES_BY_ID[id as keyof typeof STOCK_THEMES_BY_ID]?.metadata
          ?.name ?? id,
    })),
  })
  const { value, metrics } = await callOllamaFormat<{ themeId: string }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_theme", true, {
    prompt,
    output: value.themeId,
  })

  try {
    commit(context.state, {
      type: "add_theme",
      payload: { boardKey: value.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't add the theme: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return { kind: "applied", reply: `Added the ${value.themeId} theme.` }
}

/**
 * Handles the `set_theme_override` intent: theme id -> token path -> value.
 * The path is a free string guided by examples; the reducer rejects an
 * unknown path with a precise reason, which terminates the turn honestly.
 */
export async function executeSetThemeOverride(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const themeId =
    context.resolved.resourceTargetId ??
    (await (async () => {
      const theme = await resolveThemeId(context, "changing a theme token")
      return theme.kind === "resolved" ? theme.themeId : undefined
    })())
  if (!themeId) {
    return {
      kind: "message",
      text: "I couldn't tell which theme to change. Select it, or name it.",
    }
  }

  const { prompt, schema } = buildSetThemeOverrideStage({
    message: context.message,
  })
  const { value, metrics } = await callOllamaFormat<{
    path: string
    value: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_token", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

  try {
    commit(context.state, {
      type: "set_theme_override",
      payload: { themeId, path: value.path, value: value.value },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't change ${value.path}: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Set ${value.path} to ${value.value} on ${themeId}.`,
  }
}

/**
 * Handles the `add_theme_custom_token` intent. v1 supports the custom swatch
 * (the overwhelmingly common case); the 17 other token kinds terminate with a
 * clear message until their parameter shapes are wired.
 */
export async function executeAddCustomToken(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const theme = await resolveThemeId(context, "adding a custom token")
  if (theme.kind === "message") return { kind: "message", text: theme.text }

  const { prompt, schema } = buildAddCustomTokenStage({
    message: context.message,
  })
  const { value, metrics } = await callOllamaFormat<{
    kind: "swatch" | "other"
    name: string
    h: number
    s: number
    l: number
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_custom_token", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

  if (value.kind !== "swatch") {
    return {
      kind: "message",
      text: "Only custom color swatches can be added from chat so far. Other custom tokens (fonts, shadows, spacing) are coming.",
    }
  }

  try {
    commit(context.state, {
      type: "add_theme_custom_swatch",
      payload: {
        themeId: theme.themeId,
        name: value.name,
        parameters: {
          colorspace: "hsl",
          value: { hue: value.h, saturation: value.s, lightness: value.l },
        },
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't add the swatch: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Added custom swatch "${value.name}" (hsl ${value.h}, ${value.s}%, ${value.l}%) to ${theme.themeId}.`,
  }
}
