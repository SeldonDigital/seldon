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
import type { ComponentId } from "../components/types"
import type { IconId } from "../icon-sets"
import {
  GLOBAL_OPTION_ICONS,
  PROPERTY_ICONS,
  PROPERTY_OPTION_ICONS,
} from "../properties/schemas/data/property-icons"
import { getCatalogKeyForPropertyPath } from "../properties/schemas/helpers/property-path"
import { getThemeTokenSchema } from "../themes/schemas/helpers/get-theme-token-schema"

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

/** Node kinds the objects sidebar renders with a distinct icon. */
export type NodeIconKind =
  | "iconSet"
  | "theme"
  | "fontCollection"
  | "component"
  | "defaultVariant"
  | "variant"

/** Icon for a board, variant, or resource node by its kind. */
export function getNodeKindIcon(kind: NodeIconKind): IconId {
  switch (kind) {
    case "iconSet":
      return "seldon-icon"
    case "theme":
      return "seldon-theme"
    case "fontCollection":
      return "seldon-text"
    case "defaultVariant":
      return "seldon-componentDefault"
    case "variant":
      return "seldon-componentVariant"
    case "component":
    default:
      return "seldon-component"
  }
}
