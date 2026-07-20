import type { MenuEntry } from "@app/menus/types"
import {
  buildActivatedRefProps,
  buildDisabledRefProps,
  buildInvalidRefProps,
  mergeStateProps,
} from "@app/sidebars/state-props"
import { useRenameInput } from "@app/sidebars/use-rename-input"
import { useToastStore } from "@app/toaster/toast-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import {
  getCurrentOptionValue,
  getOptionIcon,
} from "@seldon/editor/lib/icons/resolve-option-icon"
import { buildResetMenuEntry } from "@seldon/editor/lib/menus/reset-menu"
import { getDisplayValue } from "@seldon/editor/lib/properties/display-value-utils"
import { buildPropertyOptions } from "@seldon/editor/lib/properties/inspector/build-property-options"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import {
  type FlatProperty,
  getCompoundChildRows,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { parsePropertyPath } from "@seldon/editor/lib/properties/property-paths"
import { resolveThemeSwatchColors } from "@seldon/editor/lib/themes/resolve-theme-swatch-colors"
import {
  getThemeTokenIconColorFromPropertyValue,
  isSwatchIconPropertyKey,
} from "@seldon/editor/lib/themes/theme-token-icon-color"
import {
  type ComputedRef,
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
} from "vue"

import {
  type Board,
  type Instance,
  type LayeredPaintKey,
  type PropertyKey,
  type Theme,
  type ThemeCustomTokenSection,
  ValueType,
  type Variant,
  type Workspace,
  isReservedTokenName,
} from "@seldon/core"
import { isLayeredPaintProperty } from "@seldon/core/properties/types/property-keys"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"

import {
  FRAME_REF_SELECTOR,
  buildPropertyRowProps,
} from "../helpers/build-property-row-props"
import { buildPropertyValueInput } from "../helpers/build-property-value-input"
import {
  getPropertyValueForDisplay,
  shouldShowMenuIcon,
} from "../helpers/property-control-data"
import { usePropertyExpansionStore } from "../property-expansion-store"
import { usePropertyEditNavigation } from "../use-property-edit-navigation"
import { usePropertyControl } from "./use-property-control"

export interface RowPropertyInput {
  property: ComputedRef<FlatProperty>
  workspace: ComputedRef<Workspace>
  node: ComputedRef<Variant | Instance | Board>
  theme: ComputedRef<Theme | undefined>
  allProperties: ComputedRef<FlatProperty[]>
  themeEditingContext: ComputedRef<ThemeEditingContext | null>
  fontCollectionEditingContext: ComputedRef<FontCollectionEditingContext | null>
  iconSetEditingContext: ComputedRef<IconSetEditingContext | null>
}

/** Layered paint parent row context for drag reorder. */
export interface LayerDragContext {
  property: LayeredPaintKey
  layerIndex: number
  layerCount: number
}

function resolveLayerDrag(
  property: FlatProperty,
  node: Variant | Instance | Board,
  allProperties: FlatProperty[],
): LayerDragContext | null {
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
 * ViewModel for a property row. Owns edit/rename state, display derivation, the
 * assembled generated `ItemProperty` slot props, reset/delete actions, state
 * tints, compound children, and layer drag context. Vue port of the React
 * `useRowProperty`.
 */
export function useRowProperty(input: RowPropertyInput) {
  const dispatch = useDispatch()
  const toast = useToastStore()
  const expansion = usePropertyExpansionStore()
  const editNavigation = usePropertyEditNavigation()

  const rowRef = ref<{ $el?: HTMLElement } | null>(null)
  const rowEl = computed<HTMLElement | null>(() => rowRef.value?.$el ?? null)

  const isEditing = ref(false)
  const isRenaming = ref(false)

  // Deferred close: hold edit mode until the workspace-derived value reflects
  // the commit, so the row never paints the stale pre-commit value for a frame.
  let deferredBaseline: string | null = null
  let deferredTimer: ReturnType<typeof setTimeout> | null = null

  function cancelDeferredClose(): void {
    if (deferredTimer !== null) {
      clearTimeout(deferredTimer)
      deferredTimer = null
    }
    deferredBaseline = null
  }

  function setEditing(editing: boolean): void {
    if (editing) {
      cancelDeferredClose()
      isEditing.value = true
      return
    }
    deferredBaseline = JSON.stringify(input.property.value.value ?? null)
    if (deferredTimer !== null) clearTimeout(deferredTimer)
    deferredTimer = setTimeout(() => {
      deferredTimer = null
      deferredBaseline = null
      isEditing.value = false
    }, 600)
  }

  watch(
    () => input.property.value.value,
    (value) => {
      if (deferredBaseline === null) return
      const currentKey = JSON.stringify(value ?? null)
      if (currentKey !== deferredBaseline) {
        cancelDeferredClose()
        isEditing.value = false
      }
    },
  )

  onBeforeUnmount(cancelDeferredClose)

  const property = input.property
  const node = input.node
  const theme = input.theme

  const isThemeAssignment = computed(
    () => property.value.pickerVariant === "themeAssignment",
  )

  const children = computed<FlatProperty[]>(() => {
    if (!property.value.isCompound && !property.value.isShorthand) return []
    return getCompoundChildRows(property.value.key, input.allProperties.value)
  })
  const hasChildren = computed(() => children.value.length > 0)
  const isExpanded = computed(() =>
    expansion.isPropertyExpanded(property.value.key),
  )
  const labelText = computed(() => property.value.label)

  const isNavigable = computed(
    () =>
      Boolean(property.value.controlType) &&
      !property.value.isDimmed &&
      !property.value.isLookParent &&
      !property.value.linkHref,
  )

  function handleTabNext(): boolean {
    return editNavigation?.moveFocus(property.value.key, 1) ?? false
  }
  function handleTabPrev(): boolean {
    return editNavigation?.moveFocus(property.value.key, -1) ?? false
  }

  const customTokenTarget = computed<{
    section: ThemeCustomTokenSection
    key: string
  } | null>(() => {
    const themeCtx = input.themeEditingContext.value
    if (!themeCtx?.isThemeEditing || !themeCtx.canAddCustom) return null
    const parts = property.value.key.split(".")
    const section = parts[0]
    let id: string | undefined
    if (section === "swatch") {
      if (parts.length === 3 && parts[1] === "custom") id = parts[2]
    } else if (parts.length === 2) {
      id = parts[1]
    } else if (parts.length === 3 && parts[2] === "step") {
      id = parts[1]
    }
    if (!section || !id || !/^custom\d+$/.test(id)) return null
    return { section: section as ThemeCustomTokenSection, key: id }
  })

  const layerTarget = computed<{
    property: LayeredPaintKey
    index: number
  } | null>(() => {
    if (input.themeEditingContext.value?.isThemeEditing) return null
    const parsed = parsePropertyPath(property.value.key)
    if (parsed.kind === "layered-parent" && parsed.index >= 1) {
      return { property: parsed.root, index: parsed.index }
    }
    return null
  })

  const iconId = computed(() => {
    const descriptor = getOptionIcon(
      property.value.key,
      getCurrentOptionValue(property.value.key, property.value.value),
      theme.value,
      property.value.icon,
    )
    return descriptor.kind === "static" ? descriptor.icon : property.value.icon
  })

  const canReset = computed(
    () =>
      property.value.status === "override" &&
      !property.value.key.startsWith("family.") &&
      !property.value.key.startsWith("icon."),
  )

  const displaySkipsOptions = computed(
    () =>
      property.value.isCompound ||
      property.value.isShorthand ||
      Boolean(property.value.isDimmed) ||
      property.value.valueType === ValueType.THEME_ORDINAL ||
      property.value.valueType === ValueType.THEME_CATEGORICAL,
  )

  const displayOptions = computed(() =>
    displaySkipsOptions.value
      ? undefined
      : buildPropertyOptions({
          property: property.value,
          theme: theme.value,
          workspace: input.workspace.value,
          subject: node.value,
        }),
  )

  const displayValue = computed(() =>
    property.value.isLookParent
      ? ""
      : getDisplayValue(
          getPropertyValueForDisplay(property.value),
          theme.value,
          displayOptions.value,
        ),
  )

  const swatchChipColor = computed(() => {
    if (!theme.value || !isSwatchIconPropertyKey(property.value.key)) {
      return undefined
    }
    return getThemeTokenIconColorFromPropertyValue(
      property.value.value,
      theme.value,
    )
  })

  const themeSwatchColors = computed(() => {
    if (!isThemeAssignment.value || !theme.value) return undefined
    return resolveThemeSwatchColors(theme.value)
  })

  function endEdit(): void {
    setEditing(false)
  }

  const control = usePropertyControl({
    property,
    node: computed(() => node.value),
    theme,
    isEditing,
    themeEditingContext: input.themeEditingContext,
    fontCollectionEditingContext: input.fontCollectionEditingContext,
    iconSetEditingContext: input.iconSetEditingContext,
    onDone: () => setEditing(false),
  })

  function handleToggle(event: MouseEvent): void {
    event.stopPropagation()
    if (hasChildren.value) expansion.toggleProperty(property.value.key)
  }

  function handleReset(): void {
    control.reset()
  }

  function handleValueFieldClick(event: MouseEvent): void {
    if (!property.value.isDimmed && property.value.controlType) {
      event.stopPropagation()
      setEditing(true)
    }
  }

  function handleMenuClick(event: MouseEvent): void {
    event.stopPropagation()
    const type = property.value.controlType
    if (
      !property.value.isDimmed &&
      !isEditing.value &&
      (type === "menu" || type === "combo")
    ) {
      setEditing(true)
    }
  }

  function handleUploadClick(event: MouseEvent): void {
    event.stopPropagation()
  }

  function handleRowClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    if (
      target.closest("button") ||
      isEditing.value ||
      property.value.isDimmed ||
      !hasChildren.value
    ) {
      return
    }
    if (target.closest(FRAME_REF_SELECTOR)) return
    if (hasChildren.value) expansion.toggleProperty(property.value.key)
  }

  function handleRenameSubmit(value: string): void {
    const target = customTokenTarget.value
    const themeCtx = input.themeEditingContext.value
    if (!target || !themeCtx?.isThemeEditing) {
      isRenaming.value = false
      return
    }
    const trimmed = value.trim()
    if (!trimmed) {
      isRenaming.value = false
      return
    }
    if (isReservedTokenName(target.section, trimmed)) {
      toast.addToast(`"${trimmed}" is a reserved ${target.section} name`)
      return
    }
    themeCtx.renameCustomToken(target.section, target.key, trimmed)
    isRenaming.value = false
  }

  function handleRowDoubleClick(): void {
    if (customTokenTarget.value) isRenaming.value = true
  }

  const { inputProps: nameInput } = useRenameInput({
    label: () => labelText.value,
    isEditing: () => isRenaming.value,
    setEditing: (editing) => (isRenaming.value = editing),
    onSubmit: handleRenameSubmit,
  })

  const rowActions = computed<MenuEntry[]>(() => {
    const target = customTokenTarget.value
    const themeCtx = input.themeEditingContext.value
    if (target) {
      return [
        {
          id: "delete-custom-token",
          label: `Delete ${labelText.value}`,
          onSelect: () =>
            themeCtx?.removeCustomToken(target.section, target.key),
          testId: `property-row-${property.value.key}-delete`,
        },
      ]
    }
    const entries: MenuEntry[] = []
    const layer = layerTarget.value
    if (layer) {
      entries.push({
        id: "delete-layer",
        label: `Delete ${labelText.value}`,
        onSelect: () =>
          dispatch({
            type: "remove_node_layer",
            payload: {
              nodeId: (node.value as Variant | Instance).id,
              property: layer.property,
              index: layer.index,
            },
          } as never),
        testId: `property-row-${property.value.key}-delete`,
      })
    }
    if (canReset.value) {
      entries.push(
        buildResetMenuEntry({
          label:
            property.value.key === "background"
              ? "Reset Entire Background"
              : `Reset ${labelText.value}`,
          onSelect: handleReset,
          testId: `property-row-${property.value.key}-reset`,
        }),
      )
    }
    return entries
  })

  const resetActions = computed<MenuEntry[]>(() =>
    isBoard(node.value) && property.value.key === "board"
      ? []
      : rowActions.value,
  )

  const listItemProps = computed(() =>
    buildPropertyRowProps({
      property: property.value,
      isExpanded: isExpanded.value,
      hasChildren: hasChildren.value,
      labelColor: undefined,
      iconId: iconId.value,
      isThemeAssignment: isThemeAssignment.value,
      themeSwatchColors: themeSwatchColors.value,
      swatchChipColor: swatchChipColor.value,
      supportsUpload: false,
      showMenuIcon: shouldShowMenuIcon(property.value),
      isReadOnly: false,
      handleToggle,
      handleUploadClick,
      handleMenuClick,
    }),
  )

  const stateRef = computed<Record<string, unknown>>(() => {
    switch (property.value.status) {
      case "override":
        return buildActivatedRefProps(true)
      case "error":
        return buildInvalidRefProps(true)
      case "not used":
        return buildDisabledRefProps(true)
      default:
        return {}
    }
  })

  const nameLabelProps = computed(() =>
    mergeStateProps(nameInput.value, {
      style: listItemProps.value.nameLabelStyle,
    }),
  )

  const valueLabelProps = computed(() =>
    buildPropertyValueInput({
      control,
      isEditing: isEditing.value,
      displayValue: displayValue.value,
      endEdit,
      onTabNext: handleTabNext,
      onTabPrev: handleTabPrev,
    }),
  )

  const layerDrag = computed(() =>
    resolveLayerDrag(property.value, node.value, input.allProperties.value),
  )

  // Focus the freshly-rendered edit input when a row enters edit or rename mode.
  // React focuses imperatively through its `autoFocus` prop; Vue's `autofocus`
  // attribute is not honored on dynamic insertion, so query the input the same
  // way the objects-sidebar rename does. Focusing the value input fires its
  // `onFocus`, which opens the combobox for menu/combo controls.
  watch([isEditing, isRenaming], async ([editing, renaming]) => {
    if (!editing && !renaming) return
    await nextTick()
    const el = rowEl.value
    if (!el) return
    const ref = renaming ? "propertyLabel" : "valueLabel"
    const inputEl = el.querySelector<HTMLInputElement>(
      `input[data-seldon-ref="${ref}"]`,
    )
    if (inputEl) {
      inputEl.focus()
      inputEl.select()
    }
  })

  // Register with the edit-navigation coordinator for Tab-between-rows.
  watch(
    [rowEl, isNavigable],
    ([el], _prev, onCleanup) => {
      if (!editNavigation) return
      if (!el) return
      editNavigation.register(property.value.key, {
        el: rowEl,
        activate: () => setEditing(true),
        isNavigable: isNavigable.value,
      })
      onCleanup(() => editNavigation.unregister(property.value.key))
    },
    { immediate: true },
  )

  return {
    rowRef,
    control,
    isEditing,
    isRenaming,
    listItemProps,
    nameLabelProps,
    valueLabelProps,
    stateRef,
    resetActions,
    isExpanded,
    hasChildren,
    children,
    layerDrag,
    displayValue,
    onRowClick: handleRowClick,
    onRowDoubleClick: handleRowDoubleClick,
    onValueFieldClick: handleValueFieldClick,
    endEdit,
  }
}
