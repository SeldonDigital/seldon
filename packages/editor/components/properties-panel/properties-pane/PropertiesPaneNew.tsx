import { useMemo } from "react"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { ThemeSelect } from "@components/ui/ThemeSelect"
import { PropertyRow as PropertyRowOld } from "../PropertyRow"
import { PropertyRow } from "./PropertyRow"
import { flattenNodeProperties } from "./helpers/properties-data"

export function PropertiesPaneNew() {
  const { selection } = useSelection()
  const { workspace, dispatch } = useWorkspace()
  const { showUnusedProperties } = useEditorConfig()

  const flatProperties = useMemo(() => {
    if (!selection) return []
    const theme = themeService.getObjectTheme(selection, workspace)
    const allProperties = flattenNodeProperties(selection, workspace, theme)

    // Filter out "not used" properties if the setting is disabled
    if (!showUnusedProperties) {
      return allProperties.filter((property) => property.status !== "not used")
    }

    return allProperties
  }, [selection, workspace, showUnusedProperties])

  const theme = useMemo(() => {
    if (!selection) return undefined
    return themeService.getObjectTheme(selection, workspace)
  }, [selection, workspace])

  if (!selection) {
    return (
      <div className="min-h-9 border-t border-t-neutral-950 px-2 py-2">
        <span
          className="w-5/12 truncate text-neutral-100/60"
          style={{ fontFamily: "IBM Plex Sans", fontSize: "0.8125rem" }}
        >
          Nothing selected
        </span>
      </div>
    )
  }

  return (
    <div
      className="scrollbar-gutter-stable h-full overflow-x-hidden overflow-y-auto border-t border-t-neutral-950 scrollbar-thin px-2"
      data-testid="properties-pane-new"
    >
      <div className="flex flex-col py-3">
        <PropertyRowOld title="Theme">
          <ThemeSelect
            activeThemeId={selection.theme}
            onValueChange={(newId) => {
              if (isBoard(selection)) {
                dispatch({
                  type: "set_board_theme",
                  payload: {
                    componentId: selection.id,
                    theme: newId!,
                  },
                })
              } else {
                dispatch({
                  type: "set_node_theme",
                  payload: {
                    nodeId: selection.id,
                    theme: newId,
                  },
                })
              }
            }}
            allowUnsetTheme={!isBoard(selection)}
          />
        </PropertyRowOld>
        {flatProperties.map((property) => (
          <PropertyRow
            key={property.key}
            property={property}
            workspace={workspace}
            node={selection}
            theme={theme}
          />
        ))}
      </div>
    </div>
  )
}
