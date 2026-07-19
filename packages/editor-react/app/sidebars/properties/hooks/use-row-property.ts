import {
  getCurrentOptionValue,
  getOptionIcon,
} from "@seldon/editor/lib/icons/resolve-option-icon"
import { MenuEntry } from "@app/menus"
import { buildResetMenuEntry } from "@seldon/editor/lib/menus/reset-menu"
import { ICONIC_BUTTON_SELECTOR } from "@seldon/editor/lib/menus/iconic-button"
import { parsePropertyPath } from "@seldon/editor/lib/properties/property-paths"
import {
  buildActivatedRefProps,
  buildDisabledRefProps,
  buildInvalidRefProps,
} from "@app/views/state-props"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Board,
  Instance,
  type LayeredPaintKey,
  PropertyKey,
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
import {
  INSTANCE_STATE_EDIT_MESSAGE,
  useNodeActiveState,
} from "@app/workspace/hooks/use-node-active-state"
import { useObjectProperties } from "@app/workspace/hooks/use-object-properties"
import { useDebugMode } from "@app/editor/hooks/use-debug-mode"
import { useRenameInput } from "../../hooks/use-rename-input"
import {
  imageUploadTargetForKey,
  useImageUploadPanel,
} from "@app/dialogs/image-upload/hooks/use-upload-image-panel"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { buildPropertyOptions } from "@seldon/editor/lib/properties/inspector/build-property-options"
import {
  FRAME_REF_SELECTOR,
  buildPropertyRowProps,
} from "../helpers/build-property-row-props"
import { buildPropertyValueInput } from "../helpers/build-property-value-input"
import type { LayerDragContext } from "../LayerDragRow"
import { dispatchPropertyReset } from "@seldon/editor/lib/properties/commit-helpers"
import { getDisplayValue } from "@seldon/editor/lib/properties/display-value-utils"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import { FlatProperty, getCompoundChildRows } from "@seldon/editor/lib/properties/inspector/properties-data"
import { getPropertyDebugColor } from "@seldon/editor/lib/properties/property-styling"
import { resolveThemeSwatchColors } from "@seldon/editor/lib/themes/resolve-theme-swatch-colors"
import {
  getThemeTokenIconColorFromPropertyValue,
  isSwatchIconPropertyKey,
} from "@seldon/editor/lib/themes/theme-token-icon-color"
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
 * `Property` stays a binding shell. Child rows are returned as plain
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
  const { getPropertyValueForDisplay, shouldShowMenuIcon } =
    usePropertyControlData({ property })
  const { show: showUploadPanel } = useImageUploadPanel()

  const frameRef = useRef<HTMLDivElement>(null)
  const valueInputRef = useRef<HTMLInputElement>(null)
  const [isEditingProperty, setIsEditingProperty] = useState(false)
  const [isRenaming, setIsRenaming] = useState(false)
  const addToast = useAddToast()

  // The row's local edit state flips a render before the workspace-derived
  // `property.value` prop reflects a commit, so dropping straight to display
  // mode paints the stale pre-commit value for a frame. Hold edit mode (which
  // shows the value the user just entered) until `property.value` changes, then
  // switch to display. A timer guards no-op commits that never change the value.
  const deferredCloseBaselineRef = useRef<string | null>(null)
  const deferredCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )

  const cancelDeferredClose = useCallback(() => {
    if (deferredCloseTimerRef.current !== null) {
      clearTimeout(deferredCloseTimerRef.current)
      deferredCloseTimerRef.current = null
    }
    deferredCloseBaselineRef.current = null
  }, [])

  const setEditing = useCallback(
    (editing: boolean) => {
      if (editing) {
        cancelDeferredClose()
        setIsEditingProperty(true)
        return
      }
      deferredCloseBaselineRef.current = JSON.stringify(property.value ?? null)
      if (deferredCloseTimerRef.current !== null) {
        clearTimeout(deferredCloseTimerRef.current)
      }
      deferredCloseTimerRef.current = setTimeout(() => {
        deferredCloseTimerRef.current = null
        deferredCloseBaselineRef.current = null
        setIsEditingProperty(false)
      }, 600)
    },
    [cancelDeferredClose, property.value],
  )

  useEffect(() => {
    if (deferredCloseBaselineRef.current === null) return
    const currentKey = JSON.stringify(property.value ?? null)
    if (currentKey !== deferredCloseBaselineRef.current) {
      cancelDeferredClose()
      setIsEditingProperty(false)
    }
  }, [property.value, cancelDeferredClose])

  useEffect(() => cancelDeferredClose, [cancelDeferredClose])

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
    if (section === "swatch") {
      // Swatch rows nest under a group: `swatch.<group>.<id>`. Only a custom
      // swatch (`swatch.custom.customN`) can be renamed in place.
      if (parts.length === 3 && parts[1] === "custom") {
        id = parts[2]
      }
    } else if (parts.length === 2) {
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
    return getCompoundChildRows(property.key, allProperties)
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

  // The unit is folded into the display string (e.g. "24px") and shown in the
  // single combobox value field. There is no separate unit element. A look-parent
  // row (theme look groups and computed groups like Modulation) owns no value, so
  // it shows nothing rather than formatting EMPTY into a "Default" placeholder.
  const value = property.isLookParent
    ? ""
    : getDisplayValue(propertyValue, theme, options)

  // Outside debug mode, property status maps to a generated leaf state
  // (activated, invalid, disabled) applied on the row's refs, so the label
  // carries no inline status color. Debug mode keeps the inline status colors
  // for its type visualization.
  const labelColor = showPropertyTypes
    ? getPropertyDebugColor(property)
    : undefined

  const swatchChipColor = useMemo(() => {
    if (!theme || !isSwatchIconPropertyKey(property.key)) {
      return undefined
    }
    return getThemeTokenIconColorFromPropertyValue(property.value, theme)
  }, [property.key, property.value, theme])

  // The theme-assignment row's closed value paints the assigned theme's swatch
  // cluster, the same strip its menu options show. Resolved from the row's theme,
  // exactly like `swatchChipColor`.
  const themeSwatchColors = useMemo(() => {
    if (!isThemeAssignment || !theme) return undefined
    return resolveThemeSwatchColors(theme)
  }, [isThemeAssignment, theme])

  const endEdit = useCallback(() => setEditing(false), [setEditing])

  // Mount the value control. The view (none / field / combobox) drives the value
  // `input` slot and, for combobox, the floating option list rendered by the
  // shell. Editing is owned here so a row click can open it.
  const control = usePropertyControl({
    property,
    propertySubject: node,
    theme,
    frameRef,
    isEditing: isEditingProperty,
    onEditChange: setEditing,
    onTabNext: handleTabNext,
    onTabPrev: handleTabPrev,
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
    () => setEditing(true),
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
    dispatchPropertyReset(property.key, property.isSubProperty, resetProperty)
  }

  // Single click on the combobox-field value frame flips the row into edit mode.
  // The display input is inert (`pointerEvents: none`), so this click lands on
  // the field, mirroring how a node row's double-click rides the row instead of
  // its inert name input. Inner buttons stop their own propagation, so a click on
  // the options-menu button never reaches here.
  const handleValueFieldClick = useCallback(
    (event: React.MouseEvent) => {
      if (isStateReadOnly) {
        event.stopPropagation()
        addToast(INSTANCE_STATE_EDIT_MESSAGE)
        return
      }
      if (!property.isDimmed && property.controlType) {
        event.stopPropagation()
        setEditing(true)
      }
    },
    [
      isStateReadOnly,
      addToast,
      property.isDimmed,
      property.controlType,
      setEditing,
    ],
  )

  const valueLabelProps = buildPropertyValueInput({
    control,
    isEditing: isEditingProperty,
    displayValue: value,
    valueRef,
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
        setEditing(true)
      }
    },
    [
      isStateReadOnly,
      addToast,
      property.isDimmed,
      property.controlType,
      isEditingProperty,
      setEditing,
    ],
  )

  const setFrameRef = useCallback((el: HTMLDivElement | null) => {
    if (el) {
      frameRef.current = el
    }
  }, [])

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

  // The property name slot is an `Input`, so a renameable row reuses the same
  // edit-in-place hook as object names. Non-renameable rows keep `isRenaming`
  // false, so the input stays a read-only, inert display of the label.
  const nameInput = useRenameInput({
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

  // The board-level commands (Apply to All Boards, Reset Board) live on the
  // board category header's actions menu, so the board compound row itself
  // carries no menu entries.
  const resetActions: MenuEntry[] =
    isBoard(node) && property.key === "board" ? [] : rowActions

  const listItemProps = buildPropertyRowProps({
    property,
    isExpanded,
    hasChildren,
    labelText,
    labelColor,
    iconId,
    isThemeAssignment,
    themeSwatchColors,
    swatchChipColor,
    supportsUpload,
    showMenuIcon: shouldShowMenuIcon(),
    isReadOnly: isStateReadOnly,
    handleToggle,
    handleUploadClick,
    handleMenuClick,
  })

  // The name `Input` slot carries the rename hook's display or edit props plus
  // the row's resting name style. The hook owns `pointerEvents` (inert while
  // displaying, live while editing), so its style is spread last.
  const nameLabelProps = {
    ...nameInput,
    style: { ...listItemProps.nameLabelStyle, ...nameInput.style },
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
    nameLabelProps,
    onRowClick: handleRowClick,
    onRowDoubleClick: handleRowDoubleClick,
    control,
    // Property status maps to a generated leaf state, replacing inline status
    // colors: override -> activated, error -> invalid, not used -> disabled.
    // Set and unset stay normal. Debug mode keeps the inline status colors.
    stateRef: showPropertyTypes
      ? {}
      : property.status === "override"
        ? buildActivatedRefProps(true)
        : property.status === "error"
          ? buildInvalidRefProps(true)
          : property.status === "not used"
            ? buildDisabledRefProps(true)
            : {},
    valueLabelProps,
    onValueFieldClick: handleValueFieldClick,
    setValueFieldRef: setFrameRef,
    endEdit,
    resetActions,
    focusTargetRef: frameRef,
    isExpanded,
    hasChildren,
    childItems,
    layerDrag,
  }
}
