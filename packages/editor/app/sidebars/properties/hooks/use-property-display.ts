import { CSSProperties, useMemo } from "react"
import { Board, Instance, Theme, Value, Variant, Workspace } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { buildPropertyOptions } from "../helpers/build-property-options"
import {
  propertyControlContainerStyle,
  propertyControlInnerStyle,
  propertyControlTextStyle,
  propertyControlTextWrapperStyle,
  propertyControlWrapperStyle,
} from "../../helpers/sidebar-styles.bespoke"
import { getComboboxStoredValue } from "../helpers/combobox-stored-value"
import { getDisplayValue } from "../helpers/display-value-utils"
import type { PropertyPickerResult } from "../helpers/options-utils"
import { FlatProperty } from "../helpers/properties-data"
import { getBoardThemeRef } from "../helpers/theme-assignment-display"

interface UsePropertyDisplayInput {
  property: FlatProperty
  theme?: Theme
  subject: Variant | Instance | Board | null | undefined
  workspace: Workspace
  color?: string
  propertyValue: Value
}

interface UsePropertyDisplayResult {
  options: PropertyPickerResult["options"] | undefined
  comboboxStoredValue: string
  displayValue: string
  containerStyle: CSSProperties
  wrapperStyle: CSSProperties
  innerStyle: CSSProperties
  textWrapperStyle: CSSProperties
  standaloneStyle: CSSProperties
  fieldStyle: CSSProperties
}

/**
 * Derives the display state for a property control: picker options, the stored
 * combobox value, the formatted display string, and the assembled style objects.
 * Keeps derivation and styling out of the control component.
 */
export function usePropertyDisplay({
  property,
  theme,
  subject,
  workspace,
  color,
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

  const displayValue = getDisplayValue(
    propertyValue,
    property.key,
    subject && !isBoard(subject)
      ? subject.id
      : subject && isBoard(subject)
        ? getComponentKey(subject)
        : "",
    workspace,
    theme,
    options,
  )

  const standaloneStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    ...propertyControlTextStyle,
    background: "transparent",
    border: "none",
    padding: 0,
    ...(color ? { color } : {}),
    ...(property.isDimmed ? { opacity: 0.5 } : {}),
  }

  const containerStyle: CSSProperties = {
    ...propertyControlContainerStyle,
    ...(property.isDimmed ? { opacity: 0.5 } : {}),
  }

  const fieldStyle: CSSProperties = {
    width: "100%",
    minWidth: 0,
    flex: property.pickerVariant === "themeAssignment" ? 1 : undefined,
    ...(color ? { color } : {}),
  }

  return {
    options,
    comboboxStoredValue,
    displayValue,
    containerStyle,
    wrapperStyle: propertyControlWrapperStyle,
    innerStyle: propertyControlInnerStyle,
    textWrapperStyle: propertyControlTextWrapperStyle,
    standaloneStyle,
    fieldStyle,
  }
}
