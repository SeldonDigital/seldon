import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { useCallback } from "react"

/**
 * Maps font collection family property edits to workspace actions on the active
 * entry. Preset rows (`family.<slot>`) dispatch `set_font_collection_family_preset`;
 * variant rows (`family.<slot>.<variant>`) dispatch `set_font_collection_family_variant`.
 */
export function useFontCollectionProperties(fontCollectionId: string | null) {
  const { dispatch } = useWorkspace({ usePreview: false })

  const updateFontCollectionProperty = useCallback(
    (property: FlatProperty, newValue: string) => {
      if (!fontCollectionId) return

      const segments = property.key.split(".")
      if (segments[0] !== "family" || !segments[1]) return
      const slot = segments[1]
      const variant = segments[2]

      // Preset row: `family.<slot>`
      if (!variant) {
        const preset = newValue.toLowerCase()
        if (preset !== "all" && preset !== "none") return
        dispatch({
          type: "set_font_collection_family_preset",
          payload: { fontCollectionId, slot, preset },
        })
        return
      }

      // Variant row: `family.<slot>.<variant>`
      dispatch({
        type: "set_font_collection_family_variant",
        payload: {
          fontCollectionId,
          slot,
          variant,
          enabled: newValue === "On" || newValue === "true",
        },
      })
    },
    [dispatch, fontCollectionId],
  )

  return { updateFontCollectionProperty }
}
