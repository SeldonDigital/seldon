import { useMemo, useRef } from "react"
import { Board, Instance, Variant } from "@seldon/core"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import { isThemeBoard } from "@seldon/core/workspace/model/components"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import {
  isThemeEditingSelection,
  resolveActiveThemeEntryId,
} from "@lib/themes/resolve-active-theme-entry-id"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import {
  sidebarNoSelectionStyle,
  sidebarNoSelectionTextStyle,
  sidebarShellStyle,
} from "../helpers/sidebar-styles"
import { SidebarContainer } from "../../../seldon/elements/SidebarContainer"
import { PropertyTree } from "./PropertyTree"
import { FlatProperty, flattenNodeProperties } from "./helpers/properties-data"
import { flattenThemeProperties } from "./helpers/theme-properties-data"
import { getThemePropertyControlType } from "./helpers/get-theme-property-controls"
import { useThemeProperties } from "./hooks/use-theme-properties"

export function PropertiesSidebar() {
  const { selection, selectedBoard, selectedThemeEntryId } = useSelection()
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { showUnusedProperties } = useEditorConfig()
  const scrollerRef = useRef<HTMLDivElement>(null)

  const activeThemeEntryId = useMemo(
    () =>
      resolveActiveThemeEntryId({
        workspace,
        selectedThemeEntryId,
        selectedBoard: selectedBoard ?? null,
      }),
    [workspace, selectedThemeEntryId, selectedBoard],
  )

  const isThemeEditingMode = useMemo(
    () =>
      isThemeEditingSelection(
        workspace,
        selectedThemeEntryId,
        selectedBoard ?? null,
      ),
    [workspace, selectedThemeEntryId, selectedBoard],
  )

  const { updateThemeProperty } = useThemeProperties(activeThemeEntryId)

  const editedTheme = useMemo(() => {
    if (!isThemeEditingMode || !activeThemeEntryId) return null
    return getComputedTheme(activeThemeEntryId, workspace)
  }, [isThemeEditingMode, activeThemeEntryId, workspace])

  const themeProperties = useMemo(() => {
    if (!isThemeEditingMode || !editedTheme) return []
    const flatProps = flattenThemeProperties(editedTheme)
    return flatProps.map((prop) => ({
      ...prop,
      controlType: prop.controlType || getThemePropertyControlType(prop),
    }))
  }, [isThemeEditingMode, editedTheme])

  const flatProperties = useMemo(() => {
    if (!selection && !isThemeEditingMode) return []
    if (isThemeEditingMode) {
      return themeProperties
    }
    if (!selection) return []
    const theme = themeService.getObjectTheme(selection, workspace)
    const allProperties = flattenNodeProperties(selection, workspace, theme)

    if (!showUnusedProperties) {
      return allProperties.filter((property) => property.status !== "not used")
    }

    return allProperties
  }, [
    selection,
    workspace,
    showUnusedProperties,
    isThemeEditingMode,
    themeProperties,
  ])

  const theme = useMemo(() => {
    if (isThemeEditingMode) {
      return editedTheme || undefined
    }
    if (!selection) return undefined
    return themeService.getObjectTheme(selection, workspace)
  }, [selection, workspace, isThemeEditingMode, editedTheme])

  const themeEditingContext = useMemo((): {
    isThemeEditing: true
    updateThemeProperty: (property: FlatProperty, newValue: string) => void
    themeProperties: FlatProperty[]
  } | null => {
    if (!isThemeEditingMode) return null
    return {
      isThemeEditing: true,
      updateThemeProperty,
      themeProperties,
    }
  }, [isThemeEditingMode, updateThemeProperty, themeProperties])

  const propertyTreeNode = useMemo((): Variant | Instance | Board | null => {
    if (selection) {
      return selection as Variant | Instance | Board
    }
    if (selectedBoard) {
      return selectedBoard
    }
    if (isThemeEditingMode) {
      for (const entry of Object.values(workspace.components)) {
        if (isThemeBoard(entry)) {
          return entry
        }
      }
    }
    return null
  }, [selection, selectedBoard, isThemeEditingMode, workspace.components])

  if (!selection && !isThemeEditingMode) {
    return (
      <SidebarContainer style={sidebarNoSelectionStyle}>
        <span style={sidebarNoSelectionTextStyle}>Nothing selected</span>
      </SidebarContainer>
    )
  }

  if (!propertyTreeNode) {
    return (
      <SidebarContainer style={sidebarNoSelectionStyle}>
        <span style={sidebarNoSelectionTextStyle}>Nothing selected</span>
      </SidebarContainer>
    )
  }

  return (
    <SidebarContainer
      style={sidebarShellStyle}
      data-testid="properties-sidebar"
    >
      <PropertyTree
        properties={flatProperties}
        workspace={workspace}
        node={propertyTreeNode}
        theme={theme}
        scrollerRef={scrollerRef}
        dispatch={dispatch}
        themeEditingContext={themeEditingContext}
      />
    </SidebarContainer>
  )
}

