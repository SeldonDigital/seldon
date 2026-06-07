import { useMemo, useRef } from "react"
import { Board, Instance, Variant } from "@seldon/core"
import { getComputedTheme } from "@seldon/core/workspace/compute"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { workspaceIconSetService } from "@seldon/core/workspace/services/icon-set/icon-set.service"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import {
  isFontCollectionEditingSelection,
  resolveActiveFontCollectionEntryId,
} from "@lib/font-collections/resolve-active-font-collection-entry-id"
import {
  isIconSetEditingSelection,
  resolveActiveIconSetEntryId,
} from "@lib/icon-sets/resolve-active-icon-set-entry-id"
import {
  isThemeEditingSelection,
  resolveActiveThemeEntryId,
} from "@lib/themes/resolve-active-theme-entry-id"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import {
  sidebarNoSelectionStyle,
  sidebarShellStyle,
} from "../helpers/sidebar-styles"
import { SidebarContainer } from "../../seldon/elements/SidebarContainer"
import { PropertyTree } from "./PropertyTree"
import { flattenFontCollectionFamilies } from "./helpers/font-collection-properties-data"
import { flattenIconSetCategories } from "./helpers/icon-set-properties-data"
import { buildMetadataProperties } from "./helpers/metadata-properties-data"
import { FlatProperty, flattenNodeProperties } from "./helpers/properties-data"
import { flattenThemeProperties } from "./helpers/theme-properties-data"
import { getThemePropertyControlType } from "./helpers/get-theme-property-controls"
import { useFontCollectionProperties } from "./hooks/use-font-collection-properties"
import { useIconSetProperties } from "./hooks/use-icon-set-properties"
import { useThemeProperties } from "./hooks/use-theme-properties"

export function PropertiesSidebar() {
  const {
    selection,
    selectedBoard,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
  } = useSelection()
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { showUnusedProperties, showUnusedFonts, showUnusedIcons } =
    useEditorConfig()
  const scrollerRef = useRef<HTMLDivElement>(null)

  const activeThemeEntryId = useMemo(
    () =>
      resolveActiveThemeEntryId({
        workspace,
        selectedThemeEntryId,
      }),
    [workspace, selectedThemeEntryId],
  )

  const isThemeEditingMode = useMemo(
    () => isThemeEditingSelection(workspace, selectedThemeEntryId),
    [workspace, selectedThemeEntryId],
  )

  const activeFontCollectionEntryId = useMemo(
    () =>
      resolveActiveFontCollectionEntryId({
        workspace,
        selectedFontCollectionEntryId,
      }),
    [workspace, selectedFontCollectionEntryId],
  )

  const isFontCollectionEditingMode = useMemo(
    () =>
      isFontCollectionEditingSelection(
        workspace,
        selectedFontCollectionEntryId,
      ),
    [workspace, selectedFontCollectionEntryId],
  )

  const editedFontCollection = useMemo(() => {
    if (!isFontCollectionEditingMode || !activeFontCollectionEntryId) {
      return null
    }
    return workspaceFontCollectionService.getFontCollection(
      activeFontCollectionEntryId,
      workspace,
    )
  }, [isFontCollectionEditingMode, activeFontCollectionEntryId, workspace])

  const activeIconSetEntryId = useMemo(
    () =>
      resolveActiveIconSetEntryId({
        workspace,
        selectedIconSetEntryId,
      }),
    [workspace, selectedIconSetEntryId],
  )

  const isIconSetEditingMode = useMemo(
    () => isIconSetEditingSelection(workspace, selectedIconSetEntryId),
    [workspace, selectedIconSetEntryId],
  )

  const editedIconSet = useMemo(() => {
    if (!isIconSetEditingMode || !activeIconSetEntryId) return null
    return workspaceIconSetService.getIconSet(activeIconSetEntryId, workspace)
  }, [isIconSetEditingMode, activeIconSetEntryId, workspace])

  const iconInclusion = useMemo(() => {
    if (!isIconSetEditingMode || !activeIconSetEntryId) return {}
    return workspaceIconSetService.getInclusion(activeIconSetEntryId, workspace)
  }, [isIconSetEditingMode, activeIconSetEntryId, workspace])

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
    const theme = workspaceThemeService.getObjectTheme(selection, workspace)
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
    return workspaceThemeService.getObjectTheme(selection, workspace)
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

  const metadataProperties = useMemo<FlatProperty[] | undefined>(() => {
    if (isThemeEditingMode && editedTheme && activeThemeEntryId) {
      const entry = workspace.themes[activeThemeEntryId]
      const board = Object.values(workspace.boards).find(
        (component) =>
          isThemeBoard(component) &&
          component.variants.some(
            (variant) => variant.id === activeThemeEntryId,
          ),
      )
      const author = board && isThemeBoard(board) ? board.author : undefined
      return buildMetadataProperties({
        name: entry?.label ?? editedTheme.metadata.name,
        description: editedTheme.metadata.description,
        intent: editedTheme.metadata.intent,
        author,
      })
    }
    if (
      isFontCollectionEditingMode &&
      editedFontCollection &&
      activeFontCollectionEntryId
    ) {
      const entry = workspace["font-collections"][activeFontCollectionEntryId]
      return buildMetadataProperties({
        name: entry?.label ?? editedFontCollection.metadata.name,
        description: editedFontCollection.metadata.description,
        intent: editedFontCollection.metadata.intent,
      })
    }
    if (isIconSetEditingMode && editedIconSet && activeIconSetEntryId) {
      const entry = workspace["icon-sets"][activeIconSetEntryId]
      return buildMetadataProperties({
        name: entry?.label ?? editedIconSet.metadata.name,
        description: editedIconSet.metadata.description,
        intent: editedIconSet.metadata.intent,
      })
    }
    return undefined
  }, [
    isThemeEditingMode,
    editedTheme,
    activeThemeEntryId,
    isFontCollectionEditingMode,
    editedFontCollection,
    activeFontCollectionEntryId,
    isIconSetEditingMode,
    editedIconSet,
    activeIconSetEntryId,
    workspace,
  ])

  const fontVariantSelection = useMemo(() => {
    if (!isFontCollectionEditingMode || !activeFontCollectionEntryId) return {}
    return workspaceFontCollectionService.getVariantSelection(
      activeFontCollectionEntryId,
      workspace,
    )
  }, [isFontCollectionEditingMode, activeFontCollectionEntryId, workspace])

  const familyProperties = useMemo<FlatProperty[] | undefined>(() => {
    if (!isFontCollectionEditingMode || !editedFontCollection) return undefined
    return flattenFontCollectionFamilies(
      editedFontCollection,
      fontVariantSelection,
      showUnusedFonts,
    )
  }, [
    isFontCollectionEditingMode,
    editedFontCollection,
    fontVariantSelection,
    showUnusedFonts,
  ])

  const { updateFontCollectionProperty } = useFontCollectionProperties(
    activeFontCollectionEntryId,
  )

  const fontCollectionEditingContext = useMemo((): {
    isFontCollectionEditing: true
    updateFontCollectionProperty: (
      property: FlatProperty,
      newValue: string,
    ) => void
  } | null => {
    if (!isFontCollectionEditingMode) return null
    return {
      isFontCollectionEditing: true,
      updateFontCollectionProperty,
    }
  }, [isFontCollectionEditingMode, updateFontCollectionProperty])

  const iconProperties = useMemo<FlatProperty[] | undefined>(() => {
    if (!isIconSetEditingMode || !editedIconSet) return undefined
    return flattenIconSetCategories(
      editedIconSet,
      iconInclusion,
      showUnusedIcons,
    )
  }, [isIconSetEditingMode, editedIconSet, iconInclusion, showUnusedIcons])

  const { updateIconSetProperty } = useIconSetProperties(activeIconSetEntryId)

  const iconSetEditingContext = useMemo((): {
    isIconSetEditing: true
    updateIconSetProperty: (property: FlatProperty, newValue: string) => void
  } | null => {
    if (!isIconSetEditingMode) return null
    return {
      isIconSetEditing: true,
      updateIconSetProperty,
    }
  }, [isIconSetEditingMode, updateIconSetProperty])

  const propertyTreeNode = useMemo((): Variant | Instance | Board | null => {
    if (selection) {
      return selection as Variant | Instance | Board
    }
    if (selectedBoard) {
      return selectedBoard
    }
    if (isThemeEditingMode) {
      for (const entry of Object.values(workspace.boards)) {
        if (isThemeBoard(entry)) {
          return entry
        }
      }
    }
    if (isFontCollectionEditingMode && activeFontCollectionEntryId) {
      for (const entry of Object.values(workspace.boards)) {
        if (
          isFontCollectionBoard(entry) &&
          entry.variants.some(
            (variant) => variant.id === activeFontCollectionEntryId,
          )
        ) {
          return entry
        }
      }
    }
    if (isIconSetEditingMode && activeIconSetEntryId) {
      for (const entry of Object.values(workspace.boards)) {
        if (
          isIconSetBoard(entry) &&
          entry.variants.some(
            (variant) => variant.id === activeIconSetEntryId,
          )
        ) {
          return entry
        }
      }
    }
    return null
  }, [
    selection,
    selectedBoard,
    isThemeEditingMode,
    isFontCollectionEditingMode,
    activeFontCollectionEntryId,
    isIconSetEditingMode,
    activeIconSetEntryId,
    workspace.boards,
  ])

  if (
    !selection &&
    !isThemeEditingMode &&
    !isFontCollectionEditingMode &&
    !isIconSetEditingMode
  ) {
    return <SidebarContainer style={sidebarNoSelectionStyle} />
  }

  if (!propertyTreeNode) {
    return <SidebarContainer style={sidebarNoSelectionStyle} />
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
        fontCollectionEditingContext={fontCollectionEditingContext}
        iconSetEditingContext={iconSetEditingContext}
        metadataProperties={metadataProperties}
        familyProperties={familyProperties}
        iconProperties={iconProperties}
      />
    </SidebarContainer>
  )
}

