import { produce } from "immer"
import { describe, expect, it } from "vitest"

import { getComponentSchema } from "../../components/catalog"
import { ComponentId, ComponentLevel } from "../../components/constants"
import { Colorspace } from "../../themes/constants/colorspace"
import {
  FONT_COLLECTION_BOARD_CATALOG_IDS,
  ICON_SET_BOARD_CATALOG_IDS,
  THEME_BOARD_CATALOG_IDS,
} from "../helpers/components/resource-board-catalog-ids"
import { createEmptyWorkspace } from "../helpers/create-empty-workspace"
import { DEFAULT_FONT_COLLECTION_BOARD_KEY } from "../helpers/seed/seed-default-font-collection-board"
import { DEFAULT_ICON_SET_BOARD_KEY } from "../helpers/seed/seed-default-icon-set-board"
import { DEFAULT_THEME_BOARD_KEY } from "../helpers/seed/seed-default-theme-board"
import type { ComponentTreeRef, Workspace, WorkspaceAction } from "../types"
import { workspaceReducer } from "./reducer"

const dispatch = (ws: Workspace, action: WorkspaceAction): Workspace =>
  workspaceReducer(ws, action)

const act = (type: string, payload: unknown): WorkspaceAction =>
  ({ type, payload }) as unknown as WorkspaceAction

const BOARD = ComponentId.BUTTON
const THEME_VARIANT_ID = "theme-seldon-copy"
const FC_VARIANT_ID = "fc-copy"
const IS_VARIANT_ID = "is-copy"

/** Sections that accept an `add_theme_custom_*` action. */
const ADD_THEME_SECTIONS = [
  "swatch",
  "font",
  "border",
  "gradient",
  "shadow",
  "scrollbar",
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "corners",
  "borderWidth",
  "blur",
  "spread",
  "fontSize",
  "fontWeight",
  "lineHeight",
] as const

/** Sections that accept a `remove_theme_custom_*` action (same as add). */
const REMOVE_THEME_SECTIONS = ADD_THEME_SECTIONS

function firstEntryIdOfType(
  map: Record<string, { type: string }>,
  type: string,
): string {
  const found = Object.entries(map).find(([, entry]) => entry.type === type)
  if (!found) throw new Error(`No ${type} entry found`)
  return found[0]
}

function findFreeCatalogId(ids: ReadonlySet<string>, ws: Workspace): string {
  for (const id of ids) {
    if (!ws.boards[id]) return id
  }
  throw new Error("No free catalog id available")
}

/** A seeded resource board that is not the protected default, so it can be removed. */
function findRemovableBoard(
  ids: ReadonlySet<string>,
  ws: Workspace,
  protectedKey: string,
): string {
  for (const id of ids) {
    if (ws.boards[id] && id !== protectedKey) return id
  }
  throw new Error("No removable resource board available")
}

/** A component absent from the base whose level can sit inside a button (element). */
function findAbsentChildBoard(ws: Workspace): ComponentId {
  const childLevels: ComponentLevel[] = [
    ComponentLevel.PRIMITIVE,
    ComponentLevel.ELEMENT,
    ComponentLevel.FRAME,
  ]
  for (const id of Object.values(ComponentId)) {
    if (ws.boards[id]) continue
    let level: ComponentLevel | undefined
    try {
      level = getComponentSchema(id).level
    } catch {
      continue
    }
    if (level && childLevels.includes(level)) return id
  }
  throw new Error("No absent child-compatible component found")
}

/** Builds the rich shared base workspace and captures every id the cases need. */
function buildBase() {
  let ws = createEmptyWorkspace()
  ws = dispatch(ws, act("add_component", { boardKey: BOARD }))
  ws = dispatch(ws, act("add_variant", { boardKey: BOARD }))
  ws = dispatch(ws, act("add_variant", { boardKey: BOARD }))
  ws = dispatch(ws, act("add_playground", { boardKey: "pg-1" }))
  ws = dispatch(ws, act("add_sandbox", { playgroundKey: "pg-1" }))
  ws = dispatch(
    ws,
    act("add_custom_state", { key: "mystate", label: "My State" }),
  )

  const themeDefaultId = firstEntryIdOfType(ws.themes, "default")
  ws = dispatch(
    ws,
    act("duplicate_theme", {
      themeId: themeDefaultId,
      newThemeId: THEME_VARIANT_ID,
    }),
  )

  const fcDefaultId = firstEntryIdOfType(ws["font-collections"], "default")
  ws = dispatch(
    ws,
    act("duplicate_font_collection", {
      fontCollectionId: fcDefaultId,
      newFontCollectionId: FC_VARIANT_ID,
    }),
  )

  const isDefaultId = firstEntryIdOfType(ws["icon-sets"], "default")
  ws = dispatch(
    ws,
    act("duplicate_icon_set", {
      iconSetId: isDefaultId,
      newIconSetId: IS_VARIANT_ID,
    }),
  )

  const buttonVariants = ws.boards[BOARD]!.variants as ComponentTreeRef[]
  const defaultRootId = buttonVariants[0]!.id
  const uv1Id = buttonVariants[1]!.id
  const uv2Id = buttonVariants[2]!.id
  const uv1ChildId = buttonVariants[1]!.children?.[0]?.id ?? uv1Id

  // Give uv1 extra background layers so layer remove/reorder have a slot above
  // the base layer to act on.
  ws = dispatch(
    ws,
    act("add_node_layer", { nodeId: uv1Id, property: "background", seed: {} }),
  )
  ws = dispatch(
    ws,
    act("add_node_layer", { nodeId: uv1Id, property: "background", seed: {} }),
  )

  // Seed custom theme tokens and a custom font family so the remove and rename
  // actions have an existing target to operate on.
  ws = produce(ws, (draft) => {
    const overrides = draft.themes[THEME_VARIANT_ID]!.overrides as Record<
      string,
      Record<string, unknown>
    >
    for (const section of REMOVE_THEME_SECTIONS) {
      // A swatch seed needs a resolvable color so removing it can inline the
      // value into referencing nodes; other sections only need a name stub.
      const seed =
        section === "swatch"
          ? {
              name: "seed",
              parameters: {
                colorspace: Colorspace.HSL,
                value: { hue: 0, saturation: 0, lightness: 50 },
              },
            }
          : { name: "seed" }
      overrides[section] = {
        ...(overrides[section] ?? {}),
        custom1: seed,
      }
    }
    const fcOverrides = draft["font-collections"][FC_VARIANT_ID]!
      .overrides as Record<string, Record<string, unknown>>
    fcOverrides.families = {
      ...(fcOverrides.families ?? {}),
      custom1: { name: "seed", origin: "custom" },
    }
  })

  const fontCollectionBoardKey = Object.keys(ws.boards).find(
    (key) => ws.boards[key]!.type === "font-collection",
  )!
  const buttonPropKey = Object.keys(getComponentSchema(BOARD).properties)[0]!
  const childBoardKey = findAbsentChildBoard(ws)

  // Free catalog ids for the `add_*` cases (absent from the seeded workspace).
  const freeTheme = findFreeCatalogId(THEME_BOARD_CATALOG_IDS, ws)
  const freeIs = findFreeCatalogId(ICON_SET_BOARD_CATALOG_IDS, ws)

  // Seeded, non-default boards for the `remove_*` cases.
  const removableTheme = findRemovableBoard(
    THEME_BOARD_CATALOG_IDS,
    ws,
    DEFAULT_THEME_BOARD_KEY,
  )
  const removableFc = findRemovableBoard(
    FONT_COLLECTION_BOARD_CATALOG_IDS,
    ws,
    DEFAULT_FONT_COLLECTION_BOARD_KEY,
  )
  const removableIconSet = findRemovableBoard(
    ICON_SET_BOARD_CATALOG_IDS,
    ws,
    DEFAULT_ICON_SET_BOARD_KEY,
  )

  // Every font collection catalog id is already a board, so `add_font_collection`
  // needs a base where one removable collection board has been dropped first.
  const baseNoFc = dispatch(
    ws,
    act("remove_font_collection", { catalogId: removableFc }),
  )

  return {
    base: ws,
    baseNoFc,
    ids: {
      themeDefaultId,
      fcDefaultId,
      isDefaultId,
      defaultRootId,
      uv1Id,
      uv2Id,
      uv1ChildId,
      fontCollectionBoardKey,
      buttonPropKey,
      childBoardKey,
      freeTheme,
      freeIs,
      addFcId: removableFc,
      removableTheme,
      removableFc,
      removableIconSet,
    },
  }
}

const { base, baseNoFc, ids } = buildBase()

function addThemeCustomCase(section: string): [string, WorkspaceAction] {
  const params =
    section === "swatch"
      ? { parameters: { colorspace: Colorspace.HEX, value: "#112233" } }
      : { kind: "exact", parameters: {} }
  return [
    `add_theme_custom_${section}`,
    act(`add_theme_custom_${section}`, {
      themeId: THEME_VARIANT_ID,
      name: `Custom ${section}`,
      intent: "test",
      ...params,
    }),
  ]
}

function removeThemeCustomCase(section: string): [string, WorkspaceAction] {
  return [
    `remove_theme_custom_${section}`,
    act(`remove_theme_custom_${section}`, {
      themeId: THEME_VARIANT_ID,
      key: "custom1",
    }),
  ]
}

// Each tuple is [label, action, workspace]. The default workspace is `base`;
// a few cases pass a derived workspace as the third item.
//
// Three reducer cases are intentionally absent because no valid input reaches
// them through the verified reducer today:
// - `add_media` and `remove_media`: a media board stores its variants in
//   `workspace.media`, but `oneDefaultVariantPerBoard` verification only skips
//   theme, icon-set, and font-collection boards and looks variants up in
//   `nodes`, so any workspace holding a media board fails verification.
// - `duplicate_component`: its validator requires a source in `workspace.boards`
//   that is neither a component board nor a packaged resource board, and no such
//   board exists in a valid workspace.
const CASES: Array<[string, WorkspaceAction, Workspace?]> = [
  // Workspace metadata writes.
  ["set_workspace", act("set_workspace", { workspace: base })],
  ["set_workspace_owner", act("set_workspace_owner", { value: "owner" })],
  ["set_workspace_label", act("set_workspace_label", { value: "Label" })],
  ["set_workspace_version", act("set_workspace_version", { value: 3 })],
  [
    "set_workspace_last_update",
    act("set_workspace_last_update", { value: "2026-01-01" }),
  ],
  ["set_workspace_intent", act("set_workspace_intent", { value: "Intent" })],
  ["set_workspace_tags", act("set_workspace_tags", { value: ["a", "b"] })],
  [
    "set_workspace_license",
    act("set_workspace_license", { value: { name: "MIT" } }),
  ],

  // Workspace metadata resets.
  ["reset_workspace_owner", act("reset_workspace_owner", {})],
  ["reset_workspace_label", act("reset_workspace_label", {})],
  ["normalize_metadata_version", act("normalize_metadata_version", {})],
  ["reset_workspace_last_update", act("reset_workspace_last_update", {})],
  ["reset_workspace_intent", act("reset_workspace_intent", {})],
  ["reset_workspace_tags", act("reset_workspace_tags", {})],
  ["reset_workspace_license", act("reset_workspace_license", {})],

  // Board and resource lifecycle.
  ["add_component", act("add_component", { boardKey: ids.childBoardKey })],
  [
    "add_font_collection",
    act("add_font_collection", { catalogId: ids.addFcId }),
    baseNoFc,
  ],
  ["add_icon_set", act("add_icon_set", { catalogId: ids.freeIs })],
  ["add_theme", act("add_theme", { boardKey: ids.freeTheme })],
  ["add_playground", act("add_playground", { boardKey: "pg-new" })],
  ["add_sandbox", act("add_sandbox", { playgroundKey: "pg-1" })],
  [
    "add_component_and_insert_default_instance",
    act("add_component_and_insert_default_instance", {
      boardKey: ids.childBoardKey,
      target: { parentId: ids.uv1Id },
    }),
  ],
  ["remove_component", act("remove_component", { boardKey: BOARD })],
  ["remove_playground", act("remove_playground", { boardKey: "pg-1" })],
  [
    "remove_font_collection",
    act("remove_font_collection", { catalogId: ids.removableFc }),
  ],
  [
    "remove_icon_set",
    act("remove_icon_set", { catalogId: ids.removableIconSet }),
  ],
  ["remove_theme", act("remove_theme", { boardKey: ids.removableTheme })],
  [
    "duplicate_playground",
    act("duplicate_playground", {
      sourcePlaygroundKey: "pg-1",
      newPlaygroundKey: "pg-dup",
    }),
  ],
  ["reorder_board", act("reorder_board", { boardKey: BOARD, newIndex: 0 })],
  [
    "reorder_variant_in_board",
    act("reorder_variant_in_board", {
      boardKey: BOARD,
      variantRootId: ids.uv1Id,
      newIndex: 1,
    }),
  ],

  // Component-level board edits.
  [
    "set_component_theme",
    act("set_component_theme", { boardKey: BOARD, theme: ids.themeDefaultId }),
  ],
  [
    "set_component_properties",
    act("set_component_properties", { boardKey: BOARD, properties: {} }),
  ],
  [
    "reset_component_property",
    act("reset_component_property", {
      boardKey: BOARD,
      propertyKey: ids.buttonPropKey,
    }),
  ],
  [
    "apply_component_properties_to_all_boards",
    act("apply_component_properties_to_all_boards", { sourceBoardKey: BOARD }),
  ],

  // Board metadata writes.
  [
    "set_board_label",
    act("set_board_label", { boardKey: BOARD, label: "Btn" }),
  ],
  [
    "set_playground_label",
    act("set_playground_label", { playgroundKey: "pg-1", label: "PG" }),
  ],
  [
    "set_board_intent",
    act("set_board_intent", { boardKey: BOARD, intent: "i" }),
  ],
  ["set_board_tags", act("set_board_tags", { boardKey: BOARD, tags: ["t"] })],
  [
    "set_board_license",
    act("set_board_license", { boardKey: BOARD, license: { name: "MIT" } }),
  ],
  [
    "set_board_author",
    act("set_board_author", { boardKey: BOARD, author: "me" }),
  ],
  [
    "set_board_credentials",
    act("set_board_credentials", {
      boardKey: ids.fontCollectionBoardKey,
      credentials: { key: "v" },
    }),
  ],
  [
    "set_board_preview",
    act("set_board_preview", {
      boardKey: ids.fontCollectionBoardKey,
      preview: "url",
    }),
  ],
  [
    "set_board_editor_data",
    act("set_board_editor_data", { boardKey: BOARD, editorData: { x: 1 } }),
  ],

  // Board metadata resets.
  ["reset_board_label", act("reset_board_label", { boardKey: BOARD })],
  ["reset_board_intent", act("reset_board_intent", { boardKey: BOARD })],
  ["reset_board_tags", act("reset_board_tags", { boardKey: BOARD })],
  ["reset_board_license", act("reset_board_license", { boardKey: BOARD })],
  ["reset_board_author", act("reset_board_author", { boardKey: BOARD })],
  [
    "reset_board_credentials",
    act("reset_board_credentials", { boardKey: ids.fontCollectionBoardKey }),
  ],
  [
    "reset_board_preview",
    act("reset_board_preview", { boardKey: ids.fontCollectionBoardKey }),
  ],
  [
    "reset_board_editor_data",
    act("reset_board_editor_data", { boardKey: BOARD }),
  ],

  ["add_variant", act("add_variant", { boardKey: BOARD })],

  // Node property writes and resets.
  [
    "set_node_properties",
    act("set_node_properties", { nodeId: ids.uv1Id, properties: {} }),
  ],
  [
    "reset_node_property",
    act("reset_node_property", {
      nodeId: ids.uv1Id,
      propertyKey: ids.buttonPropKey,
    }),
  ],
  ["reset_node", act("reset_node", { nodeId: ids.uv1Id })],
  [
    "set_node_state_properties",
    act("set_node_state_properties", {
      nodeId: ids.uv1Id,
      state: "hover",
      properties: {},
    }),
  ],
  [
    "reset_node_state_property",
    act("reset_node_state_property", {
      nodeId: ids.uv1Id,
      state: "hover",
      propertyKey: ids.buttonPropKey,
    }),
  ],
  [
    "reset_node_state",
    act("reset_node_state", { nodeId: ids.uv1Id, state: "hover" }),
  ],

  // Custom-state registry.
  [
    "add_custom_state",
    act("add_custom_state", { key: "newstate", label: "New" }),
  ],
  ["remove_custom_state", act("remove_custom_state", { key: "mystate" })],
  [
    "rename_custom_state",
    act("rename_custom_state", { key: "mystate", label: "Renamed" }),
  ],

  // Paint layer stack.
  [
    "add_node_layer",
    act("add_node_layer", {
      nodeId: ids.uv1Id,
      property: "background",
      seed: {},
    }),
  ],
  [
    "remove_node_layer",
    act("remove_node_layer", {
      nodeId: ids.uv1Id,
      property: "background",
      index: 1,
    }),
  ],
  [
    "reorder_node_layer",
    act("reorder_node_layer", {
      nodeId: ids.uv1Id,
      property: "background",
      fromIndex: 0,
      toIndex: 1,
    }),
  ],
  [
    "set_node_layer_kind",
    act("set_node_layer_kind", {
      nodeId: ids.uv1Id,
      property: "background",
      layerIndex: 0,
      kind: "color",
    }),
  ],

  // Node misc writes and resets.
  [
    "set_node_label",
    act("set_node_label", { nodeId: ids.uv1Id, label: "ZZZ-Label" }),
  ],
  ["set_node_ref", act("set_node_ref", { nodeId: ids.uv1Id, ref: "myref" })],
  ["set_node_theme", act("set_node_theme", { nodeId: ids.uv1Id, theme: null })],
  [
    "set_node_editor_data",
    act("set_node_editor_data", { nodeId: ids.uv1Id, editorData: { x: 1 } }),
  ],
  [
    "set_node_repeat",
    act("set_node_repeat", { nodeId: ids.uv1Id, repeat: undefined }),
  ],
  ["reset_node_label", act("reset_node_label", { nodeId: ids.uv1Id })],
  [
    "reset_node_editor_data",
    act("reset_node_editor_data", { nodeId: ids.uv1Id }),
  ],

  // Theme writes.
  [
    "set_theme_label",
    act("set_theme_label", { themeId: THEME_VARIANT_ID, label: "Copy" }),
  ],
  [
    "set_theme_editor_data",
    act("set_theme_editor_data", {
      themeId: THEME_VARIANT_ID,
      editorData: { x: 1 },
    }),
  ],
  [
    "set_theme_override",
    act("set_theme_override", {
      themeId: THEME_VARIANT_ID,
      path: "color.primary",
      value: null,
    }),
  ],
  [
    "set_theme_scale_slot",
    act("set_theme_scale_slot", {
      themeId: THEME_VARIANT_ID,
      section: "size",
      key: "medium",
      value: { kind: "exact", parameters: { unit: "px", value: 16 } },
    }),
  ],
  [
    "set_theme_custom_token_name",
    act("set_theme_custom_token_name", {
      themeId: THEME_VARIANT_ID,
      section: "swatch",
      key: "custom1",
      name: "Renamed Swatch",
    }),
  ],

  // Instance and variant lifecycle / resets.
  ["remove_instance", act("remove_instance", { instanceId: ids.uv1ChildId })],
  ["remove_variant", act("remove_variant", { variantRootId: ids.uv2Id })],
  ["duplicate_node", act("duplicate_node", { nodeId: ids.uv1ChildId })],
  [
    "reset_variant_to_catalog",
    act("reset_variant_to_catalog", { variantRootId: ids.uv1Id }),
  ],
  [
    "reset_instance_to_source",
    act("reset_instance_to_source", { instanceId: ids.uv1ChildId }),
  ],
  [
    "reset_instance_to_original",
    act("reset_instance_to_original", { instanceId: ids.uv1ChildId }),
  ],
  [
    "reset_default_variant_to_catalog",
    act("reset_default_variant_to_catalog", {
      defaultVariantRootId: ids.defaultRootId,
    }),
  ],
  [
    "reset_component_to_catalog",
    act("reset_component_to_catalog", { boardKey: BOARD }),
  ],

  // Move and insert.
  [
    "move_instance",
    act("move_instance", {
      instanceId: ids.uv1ChildId,
      target: { parentId: ids.uv1Id, index: 0 },
    }),
  ],
  [
    "move_instance_directional",
    act("move_instance_directional", {
      instanceId: ids.uv1ChildId,
      direction: "forward",
    }),
  ],
  [
    "reorder_instance_in_parent",
    act("reorder_instance_in_parent", {
      instanceId: ids.uv1ChildId,
      newIndex: 0,
    }),
  ],
  [
    "insert_variant_instance",
    act("insert_variant_instance", {
      variantId: ids.uv2Id,
      target: { parentId: ids.uv1Id },
    }),
  ],
  [
    "insert_duplicate_instance",
    act("insert_duplicate_instance", {
      instanceId: ids.uv1ChildId,
      target: { parentId: ids.uv2Id },
    }),
  ],
  [
    "insert_default_instance",
    act("insert_default_instance", { boardKey: BOARD, parentId: ids.uv1Id }),
  ],

  // Theme resets.
  [
    "reset_theme_tokens",
    act("reset_theme_tokens", { themeId: THEME_VARIANT_ID }),
  ],
  [
    "reset_theme_label",
    act("reset_theme_label", { themeId: THEME_VARIANT_ID }),
  ],
  [
    "reset_theme_editor_data",
    act("reset_theme_editor_data", { themeId: THEME_VARIANT_ID }),
  ],
  [
    "reset_theme_override",
    act("reset_theme_override", {
      themeId: THEME_VARIANT_ID,
      path: "color.primary",
    }),
  ],

  // Theme custom tokens.
  ...ADD_THEME_SECTIONS.map(addThemeCustomCase),
  ...REMOVE_THEME_SECTIONS.map(removeThemeCustomCase),

  ["delete_theme", act("delete_theme", { themeId: THEME_VARIANT_ID })],
  [
    "duplicate_theme",
    act("duplicate_theme", {
      themeId: ids.themeDefaultId,
      newThemeId: "dup-theme-2",
    }),
  ],

  // Font collections.
  [
    "set_font_collection_label",
    act("set_font_collection_label", {
      fontCollectionId: FC_VARIANT_ID,
      label: "FC",
    }),
  ],
  [
    "set_font_collection_editor_data",
    act("set_font_collection_editor_data", {
      fontCollectionId: FC_VARIANT_ID,
      editorData: { x: 1 },
    }),
  ],
  [
    "set_font_collection_override",
    act("set_font_collection_override", {
      fontCollectionId: FC_VARIANT_ID,
      path: "families.primary",
      value: null,
    }),
  ],
  [
    "set_font_collection_family_variant",
    act("set_font_collection_family_variant", {
      fontCollectionId: FC_VARIANT_ID,
      slot: "primary",
      variant: "regular",
      enabled: true,
    }),
  ],
  [
    "set_font_collection_family_preset",
    act("set_font_collection_family_preset", {
      fontCollectionId: FC_VARIANT_ID,
      slot: "primary",
      preset: "none",
    }),
  ],
  [
    "reset_font_collection_label",
    act("reset_font_collection_label", { fontCollectionId: FC_VARIANT_ID }),
  ],
  [
    "reset_font_collection_editor_data",
    act("reset_font_collection_editor_data", {
      fontCollectionId: FC_VARIANT_ID,
    }),
  ],
  [
    "reset_font_collection_override",
    act("reset_font_collection_override", {
      fontCollectionId: FC_VARIANT_ID,
      path: "families.primary",
    }),
  ],
  [
    "reset_font_collection",
    act("reset_font_collection", { fontCollectionId: FC_VARIANT_ID }),
  ],
  [
    "delete_font_collection",
    act("delete_font_collection", { fontCollectionId: FC_VARIANT_ID }),
  ],
  [
    "duplicate_font_collection",
    act("duplicate_font_collection", {
      fontCollectionId: ids.fcDefaultId,
      newFontCollectionId: "dup-fc-2",
    }),
  ],
  [
    "add_font_collection_custom_family",
    act("add_font_collection_custom_family", {
      fontCollectionId: FC_VARIANT_ID,
      name: "Fam",
      variants: ["regular"],
    }),
  ],
  [
    "remove_font_collection_custom_family",
    act("remove_font_collection_custom_family", {
      fontCollectionId: FC_VARIANT_ID,
      key: "custom1",
    }),
  ],

  // Icon sets.
  [
    "set_icon_set_label",
    act("set_icon_set_label", { iconSetId: IS_VARIANT_ID, label: "IS" }),
  ],
  [
    "set_icon_set_override",
    act("set_icon_set_override", {
      iconSetId: IS_VARIANT_ID,
      path: "includedIcons.seldon-lines",
      value: true,
    }),
  ],
  [
    "reset_icon_set_override",
    act("reset_icon_set_override", {
      iconSetId: IS_VARIANT_ID,
      path: "includedIcons.seldon-lines",
    }),
  ],
  ["reset_icon_set", act("reset_icon_set", { iconSetId: IS_VARIANT_ID })],
  [
    "set_icon_set_subcategory_preset",
    act("set_icon_set_subcategory_preset", {
      iconSetId: IS_VARIANT_ID,
      subcategory: "user-interface/text",
      preset: "none",
    }),
  ],
  ["delete_icon_set", act("delete_icon_set", { iconSetId: IS_VARIANT_ID })],
  [
    "duplicate_icon_set",
    act("duplicate_icon_set", {
      iconSetId: ids.isDefaultId,
      newIconSetId: "dup-is-2",
    }),
  ],

  // Reserved stub maps.
  ["stubs_add_font_collection_row", act("stubs_add_font_collection_row", {})],
  [
    "stubs_remove_font_collection_row",
    act("stubs_remove_font_collection_row", {}),
  ],
  [
    "stubs_set_font_collection_field",
    act("stubs_set_font_collection_field", {}),
  ],
  [
    "stubs_duplicate_font_collection_row",
    act("stubs_duplicate_font_collection_row", {}),
  ],
  ["stubs_add_media_row", act("stubs_add_media_row", {})],
  ["stubs_remove_media_row", act("stubs_remove_media_row", {})],
  ["stubs_set_media_field", act("stubs_set_media_field", {})],
  ["stubs_duplicate_media_row", act("stubs_duplicate_media_row", {})],
]

describe("workspaceReducer exhaustive dispatch", () => {
  it.each(CASES)(
    "routes %s through the middleware stack",
    (_name, action, ws) => {
      const result = dispatch(ws ?? base, action)
      expect(result).toBeTruthy()
      expect(result.boards).toBeTruthy()
    },
  )
})
