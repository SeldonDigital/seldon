import { COLORS } from "@lib/ui/colors"
import { CSSProperties, useMemo, useRef } from "react"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import {
  isThemeEditingSelection,
  resolveActiveThemeEntryId,
} from "@lib/themes/resolve-active-theme-entry-id"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { SidebarContainer } from "../../../seldon/elements/SidebarContainer"
import { PropertyTree } from "./PropertyTree"
import { flattenNodeProperties } from "./helpers/properties-data"
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

  const themeEditingContext = useMemo(() => {
    if (!isThemeEditingMode) return null
    return {
      isThemeEditing: true,
      updateThemeProperty,
      themeProperties,
    }
  }, [isThemeEditingMode, updateThemeProperty, themeProperties])

  const propertyTreeNode = useMemo(() => {
    if (isThemeEditingMode && activeThemeEntryId) {
      return selection ?? selectedBoard
    }
    return selection
  }, [isThemeEditingMode, activeThemeEntryId, selection, selectedBoard])

  if (!selection && !isThemeEditingMode) {
    return (
      <SidebarContainer style={styles.noSelection}>
        <span style={styles.noSelectionText}>Nothing selected</span>
      </SidebarContainer>
    )
  }

  return (
    <SidebarContainer style={styles.container} data-testid="properties-sidebar">
      <PropertyTree
        properties={flatProperties}
        workspace={workspace}
        node={propertyTreeNode ?? selectedBoard}
        theme={theme}
        scrollerRef={scrollerRef}
        dispatch={dispatch}
        themeEditingContext={themeEditingContext}
      />
    </SidebarContainer>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    minHeight: 0,
    minWidth: 0,
    overflow: "hidden",
    backgroundColor: COLORS.charcoal[500],
  },
  noSelection: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    backgroundColor: COLORS.charcoal[500],
  },
  noSelectionText: {
    fontFamily: "IBM Plex Sans",
    fontSize: "0.8125rem",
    color: "hsl(0deg 0% 100% / 0.6)",
  },
}
