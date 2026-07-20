import type { ComboboxOptionItem } from "@app/menus/types"
import { useWorkspace } from "@app/workspace/use-workspace"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { type ComputedRef, type Ref, computed, ref, watch } from "vue"

import type { Board, Instance, Theme, Variant } from "@seldon/core"

import { getPropertyValueForDisplay } from "../helpers/property-control-data"
import { buildPropertyDisplay } from "../helpers/property-display"
import { getValidationFunction } from "../helpers/property-validation"
import { createPropertyOptionIconResolver } from "../helpers/use-property-option-icon"
import { useCommitPropertyValue } from "./use-commit-property-value"
import { usePropertyCombobox } from "./use-property-combobox"

export type PropertyControlKind = "none" | "field" | "combobox" | "switch"

interface UsePropertyControlInput {
  property: ComputedRef<FlatProperty>
  node: ComputedRef<Variant | Instance | Board | null>
  theme: ComputedRef<Theme | undefined>
  isEditing: Ref<boolean>
  themeEditingContext?: ComputedRef<ThemeEditingContext | null>
  fontCollectionEditingContext?: ComputedRef<FontCollectionEditingContext | null>
  iconSetEditingContext?: ComputedRef<IconSetEditingContext | null>
  onDone: () => void
}

/**
 * ViewModel for a property control. Composes the display derivation, write
 * router, and combobox controller, then exposes a discriminated control view
 * (`none | field | combobox | switch`) plus the pieces the row binds. Vue port
 * of the React `usePropertyControl`.
 */
export function usePropertyControl(input: UsePropertyControlInput) {
  const { workspace } = useWorkspace()

  const display = computed(() =>
    buildPropertyDisplay({
      property: input.property.value,
      theme: input.theme.value,
      subject: input.node.value,
      workspace: workspace.value,
      propertyValue: getPropertyValueForDisplay(input.property.value),
    }),
  )

  const optionGroups = computed<ComboboxOptionItem[][]>(
    () => (display.value.options ?? []) as ComboboxOptionItem[][],
  )
  const storedValue = computed(() => display.value.comboboxStoredValue)
  const displayValue = computed(() => display.value.displayValue)
  const validate = computed(() => getValidationFunction(input.property.value))
  const controlType = computed(() => input.property.value.controlType)

  const commitCtl = useCommitPropertyValue({
    property: () => input.property.value,
    theme: () => input.theme.value,
    options: () =>
      display.value.options as
        | Array<Array<{ name: string; value: string }>>
        | undefined,
    subject: () => input.node.value,
    themeEditingContext: () => input.themeEditingContext?.value ?? null,
    fontCollectionEditingContext: () =>
      input.fontCollectionEditingContext?.value ?? null,
    iconSetEditingContext: () => input.iconSetEditingContext?.value ?? null,
    onDone: input.onDone,
  })

  const kind = computed<PropertyControlKind>(() => {
    const type = controlType.value
    if (!type) return "none"
    if (type === "switch") return "switch"
    if (type === "text" || type === "number") return "field"
    return "combobox"
  })

  // Field draft (text/number).
  const fieldDraft = ref(displayValue.value)
  watch([() => input.isEditing.value, displayValue], () => {
    if (!input.isEditing.value) fieldDraft.value = displayValue.value
  })
  const fieldValue = computed(() =>
    input.isEditing.value ? fieldDraft.value : displayValue.value,
  )

  // Switch state.
  const switchState = computed(() => {
    const stored = storedValue.value
    return {
      checked: stored === "true",
      mixed: stored !== "true" && stored !== "false",
    }
  })

  // Combobox controller (menu/combo).
  const combobox = usePropertyCombobox({
    controlType,
    optionGroups,
    storedValue,
    displayValue,
    validate,
    isEditing: input.isEditing,
    commit: commitCtl.commit,
    onDone: input.onDone,
  })

  const resolveOptionIcon = computed(() =>
    createPropertyOptionIconResolver({
      property: input.property.value,
      theme: input.theme.value,
      workspace: workspace.value,
    }),
  )

  function submitField(value: string): void {
    const validator = validate.value
    if (validator && !validator(value)) {
      fieldDraft.value = displayValue.value
    } else {
      commitCtl.commit(value)
    }
  }

  function cancelField(): void {
    fieldDraft.value = displayValue.value
  }

  function onSwitchToggle(next: boolean): void {
    commitCtl.commit(next ? "true" : "false")
  }

  return {
    kind,
    controlType,
    display,
    storedValue,
    displayValue,
    optionGroups,
    validate,
    fieldDraft,
    fieldValue,
    submitField,
    cancelField,
    switchState,
    onSwitchToggle,
    combobox,
    resolveOptionIcon,
    commit: commitCtl.commit,
    reset: commitCtl.reset,
  }
}

export type PropertyControl = ReturnType<typeof usePropertyControl>
