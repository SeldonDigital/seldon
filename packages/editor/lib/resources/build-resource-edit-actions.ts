import type { WorkspaceAction } from "@seldon/core"

/**
 * Maps a font collection family row edit to its workspace action. Preset rows
 * (`family.<slot>`) dispatch `set_font_collection_family_preset`; variant rows
 * (`family.<slot>.<variant>`) dispatch `set_font_collection_family_variant`.
 * Mirrors the React `useFontCollectionProperties` routing.
 */
export function buildFontCollectionEditAction(
  fontCollectionId: string,
  key: string,
  rawValue: string,
): WorkspaceAction | null {
  const segments = key.split(".")
  if (segments[0] !== "family" || !segments[1]) return null
  const slot = segments[1]
  const variant = segments[2]

  if (!variant) {
    const preset = rawValue.toLowerCase()
    if (preset !== "all" && preset !== "none") return null
    return {
      type: "set_font_collection_family_preset",
      payload: { fontCollectionId, slot, preset },
    }
  }

  return {
    type: "set_font_collection_family_variant",
    payload: {
      fontCollectionId,
      slot,
      variant,
      enabled: rawValue === "On" || rawValue === "true",
    },
  }
}

/**
 * Maps an icon set row edit to its workspace action. Preset rows
 * (`icon.<category>/<subcategory>`) dispatch `set_icon_set_subcategory_preset`;
 * icon rows (`icon.<category>/<subcategory>.<iconId>`) dispatch
 * `set_icon_set_override` under `includedIcons`. Mirrors the React
 * `useIconSetProperties` routing.
 */
export function buildIconSetEditAction(
  iconSetId: string,
  key: string,
  rawValue: string,
): WorkspaceAction | null {
  const segments = key.split(".")
  if (segments[0] !== "icon" || !segments[1]) return null
  const subcategory = segments[1]
  const iconId = segments[2]

  if (!iconId) {
    const preset = rawValue.toLowerCase()
    if (preset !== "all" && preset !== "none") return null
    return {
      type: "set_icon_set_subcategory_preset",
      payload: { iconSetId, subcategory, preset },
    }
  }

  return {
    type: "set_icon_set_override",
    payload: {
      iconSetId,
      path: `includedIcons.${iconId}`,
      value: rawValue === "On" || rawValue === "true",
    },
  }
}
