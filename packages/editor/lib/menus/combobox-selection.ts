/**
 * Pure selection and filter helpers for a combobox option list. Options are
 * either a flat list or a list of sections. These functions carry no view
 * state, so an editors' combobox view-model drives the same matching and
 * navigation behavior.
 */

export type OptionsType<ItemT> = ItemT[] | ItemT[][]

/** Whether the options are grouped into sections rather than a flat list. */
export function isSectioned<ItemT>(options: OptionsType<ItemT>): boolean {
  return Array.isArray(options[0])
}

/** Flattens sectioned options into a single list; returns a flat list as-is. */
export function flattenOptions<ItemT>(options: OptionsType<ItemT>): ItemT[] {
  return isSectioned(options)
    ? (options as ItemT[][]).flat()
    : (options as ItemT[])
}

/** A hidden or disabled option cannot be highlighted by keyboard navigation. */
export function isNavigableOption<ItemT extends object>(
  option: ItemT,
): boolean {
  return (
    !("hidden" in option && option.hidden) &&
    !("disabled" in option && option.disabled)
  )
}

/** Filters options by a case-insensitive name match, preserving section shape. */
export function filterOptions<ItemT extends { name: string }>(
  options: OptionsType<ItemT>,
  query: string,
): OptionsType<ItemT> {
  const term = query.toLowerCase()
  const filterGroup = (group: ItemT[]) =>
    group.filter((option) => option.name.toLowerCase().includes(term))

  return isSectioned(options)
    ? (options as ItemT[][]).map(filterGroup)
    : filterGroup(options as ItemT[])
}

/**
 * The next highlighted value when stepping through `items` by `direction`.
 * Wraps around the ends. When nothing is highlighted yet, starts at the first
 * item for forward steps and the last for backward steps.
 */
export function stepHighlight<ItemT extends { value: string }>(
  items: ItemT[],
  current: string | undefined,
  direction: 1 | -1,
): string | undefined {
  const currentIndex = items.findIndex((option) => option.value === current)
  if (currentIndex === -1) {
    return items[direction === 1 ? 0 : items.length - 1]?.value
  }
  const nextIndex = (currentIndex + direction + items.length) % items.length
  return items[nextIndex]?.value
}

/** First option whose name matches `name` case-insensitively. */
export function findOptionByName<ItemT extends { name: string }>(
  options: ItemT[],
  name: string,
): ItemT | undefined {
  return options.find(
    (option) => option.name.toLowerCase() === name.toLowerCase(),
  )
}

/** First option whose value matches `value` case-insensitively. */
export function findOptionByValue<ItemT extends { value: string }>(
  options: ItemT[],
  value: string | undefined,
): ItemT | undefined {
  return options.find(
    (option) => option.value.toLowerCase() === value?.toLowerCase(),
  )
}
