import { findComponentSchema } from "@seldon/core/components/catalog"
import { getPropertyOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { getCatalogKeyForPropertyPath } from "@seldon/core/properties/schemas/helpers/property-path"
import {
  listReservedStateNames,
  listSpacingFeels,
  resolveIntentProperty,
  resolveIntentTarget,
  resolveOperation,
  resolveScaleStep,
  resolveSpacingFeel,
  resolveStateName,
} from "@seldon/core/rules/config/design-semantics.resolve"
import { computeNodeProperties, computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import { authoredBoardKeyFromName } from "@seldon/core/workspace/helpers/components/authored-board-key"
import { getSourceNodeId } from "@seldon/core/workspace/helpers/components/get-source-node-id"
import { getNodeParentIndex } from "@seldon/core/workspace/helpers/graph/build-node-parent-index"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { Type } from "typebox"

import { SHORTHAND_SIDES, isTaggedValue, propertyShape } from "../prompt/property-taxonomy"
import { ALL_ACTION_TYPES } from "../schema/action-schema"
import { resolveCatalogId } from "./catalog-ids"
import { defineSeldonTool } from "./context"
import { withCreatedIdentity } from "./created-nodes"

import type { SeldonTool } from "./context"
import type { TargetSpec } from "./resolve-target"
import type { CustomStateChoice } from "@seldon/core/rules/config/design-semantics.resolve"
import type { Theme } from "@seldon/core/themes/types"
import type { BoardKey, Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

const KNOWN_ACTION_TYPES = new Set(ALL_ACTION_TYPES)

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
 * not expose it.
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

/** Position words the align tool accepts, mapped to the 2D container anchor. */
const ALIGN_BY_POSITION: Record<string, string> = {
  center: "center",
  left: "left",
  right: "right",
  top: "top-center",
  bottom: "bottom-center",
  "top-left": "top-left",
  "top-right": "top-right",
  "bottom-left": "bottom-left",
  "bottom-right": "bottom-right",
}

/** Horizontal positions that a Text node can satisfy with inline textAlign. */
const TEXT_ALIGN_BY_POSITION: Record<string, string> = {
  left: "left",
  right: "right",
  center: "center",
  justify: "justify",
}

const ALIGN_POSITIONS = [...Object.keys(ALIGN_BY_POSITION), "justify"] as const

/** The settable keys of the component a node instantiates, or an empty set. */
function exposedKeys(workspace: Workspace, nodeId: string): Set<string> {
  const node = workspace.nodes?.[nodeId]

  if (!node) return new Set()
  const catalogId = getNodeCatalogId(node, workspace)

  if (!catalogId) return new Set()
  const schema = findComponentSchema(catalogId)

  if (!schema?.properties) return new Set()

  return new Set(Object.keys(schema.properties))
}

/** True when the node's effective width is the "fill" resize option. */
function widthIsFill(workspace: Workspace, nodeId: string): boolean {
  const effective = computeNodeProperties(nodeId, workspace, {
    stage: "effective",
  }) as Record<string, unknown>
  const width = effective.width

  return isTaggedValue(width) && width.type === "option" && width.value === "fill"
}

/** Typographic roles that map to the theme font look ids. */
const ROLES = [
  "display",
  "heading",
  "subheading",
  "title",
  "subtitle",
  "callout",
  "body",
  "label",
  "tagline",
  "code",
] as const

/** Weight names that map to the theme font weight scale ids. */
const WEIGHTS = [
  "thin",
  "xlight",
  "light",
  "normal",
  "medium",
  "semibold",
  "bold",
  "xbold",
  "black",
] as const

/** The workspace custom states as name choices, or an empty list. */
function customStateChoices(workspace: Workspace): CustomStateChoice[] {
  const states = workspace.metadata.customStates ?? []

  return states.map((state) => ({ key: state.key, label: state.label }))
}

const setProperties = defineSeldonTool({
  name: "set_properties",
  label: "Set Properties",
  description:
    'Primary tool to change a node\'s properties. Values may be loose: a bare string or number becomes an exact value, a descriptive size or color word ("big", "primary") resolves to the matching theme token, and an "@scope.key" string becomes a theme reference. Omit scope to let the tool pick the reach; pass scope "all" only to change the shared source on purpose.',
  kind: "write",
  parameters: Type.Object({
    target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
      description: '"selection" for the selected node, or { "nodeId" } from the context.',
    }),
    scope: Type.Optional(
      Type.Union([Type.Literal("instance"), Type.Literal("all")], {
        description:
          'Optional. "instance" overrides just this node; "all" edits the shared component source so every instance follows. Omit it and the tool decides from the selection scope, defaulting to a local override.',
      }),
    ),
    properties: Type.Record(Type.String(), Type.Unknown()),
    match: Type.Optional(
      Type.String({ description: "Label or catalog id to locate the node when out of scope." }),
    ),
  }),
  run: (ctx, params) =>
    ctx.applyPropertyEdit({
      target: params.target as TargetSpec,
      scope: params.scope as "instance" | "all" | undefined,
      properties: params.properties as Record<string, unknown>,
      match: params.match as string | undefined,
    }),
})

const addComponent = defineSeldonTool({
  name: "add_component",
  label: "Add Component",
  description:
    "Add a component from the catalog to the workspace as its own board. Pass its catalog id (from list_catalog_ids). To place it inside an existing node, use insert_component.",
  kind: "write",
  parameters: Type.Object({
    catalogId: Type.String({
      description: "Catalog id of the component to add (from list_catalog_ids).",
    }),
  }),
  run: (ctx, params) => {
    const resolved = resolveCatalogId(params.catalogId as string)

    if (!resolved.id) return resolved.message ?? "Unknown catalog id."
    const catalogId = resolved.id

    if (ctx.getWorkspace().boards[catalogId]) {
      return `Component "${catalogId}" is already in the workspace. Select its board, or use insert_component to place an instance of it under a parent node.`
    }

    const before = ctx.getWorkspace()
    const applied = ctx.propose({
      type: "add_component",
      payload: { boardKey: catalogId },
    } as WorkspaceAction)
    const message = resolved.note ? `${resolved.note}\n${applied}` : applied

    return withCreatedIdentity(before, ctx.getWorkspace(), message)
  },
})

const createAuthoredComponent = defineSeldonTool({
  name: "create_authored_component",
  label: "Create Authored Component",
  description:
    "Create an authored component board (a user-defined component with no catalog schema). The board key derives from the name, so no parent is needed. Root it in a Frame or Container, then fill it with insert_component, reusing existing catalog or workspace components before creating new ones.",
  kind: "write",
  parameters: Type.Object({
    name: Type.String({
      description: "Human name for the component. The board key and export name derive from it.",
    }),
    level: Type.Union(
      [
        Type.Literal("element"),
        Type.Literal("part"),
        Type.Literal("module"),
        Type.Literal("screen"),
      ],
      {
        description:
          "Declared component level. Controls what the component may contain and its export folder.",
      },
    ),
    rootKind: Type.Optional(
      Type.Union([Type.Literal("frame"), Type.Literal("container")], {
        description: "Root template: a Frame or a flex Container. Defaults to frame.",
        default: "frame",
      }),
    ),
    intent: Type.Optional(Type.String({ description: "Short description of the component." })),
    tags: Type.Optional(
      Type.Array(Type.String(), { description: "Optional tags for the component." }),
    ),
  }),
  run: (ctx, params) => {
    const name = params.name as string
    const boardKey = authoredBoardKeyFromName(name)

    if (!boardKey) return "Authored component name must contain a letter or number."
    const workspace = ctx.getWorkspace()

    if (workspace.boards[boardKey] || workspace.playgrounds?.[boardKey]) {
      return `A component with the key "${boardKey}" already exists in this workspace. Pick a different name, or edit the existing board.`
    }

    const before = ctx.getWorkspace()
    const applied = ctx.propose({
      type: "add_authored_component",
      payload: {
        name,
        rootKind: (params.rootKind as string | undefined) ?? "frame",
        level: params.level,
        intent: params.intent,
        tags: params.tags,
      },
    } as WorkspaceAction)

    return withCreatedIdentity(before, ctx.getWorkspace(), applied)
  },
})

const insertComponent = defineSeldonTool({
  name: "insert_component",
  label: "Insert Component",
  description:
    "Insert a catalog component under an existing parent node (for example the selection). Pass its catalog id (from list_catalog_ids). Creates the board if it does not exist yet. Only nest what the hierarchy allows.",
  kind: "write",
  parameters: Type.Object({
    catalogId: Type.String({
      description: "Catalog id of the component to insert (from list_catalog_ids).",
    }),
    parentId: Type.String({ description: "Existing parent node id." }),
    index: Type.Optional(
      Type.Number({ description: "Insertion index among the parent's children." }),
    ),
  }),
  run: (ctx, params) => {
    const resolved = resolveCatalogId(params.catalogId as string)

    if (!resolved.id) return resolved.message ?? "Unknown catalog id."
    const catalogId = resolved.id
    const parentId = params.parentId as string
    const index = params.index as number | undefined
    const action: WorkspaceAction = ctx.getWorkspace().boards[catalogId]
      ? ({
          type: "insert_default_instance",
          payload: { boardKey: catalogId, parentId, index },
        } as WorkspaceAction)
      : ({
          type: "add_component_and_insert_default_instance",
          payload: { boardKey: catalogId, target: { parentId, index } },
        } as WorkspaceAction)
    const before = ctx.getWorkspace()
    const applied = ctx.propose(action)
    const message = resolved.note ? `${resolved.note}\n${applied}` : applied

    return withCreatedIdentity(before, ctx.getWorkspace(), message)
  },
})

const insertVariantInstance = defineSeldonTool({
  name: "insert_variant_instance",
  label: "Insert Variant Instance",
  description:
    "Insert an instance of a specific existing variant under an existing parent node. Use insert_component to add a component from the catalog by its catalog id.",
  kind: "write",
  parameters: Type.Object({
    variantId: Type.String({ description: "Variant node id from the context." }),
    parentId: Type.String({ description: "Existing parent node id." }),
    index: Type.Optional(
      Type.Number({ description: "Insertion index among the parent's children." }),
    ),
  }),
  run: (ctx, params) => {
    const before = ctx.getWorkspace()
    const message = ctx.propose({
      type: "insert_variant_instance",
      payload: {
        variantId: params.variantId as string,
        target: { parentId: params.parentId as string, index: params.index as number | undefined },
      },
    } as WorkspaceAction)

    return withCreatedIdentity(before, ctx.getWorkspace(), message)
  },
})

const duplicateComponent = defineSeldonTool({
  name: "duplicate_component",
  label: "Duplicate Component",
  description:
    "Duplicate an existing component. Pass parentId to paste a copy under that node (for example the selection); omit it to duplicate in place next to the original.",
  kind: "write",
  parameters: Type.Object({
    nodeId: Type.String({ description: "Node id to duplicate, from the context." }),
    parentId: Type.Optional(
      Type.String({
        description: "Parent node id to paste the copy under. Omit to duplicate in place.",
      }),
    ),
    index: Type.Optional(
      Type.Number({ description: "Insertion index among the parent's children." }),
    ),
  }),
  run: (ctx, params) => {
    const nodeId = params.nodeId as string
    const parentId = params.parentId as string | undefined
    const index = params.index as number | undefined
    const action: WorkspaceAction =
      parentId !== undefined
        ? ({
            type: "insert_duplicate_instance",
            payload: { instanceId: nodeId, target: { parentId, index } },
          } as WorkspaceAction)
        : ({
            type: "duplicate_node",
            payload: { nodeId },
          } as WorkspaceAction)
    const before = ctx.getWorkspace()
    const message = ctx.propose(action)

    return withCreatedIdentity(before, ctx.getWorkspace(), message)
  },
})

const addVariant = defineSeldonTool({
  name: "add_variant",
  label: "Add Variant",
  description:
    "Add a new variant to a component, authored, or playground board by its board key (from the context or list_boards).",
  kind: "write",
  parameters: Type.Object({
    boardKey: Type.String({ description: "Board key from the context." }),
  }),
  run: (ctx, params) => {
    const before = ctx.getWorkspace()
    const applied = ctx.propose({
      type: "add_variant",
      payload: { boardKey: params.boardKey as BoardKey },
    } as WorkspaceAction)

    return withCreatedIdentity(before, ctx.getWorkspace(), applied)
  },
})

const moveComponent = defineSeldonTool({
  name: "move_component",
  label: "Move Component",
  description:
    "Move an existing instance under a new parent node in the same variant. Only nest what the hierarchy allows.",
  kind: "write",
  parameters: Type.Object({
    instanceId: Type.String({ description: "Instance node id to move, from the context." }),
    parentId: Type.String({ description: "New parent node id." }),
    index: Type.Optional(
      Type.Number({ description: "Insertion index among the parent's children." }),
    ),
  }),
  run: (ctx, params) =>
    ctx.propose({
      type: "move_instance",
      payload: {
        instanceId: params.instanceId as string,
        target: { parentId: params.parentId as string, index: params.index as number | undefined },
      },
    } as WorkspaceAction),
})

const reorderComponent = defineSeldonTool({
  name: "reorder_component",
  label: "Reorder Component",
  description:
    "Move an existing instance to a new position among its siblings under the same parent.",
  kind: "write",
  parameters: Type.Object({
    instanceId: Type.String({ description: "Instance node id to reorder, from the context." }),
    index: Type.Number({ description: "New index among the parent's children." }),
  }),
  run: (ctx, params) =>
    ctx.propose({
      type: "reorder_instance_in_parent",
      payload: { instanceId: params.instanceId as string, newIndex: params.index as number },
    } as WorkspaceAction),
})

const removeInstance = defineSeldonTool({
  name: "remove_instance",
  label: "Remove Instance",
  description: "Remove an instance node by its id.",
  kind: "write",
  parameters: Type.Object({
    instanceId: Type.String({ description: "Instance node id from the context." }),
  }),
  run: (ctx, params) =>
    ctx.propose({
      type: "remove_instance",
      payload: { instanceId: params.instanceId as string },
    } as WorkspaceAction),
})

const setBoardLabel = defineSeldonTool({
  name: "set_board_label",
  label: "Set Board Label",
  description: "Rename a board by its key.",
  kind: "write",
  parameters: Type.Object({
    boardKey: Type.String({ description: "Board key from the context." }),
    label: Type.String({ description: "New board label." }),
  }),
  run: (ctx, params) =>
    ctx.propose({
      type: "set_board_label",
      payload: { boardKey: params.boardKey as string, label: params.label as string },
    } as WorkspaceAction),
})

const applyActionsTool = defineSeldonTool({
  name: "apply_actions",
  label: "Apply Actions",
  description:
    'Apply several workspace actions in one call, in order. Prefer this over repeated calls: put every edit in one call. Also the escape hatch for actions without a dedicated tool. Each item is { "type", "payload" }; they run top to bottom, so create a node before setting its properties. Call get_action_spec when unsure of payload keys. Resend only items marked "rejected".',
  kind: "write",
  parameters: Type.Object({
    actions: Type.Array(
      Type.Object({
        type: Type.String({ description: "One of the allowed action types." }),
        payload: Type.Record(Type.String(), Type.Unknown()),
      }),
      { description: "Actions to apply, in order." },
    ),
  }),
  run: (ctx, params) => {
    const actions = params.actions as { type: string; payload: Record<string, unknown> }[]

    if (actions.length === 0) return "No actions provided."

    const lines = actions.map((action, index) => {
      const position = index + 1

      if (!KNOWN_ACTION_TYPES.has(action.type)) {
        return `${position}. ${action.type} rejected: unknown action type. Allowed types: ${ALL_ACTION_TYPES.join(", ")}.`
      }

      try {
        return `${position}. ${ctx.propose({
          type: action.type,
          payload: action.payload,
        } as WorkspaceAction)}`
      } catch (caught) {
        const reason = caught instanceof Error ? caught.message : "invalid action"

        return `${position}. ${action.type} rejected: ${reason}`
      }
    })

    return lines.join("\n")
  },
})

const setTextRole = defineSeldonTool({
  name: "set_text_role",
  label: "Set Text Role",
  description:
    "Apply a typographic role (title, heading, body, label, and so on) to a text node by setting its font look. Prefer this over setting size and weight by hand.",
  kind: "write",
  parameters: Type.Object({
    target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
      description: '"selection" for the selected node, or { "nodeId" } from the context.',
    }),
    role: Type.Union(
      ROLES.map((role) => Type.Literal(role)),
      { description: "A typographic role on the theme font look scale." },
    ),
  }),
  run: (ctx, params) =>
    ctx.applyPropertyEdit({
      target: params.target as TargetSpec,
      properties: {
        font: {
          preset: { type: "theme.categorical", value: `@font.${params.role as string}` },
        },
      },
    }),
})

const setEmphasis = defineSeldonTool({
  name: "set_emphasis",
  label: "Set Emphasis",
  description:
    "Set a text node's weight (bold, light, and so on) as a theme weight token. Use this to make text bold or lighter instead of set_properties.",
  kind: "write",
  parameters: Type.Object({
    target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
      description: '"selection" for the selected node, or { "nodeId" } from the context.',
    }),
    weight: Type.Union(
      WEIGHTS.map((weight) => Type.Literal(weight)),
      { description: "A named weight on the theme scale." },
    ),
  }),
  run: (ctx, params) =>
    ctx.applyPropertyEdit({
      target: params.target as TargetSpec,
      properties: {
        font: {
          weight: { type: "theme.ordinal", value: `@fontWeight.${params.weight as string}` },
        },
      },
    }),
})

const setDirection = defineSeldonTool({
  name: "set_direction",
  label: "Set Direction",
  description:
    "Set a node's reading and layout direction to ltr or rtl. Use this for right-to-left content (Hebrew, Arabic) instead of align, margin, or float.",
  kind: "write",
  parameters: Type.Object({
    target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
      description: '"selection" for the selected node, or { "nodeId" } from the context.',
    }),
    direction: Type.Union([Type.Literal("ltr"), Type.Literal("rtl")], {
      description: "Reading direction: ltr or rtl.",
    }),
  }),
  run: (ctx, params) =>
    ctx.applyPropertyEdit({
      target: params.target as TargetSpec,
      properties: { direction: { type: "option", value: params.direction } },
    }),
})

const nudge = defineSeldonTool({
  name: "nudge",
  label: "Nudge",
  description:
    'Step a concept up or down its theme scale relative to the node\'s current value, for "more space", "tighter", "a bit bigger", "bolder". Concept is a design word like "spacing", "size", "weight", "corners"; direction is "increase" or "decrease" (a verb like "tighten" already implies it). Use this for relative changes instead of set_properties with an absolute token.',
  kind: "write",
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
    steps: Type.Optional(Type.Number({ description: "How many scale steps to move. Default 1." })),
    match: Type.Optional(
      Type.String({ description: "Label or catalog id to locate the node when out of scope." }),
    ),
  }),
  run: (ctx, params) => {
    const workspace = ctx.getWorkspace()
    const match = params.match as string | undefined
    const resolution = ctx.resolveTarget(params.target as TargetSpec, match)

    if (resolution.kind === "message") return resolution.text

    // A bare relative verb ("tighten") names both the concept and direction.
    const operation = resolveOperation(params.concept as string)
    const concept = operation?.concept ?? (params.concept as string)
    const direction = (params.direction as "increase" | "decrease" | undefined) ?? operation?.direction

    if (!direction) {
      return `Nudge needs a direction for "${params.concept as string}". Pass direction "increase" or "decrease", or use a verb like "tighten" or "bolder".`
    }

    const steps = (params.steps as number | undefined) ?? operation?.steps ?? 1
    const route = routeConcept(workspace, resolution.nodeId, concept)

    if ("error" in route) return route.error
    const { facts, path } = route
    const editId = route.nodeId

    const schemaKey = getCatalogKeyForPropertyPath(path) ?? rootOf(path)
    let theme: Theme | undefined

    try {
      theme = computeWorkspaceThemes(workspace)[0] as unknown as Theme | undefined
    } catch {
      theme = undefined
    }

    const orderedTokens = getPropertyOptions(schemaKey, "themeOrdinal", theme).map(String)

    if (orderedTokens.length === 0) {
      return `"${path}" on ${facts.catalogId} has no ordinal theme scale to step. Use set_properties with an explicit value.`
    }

    const effective = computeNodeProperties(editId, workspace, {
      stage: "effective",
    }) as Record<string, unknown>
    const currentToken = findOrdinalRef(effective[rootOf(path)])
    const signedSteps = direction === "decrease" ? -steps : steps
    const nextToken = resolveScaleStep(currentToken, signedSteps, orderedTokens)

    if (!nextToken) return `Could not step "${path}" on ${facts.catalogId}.`

    const properties = buildWrite(path, { type: "theme.ordinal", value: nextToken })

    return ctx.applyPropertyEdit({ target: { nodeId: editId }, properties, match })
  },
})

const align = defineSeldonTool({
  name: "align",
  label: "Align",
  description:
    'Anchor a node within its container, or align its text: "center the title", "move the image to the top", "put the button on the right". It reads the node to pick the right property (inline textAlign for filled text, the container align anchor otherwise). Do not use it to reorder items in a stack; use reorder_component for that.',
  kind: "write",
  parameters: Type.Object({
    target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
      description: '"selection" for the selected node, or { "nodeId" } from the context.',
    }),
    position: Type.Union(
      ALIGN_POSITIONS.map((position) => Type.Literal(position)),
      {
        description:
          "Where to place it: center, left, right, top, bottom, a corner, or justify (text only).",
      },
    ),
    match: Type.Optional(
      Type.String({ description: "Label or catalog id to locate the node when out of scope." }),
    ),
  }),
  run: (ctx, params) => {
    const workspace = ctx.getWorkspace()
    const match = params.match as string | undefined
    const resolution = ctx.resolveTarget(params.target as TargetSpec, match)

    if (resolution.kind === "message") return resolution.text

    const nodeId = resolution.nodeId
    const position = params.position as string
    const keys = exposedKeys(workspace, nodeId)
    const textAlign = TEXT_ALIGN_BY_POSITION[position]

    if (keys.has("textAlign") && textAlign && widthIsFill(workspace, nodeId)) {
      return ctx.applyPropertyEdit({
        target: { nodeId },
        properties: { textAlign: { type: "option", value: textAlign } },
        match,
      })
    }

    const anchor = ALIGN_BY_POSITION[position] ?? "center"
    const parentId = getNodeParentIndex(workspace).get(nodeId)
    const parentExposesAlign =
      parentId !== undefined && exposedKeys(workspace, parentId).has("align")
    const anchorNodeId = parentExposesAlign && parentId ? parentId : nodeId

    if (!exposedKeys(workspace, anchorNodeId).has("align")) {
      return `Cannot anchor ${nodeId}: neither it nor its container exposes an align property. Use set_properties, or reorder_component to change its order.`
    }

    return ctx.applyPropertyEdit({
      target: { nodeId: anchorNodeId },
      properties: { align: { type: "option", value: anchor } },
      match,
    })
  },
})

const setStateStyle = defineSeldonTool({
  name: "set_state_style",
  label: "Set State Style",
  description:
    'Style an interaction state of a node: "make the hover state blue", "gray out the disabled button", "give focus a ring". Name the state (hover, focus, active, disabled, selected, checked, error, dragged, activated, or a workspace custom state) and the properties to set on it. It writes the node\'s source variant, since states live on variants, not instances. Values may be loose, like set_properties.',
  kind: "write",
  parameters: Type.Object({
    target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
      description: '"selection" for the selected node, or { "nodeId" } from the context.',
    }),
    state: Type.String({
      description:
        'The interaction state to style, for example "hover", "disabled", "pressed", or a custom-state name.',
    }),
    properties: Type.Record(Type.String(), Type.Unknown(), {
      description: "Property edits to apply on that state, in the same shape as set_properties.",
    }),
    match: Type.Optional(
      Type.String({ description: "Label or catalog id to locate the node when out of scope." }),
    ),
  }),
  run: (ctx, params) => {
    const workspace = ctx.getWorkspace()
    const resolution = ctx.resolveTarget(params.target as TargetSpec, params.match as string | undefined)

    if (resolution.kind === "message") return resolution.text

    const choices = customStateChoices(workspace)
    const resolvedState = resolveStateName(params.state as string, choices)

    if (!resolvedState) {
      const reserved = listReservedStateNames().join(", ")
      const custom =
        choices.length > 0
          ? ` Registered custom states: ${choices.map((c) => c.key).join(", ")}.`
          : " No custom states are registered; add one with add_custom_state first."

      return `Unknown interaction state "${params.state as string}". Use a reserved state (${reserved}) or a workspace custom state.${custom}`
    }

    const writeNodeId = getSourceNodeId(workspace, resolution.nodeId)
    const outcome = ctx.propose({
      type: "set_node_state_properties",
      payload: {
        nodeId: writeNodeId,
        state: resolvedState.key,
        properties: params.properties,
      },
    } as WorkspaceAction)

    const note =
      writeNodeId === resolution.nodeId
        ? `Styled the "${resolvedState.key}" state of ${writeNodeId}.`
        : `Styled the "${resolvedState.key}" state on the source variant ${writeNodeId}; every instance of it follows.`

    return `${outcome}\n${note}`
  },
})

const setNodeRef = defineSeldonTool({
  name: "set_node_ref",
  label: "Set Node Ref",
  description:
    "Set a node's code-name (ref handle) used as its exported identifier and file name. Applies to the exact node, including instances. Pass an empty ref to clear it.",
  kind: "write",
  parameters: Type.Object({
    target: Type.Union([Type.Literal("selection"), Type.Object({ nodeId: Type.String() })], {
      description: '"selection" for the selected node, or { "nodeId" } from the context.',
    }),
    ref: Type.String({ description: "The code name. Empty string clears the ref." }),
    match: Type.Optional(
      Type.String({ description: "Label or catalog id to locate the node when out of scope." }),
    ),
  }),
  run: (ctx, params) => {
    const resolution = ctx.resolveTarget(params.target as TargetSpec, params.match as string | undefined)

    if (resolution.kind === "message") return resolution.text

    return ctx.propose({
      type: "set_node_ref",
      payload: { nodeId: resolution.nodeId, ref: (params.ref as string).trim() },
    } as WorkspaceAction)
  },
})

const setThemeOverride = defineSeldonTool({
  name: "set_theme_override",
  label: "Set Theme Override",
  description:
    "Override a single theme token by path on an existing theme. Pass null to reset the token.",
  kind: "write",
  parameters: Type.Object({
    themeId: Type.String({ description: "Theme id from the context." }),
    path: Type.String({ description: "Token path, for example swatch.primary." }),
    value: Type.Optional(Type.Unknown()),
  }),
  run: (ctx, params) =>
    ctx.propose({
      type: "set_theme_override",
      payload: {
        themeId: params.themeId as string,
        path: params.path as string,
        value: params.value ?? null,
      },
    } as WorkspaceAction),
})

const setSpacingFeel = defineSeldonTool({
  name: "set_spacing_feel",
  label: "Set Spacing Feel",
  description:
    'Set the whole theme\'s spacing density by name ("breathe", "spacious", "cozy", "compact", "tight"), for a holistic request like "make the design breathe". It scales the theme spacing and size tokens together, so it changes every component. For one element only, use nudge or set_properties instead.',
  kind: "write",
  parameters: Type.Object({
    themeId: Type.String({ description: "Theme id from the context to change." }),
    feel: Type.Union(
      listSpacingFeels().map((feel) => Type.Literal(feel.id)),
      { description: "The named spacing density to apply." },
    ),
  }),
  run: (ctx, params) => {
    const feel = resolveSpacingFeel(params.feel as string)

    if (!feel) return `Unknown spacing feel "${params.feel as string}".`

    return ctx.propose({
      type: "set_theme_override",
      payload: {
        themeId: params.themeId as string,
        path: "modulation.parameters.baseSize",
        value: feel.baseSize,
      },
    } as WorkspaceAction)
  },
})

const setFontCollectionFamilyPreset = defineSeldonTool({
  name: "set_font_collection_family_preset",
  label: "Set Font Collection Family Preset",
  description:
    'Turn a whole family (slot) on or off. preset "all" enables every weight, "none" disables them.',
  kind: "write",
  parameters: Type.Object({
    fontCollectionId: Type.Optional(
      Type.String({ description: "Font collection entry id. Defaults to the selection." }),
    ),
    slot: Type.String({ description: "Family slot, for example primary or secondary." }),
    preset: Type.Union([Type.Literal("all"), Type.Literal("none")]),
  }),
  run: (ctx, params) => {
    const fontCollectionId =
      (params.fontCollectionId as string | undefined) ?? ctx.selection.resourceTargetId

    if (!fontCollectionId) return "No font collection is selected. Pass fontCollectionId."

    return ctx.propose({
      type: "set_font_collection_family_preset",
      payload: { fontCollectionId, slot: params.slot as string, preset: params.preset as string },
    } as WorkspaceAction)
  },
})

const setFontCollectionFamilyVariant = defineSeldonTool({
  name: "set_font_collection_family_variant",
  label: "Set Font Collection Family Variant",
  description: "Turn one weight (variant) of a family on or off.",
  kind: "write",
  parameters: Type.Object({
    fontCollectionId: Type.Optional(
      Type.String({ description: "Font collection entry id. Defaults to the selection." }),
    ),
    slot: Type.String({ description: "Family slot, for example primary." }),
    variant: Type.String({ description: "Weight token, for example regular or bold." }),
    enabled: Type.Boolean({ description: "true to enable, false to disable." }),
  }),
  run: (ctx, params) => {
    const fontCollectionId =
      (params.fontCollectionId as string | undefined) ?? ctx.selection.resourceTargetId

    if (!fontCollectionId) return "No font collection is selected. Pass fontCollectionId."

    return ctx.propose({
      type: "set_font_collection_family_variant",
      payload: {
        fontCollectionId,
        slot: params.slot as string,
        variant: params.variant as string,
        enabled: params.enabled as boolean,
      },
    } as WorkspaceAction)
  },
})

const setIconSetSubcategoryPreset = defineSeldonTool({
  name: "set_icon_set_subcategory_preset",
  label: "Set Icon Set Subcategory Preset",
  description:
    'Turn a whole subcategory on or off. preset "all" includes every icon, "none" excludes them.',
  kind: "write",
  parameters: Type.Object({
    iconSetId: Type.Optional(
      Type.String({ description: "Icon set entry id. Defaults to the selection." }),
    ),
    subcategory: Type.String({ description: "Subcategory path, for example communication/email." }),
    preset: Type.Union([Type.Literal("all"), Type.Literal("none")]),
  }),
  run: (ctx, params) => {
    const iconSetId = (params.iconSetId as string | undefined) ?? ctx.selection.resourceTargetId

    if (!iconSetId) return "No icon set is selected. Pass iconSetId."

    return ctx.propose({
      type: "set_icon_set_subcategory_preset",
      payload: {
        iconSetId,
        subcategory: params.subcategory as string,
        preset: params.preset as string,
      },
    } as WorkspaceAction)
  },
})

const setIconSetOverride = defineSeldonTool({
  name: "set_icon_set_override",
  label: "Set Icon Set Override",
  description:
    "Turn a single icon on or off. path is includedIcons.<iconId>; value true includes, false excludes.",
  kind: "write",
  parameters: Type.Object({
    iconSetId: Type.Optional(
      Type.String({ description: "Icon set entry id. Defaults to the selection." }),
    ),
    path: Type.String({ description: "Override path, for example includedIcons.arrow-right." }),
    value: Type.Optional(Type.Unknown()),
  }),
  run: (ctx, params) => {
    const iconSetId = (params.iconSetId as string | undefined) ?? ctx.selection.resourceTargetId

    if (!iconSetId) return "No icon set is selected. Pass iconSetId."

    return ctx.propose({
      type: "set_icon_set_override",
      payload: { iconSetId, path: params.path as string, value: params.value ?? null },
    } as WorkspaceAction)
  },
})

/** Every write tool, shared by Pi and MCP. */
export const MUTATION_TOOLS: SeldonTool[] = [
  setProperties,
  addComponent,
  createAuthoredComponent,
  insertComponent,
  insertVariantInstance,
  duplicateComponent,
  addVariant,
  moveComponent,
  reorderComponent,
  removeInstance,
  setBoardLabel,
  applyActionsTool,
  setTextRole,
  setEmphasis,
  setDirection,
  nudge,
  align,
  setStateStyle,
  setNodeRef,
  setThemeOverride,
  setSpacingFeel,
  setFontCollectionFamilyPreset,
  setFontCollectionFamilyVariant,
  setIconSetSubcategoryPreset,
  setIconSetOverride,
]
