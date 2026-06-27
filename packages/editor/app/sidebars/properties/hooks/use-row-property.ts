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
  ValueType,
  Variant,
  Workspace,
  isReservedTokenName,
} from "@seldon/core"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
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
import { ComboboxFieldProps } from "@seldon/components/elements/ComboboxField"
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
import type { LayerDragContext } from "../LayerDragRow"
import {
  getFormControlStyle,
  getRowStyle,
} from "../helpers/property-row-state-styles"
import {
  getPropertyLabelStyle,
  getPropertyRowStyle,
} from "../helpers/property-styling-tokens"
import { isNumericPropertyValue } from "../helpers/property-value-display"
import {
  getThemeTokenIconColorFromPropertyValue,
  isSwatchIconPropertyKey,
} from "../helpers/theme-token-icon-color"
import { buildPropertyValueInput } from "../helpers/build-property-value-input"
import { usePropertyControl } from "./use-property-control"
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
 * Returns the layer-reorder context for a row when it is a draggable layered
 * paint parent (`background`/`shadow`) on a node with more than one layer.
 * Returns null for boards, non-layer rows, facet rows, and single-layer stacks.
 */
function resolveLayerDrag({
  property,
  node,
  allProperties,
}: Pick<
  RowPropertyProps,
  "property" | "node" | "allProperties"
>): LayerDragContext | null {
  if (isBoard(node)) return null
  if (property.isSubProperty) return null
  if (property.layerIndex === undefined) return null

  const root = property.key.split(".")[0]
  if (!isLayeredPaintProperty(root as PropertyKey)) return null

  const layerCount = allProperties.filter(
    (candidate) =>
      candidate.layerIndex !== undefined &&
      !candidate.isSubProperty &&
      candidate.key.split(".")[0] === root,
  ).length
  if (layerCount < 2) return null

  return {
    property: root as LayeredPaintKey,
    layerIndex: property.layerIndex,
    layerCount,
  }
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
  const { resetProperty, removeNodeLayer, applyBoardPropertiesToAllBoards } =
    useObjectProperties()
  const { toggleProperty } = usePropertyExpansion()
  const themes = useThemes()
  const { getPropertyValueForDisplay, getUnit, shouldShowMenuIcon } =
    usePropertyControlData({ property, theme })
  const { show: showUploadPanel } = useImageUploadPanel()

  const frameRef = useRef<HTMLDivElement>(null)
  const valueInputRef = useRef<HTMLInputElement>(null)
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

  // A closed row uses `options` only to look up the current value's display
  // name. Theme tokens, compound and shorthand summaries, and dimmed rows
  // already resolve to a formatted `actualValue`, which can never match a
  // picker value (a label like "Primary" is not the token `@swatch.primary`),
  // so `getDisplayValue` ignores `options` for them. Skipping the build avoids
  // generating the full swatch/font/size/look lists for every row on each
  // selection. The editing control rebuilds its own options when the row opens.
  const displaySkipsOptions =
    property.isCompound ||
    property.isShorthand ||
    property.isDimmed ||
    property.valueType === ValueType.THEME_ORDINAL ||
    property.valueType === ValueType.THEME_CATEGORICAL

  // Options for theme value matching (UI optimization).
  const options = useMemo(
    () =>
      displaySkipsOptions
        ? undefined
        : buildPropertyOptions({ property, theme, workspace, subject: node }),
    [displaySkipsOptions, property, theme, node, workspace],
  )

  const nodeId = isBoard(node) ? getComponentKey(node) : node.id
  const unit = getUnit()
  const isNumericValue = useMemo(
    () => isNumericPropertyValue(property),
    [property],
  )

  // The unit is folded into the display string (e.g. "24px") and shown in the
  // single combobox value field. There is no separate unit element.
  const value = getDisplayValue(
    propertyValue,
    property.key,
    nodeId,
    workspace,
    theme,
    options,
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

  const endEdit = useCallback(() => setIsEditingProperty(false), [])

  // Mount the value control. The view (none / field / combobox) drives the value
  // `input` slot and, for combobox, the floating option list rendered by the
  // shell. Editing is owned here so a row click can open it.
  const control = usePropertyControl({
    property,
    propertySubject: node,
    theme,
    frameRef,
    isEditing: isEditingProperty,
    onEditChange: setIsEditingProperty,
    onTabNext: handleTabNext,
    onTabPrev: handleTabPrev,
    color: labelColor,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
  })

  // The combobox controller owns its own input ref (focus/select/anchoring); a
  // text/number field has none, so focus it here when the row enters edit mode.
  useEffect(() => {
    if (isEditingProperty && control.kind === "field") {
      const input = valueInputRef.current
      if (input) {
        input.focus()
        input.select()
      }
    }
  }, [isEditingProperty, control.kind])

  const valueRef =
    control.kind === "combobox" ? control.field.inputRef : valueInputRef

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

  const valueLabelProps = buildPropertyValueInput({
    control,
    isEditing: isEditingProperty,
    displayValue: value,
    valueRef,
    beginEdit: handleLabel2Click,
    endEdit,
    onTabNext: handleTabNext,
    onTabPrev: handleTabPrev,
  })

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

  // The board's device row (the `board` compound) can push its board properties
  // onto every other component board. Append it to the row's actions menu so the
  // command lives beside the device/viewport setting.
  const handleApplyToAllBoards = () => {
    const confirmed = window.confirm(
      "Apply this board's properties to all other component boards? This overwrites their board properties.",
    )
    if (!confirmed) return
    applyBoardPropertiesToAllBoards({ sourceBoardKey: nodeId })
  }

  const resetActions: MenuEntry[] =
    isBoard(node) && property.key === "board"
      ? [
          {
            id: "apply-to-all-boards",
            label: "Apply to All Boards",
            onSelect: handleApplyToAllBoards,
            testId: `property-row-${property.key}-apply-to-all`,
          },
          ...(rowActions.length > 0 ? ["separator" as const] : []),
          ...rowActions,
        ]
      : rowActions

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

  // Frame props for the combobox-field value frame. The row supplies its own
  // children (value icon, value cell, menu button), so the field's default
  // icon/input/button slots are left to the children path.
  const frameProps = {
    tabIndex: -1,
    [FRAME_REF_ATTR]: FRAME_REF_VALUE,
    ref: setFrameRef,
    onClick: handleFrameRefClick,
    onMouseEnter: handleFrameMouseEnter,
    onMouseLeave: handleFrameMouseLeave,
    style: getFormControlStyle({ cursor: rowCursor, hoverStyle }),
  } as ComboboxFieldProps & {
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
    unitLabel: undefined,
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

  const layerDrag = resolveLayerDrag({ property, node, allProperties })

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
    control,
    valueLabelProps,
    setValueFieldRef: setFrameRef,
    endEdit,
    isEditingProperty,
    resetActions,
    focusTargetRef: frameRef,
    labelColor,
    isExpanded,
    hasChildren,
    childItems,
    layerDrag,
  }
}
