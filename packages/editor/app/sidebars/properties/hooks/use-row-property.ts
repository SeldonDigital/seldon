import {
  getCurrentOptionValue,
  getOptionIcon,
} from "@lib/icons/resolve-option-icon"
import { MenuEntry } from "@lib/menus"
import {
  childPathsUnderCompoundParent,
  parsePropertyPath,
} from "@lib/properties/property-paths"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Board,
  Instance,
  type LayeredPaintKey,
  PropertyKey,
  SubPropertyKey,
  Theme,
  type ThemeCustomTokenSection,
  Variant,
  Workspace,
  isReservedTokenName,
} from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { isEntryNodeInstance } from "@seldon/core/workspace/model/entry-node"
import { NORMAL_STATE } from "@seldon/core/workspace/model/node-state"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useThemes } from "@lib/themes/hooks/use-themes"
import {
  INSTANCE_STATE_EDIT_MESSAGE,
  useNodeActiveState,
} from "@lib/workspace/hooks/use-node-active-state"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useInlineRename } from "../../hooks/use-inline-rename"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { FormControlIconicProps } from "@seldon/components/elements/FormControlIconic"
import {
  imageUploadTargetForKey,
  useImageUploadPanel,
} from "@app/panels/hooks/use-upload-image-panel"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { buildResetMenuEntry } from "../../shared/build-reset-menu-entry"
import { buildPropertyOptions } from "../helpers/build-property-options"
import {
  FRAME_REF_ATTR,
  FRAME_REF_SELECTOR,
  FRAME_REF_VALUE,
  buildPropertyRowProps,
} from "../helpers/build-property-row-props"
import { ICONIC_BUTTON_SELECTOR } from "../../helpers/iconic-button"
import { getDisplayValue } from "../helpers/display-value-utils"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "../helpers/editing-contexts"
import { FlatProperty } from "../helpers/properties-data"
import {
  getFormControlStyle,
  getRowStyle,
} from "../helpers/property-row-state-styles"
import {
  getPropertyLabelStyle,
  getPropertyRowStyle,
} from "../helpers/property-styling-tokens"
import {
  isNumericPropertyValue,
  stripDisplayUnitSuffix,
} from "../helpers/property-value-display"
import {
  getThemeTokenIconColorFromPropertyValue,
  isSwatchIconPropertyKey,
} from "../helpers/theme-token-icon-color"
import { usePropertyControlData } from "./use-property-control-data"
import {
  usePropertyEditNavigation,
  usePropertyEditRowRegistration,
} from "./use-property-edit-navigation"
import {
  useIsPropertyExpanded,
  usePropertyExpansion,
} from "./use-property-expansion"
import { usePropertyFrameHover } from "./use-property-frame-hover"

export interface RowPropertyProps {
  property: FlatProperty
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  allProperties: FlatProperty[]
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

/**
 * ViewModel hook for a property row. Owns the edit/hover state, display
 * derivation, interaction commands, and the assembled props for the generated
 * `ItemInputRow`, `PropertyValueCell`, and the reset menu, so
 * `VMProperty` stays a binding shell. Child rows are returned as plain
 * props for the shell to recurse on.
 */
export function useRowProperty({
  property,
  workspace,
  node,
  theme,
  allProperties,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
}: RowPropertyProps) {
  const { showPropertyTypes } = useDebugMode()
  const { resetProperty, removeNodeLayer } = useObjectProperties()
  const { toggleProperty } = usePropertyExpansion()
  const themes = useThemes()
  const { getPropertyValueForDisplay, getUnit, shouldShowMenuIcon } =
    usePropertyControlData({ property, theme })
  const { show: showUploadPanel } = useImageUploadPanel()

  const frameRef = useRef<HTMLDivElement>(null)
  const [isEditingProperty, setIsEditingProperty] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const addToast = useAddToast()

  // Instances cannot author interaction states. In a non-Normal state their rows
  // are read-only: no hover outline, no chevron, default cursor, and a click
  // surfaces the source-component toast instead of entering edit mode.
  const activeState = useNodeActiveState(node)
  const isStateReadOnly =
    !isBoard(node) && isEntryNodeInstance(node) && activeState !== NORMAL_STATE

  // A row is reachable by Tab when it owns an editable control and is not
  // dimmed, read-only, a look-parent grouping, or a license link row.
  const isNavigable =
    Boolean(property.controlType) &&
    !property.isDimmed &&
    !isStateReadOnly &&
    !property.isLookParent &&
    !property.linkHref

  const editNavigation = usePropertyEditNavigation()
  const handleTabNext = useCallback(
    () => editNavigation?.moveFocus(property.key, 1) ?? false,
    [editNavigation, property.key],
  )
  const handleTabPrev = useCallback(
    () => editNavigation?.moveFocus(property.key, -1) ?? false,
    [editNavigation, property.key],
  )

  // A custom token row can be renamed in place. Reserved scale/look/swatch keys
  // are not `customN`, so they never match. Only meaningful on a theme variant.
  const customTokenTarget = useMemo<{
    section: ThemeCustomTokenSection
    key: string
  } | null>(() => {
    if (
      !themeEditingContext?.isThemeEditing ||
      !themeEditingContext.canAddCustom
    ) {
      return null
    }
    const parts = property.key.split(".")
    const section = parts[0]
    let id: string | undefined
    if (parts.length === 2) {
      id = parts[1]
    } else if (parts.length === 3 && parts[2] === "step") {
      id = parts[1]
    }
    if (!section || !id || !/^custom\d+$/.test(id)) return null
    return { section: section as ThemeCustomTokenSection, key: id }
  }, [property.key, themeEditingContext])

  // An upper paint layer parent row (`background.1`, index >= 1) can be deleted.
  // The base layer (index 0, bare key) is not deletable.
  const layerTarget = useMemo<{
    property: LayeredPaintKey
    index: number
  } | null>(() => {
    if (themeEditingContext?.isThemeEditing) return null
    const parsed = parsePropertyPath(property.key)
    if (parsed.kind === "layered-parent" && parsed.index >= 1) {
      return { property: parsed.root, index: parsed.index }
    }
    return null
  }, [property.key, themeEditingContext])

  // Sub-properties for this compound/shorthand property.
  const children = useMemo(() => {
    if (!property.isCompound && !property.isShorthand) return []
    return allProperties.filter(
      (p) =>
        p.isSubProperty && childPathsUnderCompoundParent(property.key, p.key),
    )
  }, [allProperties, property.key, property.isCompound, property.isShorthand])

  const hasChildren = children.length > 0
  const isExpanded = useIsPropertyExpanded(property.key)
  const labelText = property.label
  const isThemeAssignment = property.pickerVariant === "themeAssignment"

  // Property icons are real icon ids resolved by the custom Icon wrapper. The
  // closed control always shows the property's default icon, with one exception:
  // per-option static icons (e.g. board presets get their device icon). Theme
  // tokens, glyphs, and swatches defer to the property icon so the row never
  // swaps to the token icon; the token icon stays in the menu, and the swatch
  // chip is painted separately via swatchChipColor.
  const currentIconDescriptor = getOptionIcon(
    property.key,
    getCurrentOptionValue(property.key, property.value),
    theme,
    property.icon,
  )
  const iconId =
    currentIconDescriptor.kind === "static"
      ? currentIconDescriptor.icon
      : property.icon

  // Can reset only when overridden. Font collection family rows (`family.*`) and
  // icon set rows (`icon.*`) carry an override status for color only; they have
  // no node-property reset, so the affordance is hidden.
  const canReset =
    property.status === "override" &&
    !property.key.startsWith("family.") &&
    !property.key.startsWith("icon.")

  // Resolve the swatch cluster theme for the synthetic Theme-assignment row.
  const themeForSwatches = useMemo<Theme | null>(() => {
    if (!isThemeAssignment) return null
    const displayThemeId = workspaceThemeService.getObjectThemeId(
      node,
      workspace,
    )
    return themes.find((t) => t.id === displayThemeId) ?? null
  }, [isThemeAssignment, node, workspace, themes])

  const propertyValue = getPropertyValueForDisplay()

  // Options for theme value matching (UI optimization).
  const options = useMemo(
    () => buildPropertyOptions({ property, theme, workspace, subject: node }),
    [property, theme, node, workspace],
  )

  const nodeId = isBoard(node) ? getComponentKey(node) : node.id
  const unit = getUnit()
  const isNumericValue = useMemo(
    () => isNumericPropertyValue(property),
    [property],
  )

  // Strip the unit suffix from the display value when a separate unit label is
  // shown, avoiding redundant output like "10px PX".
  const value = stripDisplayUnitSuffix(
    getDisplayValue(
      propertyValue,
      property.key,
      nodeId,
      workspace,
      theme,
      options,
    ),
    unit,
    isNumericValue,
  )

  const rowStyle = useMemo(
    () => getPropertyRowStyle(property, showPropertyTypes),
    [property, showPropertyTypes],
  )
  const labelStyle = useMemo(
    () => getPropertyLabelStyle(property, showPropertyTypes),
    [property, showPropertyTypes],
  )
  const labelColor = labelStyle.color

  const swatchChipColor = useMemo(() => {
    if (!theme || !isSwatchIconPropertyKey(property.key)) {
      return undefined
    }
    return getThemeTokenIconColorFromPropertyValue(property.value, theme)
  }, [property.key, property.value, theme])

  const rowColor = rowStyle.color as string | undefined
  const { setIsHovered, style: hoverStyle } = usePropertyFrameHover(rowColor)

  // Keyboard Tab moves edit focus without firing pointer events, so the row the
  // mouse rests on keeps its hover outline. Hand the hover setter to the
  // navigation coordinator so it can clear the source row and outline the target.
  usePropertyEditRowRegistration(
    property.key,
    frameRef,
    () => setIsEditingProperty(true),
    setIsHovered,
    isNavigable,
  )

  // Image rows (source attribute, background image facet) support upload.
  const uploadTarget = imageUploadTargetForKey(property.key)
  const supportsUpload = uploadTarget !== null

  const handleToggle = () => {
    if (hasChildren) {
      toggleProperty(property.key)
    }
  }

  const handleReset = () => {
    // Theme rows reset their entry override; node dispatches do not apply.
    if (themeEditingContext?.isThemeEditing) {
      themeEditingContext.resetThemeProperty(property)
      return
    }
    if (property.isSubProperty) {
      const parsed = parsePropertyPath(property.key)
      if (parsed.kind === "layered-facet") {
        resetProperty(
          parsed.root as PropertyKey,
          parsed.facet as SubPropertyKey,
          parsed.index,
        )
      } else if (parsed.kind === "facet") {
        resetProperty(
          parsed.root as PropertyKey,
          parsed.facet as SubPropertyKey,
        )
      } else {
        resetProperty(property.key as PropertyKey)
      }
    } else {
      const parsed = parsePropertyPath(property.key)
      if (parsed.kind === "layered-parent") {
        resetProperty(parsed.root as PropertyKey, undefined, parsed.index)
      } else {
        resetProperty(property.key as PropertyKey)
      }
    }
  }

  const handleFrameMouseEnter = () => {
    // Don't enable hover for dimmed or read-only (instance state) properties.
    if (!property.isDimmed && !isStateReadOnly) {
      setIsHovered(true)
    }
  }
  const handleFrameMouseLeave = () => setIsHovered(false)

  // Reset hover state when clicking outside the frame.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        frameRef.current &&
        !frameRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setIsHovered])

  const handleFrameClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isStateReadOnly) {
      event.stopPropagation()
      addToast(INSTANCE_STATE_EDIT_MESSAGE)
      return
    }

    if (property.isDimmed || !property.controlType || isEditingProperty) {
      return
    }

    const target = event.target as HTMLElement
    if (target.closest("button") || target.closest(ICONIC_BUTTON_SELECTOR)) {
      return
    }

    // Only enter edit mode when clicking the actual control input area; let row
    // clicks elsewhere handle toggling.
    const inputElement = target.closest("input, textarea, select")
    if (!inputElement) {
      return
    }

    event.stopPropagation()
    setIsEditingProperty(true)
  }

  const handleLabel2Click = useCallback(
    (event: React.MouseEvent) => {
      if (isStateReadOnly) {
        event.stopPropagation()
        addToast(INSTANCE_STATE_EDIT_MESSAGE)
        return
      }
      if (!property.isDimmed && property.controlType) {
        event.stopPropagation()
        setIsEditingProperty(true)
      }
    },
    [
      isStateReadOnly,
      addToast,
      property.isDimmed,
      property.controlType,
      setIsEditingProperty,
    ],
  )

  const handleRowClick = (event: React.MouseEvent<HTMLLIElement>) => {
    const target = event.target as HTMLElement
    if (
      target.closest("button") ||
      target.closest(ICONIC_BUTTON_SELECTOR) ||
      isEditingProperty ||
      property.isDimmed ||
      !hasChildren
    ) {
      return
    }

    // Don't toggle when clicking the value-cell frame control.
    if (target.closest(FRAME_REF_SELECTOR)) {
      return
    }

    handleToggle()
  }

  const handleUploadClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (uploadTarget) {
        showUploadPanel({ property: uploadTarget })
      }
    },
    [uploadTarget, showUploadPanel],
  )

  const handleMenuClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (isStateReadOnly) {
        addToast(INSTANCE_STATE_EDIT_MESSAGE)
        return
      }
      if (
        !property.isDimmed &&
        !isEditingProperty &&
        (property.controlType === "menu" || property.controlType === "combo")
      ) {
        setIsEditingProperty(true)
      }
    },
    [
      isStateReadOnly,
      addToast,
      property.isDimmed,
      property.controlType,
      isEditingProperty,
    ],
  )

  const setFrameRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      frameRef.current = el
    }
  }, [])

  const handleFrameRefClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const frameElement = event.currentTarget as HTMLDivElement
      if (frameElement && frameElement !== frameRef.current) {
        frameRef.current = frameElement
      }
      handleFrameClick(event)
    },
    [handleFrameClick],
  )

  const handleRenameSubmit = useCallback(
    (value: string) => {
      if (!customTokenTarget || !themeEditingContext?.isThemeEditing) {
        setIsRenaming(false)
        return
      }
      const trimmed = value.trim()
      if (!trimmed) {
        setIsRenaming(false)
        return
      }
      // The reducer enforces this too; the toast gives instant feedback and
      // keeps the row in edit mode so the user can correct the name.
      if (isReservedTokenName(customTokenTarget.section, trimmed)) {
        addToast(`"${trimmed}" is a reserved ${customTokenTarget.section} name`)
        return
      }
      themeEditingContext.renameCustomToken(
        customTokenTarget.section,
        customTokenTarget.key,
        trimmed,
      )
      setIsRenaming(false)
    },
    [customTokenTarget, themeEditingContext, addToast],
  )

  const handleRowDoubleClick = useCallback(() => {
    if (customTokenTarget) {
      setIsRenaming(true)
    }
  }, [customTokenTarget])

  const { labelChildren } = useInlineRename({
    label: labelText,
    isEditing: isRenaming,
    setEditing: setIsRenaming,
    onSubmit: handleRenameSubmit,
  })

  // Custom-token rows expose a single "Delete" action instead of reset: a
  // custom token has no base value to reset to, so deletion removes the cell.
  const rowActions: MenuEntry[] = customTokenTarget
    ? [
        {
          id: "delete-custom-token",
          label: `Delete ${labelText}`,
          onSelect: () =>
            themeEditingContext?.removeCustomToken(
              customTokenTarget.section,
              customTokenTarget.key,
            ),
          testId: `property-row-${property.key}-delete`,
        },
      ]
    : [
        // Delete sits before Reset on a deletable upper paint layer row.
        ...(layerTarget
          ? [
              {
                id: "delete-layer",
                label: `Delete ${labelText}`,
                onSelect: () =>
                  removeNodeLayer(layerTarget.property, layerTarget.index),
                testId: `property-row-${property.key}-delete`,
              },
            ]
          : []),
        ...(canReset
          ? [
              buildResetMenuEntry({
                label:
                  property.key === "background"
                    ? "Reset Entire Background"
                    : `Reset ${labelText}`,
                onSelect: handleReset,
                testId: `property-row-${property.key}-reset`,
              }),
            ]
          : []),
      ]

  const listItemProps = buildPropertyRowProps({
    property,
    isExpanded,
    hasChildren,
    labelText,
    labelStyle,
    labelColor,
    iconId,
    isThemeAssignment,
    swatchChipColor,
    unit,
    isNumericValue,
    isEditingProperty,
    supportsUpload,
    showMenuIcon: shouldShowMenuIcon(),
    isReadOnly: isStateReadOnly,
    handleToggle,
    handleLabel2Click,
    handleUploadClick,
    handleMenuClick,
  })

  if (customTokenTarget && isRenaming) {
    listItemProps.textLabel = {
      ...listItemProps.textLabel,
      children: labelChildren as unknown as string,
    }
  }

  const rowCursor =
    !isStateReadOnly && (hasChildren || property.controlType)
      ? "pointer"
      : "default"

  // Suppress the form control's internal icon/input/button slots: the row's
  // child slots (value icon, value cell, menu button) supply the content.
  const frameProps = {
    icon: null,
    input: null,
    button: null,
    tabIndex: -1,
    [FRAME_REF_ATTR]: FRAME_REF_VALUE,
    ref: setFrameRef,
    onClick: handleFrameRefClick,
    onMouseEnter: handleFrameMouseEnter,
    onMouseLeave: handleFrameMouseLeave,
    style: getFormControlStyle({ cursor: rowCursor, hoverStyle }),
  } as FormControlIconicProps & {
    ref?: (el: HTMLDivElement | null) => void
  }

  const rowStyleProp = getRowStyle({ rowStyle, hasChildren })

  const valueCellProps = {
    property,
    value,
    node,
    theme,
    labelColor,
    valueChip: listItemProps.valueChip,
    unitLabel: listItemProps.unitLabel,
    isEditingProperty,
    isThemeAssignment,
    themeForSwatches,
    frameRef,
    onEditChange: setIsEditingProperty,
    onTabNext: handleTabNext,
    onTabPrev: handleTabPrev,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
  }

  const childItems: RowPropertyProps[] = children.map((subProperty) => ({
    property: subProperty,
    workspace,
    node,
    theme,
    allProperties,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
  }))

  return {
    listItemProps,
    onRowClick: handleRowClick,
    onRowDoubleClick: handleRowDoubleClick,
    frameProps,
    rowStyleProp,
    valueCellProps,
    resetActions: rowActions,
    focusTargetRef: frameRef,
    labelColor,
    isExpanded,
    hasChildren,
    childItems,
  }
}
