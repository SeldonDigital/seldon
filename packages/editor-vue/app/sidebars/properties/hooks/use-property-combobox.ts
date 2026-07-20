import { computed, ref, watch, type ComputedRef, type Ref } from "vue"
import {
  filterOptions,
  findOptionByValue,
  flattenOptions,
  stepHighlight,
} from "@seldon/editor/lib/menus/combobox-selection"
import { resolveComboboxSubmit } from "@seldon/editor/lib/menus/combobox-submit"
import type { ComboboxOptionItem } from "@app/menus/types"

interface UsePropertyComboboxInput {
  controlType: ComputedRef<string | undefined>
  optionGroups: ComputedRef<ComboboxOptionItem[][]>
  storedValue: ComputedRef<string>
  displayValue: ComputedRef<string>
  validate: ComputedRef<((value: string) => boolean) | undefined>
  isEditing: Ref<boolean>
  commit: (value: string) => void
  onDone: () => void
}

/**
 * Controller for a property combobox. Owns the open/query/highlight state and
 * the original-value cancel tracking. The value field drives it (type to filter,
 * arrows to move, Enter/Tab to submit); the floating list renders the options.
 * Vue port of the React `usePropertyCombobox` over the shared selection helpers.
 */
export function usePropertyCombobox({
  controlType,
  optionGroups,
  storedValue,
  displayValue,
  validate,
  isEditing,
  commit,
  onDone,
}: UsePropertyComboboxInput) {
  const open = ref(false)
  const inputValue = ref("")
  const highlightedValue = ref<string | undefined>(undefined)
  const originalValue = ref<string | undefined>(undefined)
  // Filtering only begins once the user types. On open the input is seeded with
  // the current value, so filtering immediately would collapse the list to the
  // one selected option. Mirrors React `useComboboxState`'s `shouldFilter`.
  const shouldFilter = ref(false)
  let hasSelection = false

  const isMenuOrCombo = computed(
    () => controlType.value === "menu" || controlType.value === "combo",
  )

  // Open the option list as soon as a menu/combo row enters edit mode. The row
  // also focuses the input (which opens via `onFocus`); this is the resilient
  // path so the list still appears if focus timing shifts. Mirrors React's
  // `openComboboxWithFocus` effect keyed on `isEditing`.
  watch(
    [isEditing, isMenuOrCombo],
    ([editing, menuOrCombo]) => {
      if (editing && menuOrCombo) open.value = true
    },
    { immediate: true },
  )

  const flatOptions = computed<ComboboxOptionItem[]>(() =>
    flattenOptions<ComboboxOptionItem>(optionGroups.value),
  )

  const filteredGroups = computed<ComboboxOptionItem[][]>(() => {
    const query = inputValue.value.trim()
    if (!query || !shouldFilter.value) return optionGroups.value
    return filterOptions(optionGroups.value, query) as ComboboxOptionItem[][]
  })

  const hasFilteredOptions = computed(() =>
    filteredGroups.value.some((group) => group.length > 0),
  )

  // Mirror the stored value into the closed input when not editing.
  watch(
    [open, isEditing, storedValue, displayValue, flatOptions],
    () => {
      if (!open.value && !isEditing.value) {
        const option = flatOptions.value.find(
          (candidate) => candidate.value === storedValue.value,
        )
        inputValue.value = option ? option.name : displayValue.value || ""
      }
    },
    { immediate: true },
  )

  watch(open, (isOpen) => {
    if (isOpen && originalValue.value === undefined) {
      originalValue.value = storedValue.value
      hasSelection = false
    } else if (!isOpen) {
      originalValue.value = undefined
      hasSelection = false
      // Reset so the next open shows the full list before the user types.
      shouldFilter.value = false
    }
  })

  function setOpen(next: boolean): void {
    open.value = next
  }

  function handleInputChange(value: string): void {
    shouldFilter.value = true
    inputValue.value = value
    if (!open.value) open.value = true
  }

  function handleSelect(value: string): void {
    hasSelection = true
    commit(value)
    const option = flatOptions.value.find((candidate) => candidate.value === value)
    if (option) inputValue.value = option.name
    if (controlType.value === "menu") {
      open.value = false
      onDone()
    } else {
      open.value = false
    }
  }

  function handleSubmit(options?: { keepFocus?: boolean }): void {
    const query = inputValue.value.trim()
    const resolution = resolveComboboxSubmit({
      inputValue: query,
      highlightedValue: highlightedValue.value,
      useHighlighted: true,
      flatOptions: flatOptions.value,
      allowCustom: (candidate) =>
        controlType.value === "combo" &&
        (!validate.value || validate.value(candidate)),
    })

    if (resolution.kind === "select") {
      handleSelect(resolution.value)
    } else if (resolution.kind === "custom") {
      hasSelection = true
      commit(resolution.value)
      open.value = false
    } else {
      restoreInput()
      open.value = false
    }
    if (!options?.keepFocus) onDone()
  }

  function restoreInput(): void {
    if (!hasSelection && originalValue.value !== undefined) {
      const option = findOptionByValue(flatOptions.value, originalValue.value)
      inputValue.value = option ? option.name : originalValue.value || ""
    }
  }

  function handleCancel(): void {
    restoreInput()
    open.value = false
  }

  function handleClose(): void {
    restoreInput()
    open.value = false
    if (controlType.value === "menu") onDone()
  }

  function highlightNext(): void {
    highlightedValue.value = stepHighlight(
      flatOptions.value,
      highlightedValue.value,
      1,
    )
  }

  function highlightPrev(): void {
    highlightedValue.value = stepHighlight(
      flatOptions.value,
      highlightedValue.value,
      -1,
    )
  }

  function setHighlightedValue(value: string | undefined): void {
    highlightedValue.value = value
  }

  return {
    open,
    inputValue,
    highlightedValue,
    filteredGroups,
    hasFilteredOptions,
    isMenuOrCombo,
    setOpen,
    handleInputChange,
    handleSelect,
    handleSubmit,
    handleCancel,
    handleClose,
    highlightNext,
    highlightPrev,
    setHighlightedValue,
  }
}
