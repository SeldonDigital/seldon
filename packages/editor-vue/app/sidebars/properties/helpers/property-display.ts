import type { Board, Instance, Theme, Value, Variant, Workspace } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getComboboxStoredValue } from "@seldon/editor/lib/properties/combobox-stored-value"
import { getDisplayValue } from "@seldon/editor/lib/properties/display-value-utils"
import { buildPropertyOptions } from "@seldon/editor/lib/properties/inspector/build-property-options"
import { getBoardThemeRef } from "@seldon/editor/lib/properties/inspector/theme-assignment-display"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

export interface PropertyDisplay {
  options: ReturnType<typeof buildPropertyOptions>
  comboboxStoredValue: string
  displayValue: string
}

/**
 * Derives the display state for a property control: picker options, the stored
 * combobox value, and the formatted display string. Pure; called from a computed.
 * Mirrors the React `usePropertyDisplay`.
 */
export function buildPropertyDisplay({
  property,
  theme,
  subject,
  workspace,
  propertyValue,
}: {
  property: FlatProperty
  theme?: Theme
  subject: Variant | Instance | Board | null | undefined
  workspace: Workspace
  propertyValue: Value
}): PropertyDisplay {
  const options = buildPropertyOptions({
    property,
    theme,
    workspace,
    subject: subject ?? undefined,
    includeCurrentSymbol: true,
  })

  let comboboxStoredValue: string
  if (property.key === "theme") {
    if (subject && isBoard(subject)) {
      comboboxStoredValue = getBoardThemeRef(subject)
    } else if (subject && !isBoard(subject)) {
      comboboxStoredValue = subject.theme ?? "none"
    } else {
      comboboxStoredValue = "none"
    }
  } else {
    comboboxStoredValue = getComboboxStoredValue(property.value)
  }

  const displayValue = getDisplayValue(propertyValue, theme, options)

  return { options, comboboxStoredValue, displayValue }
}
