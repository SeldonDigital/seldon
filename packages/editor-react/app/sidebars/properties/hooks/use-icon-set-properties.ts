import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { useCallback } from "react"

/**
 * Maps icon set property edits to workspace actions on the active entry. Preset
 * rows (`icon.<category>/<subcategory>`) dispatch `set_icon_set_subcategory_preset`;
 * icon rows (`icon.<category>/<subcategory>.<iconId>`) dispatch `set_icon_set_override`
 * under `includedIcons`.
 */
export function useIconSetProperties(iconSetId: string | null) {
  const { dispatch } = useWorkspace({ usePreview: false })

  const updateIconSetProperty = useCallback(
    (property: FlatProperty, newValue: string) => {
      if (!iconSetId) return

      const segments = property.key.split(".")
      if (segments[0] !== "icon" || !segments[1]) return
      const subcategory = segments[1]
      const iconId = segments[2]

      // Preset row: `icon.<category>/<subcategory>`
      if (!iconId) {
        const preset = newValue.toLowerCase()
        if (preset !== "all" && preset !== "none") return
        dispatch({
          type: "set_icon_set_subcategory_preset",
          payload: { iconSetId, subcategory, preset },
        })
        return
      }

      // Icon row: `icon.<category>/<subcategory>.<iconId>`
      dispatch({
        type: "set_icon_set_override",
        payload: {
          iconSetId,
          path: `includedIcons.${iconId}`,
          value: newValue === "On" || newValue === "true",
        },
      })
    },
    [dispatch, iconSetId],
  )

  return { updateIconSetProperty }
}
