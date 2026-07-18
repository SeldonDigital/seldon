import type { ComboboxOptionItems } from "@lib/menus"
import { RefObject, useCallback, useEffect, useState } from "react"
import { Board, Instance, Theme, Variant } from "@seldon/core"
import { useThemes } from "@lib/themes/hooks/use-themes"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "../helpers/editing-contexts"
import { FlatProperty } from "../helpers/properties-data"
import {
  OptionIconRender,
  createPropertyOptionIconResolver,
} from "../helpers/render-property-option-icon"
import { useCommitPropertyValue } from "./use-commit-property-value"
import { usePropertyCombobox } from "./use-property-combobox"
import { usePropertyControlData } from "./use-property-control-data"
import { usePropertyDisplay } from "./use-property-display"
import { usePropertyValidation } from "./use-property-validation"

export interface PropertyControlProps {
  property: FlatProperty
  propertySubject?: Variant | Instance | Board
  theme?: Theme
  frameRef?: RefObject<HTMLDivElement | null>
  isEditing?: boolean
  onEditChange?: (editing: boolean) => void
  onBlur?: () => void
  onTabNext?: () => boolean
  onTabPrev?: () => boolean
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

interface Position {
  x: number
  y: number
  w: number
  positionAbove?: boolean
}

interface FieldControlView {
  kind: "field"
  combobox: {
    value: string
    onValueChange: (value: string) => void
    onSubmit: (value: string) => void
    onCancel: () => void
    validate?: (value: string) => boolean
    autoFocus: boolean
  }
}

interface ComboboxControlView {
  kind: "combobox"
  field: {
    inputRef: RefObject<HTMLInputElement | null>
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
    handleSubmit: (options?: { keepFocus?: boolean }) => void
    onCancel: () => void
    onHighlightNext: () => void
    onHighlightPrev: () => void
    autoFocus: boolean
  }
  options: {
    open: boolean
    position: Position
    handleClose: () => void
    onPointerLeave: () => void
  }
  optionList: {
    filteredOptions: ComboboxOptionItems
    hasSections: boolean
    value: string
    highlightedValue?: string
    resolveIcon: (option?: { value: string; name: string }) => OptionIconRender
    onSelect: (value: string) => void
    onHighlight: (value: string | undefined) => void
  }
}

interface SwitchControlView {
  kind: "switch"
  checked: boolean
  /** True when the stored value is neither true nor false (unset), shown indeterminate. */
  mixed: boolean
  onToggle: (next: boolean) => void
}

export type PropertyControlView =
  | { kind: "none" }
  | FieldControlView
  | ComboboxControlView
  | SwitchControlView

/**
 * ViewModel for a property control. Composes the display derivation, write
 * router, and combobox controller, then returns a discriminated view state
 * that `buildPropertyValueInput` and `PropertyOptionsListbox` bind to.
 */
export function usePropertyControl({
  property,
  propertySubject,
  theme,
  frameRef,
  isEditing: externalIsEditing,
  onEditChange,
  onBlur,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
}: PropertyControlProps): PropertyControlView {
  const { workspace } = useWorkspace({ usePreview: false })
  const { selection } = useSelection()
  const [internalIsEditing, setInternalIsEditing] = useState(false)

  const isEditing = externalIsEditing ?? internalIsEditing
  const setIsEditing = onEditChange ?? setInternalIsEditing

  const { getPropertyValueForDisplay } = usePropertyControlData({
    property,
  })
  const { validationFunction } = usePropertyValidation(property)

  const subject = propertySubject ?? selection

  const display = usePropertyDisplay({
    property,
    theme,
    subject,
    workspace,
    propertyValue: getPropertyValueForDisplay(),
  })

  const onDone = useCallback(() => {
    setIsEditing(false)
    onBlur?.()
  }, [setIsEditing, onBlur])

  const { commit } = useCommitPropertyValue({
    property,
    theme,
    options: display.options,
    propertySubject,
    themeEditingContext,
    fontCollectionEditingContext,
    iconSetEditingContext,
    onDone,
  })

  const effectiveControlType = property.controlType

  const combo = usePropertyCombobox({
    property,
    effectiveControlType,
    options: display.options,
    comboboxControlValue: display.comboboxStoredValue,
    comboboxStoredValue: display.comboboxStoredValue,
    displayValue: display.displayValue,
    validationFunction,
    isEditing,
    setIsEditing,
    onEditChange,
    onBlur,
    frameRef,
    commit,
  })

  const themes = useThemes()
  const [fieldDraft, setFieldDraft] = useState(display.displayValue)

  useEffect(() => {
    if (!isEditing) {
      setFieldDraft(display.displayValue)
    }
  }, [isEditing, display.displayValue])

  if (!property.controlType) {
    return { kind: "none" }
  }

  // A switch is a binary On/Off control (wrapChildren, clip). It reads the
  // stored boolean and commits "true"/"false", the same wire values the option
  // list used, so the write router serializes them unchanged.
  if (effectiveControlType === "switch") {
    const stored = display.comboboxStoredValue
    return {
      kind: "switch",
      checked: stored === "true",
      mixed: stored !== "true" && stored !== "false",
      onToggle: (next: boolean) => commit(next ? "true" : "false"),
    }
  }

  if (effectiveControlType === "text" || effectiveControlType === "number") {
    return {
      kind: "field",
      combobox: {
        // While editing, show the in-flight draft. Once editing ends, render the
        // workspace-resolved value directly so a committed value that resolves to
        // a different display (e.g. a pruned override falling back to Default)
        // never paints the typed text for a frame before the sync effect runs.
        value: isEditing ? fieldDraft : display.displayValue,
        onValueChange: setFieldDraft,
        onSubmit: commit,
        onCancel: () => setFieldDraft(display.displayValue),
        validate: validationFunction,
        autoFocus: isEditing,
      },
    }
  }

  const resolveIcon = createPropertyOptionIconResolver({
    property,
    theme,
    workspace,
    themes,
  })

  return {
    kind: "combobox",
    field: {
      inputRef: combo.inputRef,
      value: combo.inputValue,
      onValueChange: combo.handleInputChange,
      open: combo.open,
      setOpen: combo.setOpen,
      handleSubmit: combo.handleSubmitInput,
      onCancel: combo.handleCancelInput,
      onHighlightNext: combo.highlightNext,
      onHighlightPrev: combo.highlightPrev,
      autoFocus: isEditing,
    },
    options: {
      open: combo.open && combo.hasFilteredOptions,
      position: combo.position,
      handleClose: combo.handleComboboxClose,
      // Drop the hover highlight when the pointer leaves the list so only the
      // selected option still reads as active.
      onPointerLeave: () =>
        combo.setHighlightedValue(display.comboboxStoredValue),
    },
    optionList: {
      filteredOptions: combo.filteredOptions,
      hasSections: combo.hasSections,
      value: display.comboboxStoredValue,
      highlightedValue: combo.highlightedValue,
      resolveIcon,
      onSelect: combo.handleSelect,
      onHighlight: combo.setHighlightedValue,
    },
  }
}
