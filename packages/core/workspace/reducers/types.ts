import type { FontOrigin } from "../../font-collections/types"
import type { LayeredPaintKey, Properties, PropertyKey, SubPropertyKey } from "../../properties"
import type {
  BorderParameters,
  FontParameters,
  GradientParameters,
  ModulationParameters,
  ScrollbarParameters,
  ShadowParameters,
  ThemeCustomSwatchId,
  ThemeExact,
  ThemeInstanceId,
  ThemeSwatchParameters,
} from "../../themes/types"
import type { RepeatEditorData } from "../helpers/nodes/node-repeat"
import type { InstanceId, VariantId } from "../helpers/rules/workspace-node-ids"
import type { BoardKey } from "../model/components"
import type { EntryNodeId, EntryNodeLevel } from "../model/entry-node"
import type { WorkspaceExportSettings } from "../model/export-settings"
import type { NodeState } from "../model/node-state"
import type { WorkspaceStringMap } from "../model/string-maps"
import type { Workspace } from "../model/workspace"

/**
 * Parent, component board key, and optional child index for {@link WorkspaceAction}
 * `insert_default_instance`. `boardKey` is the component catalog row key and must match `components`
 * in the workspace file.
 */
export type InsertDefaultInstance = {
  parentId: VariantId | InstanceId
  boardKey: BoardKey
  index?: number
}

/** Common fields on every `add_theme_custom_*` payload. Targets one variant theme entry in `workspace.themes`. */
type AddThemeCustomBase = {
  themeId: string
  name: string
  intent?: string
}

/** Payload shared by every `remove_theme_custom_*` action. Targets one `customN` slot inside a variant theme entry. */
type RemoveThemeCustomBase = {
  themeId: string
  key: ThemeCustomSwatchId
}

/** Scale-table cell payload: discriminated between `modulated` (step on the scale) and `exact` (fixed length / number). */
export type ScaleTokenInput =
  | { kind: "modulated"; parameters: ModulationParameters }
  | { kind: "exact"; parameters: ThemeExact["parameters"] }

/** Scale sections whose cells are modulated steps and may be set to an exact px/rem length. */
export type ScaleTokenSection =
  | "size"
  | "dimension"
  | "margin"
  | "padding"
  | "gap"
  | "corners"
  | "fontSize"
  | "blur"
  | "spread"
  | "borderWidth"

/** Every section that accepts user-added `customN` tokens (matches the `add_theme_custom_*` tables). */
export type ThemeCustomTokenSection =
  | "swatch"
  | "font"
  | "border"
  | "gradient"
  | "shadow"
  | "scrollbar"
  | "size"
  | "dimension"
  | "margin"
  | "padding"
  | "gap"
  | "corners"
  | "borderWidth"
  | "blur"
  | "spread"
  | "fontSize"
  | "fontWeight"
  | "lineHeight"

/** Runtime list of every section that accepts user-added `customN` tokens. */
export const THEME_CUSTOM_TOKEN_SECTIONS = [
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
] as const satisfies readonly ThemeCustomTokenSection[]

/** Tells whether a section accepts user-added `customN` tokens. */
export function isThemeCustomTokenSection(section: string): section is ThemeCustomTokenSection {
  return (THEME_CUSTOM_TOKEN_SECTIONS as readonly string[]).includes(section)
}

/** Strictly-typed union of every `add_theme_custom_*` action covering THEMES.md custom-token tables. */
export type AddCustomToken =
  | {
      type: "add_theme_custom_swatch"
      payload: AddThemeCustomBase & { parameters: ThemeSwatchParameters }
    }
  | {
      type: "add_theme_custom_font"
      payload: AddThemeCustomBase & { parameters: FontParameters }
    }
  | {
      type: "add_theme_custom_border"
      payload: AddThemeCustomBase & { parameters: BorderParameters }
    }
  | {
      type: "add_theme_custom_gradient"
      payload: AddThemeCustomBase & { parameters: GradientParameters }
    }
  | {
      type: "add_theme_custom_shadow"
      payload: AddThemeCustomBase & { parameters: ShadowParameters }
    }
  | {
      type: "add_theme_custom_scrollbar"
      payload: AddThemeCustomBase & { parameters: ScrollbarParameters }
    }
  | {
      type: "add_theme_custom_size"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_dimension"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_margin"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_padding"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_gap"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_corners"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_borderWidth"
      payload: AddThemeCustomBase & { parameters: ModulationParameters }
    }
  | {
      type: "add_theme_custom_blur"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_spread"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_fontSize"
      payload: AddThemeCustomBase & ScaleTokenInput
    }
  | {
      type: "add_theme_custom_fontWeight"
      payload: AddThemeCustomBase & { parameters: ThemeExact["parameters"] }
    }
  | {
      type: "add_theme_custom_lineHeight"
      payload: AddThemeCustomBase & { parameters: ThemeExact["parameters"] }
    }

/** Strictly-typed union of every `remove_theme_custom_*` action. */
export type RemoveCustomToken =
  | { type: "remove_theme_custom_swatch"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_font"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_border"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_gradient"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_shadow"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_scrollbar"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_size"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_dimension"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_margin"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_padding"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_gap"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_corners"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_borderWidth"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_blur"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_spread"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_fontSize"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_fontWeight"; payload: RemoveThemeCustomBase }
  | { type: "remove_theme_custom_lineHeight"; payload: RemoveThemeCustomBase }

/** Workspace-level metadata reads and resets. */
export type WorkspaceMetadataActions =
  | {
      type: "set_workspace"
      payload: {
        workspace: Workspace
      }
    }
  | {
      type: "set_workspace_owner"
      payload: { value: string | undefined }
    }
  | {
      type: "set_workspace_label"
      payload: { value: string | undefined }
    }
  | {
      type: "set_workspace_version"
      payload: { value: number }
    }
  | {
      type: "set_workspace_last_update"
      payload: { value: string | undefined }
    }
  | {
      type: "set_workspace_intent"
      payload: { value: string | undefined }
    }
  | {
      type: "set_workspace_tags"
      payload: { value: string[] | undefined }
    }
  | {
      type: "set_workspace_license"
      payload: { value: WorkspaceStringMap | undefined }
    }
  | {
      type: "set_workspace_export_settings"
      payload: { value: WorkspaceExportSettings | undefined }
    }
  | { type: "reset_workspace_owner"; payload: Record<string, never> }
  | { type: "reset_workspace_label"; payload: Record<string, never> }
  | {
      type: "normalize_metadata_version"
      payload: Record<string, never>
    }
  | { type: "reset_workspace_last_update"; payload: Record<string, never> }
  | { type: "reset_workspace_intent"; payload: Record<string, never> }
  | { type: "reset_workspace_tags"; payload: Record<string, never> }
  | { type: "reset_workspace_license"; payload: Record<string, never> }

/** Board, variant, and instance structure: add, remove, duplicate, reorder, and insert. */
export type BoardStructureActions =
  | {
      type: "add_component"
      payload: {
        boardKey: BoardKey
        variantFallbacks?: string[]
      }
    }
  | {
      type: "add_font_collection"
      payload: { catalogId: string }
    }
  | {
      type: "add_media"
      payload: { catalogId: string }
    }
  | {
      type: "add_icon_set"
      payload: { catalogId: string }
    }
  | {
      type: "add_theme"
      payload: {
        boardKey: BoardKey
      }
    }
  /** `boardKey` is a caller-generated unique board key so the UI can select the new theme. */
  | {
      type: "add_authored_theme"
      payload: {
        boardKey: BoardKey
      }
    }
  | {
      type: "add_playground"
      payload: {
        boardKey: BoardKey
      }
    }
  /**
   * `name` is the human-entered component name, and the board key and export name derive from it.
   * `rootKind` is the root template, either a flex Container or a Frame, both opaque at the declared
   * level. `level` is the declared component level, enforced for containment and export folder.
   */
  | {
      type: "add_authored_component"
      payload: {
        name: string
        rootKind: "container" | "frame"
        level: EntryNodeLevel
        intent?: string
        tags?: string[]
      }
    }
  | {
      type: "add_sandbox"
      payload: {
        playgroundKey: BoardKey
      }
    }
  | {
      type: "remove_board"
      payload: {
        boardKey: BoardKey
      }
    }
  | {
      type: "duplicate_component"
      payload: {
        sourceBoardKey: BoardKey
        newBoardKey: BoardKey
        label?: string
      }
    }
  | {
      type: "duplicate_playground"
      payload: {
        sourcePlaygroundKey: BoardKey
        newPlaygroundKey: BoardKey
        label?: string
      }
    }
  | {
      type: "add_variant"
      payload: {
        boardKey: BoardKey
        properties?: Properties
        ensureDescendantComponents?: boolean
      }
    }
  | {
      type: "reorder_board"
      payload: {
        boardKey: BoardKey
        newIndex: number
      }
    }
  | {
      type: "reorder_variant_in_board"
      payload: {
        boardKey: BoardKey
        variantRootId: EntryNodeId
        newIndex: number
      }
    }
  | {
      type: "insert_variant_instance"
      payload: {
        variantId: VariantId
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
      }
    }
  | {
      type: "insert_duplicate_instance"
      payload: {
        instanceId: InstanceId
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
      }
    }
  | {
      type: "insert_default_instance"
      payload: InsertDefaultInstance
    }
  | {
      type: "add_component_and_insert_default_instance"
      payload: {
        boardKey: BoardKey
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
        variantFallbacks?: string[]
      }
    }
  | {
      type: "remove_instance"
      payload: {
        instanceId: InstanceId
      }
    }
  | {
      type: "remove_variant"
      payload: {
        variantRootId: VariantId
      }
    }
  | {
      type: "duplicate_node"
      payload: {
        nodeId: VariantId | InstanceId
      }
    }

/** Node content: properties, interaction states, custom states, and paint layers. */
export type NodeContentActions =
  | {
      type: "set_node_properties"
      payload: {
        nodeId: InstanceId | VariantId
        properties: Properties
        options?: {
          mergeSubProperties?: boolean
        }
      }
    }
  | {
      type: "paste_node_properties"
      payload: {
        nodeId: InstanceId | VariantId
        properties: Properties
      }
    }
  /** `layerIndex` is the paint-layer slot for layered properties and defaults to layer 0. */
  | {
      type: "reset_node_property"
      payload: {
        nodeId: InstanceId | VariantId
        propertyKey: PropertyKey
        subpropertyKey?: SubPropertyKey
        layerIndex?: number
      }
    }
  | {
      type: "reset_node"
      payload: {
        nodeId: InstanceId | VariantId
      }
    }
  | {
      type: "set_node_state_properties"
      payload: {
        nodeId: InstanceId | VariantId
        state: NodeState
        properties: Properties
        options?: {
          mergeSubProperties?: boolean
        }
      }
    }
  /** `layerIndex` is the paint-layer slot for layered properties and defaults to layer 0. */
  | {
      type: "reset_node_state_property"
      payload: {
        nodeId: InstanceId | VariantId
        state: NodeState
        propertyKey: PropertyKey
        subpropertyKey?: SubPropertyKey
        layerIndex?: number
      }
    }
  | {
      type: "reset_node_state"
      payload: {
        nodeId: InstanceId | VariantId
        state: NodeState
      }
    }
  | {
      type: "add_custom_state"
      payload: {
        key: string
        label: string
        description?: string
      }
    }
  | {
      type: "remove_custom_state"
      payload: {
        key: string
      }
    }
  | {
      type: "rename_custom_state"
      payload: {
        key: string
        label: string
      }
    }
  /** `seed` is the optional initial facets for the new layer and defaults to an empty bag. */
  | {
      type: "add_node_layer"
      payload: {
        nodeId: InstanceId | VariantId
        property: LayeredPaintKey
        seed?: Record<string, unknown>
      }
    }
  | {
      type: "remove_node_layer"
      payload: {
        nodeId: InstanceId | VariantId
        property: LayeredPaintKey
        index: number
      }
    }
  | {
      type: "reorder_node_layer"
      payload: {
        nodeId: InstanceId | VariantId
        property: LayeredPaintKey
        fromIndex: number
        toIndex: number
      }
    }
  /**
   * `kind` is the kind to seed the layer with, such as a `BackgroundKind` value. `layerIndex` is the
   * paint-layer slot to retype and defaults to layer 0.
   */
  | {
      type: "set_node_layer_kind"
      payload: {
        nodeId: InstanceId | VariantId
        property: LayeredPaintKey
        kind: string
        layerIndex?: number
      }
    }

/** Component property and board metadata edits and resets. */
export type BoardMetadataActions =
  | {
      type: "set_component_properties"
      payload: {
        boardKey: BoardKey
        properties: Properties
      }
    }
  /** `layerIndex` is the paint-layer slot for layered properties and defaults to layer 0. */
  | {
      type: "reset_component_property"
      payload: {
        boardKey: BoardKey
        propertyKey: PropertyKey
        subpropertyKey?: SubPropertyKey
        layerIndex?: number
      }
    }
  | {
      type: "apply_component_properties_to_all_boards"
      payload: {
        sourceBoardKey: BoardKey
      }
    }
  | {
      type: "reset_component_board"
      payload: {
        boardKey: BoardKey
      }
    }
  | {
      type: "set_board_label"
      payload: { boardKey: BoardKey; label: string }
    }
  | {
      type: "set_playground_label"
      payload: { playgroundKey: BoardKey; label: string }
    }
  | {
      type: "set_board_intent"
      payload: { boardKey: BoardKey; intent: string | undefined }
    }
  | {
      type: "set_board_tags"
      payload: { boardKey: BoardKey; tags: string[] | undefined }
    }
  | {
      type: "set_board_license"
      payload: {
        boardKey: BoardKey
        license: WorkspaceStringMap | undefined
      }
    }
  | {
      type: "set_board_author"
      payload: { boardKey: BoardKey; author: string }
    }
  | {
      type: "set_board_credentials"
      payload: {
        boardKey: BoardKey
        credentials: WorkspaceStringMap | undefined
      }
    }
  | {
      type: "set_board_preview"
      payload: { boardKey: BoardKey; preview: string }
    }
  | {
      type: "set_board_editor_data"
      payload: {
        boardKey: BoardKey
        editorData: Record<string, unknown> | undefined
      }
    }
  | { type: "reset_board_label"; payload: { boardKey: BoardKey } }
  | { type: "reset_board_intent"; payload: { boardKey: BoardKey } }
  | { type: "reset_board_tags"; payload: { boardKey: BoardKey } }
  | { type: "reset_board_license"; payload: { boardKey: BoardKey } }
  | { type: "reset_board_author"; payload: { boardKey: BoardKey } }
  | {
      type: "reset_board_credentials"
      payload: { boardKey: BoardKey }
    }
  | { type: "reset_board_preview"; payload: { boardKey: BoardKey } }
  | {
      type: "reset_board_editor_data"
      payload: { boardKey: BoardKey }
    }

/** Node metadata (label, ref, theme, editor data, repeat), component theme, and instance placement. */
export type NodeMetadataAndPlacementActions =
  | {
      type: "set_node_label"
      payload: {
        nodeId: VariantId | InstanceId
        label: string
      }
    }
  | {
      type: "set_node_ref"
      payload: {
        nodeId: VariantId | InstanceId
        ref: string
      }
    }
  | {
      type: "set_node_theme"
      payload: {
        nodeId: InstanceId | VariantId
        theme: ThemeInstanceId | null
      }
    }
  | {
      type: "set_node_editor_data"
      payload: {
        nodeId: InstanceId | VariantId
        editorData: Record<string, unknown> | undefined
      }
    }
  | {
      type: "set_node_repeat"
      payload: {
        nodeId: InstanceId | VariantId
        repeat: RepeatEditorData | undefined
      }
    }
  | {
      type: "reset_node_label"
      payload: { nodeId: VariantId | InstanceId }
    }
  | {
      type: "reset_node_editor_data"
      payload: { nodeId: InstanceId | VariantId }
    }
  | {
      type: "set_component_theme"
      payload: {
        boardKey: BoardKey
        theme: ThemeInstanceId
      }
    }
  | {
      type: "move_instance"
      payload: {
        instanceId: InstanceId
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
      }
    }
  | {
      type: "reorder_instance_in_parent"
      payload: {
        instanceId: InstanceId
        newIndex: number
      }
    }
  | {
      type: "move_instance_directional"
      payload: {
        instanceId: InstanceId
        direction: "forward" | "backward" | "front" | "back"
      }
    }

/** Theme token edits, custom-token add and remove, scale slots, and theme resets. */
export type ThemeActions =
  | {
      type: "set_theme_label"
      payload: { themeId: string; label: string }
    }
  | {
      type: "set_theme_editor_data"
      payload: {
        themeId: string
        editorData: Record<string, unknown> | undefined
      }
    }
  | {
      type: "set_theme_override"
      payload: {
        themeId: string
        path: string
        value: unknown | null
      }
    }
  | AddCustomToken
  | RemoveCustomToken
  | {
      type: "set_theme_scale_slot"
      payload: {
        themeId: string
        section: ScaleTokenSection
        key: string
        value: ScaleTokenInput
      }
    }
  | {
      type: "set_theme_custom_token_name"
      payload: {
        themeId: string
        section: ThemeCustomTokenSection
        key: string
        name: string
      }
    }
  | {
      type: "reset_theme_tokens"
      payload: {
        themeId: string
      }
    }
  | {
      type: "reset_theme_label"
      payload: { themeId: string }
    }
  | {
      type: "reset_theme_editor_data"
      payload: { themeId: string }
    }
  | {
      type: "reset_theme_override"
      payload: { themeId: string; path: string }
    }

/** Rebuild variants, instances, and boards back to their catalog or source state. */
export type ResetToCatalogActions =
  | {
      type: "reset_variant_to_catalog"
      payload: {
        variantRootId: VariantId
      }
    }
  | {
      type: "reset_variant_instances"
      payload: {
        variantRootId: VariantId
      }
    }
  | {
      type: "reset_instance_to_source"
      payload: {
        instanceId: InstanceId
      }
    }
  | {
      type: "reset_instance_to_original"
      payload: {
        instanceId: InstanceId
      }
    }
  | {
      type: "reset_default_variant_to_catalog"
      payload: {
        defaultVariantRootId: VariantId
      }
    }
  | {
      type: "reset_component_to_catalog"
      payload: {
        boardKey: BoardKey
      }
    }

/** Theme row lifecycle: delete and duplicate. */
export type ThemeLifecycleActions =
  | {
      type: "delete_theme"
      payload: {
        themeId: string
      }
    }
  | {
      type: "duplicate_theme"
      payload: {
        themeId: string
        newThemeId?: string
      }
    }

/** Font collection edits, family management, and lifecycle. */
export type FontCollectionActions =
  | {
      type: "set_font_collection_label"
      payload: { fontCollectionId: string; label: string }
    }
  | {
      type: "set_font_collection_editor_data"
      payload: {
        fontCollectionId: string
        editorData: Record<string, unknown> | undefined
      }
    }
  | {
      type: "set_font_collection_override"
      payload: {
        fontCollectionId: string
        path: string
        value: unknown | null
      }
    }
  | {
      type: "reset_font_collection_label"
      payload: { fontCollectionId: string }
    }
  | {
      type: "reset_font_collection_editor_data"
      payload: { fontCollectionId: string }
    }
  | {
      type: "reset_font_collection_override"
      payload: { fontCollectionId: string; path: string }
    }
  | {
      type: "reset_font_collection"
      payload: { fontCollectionId: string }
    }
  | {
      type: "delete_font_collection"
      payload: { fontCollectionId: string }
    }
  | {
      type: "duplicate_font_collection"
      payload: {
        fontCollectionId: string
        newFontCollectionId?: string
      }
    }
  | {
      type: "add_font_collection_custom_family"
      payload: {
        fontCollectionId: string
        name: string
        origin?: FontOrigin
        stack?: string
        variants?: string[]
      }
    }
  | {
      type: "remove_font_collection_custom_family"
      payload: { fontCollectionId: string; key: string }
    }
  | {
      type: "set_font_collection_family_variant"
      payload: {
        fontCollectionId: string
        slot: string
        variant: string
        enabled: boolean
      }
    }
  | {
      type: "set_font_collection_family_preset"
      payload: {
        fontCollectionId: string
        slot: string
        preset: "all" | "none"
      }
    }

/** Reserved font-collection row stubs; no-op until the spec is finalized. */
export type FontCollectionStubActions =
  /** @internal Reserved payload; no-op until `font-collections` spec is finalized. */
  | { type: "stubs_add_font_collection_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_remove_font_collection_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_set_font_collection_field"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_duplicate_font_collection_row"; payload: { id?: string } }

/** Icon set edits, per-icon and subcategory inclusion, and lifecycle. */
export type IconSetActions =
  | {
      type: "set_icon_set_label"
      payload: { iconSetId: string; label: string }
    }
  | {
      type: "set_icon_set_override"
      payload: {
        iconSetId: string
        path: string
        value: unknown | null
      }
    }
  | {
      type: "reset_icon_set_override"
      payload: { iconSetId: string; path: string }
    }
  | {
      type: "reset_icon_set"
      payload: { iconSetId: string }
    }
  | {
      type: "set_icon_set_subcategory_preset"
      payload: {
        iconSetId: string
        subcategory: string
        preset: "all" | "none"
      }
    }
  | {
      type: "delete_icon_set"
      payload: { iconSetId: string }
    }
  | {
      type: "duplicate_icon_set"
      payload: {
        iconSetId: string
        newIconSetId?: string
      }
    }

/** Reserved media row stubs; no-op until the spec is finalized. */
export type MediaStubActions =
  /** @internal Reserved payload; no-op until `media` spec is finalized. */
  | { type: "stubs_add_media_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_remove_media_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_set_media_field"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_duplicate_media_row"; payload: { id?: string } }

/** Every reducer action, grouped by target entity. */
export type WorkspaceAction =
  | WorkspaceMetadataActions
  | BoardStructureActions
  | NodeContentActions
  | BoardMetadataActions
  | NodeMetadataAndPlacementActions
  | ThemeActions
  | ResetToCatalogActions
  | ThemeLifecycleActions
  | FontCollectionActions
  | FontCollectionStubActions
  | IconSetActions
  | MediaStubActions

export type ExtractPayload<T extends WorkspaceAction["type"]> = Extract<
  WorkspaceAction,
  { type: T }
>["payload"]
