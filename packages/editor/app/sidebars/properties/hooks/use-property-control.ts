import {
  CSSProperties,
  MouseEvent,
  ReactNode,
  Ref,
  RefObject,
  useCallback,
  useEffect,
  useState,
} from "react"
import { Board, Instance, Theme, Variant } from "@seldon/core"
import { useThemes } from "@lib/themes/hooks/use-themes"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import type { ComboboxOptionItems } from "@seldon/components/custom-components"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "../helpers/editing-contexts"
import { formatControlPlaceholder } from "../helpers/format-control-placeholder"
import { FlatProperty } from "../helpers/properties-data"
import { createPropertyOptionIconRenderer } from "../helpers/render-property-option-icon"
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
  color?: string
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
  onBlur?: () => void
  wrapperStyle: CSSProperties
  combobox: {
    value: string
    onValueChange: (value: string) => void
    onSubmit: (value: string) => void
    onCancel: () => void
    placeholder: string
    validate?: (value: string) => boolean
    disabled?: boolean
    autoFocus: boolean
    style: CSSProperties
  }
}

interface ComboboxControlView {
  kind: "combobox"
  surface: {
    containerRef: Ref<HTMLDivElement>
    onClick: (event: MouseEvent<HTMLDivElement>) => void
    containerStyle: CSSProperties
    wrapperStyle: CSSProperties
    innerStyle: CSSProperties
  }
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
    placeholder: string
    disabled?: boolean
    autoFocus: boolean
    style: CSSProperties
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
    renderIcon: (option?: { value: string; name: string }) => ReactNode
    onSelect: (value: string) => void
    onHighlight: (value: string | undefined) => void
  }
}

export type PropertyControlView =
  | { kind: "none" }
  | FieldControlView
  | ComboboxControlView

/**
 * ViewModel for a property control. Composes the display derivation, write
 * router, and combobox controller, then returns a discriminated view state so
 * `PropertyControl` stays a binding shell.
 */
export function usePropertyControl({
  property,
  propertySubject,
  theme,
  frameRef,
  isEditing: externalIsEditing,
  onEditChange,
  onBlur,
  color,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
}: PropertyControlProps): PropertyControlView {
  const { workspace } = useWorkspace({ usePreview: false })
  const { selection } = useSelection()
  const [internalIsEditing, setInternalIsEditing] = useState(false)

  const isEditing = externalIsEditing ?? internalIsEditing
  const setIsEditing = onEditChange ?? setInternalIsEditing

  const { getPropertyValueForDisplay, getPlaceholder } = usePropertyControlData(
    { property, theme },
  )
  const { validationFunction, units } = usePropertyValidation(property)

  const subject = propertySubject ?? selection

  const display = usePropertyDisplay({
    property,
    theme,
    subject,
    workspace,
    color,
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

  const placeholder = formatControlPlaceholder({
    placeholder: getPlaceholder(),
    controlType: effectiveControlType,
    units,
  })

  if (!property.controlType) {
    return { kind: "none" }
  }

  if (effectiveControlType === "text" || effectiveControlType === "number") {
    return {
      kind: "field",
      onBlur,
      wrapperStyle: display.textWrapperStyle,
      combobox: {
        value: fieldDraft,
        onValueChange: setFieldDraft,
        onSubmit: commit,
        onCancel: () => setFieldDraft(display.displayValue),
        placeholder,
        validate: validationFunction,
        disabled: property.isDimmed,
        autoFocus: isEditing,
        style: display.standaloneStyle,
      },
    }
  }

  const renderIcon = createPropertyOptionIconRenderer({
    property,
    theme,
    workspace,
    themes,
  })

  return {
    kind: "combobox",
    surface: {
      containerRef: combo.comboboxRef,
      onClick: combo.handleControlClick,
      containerStyle: display.containerStyle,
      wrapperStyle: display.wrapperStyle,
      innerStyle: display.innerStyle,
    },
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
      placeholder,
      disabled: property.isDimmed,
      autoFocus: isEditing,
      style: display.fieldStyle,
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
      renderIcon,
      onSelect: combo.handleSelect,
      onHighlight: combo.setHighlightedValue,
    },
  }
}
