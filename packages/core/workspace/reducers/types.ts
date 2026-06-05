/**
 * WorkspaceAction coverage (serialized top-level keys in WORKSPACE.md):
 *
 * | Action | Primary map / target |
 * | --- | --- |
 * | set_workspace | whole file |
 * | set_workspace_owner, set_workspace_label, set_workspace_version, set_workspace_last_update, set_workspace_intent, set_workspace_tags, set_workspace_license | metadata |
 * | reset_workspace_owner, reset_workspace_label, normalize_metadata_version, reset_workspace_last_update, reset_workspace_intent, reset_workspace_tags, reset_workspace_license | metadata |
 * | add_component, remove_component, reorder_board, duplicate_component | components (+ nodes/themes/resources per type) |
 * | add_font_collection, remove_font_collection, add_media, remove_media, add_icon_set, remove_icon_set, add_theme, remove_theme, add_playground, remove_playground | components + section rows |
 * | set_component_label, set_component_intent, set_component_tags, set_component_license, set_component_author, set_component_credentials, set_component_preview, set_component_editor_data, set_component_properties, reset_component_property, set_component_theme | components |
 * | reset_component_label, reset_component_intent, reset_component_tags, reset_component_license, reset_component_author, reset_component_credentials, reset_component_preview, reset_component_editor_data | components |
 * | reorder_variant_in_board | components.variants order |
 * | add_variant | components.variants + nodes |
 * | insert_variant_instance, insert_duplicate_instance, insert_default_instance, add_component_and_insert_default_instance | components tree + nodes |
 * | remove_instance, remove_variant, duplicate_node, move_instance, reorder_instance_in_parent | components tree + nodes |
 * | set_node_properties, reset_node_property, reset_node, set_node_label, set_node_theme, set_node_editor_data | nodes |
 * | reset_node_label, reset_node_editor_data | nodes |
 * | reset_user_variant_to_default | components.variants tree + nodes |
 * | set_theme_label, set_theme_editor_data, set_theme_override, reset_theme_tokens, reset_theme_label, reset_theme_editor_data, reset_theme_override | themes |
 * | add_theme_custom_{swatch,font,border,background,gradient,shadow,scrollbar,size,dimension,margin,padding,gap,corners,borderWidth,blur,spread,fontSize,fontWeight,lineHeight} | themes (variant rows only) |
 * | remove_theme_custom_{...same 19 tables...} | themes (variant rows only) |
 * | delete_theme, duplicate_theme | themes (+ components.variants for theme row) |
 * | set_font_collection_{label,editor_data,override}, reset_font_collection_{label,editor_data,override}, add_font_collection_custom_family, remove_font_collection_custom_family | font-collections (variant rows only for families) |
 * | set_font_collection_family_variant, set_font_collection_family_preset | font-collections (any entry; per-family variant selection) |
 * | delete_font_collection, duplicate_font_collection | font-collections (+ components.variants for font-collection row) |
 * | set_icon_set_label | icon-sets |
 * | set_icon_set_override, reset_icon_set_override | icon-sets (per-icon inclusion under includedIcons) |
 * | set_icon_set_subcategory_preset | icon-sets (per-subcategory inclusion under includedIcons) |
 * | duplicate_icon_set | icon-sets (+ components.variants for icon-set row) |
 * | stubs_* (font / media) | reserved — no-op until spec |
 * | transcript_add_message | none (no-op) |
 */
import type { FontOrigin } from "../../font-collections/types"
import { Properties, PropertyKey, SubPropertyKey } from "../../properties"
import {
  BackgroundParameters,
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
import type { InstanceId, VariantId } from "../helpers/rules/workspace-node-ids"
import type { ComponentKey } from "../model/components"
import type { EntryNodeId } from "../model/entry-node"
import type { WorkspaceFileStringMap } from "../model/string-maps"
import type { Workspace } from "../model/workspace"

/** Parent, component board key, and optional child index for {@link WorkspaceAction} `insert_default_instance`. */
export type InsertDefaultInstance = {
  parentId: VariantId | InstanceId
  /** Component catalog row key; must match `components` in the workspace file. */
  componentKey: ComponentKey
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
      type: "add_theme_custom_background"
      payload: AddThemeCustomBase & { parameters: BackgroundParameters }
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
  | { type: "remove_theme_custom_background"; payload: RemoveThemeCustomBase }
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

export type WorkspaceAction =
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
      payload: { value: WorkspaceFileStringMap | undefined }
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
  | {
      type: "add_component"
      payload: {
        componentId: ComponentKey
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
        componentKey: ComponentKey
      }
    }
  | {
      type: "add_playground"
      payload: {
        componentKey: ComponentKey
      }
    }
  | {
      type: "remove_component"
      payload: {
        componentId: ComponentKey
      }
    }
  | {
      type: "remove_font_collection"
      payload: {
        catalogId: string
      }
    }
  | {
      type: "remove_media"
      payload: {
        catalogId: string
      }
    }
  | {
      type: "remove_icon_set"
      payload: {
        catalogId: string
      }
    }
  | {
      type: "remove_theme"
      payload: {
        componentKey: ComponentKey
      }
    }
  | {
      type: "remove_playground"
      payload: {
        componentKey: ComponentKey
      }
    }
  | {
      type: "duplicate_component"
      payload: {
        sourceComponentKey: ComponentKey
        newComponentKey: ComponentKey
        label?: string
      }
    }
  | {
      type: "add_variant"
      payload: {
        componentKey: ComponentKey
        properties?: Properties
        ensureDescendantComponents?: boolean
      }
    }
  | {
      type: "reorder_board"
      payload: {
        componentKey: ComponentKey
        newIndex: number
      }
    }
  | {
      type: "reorder_variant_in_board"
      payload: {
        componentKey: ComponentKey
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
        componentId: ComponentKey
        variantFallbacks?: string[]
        target: {
          parentId: VariantId | InstanceId
          index?: number
        }
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
      type: "reset_node_property"
      payload: {
        nodeId: InstanceId | VariantId
        propertyKey: PropertyKey
        subpropertyKey?: SubPropertyKey
      }
    }
  | {
      type: "reset_node"
      payload: {
        nodeId: InstanceId | VariantId
      }
    }
  | {
      type: "set_component_properties"
      payload: {
        componentKey: ComponentKey
        properties: Properties
      }
    }
  | {
      type: "reset_component_property"
      payload: {
        componentKey: ComponentKey
        propertyKey: PropertyKey
        subpropertyKey?: SubPropertyKey
      }
    }
  | {
      type: "set_component_label"
      payload: { componentKey: ComponentKey; label: string }
    }
  | {
      type: "set_component_intent"
      payload: { componentKey: ComponentKey; intent: string | undefined }
    }
  | {
      type: "set_component_tags"
      payload: { componentKey: ComponentKey; tags: string[] | undefined }
    }
  | {
      type: "set_component_license"
      payload: {
        componentKey: ComponentKey
        license: WorkspaceFileStringMap | undefined
      }
    }
  | {
      type: "set_component_author"
      payload: { componentKey: ComponentKey; author: string }
    }
  | {
      type: "set_component_credentials"
      payload: {
        componentKey: ComponentKey
        credentials: WorkspaceFileStringMap | undefined
      }
    }
  | {
      type: "set_component_preview"
      payload: { componentKey: ComponentKey; componentPreview: string }
    }
  | {
      type: "set_component_editor_data"
      payload: {
        componentKey: ComponentKey
        editorData: Record<string, unknown> | undefined
      }
    }
  | { type: "reset_component_label"; payload: { componentKey: ComponentKey } }
  | { type: "reset_component_intent"; payload: { componentKey: ComponentKey } }
  | { type: "reset_component_tags"; payload: { componentKey: ComponentKey } }
  | { type: "reset_component_license"; payload: { componentKey: ComponentKey } }
  | { type: "reset_component_author"; payload: { componentKey: ComponentKey } }
  | {
      type: "reset_component_credentials"
      payload: { componentKey: ComponentKey }
    }
  | { type: "reset_component_preview"; payload: { componentKey: ComponentKey } }
  | {
      type: "reset_component_editor_data"
      payload: { componentKey: ComponentKey }
    }
  | {
      type: "set_node_label"
      payload: {
        nodeId: VariantId | InstanceId
        label: string
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
        componentKey: ComponentKey
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
  | {
      type: "reset_user_variant_to_default"
      payload: {
        variantRootId: VariantId
      }
    }
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
  /** @internal Reserved payload; no-op until `font-collections` spec is finalized. */
  | { type: "stubs_add_font_collection_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_remove_font_collection_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_set_font_collection_field"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_duplicate_font_collection_row"; payload: { id?: string } }
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
      type: "set_icon_set_subcategory_preset"
      payload: {
        iconSetId: string
        subcategory: string
        preset: "all" | "none"
      }
    }
  | {
      type: "duplicate_icon_set"
      payload: {
        iconSetId: string
        newIconSetId?: string
      }
    }
  /** @internal Reserved payload; no-op until `media` spec is finalized. */
  | { type: "stubs_add_media_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_remove_media_row"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_set_media_field"; payload: { id?: string } }
  /** @internal */
  | { type: "stubs_duplicate_media_row"; payload: { id?: string } }
  /**
   * @deprecated Not persisted in workspace.json. Editor/agent narration will move to a separate channel; dispatch is a no-op until then.
   */
  | {
      type: "transcript_add_message"
      payload: {
        chatMessage: string
        expectUserAnswer: boolean
      }
    }

export type ExtractPayload<T extends WorkspaceAction["type"]> = Extract<
  WorkspaceAction,
  { type: T }
>["payload"]
