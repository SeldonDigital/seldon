import { findOptionByName, findOptionByValue } from "./combobox-selection"

interface OptionLike {
  name: string
  value: string
}

/**
 * Outcome of submitting a combobox: commit an option, commit a custom typed
 * value, or revert the input to the current selection's name. `fromHighlight`
 * marks a keyboard-highlighted selection so the caller can sync the input text
 * to the chosen option, matching the source behavior.
 */
export type ComboboxSubmitResolution =
  | { kind: "select"; value: string; name: string; fromHighlight: boolean }
  | { kind: "custom"; value: string }
  | { kind: "revert"; name: string }

interface ResolveComboboxSubmitArgs<T extends OptionLike> {
  /** The text currently in the input (already trimmed by the caller if desired). */
  inputValue: string
  /** The value of the current selection, used to revert on no match. */
  currentValue?: string
  highlightedValue?: string
  /** Whether the highlighted option should win over a name match. */
  useHighlighted: boolean
  flatOptions: T[]
  /** Options the highlight is drawn from; defaults to `flatOptions`. */
  highlightSource?: T[]
  /** Whether the raw typed value may be committed as a custom value. */
  allowCustom: (value: string) => boolean
}

/**
 * Pure submit resolution for a combobox. Prefers a keyboard-highlighted option
 * when allowed, then a case-insensitive name match, then a custom value when
 * the caller permits it, and finally reverts to the current selection. Shared
 * by the React and Vue combobox controllers so both resolve submits the same
 * way; each caller applies the outcome with its own state updates.
 */
export function resolveComboboxSubmit<T extends OptionLike>({
  inputValue,
  currentValue,
  highlightedValue,
  useHighlighted,
  flatOptions,
  highlightSource,
  allowCustom,
}: ResolveComboboxSubmitArgs<T>): ComboboxSubmitResolution {
  if (useHighlighted && highlightedValue) {
    const source = highlightSource ?? flatOptions
    const option = source.find(
      (candidate) => candidate.value === highlightedValue,
    )
    if (option) {
      return {
        kind: "select",
        value: option.value,
        name: option.name,
        fromHighlight: true,
      }
    }
  }

  const byName = findOptionByName(flatOptions, inputValue)
  if (byName) {
    return {
      kind: "select",
      value: byName.value,
      name: byName.name,
      fromHighlight: false,
    }
  }

  if (allowCustom(inputValue)) {
    return { kind: "custom", value: inputValue }
  }

  const current =
    currentValue !== undefined
      ? findOptionByValue(flatOptions, currentValue)
      : undefined
  return { kind: "revert", name: current?.name ?? "" }
}
