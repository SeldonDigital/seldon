/**
 * Icon registry.
 *
 * One React-free place that resolves an icon id for anything shown in the
 * objects or properties sidebar: a property row, a property option value, a
 * component, a theme token, or a node kind. Icons are authored on the schemas
 * (component, theme token) and in the property icon catalog
 * ({@link PROPERTY_ICONS}); this module only reads and resolves them, so the
 * editor and AI agents share a single source.
 *
 * Render availability is separate: an id resolves here whether or not the
 * user's generated workspace icon set can draw it. A missing id renders as the
 * existing red "missing" symbol at the render layer.
 */
import { getComponentSchema } from "../components/catalog"
import { ComponentId } from "../components/types"
import {
  GLOBAL_OPTION_ICONS,
  PROPERTY_ICONS,
  PROPERTY_OPTION_ICONS,
} from "../properties/schemas/data/property-icons"
import { getCatalogKeyForPropertyPath } from "../properties/schemas/helpers/property-path"
import { parseThemeLookRef } from "../themes/looks"
import { getThemeTokenSchema } from "../themes/schemas/helpers/get-theme-token-schema"
import { getNodeCatalogId } from "../workspace/helpers/nodes/get-node-catalog-id"
import { isSandboxNode } from "../workspace/helpers/nodes/sandbox"
import { isAuthoredBoard, isPlaygroundBoard } from "../workspace/model/components"
import { typeCheckingService } from "../workspace/services"

import type { IconId } from "../icon-sets"
import type { Board, EntryNode, Workspace } from "../workspace/types"

/** Generic fallback when a component schema declares no icon. */
const COMPONENT_ICON_FALLBACK: IconId = "seldon-component"

/**
 * Icon for a property row. Resolves a compound parent key (`background`,
 * `border`) directly, otherwise maps the node property path to a catalog key
 * (handling compound, shorthand, and layered paint facets) and reads its icon.
 */
export function getPropertyIcon(path: string): string | undefined {
  const direct = PROPERTY_ICONS[path]

  if (direct) return direct
  const catalogKey = getCatalogKeyForPropertyPath(path)

  return catalogKey ? PROPERTY_ICONS[catalogKey] : undefined
}

/**
 * Icon for one property option value: a per-property override, then a global
 * option icon, then the property's own default icon.
 */
export function getOptionIcon(path: string, value: string): string | undefined {
  const catalogKey = getCatalogKeyForPropertyPath(path) ?? path

  // A cleared "none" look (@border.none, @shadow.none) reads as an absence, so
  // it shares the block glyph the plain "none" option uses. Font's cleared look
  // ("normal") keeps a different id and its own icon.
  if (parseThemeLookRef(value)?.id === "none") {
    return GLOBAL_OPTION_ICONS.none
  }

  return (
    PROPERTY_OPTION_ICONS[path]?.[value] ??
    PROPERTY_OPTION_ICONS[catalogKey]?.[value] ??
    GLOBAL_OPTION_ICONS[value] ??
    getPropertyIcon(path)
  )
}

/** Icon for a component, falling back to `seldon-component` when unset. */
export function getComponentIcon(id: ComponentId): IconId {
  try {
    return getComponentSchema(id)?.icon ?? COMPONENT_ICON_FALLBACK
  } catch {
    return COMPONENT_ICON_FALLBACK
  }
}

/** Icon authored on a theme token schema, when one exists for the key. */
export function getThemeTokenIcon(key: string): string | undefined {
  return getThemeTokenSchema(key)?.icon
}

/**
 * Semantic icon for a node whose resolved catalog component is a known
 * primitive or frame type. Keyed by catalog {@link ComponentId}. These win over
 * the generic node-type icons so a Text always reads as text and a Container as
 * stacked rows, at every node level.
 */
const COMPONENT_TYPE_ICONS: Partial<Record<ComponentId, IconId>> = {
  [ComponentId.TEXT]: "seldon-text",
  [ComponentId.BLOCKQUOTE]: "seldon-text",
  [ComponentId.CITE]: "seldon-text",
  [ComponentId.LEGEND]: "seldon-text",
  [ComponentId.ICON]: "seldon-icon",
  [ComponentId.HR]: "seldon-minus",
  [ComponentId.IMAGE]: "seldon-image",
  [ComponentId.INPUT]: "seldon-input",
  [ComponentId.TEXTAREA]: "seldon-input",
  [ComponentId.SELECT]: "seldon-input",
  [ComponentId.TOGGLE_SWITCH]: "seldon-input",
  [ComponentId.FRAME]: "seldon-frame",
  [ComponentId.CONTAINER]: "seldon-frameRows",
}

/** Resource entry kinds the objects sidebar lists under a resource board. */
export type ResourceEntryIconKind = "theme" | "fontCollection" | "iconSet" | "media"

/**
 * Icon for a board row. Authored, sandbox, and playground boards read as custom
 * work, so they share the stub glyph. Every other board (component, theme, font
 * collection, icon set, media) shares the device glyph.
 */
export function getBoardRowIcon(board: Board): IconId {
  if (isAuthoredBoard(board) || isPlaygroundBoard(board)) return "seldon-stub"

  return "seldon-deviceCustom"
}

/**
 * Icon for a variant or instance row. A sandbox root reads as custom work. A
 * recognized component type wins next, then the node type: default variant,
 * custom variant, or instance.
 */
export function getNodeRowIcon(node: EntryNode, workspace: Workspace): IconId {
  if (isSandboxNode(node)) return "seldon-stub"

  const catalogId = getNodeCatalogId(node, workspace)
  const typeIcon = catalogId ? COMPONENT_TYPE_ICONS[catalogId as ComponentId] : undefined

  if (typeIcon) return typeIcon

  if (typeCheckingService.isVariant(node)) {
    return typeCheckingService.isDefaultVariant(node)
      ? "seldon-component"
      : "seldon-componentDefault"
  }

  return "seldon-componentVariant"
}

/** Icon for a resource entry row by its resource kind. */
export function getResourceEntryIcon(kind: ResourceEntryIconKind): IconId {
  switch (kind) {
    case "theme":
      return "seldon-theme"
    case "fontCollection":
      return "seldon-text"
    case "iconSet":
      return "seldon-icon"
    case "media":
    default:
      return "seldon-component"
  }
}
