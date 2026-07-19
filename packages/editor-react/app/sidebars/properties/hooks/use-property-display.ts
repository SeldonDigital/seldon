import { useMemo } from "react"
import { Board, Instance, Theme, Value, Variant, Workspace } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { buildPropertyOptions } from "@seldon/editor/lib/properties/inspector/build-property-options"
import { getComboboxStoredValue } from "@seldon/editor/lib/properties/combobox-stored-value"
import { getDisplayValue } from "@seldon/editor/lib/properties/display-value-utils"
import type { PropertyPickerResult } from "@seldon/editor/lib/properties/inspector/options-utils"
import { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"
import { getBoardThemeRef } from "@seldon/editor/lib/properties/inspector/theme-assignment-display"

interface UsePropertyDisplayInput {
  property: FlatProperty
  theme?: Theme
  subject: Variant | Instance | Board | null | undefined
  workspace: Workspace
  propertyValue: Value
}

interface UsePropertyDisplayResult {
  options: PropertyPickerResult["options"] | undefined
  comboboxStoredValue: string
  displayValue: string
}

/**
 * Derives the display state for a property control: picker options, the stored
 * combobox value, and the formatted display string.
 */
export function usePropertyDisplay({
  property,
  theme,
  subject,
  workspace,
  propertyValue,
}: UsePropertyDisplayInput): UsePropertyDisplayResult {
  const options = useMemo(
    () =>
      buildPropertyOptions({
        property,
        theme,
        workspace,
        subject: subject ?? undefined,
        includeCurrentSymbol: true,
      }),
    [property, theme, subject, workspace],
  )

  const comboboxStoredValue = useMemo(() => {
    if (property.key === "theme") {
      if (subject && isBoard(subject)) {
        return getBoardThemeRef(subject)
      }
      if (subject && !isBoard(subject)) {
        return subject.theme ?? "none"
      }
      return "none"
    }
    return getComboboxStoredValue(property.value)
  }, [property.key, property.value, subject])

  const displayValue = getDisplayValue(propertyValue, theme, options)

  return {
    options,
    comboboxStoredValue,
    displayValue,
  }
}
