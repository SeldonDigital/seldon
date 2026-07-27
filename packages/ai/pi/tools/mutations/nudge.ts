import { defineTool } from "@earendil-works/pi-coding-agent"
import { Type } from "typebox"

import { findComponentSchema } from "@seldon/core/components/catalog"
import { getPropertyOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import {
  resolveIntentProperty,
  resolveIntentTarget,
  resolveOperation,
  resolveScaleStep,
} from "@seldon/core/rules/config/design-semantics.resolve"
import { computeNodeProperties, computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import { getNodeParentIndex } from "@seldon/core/workspace/helpers/graph/build-node-parent-index"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"

import { SHORTHAND_SIDES, isTaggedValue, propertyShape } from "../../../prompt/property-taxonomy"
import { resolveNodeTarget } from "../resolve-target"
import { textResult } from "./commit"
import { applyPropertyEdit } from "./set-properties"

import type { ToolDefinition } from "@earendil-works/pi-coding-agent"
import type { Theme } from "@seldon/core/themes/types"
import type { Workspace } from "@seldon/core/workspace/types"
import type { ResolvedContext } from "../../editor-context"
import type { TargetSpec } from "../resolve-target"
import type { PiTurnState } from "../turn-state"

/** A component's catalog id, level, and settable keys. */
interface Facts {
  catalogId: string
  keys: Set<string>
  level?: string
}

/** The target component's catalog id, level, and settable keys, or undefined. */
function componentFacts(workspace: Workspace, nodeId: string): Facts | undefined {
  const node = workspace.nodes?.[nodeId]

  if (!node) return undefined
  const catalogId = getNodeCatalogId(node, workspace)

  if (!catalogId) return undefined
  const schema = findComponentSchema(catalogId)

  if (!schema?.properties) return undefined

  return {
    catalogId,
    level: schema.level,
    keys: new Set(Object.keys(schema.properties)),
  }
}

/** The node an intent resolves against, with its property path, or a message. */
type ConceptRoute = { nodeId: string; facts: Facts; path: string } | { error: string }

function propertyOn(concept: string, facts: Facts | undefined) {
  if (!facts) return undefined

  return resolveIntentProperty(concept, facts.keys, {
    level: facts.level,
    componentId: facts.catalogId,
  })
}

/**
 * Routes a concept to the node and property that should receive the edit. It
 * prefers the selected node, but a concept that lives on the container, such as
 * the gap between children, retargets to the parent when the selected node does
 * not expose it. An intent marked `target: "parent"` biases to the parent up
 * front. Returns a message when the concept resolves nowhere or is ambiguous.
 */
function routeConcept(workspace: Workspace, selectedId: string, concept: string): ConceptRoute {
  const intent = resolveIntentTarget(concept)
  const selfFacts = componentFacts(workspace, selectedId)
  const parentId = getNodeParentIndex(workspace).get(selectedId)
  const parentFacts = parentId ? componentFacts(workspace, parentId) : undefined

  const selfRes = propertyOn(concept, selfFacts)
  const parentRes = propertyOn(concept, parentFacts)
  const preferParent = intent?.target === "parent"

  if (preferParent && parentId && parentFacts && parentRes?.status === "resolved") {
    return { nodeId: parentId, facts: parentFacts, path: parentRes.propertyPath }
  }

  if (selfFacts && selfRes?.status === "resolved") {
    return { nodeId: selectedId, facts: selfFacts, path: selfRes.propertyPath }
  }

  if (parentId && parentFacts && parentRes?.status === "resolved") {
    return { nodeId: parentId, facts: parentFacts, path: parentRes.propertyPath }
  }

  if (selfRes?.status === "ambiguous") {
    return {
      error: `"${concept}" is ambiguous on ${selfFacts!.catalogId}: it could be ${selfRes.candidates.join(" or ")}. Say which, or use set_properties.`,
    }
  }

  if (selfFacts?.keys.has(concept)) {
    return { nodeId: selectedId, facts: selfFacts, path: concept }
  }

  const where = selfFacts?.catalogId ?? selectedId

  return {
    error: `Could not route "${concept}" to a property on ${where}. Call get_component_vocabulary for its keys.`,
  }
}

/** The first `@scope.id` ordinal reference under a property value subtree. */
function findOrdinalRef(value: unknown): string | undefined {
  if (isTaggedValue(value)) {
    if (value.type === "theme.ordinal" && typeof value.value === "string") {
      return value.value
    }

    return undefined
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findOrdinalRef(item)

      if (found) return found
    }

    return undefined
  }

  if (value && typeof value === "object") {
    for (const facet of Object.values(value as Record<string, unknown>)) {
      const found = findOrdinalRef(facet)

      if (found) return found
    }
  }

  return undefined
}

/** The top-level key a candidate path writes, for example font.size -> font. */
function rootOf(path: string): string {
  const dot = path.indexOf(".")

  return dot === -1 ? path : path.slice(0, dot)
}

/**
 * Builds the write for a stepped value. A shorthand writes every side so the
 * step lands uniformly; a compound facet nests the value under its facet path;
 * an atomic key writes the value directly.
 */
function buildWrite(path: string, value: Record<string, unknown>): Record<string, unknown> {
  const root = rootOf(path)

  if (propertyShape(root) === "shorthand") {
    const sides = SHORTHAND_SIDES[root] ?? []

    return {
      [root]: Object.fromEntries(sides.map((side) => [side, value])),
    }
  }

  const segments = path.split(".")
  let nested: Record<string, unknown> = value

  for (let i = segments.length - 1; i >= 1; i--) {
    nested = { [segments[i]!]: nested }
  }

  return { [segments[0]!]: nested }
}

/**
 * Intent verb: step a concept up or down its ordinal scale. It reads the node's
 * current token, moves one step (or more) along the property's theme scale, and
 * writes the new token, so a relative request resolves to a real scale step
 * rather than the model guessing an absolute one. The concept routes to whichever
 * property the target exposes; a bare verb like "tighten" carries its direction.
 */
export function createNudgeTool(state: PiTurnState, resolved: ResolvedContext): ToolDefinition {
  return defineTool({
    name: "nudge",
    label: "Nudge",
    description:
      'Step a concept up or down its theme scale relative to the node\'s current value, for "more space", "tighter", "a bit bigger", "bolder". Concept is a design word like "spacing", "size", "weight", "corners"; direction is "increase" or "decrease" (a verb like "tighten" already implies it). Use this for relative changes instead of set_properties with an absolute token.',
    parameters: Type.Object({
      target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
        description: '"selection" for the selected node, or { "nodeId" } from the context.',
      }),
      concept: Type.String({
        description:
          'The design concept or relative verb, for example "spacing", "size", "weight", "corners", or "tighten".',
      }),
      direction: Type.Optional(
        Type.Union([Type.Literal("increase"), Type.Literal("decrease")], {
          description:
            'Which way to move. Omit when the concept is a verb that already implies it, like "tighten" or "bolder".',
        }),
      ),
      steps: Type.Optional(
        Type.Number({
          description: "How many scale steps to move. Default 1.",
        }),
      ),
      match: Type.Optional(
        Type.String({
          description: "Label or catalog id to locate the node when out of scope.",
        }),
      ),
    }),

    execute: async (_id, params) => {
      const resolution = resolveNodeTarget(
        state.workspace,
        resolved.resolvedKey,
        resolved.selectedNodeId,
        resolved.selectedBoardId,
        params.target as TargetSpec,
        params.match,
        resolved.scope,
        resolved.isolation?.allowedBoardKeys,
      )

      if (resolution.kind === "message") return textResult(resolution.text)

      // A bare relative verb ("tighten") names both the concept and direction.
      const operation = resolveOperation(params.concept)
      const concept = operation?.concept ?? params.concept
      const direction = params.direction ?? operation?.direction

      if (!direction) {
        return textResult(
          `Nudge needs a direction for "${params.concept}". Pass direction "increase" or "decrease", or use a verb like "tighten" or "bolder".`,
        )
      }

      const steps = params.steps ?? operation?.steps ?? 1

      const route = routeConcept(state.workspace, resolution.nodeId, concept)

      if ("error" in route) return textResult(route.error)
      const { nodeId: editId, facts, path } = route

      const schemaKey = getCatalogKeyForPropertyPath(path) ?? rootOf(path)
      let theme: Theme | undefined

      try {
        theme = computeWorkspaceThemes(state.workspace)[0] as unknown as Theme | undefined
      } catch {
        theme = undefined
      }

      const orderedTokens = getPropertyOptions(schemaKey, "themeOrdinal", theme).map(String)

      if (orderedTokens.length === 0) {
        return textResult(
          `"${path}" on ${facts.catalogId} has no ordinal theme scale to step. Use set_properties with an explicit value.`,
        )
      }

      const effective = computeNodeProperties(editId, state.workspace, {
        stage: "effective",
      }) as Record<string, unknown>
      const currentToken = findOrdinalRef(effective[rootOf(path)])
      const signedSteps = direction === "decrease" ? -steps : steps
      const nextToken = resolveScaleStep(currentToken, signedSteps, orderedTokens)

      if (!nextToken) {
        return textResult(`Could not step "${path}" on ${facts.catalogId}.`)
      }

      const properties = buildWrite(path, {
        type: "theme.ordinal",
        value: nextToken,
      })

      return textResult(
        applyPropertyEdit(state, resolved, {
          target: { nodeId: editId },
          properties,
          match: params.match,
        }),
      )
    },
  })
}
