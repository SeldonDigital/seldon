import { isWorkspaceIconUnavailable } from "@lib/icon-sets/icon-availability"
import {
  isLayeredPaintRoot,
  layeredFacetPath,
  parsePropertyPath,
} from "@lib/properties/property-paths"
import { serializeValue } from "@lib/properties/serialize-value"
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Board, Instance, Theme, Value, ValueType, Variant } from "@seldon/core"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { IconId } from "@seldon/core/icon-sets"
import { IconSeldonMissing } from "@seldon/core/icon-sets/catalog/seldon/user-interface/actions/IconSeldonMissing"
import type {
  PropertyKey,
  SubPropertyKey,
} from "@seldon/core/properties/types/property-keys"
import type { LayeredPaintKey } from "@seldon/core/properties/types/property-keys"
import type { ThemeInstanceId } from "@seldon/core/themes/types/theme-id"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useThemes } from "@lib/themes/hooks/use-themes"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useComboboxState } from "./controls/combobox/hooks/use-combobox-state"
import { useComboboxPosition } from "./hooks/use-combobox-position"
import { usePropertyControlData } from "./hooks/use-property-control-data"
import { usePropertyValidation } from "./hooks/use-property-validation"
import { useSetObjectTheme } from "./hooks/use-set-object-theme"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { IconCustomColorValue } from "@seldon/components/custom-icons"
import { IconSeldonToken } from "@seldon/components/icons"
import { LoadEditorIcons } from "@app/LoadEditorIcons"
import { useImageUploadPanel } from "@app/panels/hooks/use-upload-image-panel"
import { ThemeSwatches } from "@seldon/components/custom-components"
import { resolveThemeSwatchColors } from "./helpers/resolve-theme-swatch-colors"
import {
  propertyControlContainerStyle,
  propertyControlInnerStyle,
  propertyControlTextStyle,
  propertyControlTextWrapperStyle,
  propertyControlWrapperStyle,
} from "../helpers/sidebar-styles"
import { Combobox } from "./controls/combobox/Combobox"
import { ComboboxOptionList } from "./controls/combobox/OptionList"
import { ComboboxOptions } from "./controls/combobox/Options"
import { getComboboxStoredValue } from "./helpers/combobox-stored-value"
import { createPresetPropertyUpdate } from "./helpers/compound-properties"
import { handleComputedValueChange } from "./helpers/computed-property-handler"
import { isComputedFunctionOption } from "./helpers/computed-utils"
import { getDisplayValue } from "./helpers/display-value-utils"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import { buildPropertyOptions } from "./helpers/build-property-options"
import { FlatProperty } from "./helpers/properties-data"
import { RESET_VALUES } from "./helpers/property-control-constants"
import { shouldUsePresetPropertyBehavior } from "./helpers/property-types"
import { updateProperty } from "./helpers/property-update-handler"
import { getBoardThemeRef } from "./helpers/theme-assignment-display"
import { getThemeTokenIconColor } from "./helpers/theme-token-icon-color"

function compoundPresetPropertyKey(propertyKey: string): string {
  if (isLayeredPaintRoot(propertyKey)) {
    return layeredFacetPath(propertyKey as LayeredPaintKey, "preset")
  }
  return `${propertyKey}.preset`
}

interface PropertyControlProps {
  property: FlatProperty
  propertySubject?: Variant | Instance | Board
  theme?: Theme
  frameRef?: RefObject<HTMLDivElement | null>
  isEditing?: boolean
  onEditChange?: (editing: boolean) => void
  onBlur?: () => void
  color?: string
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

export function PropertyControl({
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
}: PropertyControlProps) {
  const { setProperties, resetProperty } = useObjectProperties()
  const { workspace } = useWorkspace({ usePreview: false })
  const { selection } = useSelection()
  const setObjectTheme = useSetObjectTheme()
  const { show: showUploadPanel } = useImageUploadPanel()
  const [internalIsEditing, setInternalIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const comboboxRef = useRef<HTMLDivElement>(null)
  const [highlightedValue, setHighlightedValue] = useState<string | undefined>(
    undefined,
  )
  const originalValueRef = useRef<string | undefined>(undefined)
  const hasSelectionRef = useRef(false)

  const isEditing = externalIsEditing ?? internalIsEditing
  const setIsEditing = onEditChange ?? setInternalIsEditing

  const { getIconComponent, getPropertyValueForDisplay, getPlaceholder } =
    usePropertyControlData({ property, theme })

  const { validationFunction, units } = usePropertyValidation(property)

  const localSerializeValue = (newValue: string, currentValue: unknown) => {
    return serializeValue(
      newValue,
      {
        currentValue: currentValue as Value | undefined,
        workspace,
      },
      selection || undefined,
      property.key,
    )
  }

  const cleanCompoundValue = (
    compoundValue: unknown,
  ): Record<string, unknown> => {
    const current = compoundValue || {}
    return Object.keys(current).reduce(
      (acc, key) => {
        if (
          key !== "type" &&
          key !== "value" &&
          (current as Record<string, unknown>)[key]
        ) {
          acc[key] = (current as Record<string, unknown>)[key]
        }
        return acc
      },
      {} as Record<string, unknown>,
    )
  }

  const applyPresetPropertyUpdate = (newValue: string) => {
    if (!shouldUsePresetPropertyBehavior(property.key)) {
      return false
    }
    const update = createPresetPropertyUpdate(
      property.key,
      newValue,
      workspace,
      selection!,
      theme,
    )
    if (Object.keys(update).length > 0) {
      setProperties(update, { mergeSubProperties: false })
    }
    setIsEditing(false)
    onBlur?.()
    return true
  }

  const handleChange = (newValue: string) => {
    const subject = propertySubject ?? selection ?? null

    // Font collection family rows route edits straight to the workspace through
    // the editing context, bypassing the node/theme property paths.
    if (fontCollectionEditingContext?.isFontCollectionEditing) {
      fontCollectionEditingContext.updateFontCollectionProperty(
        property,
        newValue,
      )
      setIsEditing(false)
      onBlur?.()
      return
    }

    // Icon set rows route edits straight to the workspace through the editing
    // context, bypassing the node/theme property paths.
    if (iconSetEditingContext?.isIconSetEditing) {
      iconSetEditingContext.updateIconSetProperty(property, newValue)
      setIsEditing(false)
      onBlur?.()
      return
    }

    if (property.key === "theme" && subject) {
      const newThemeId =
        newValue === "none" ? null : (newValue as ThemeInstanceId)
      setObjectTheme(subject, newThemeId)
      setIsEditing(false)
      onBlur?.()
      return
    }

    if (newValue === "__upload__") {
      const supportsUpload =
        property.key === "source" ||
        property.key === "background.0.image" ||
        property.key === "background.image"

      if (supportsUpload) {
        // Convert property key to upload panel format:
        // - Sub-properties (with dots): replace dots with hyphens (e.g., "background.image" -> "background-image")
        // - Top-level properties: use as-is (e.g., "source" -> "source")
        const uploadPanelProperty = property.key.includes(".")
          ? property.key.replace(/\./g, "-")
          : property.key

        showUploadPanel({
          property: uploadPanelProperty as "source" | "background-image",
        })
        setIsEditing(false)
        onBlur?.()
        return
      }
    }

    // Handle computed function values
    if (isComputedFunctionOption(newValue)) {
      const handled = handleComputedValueChange({
        property,
        newValue,
        workspace,
        selection: selection || null,
        setProperties,
        cleanCompoundValue,
      })
      if (handled) {
        setIsEditing(false)
        onBlur?.()
      }
      return
    }

    // Handle reset values (Default, None, empty string)
    if (RESET_VALUES.includes(newValue as (typeof RESET_VALUES)[number])) {
      // Check if this is a compound property with a preset sub-property
      if (property.isCompound) {
        const presetPropertyKey = compoundPresetPropertyKey(property.key)
        const update = createPresetPropertyUpdate(
          presetPropertyKey,
          newValue,
          workspace,
          selection!,
          theme,
        )
        if (Object.keys(update).length > 0) {
          setProperties(update, { mergeSubProperties: false })
          setIsEditing(false)
          onBlur?.()
          return
        }
      }

      if (applyPresetPropertyUpdate(newValue)) {
        return
      }
      handleReset()
      return
    }

    // Handle theme property updates if in theme editing mode
    if (themeEditingContext?.isThemeEditing) {
      themeEditingContext.updateThemeProperty(property, newValue)
      setIsEditing(false)
      onBlur?.()
      return
    }

    // Handle regular property updates
    const serializedValue = localSerializeValue(newValue, property.value)

    // Check if this is a compound property and the value looks like a preset
    // (theme token starting with @ or a preset name from options)
    if (property.isCompound && options) {
      // Flatten the options array (options is PropertyOption[][])
      const flatOptions = options.flat()
      const isPresetValue = flatOptions.some((opt) => opt.value === newValue)

      if (isPresetValue) {
        const presetPropertyKey = compoundPresetPropertyKey(property.key)
        const update = createPresetPropertyUpdate(
          presetPropertyKey,
          newValue,
          workspace,
          selection!,
          theme,
        )
        if (Object.keys(update).length > 0) {
          setProperties(update, { mergeSubProperties: false })
          setIsEditing(false)
          onBlur?.()
          return
        }
      }
    }

    if (applyPresetPropertyUpdate(newValue)) {
      return
    }

    updateProperty({
      property,
      value: serializedValue,
      setProperties,
    })

    setIsEditing(false)
    onBlur?.()
  }

  const handleReset = () => {
    if (property.isSubProperty) {
      const parsed = parsePropertyPath(property.key)
      if (parsed.kind === "layered-facet") {
        resetProperty(
          parsed.root as PropertyKey,
          parsed.facet as SubPropertyKey,
        )
      } else if (parsed.kind === "facet") {
        resetProperty(
          parsed.root as PropertyKey,
          parsed.facet as SubPropertyKey,
        )
      } else {
        resetProperty(property.key as PropertyKey)
      }
    } else {
      resetProperty(property.key as PropertyKey)
    }
    setIsEditing(false)
    onBlur?.()
  }

  const subject = propertySubject ?? selection

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

  const propertyValue = getPropertyValueForDisplay()
  const effectiveControlType = property.controlType

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

  const themes = useThemes()

  const comboboxControlValue = comboboxStoredValue

  const {
    open: comboboxOpen,
    setOpen: setComboboxOpen,
    inputValue,
    setInputValue,
    filteredOptions,
    handleSelect,
    handleInputChange,
    handleSubmitInput,
    flatOptions,
    isValid,
  } = useComboboxState({
    value: comboboxControlValue,
    options:
      effectiveControlType === "combo" || effectiveControlType === "menu"
        ? (options as
            | Array<{ name: string; value: string }>
            | Array<Array<{ name: string; value: string }>>)
        : [],
    onValueChange: (value) => {
      hasSelectionRef.current = true
      handleChange(value)
      if (effectiveControlType === "menu") {
        onBlur?.()
      }
    },
    inputRef,
    validateCustomValue:
      effectiveControlType === "combo" ? validationFunction : undefined,
  })

  // Track original value when combobox opens
  useEffect(() => {
    if (comboboxOpen && originalValueRef.current === undefined) {
      originalValueRef.current = comboboxStoredValue
      hasSelectionRef.current = false
    } else if (!comboboxOpen) {
      originalValueRef.current = undefined
      hasSelectionRef.current = false
    }
  }, [comboboxOpen, comboboxStoredValue])

  const hasSections =
    filteredOptions.length > 0 && Array.isArray(filteredOptions[0])

  // Check if filteredOptions is empty (no options to show)
  const hasFilteredOptions = useMemo(() => {
    if (!filteredOptions || filteredOptions.length === 0) return false
    if (hasSections) {
      // For sections, check if any group has options
      return (
        filteredOptions as Array<Array<{ value: string; name: string }>>
      ).some((group) => group.length > 0)
    } else {
      // For flat array, check if it has any options
      return (
        (filteredOptions as Array<{ value: string; name: string }>).length > 0
      )
    }
  }, [filteredOptions, hasSections])

  // Sync input value with display value
  // But don't sync while menu is open - user is typing and we don't want to overwrite their input
  useEffect(() => {
    if (!comboboxOpen) {
      const option = flatOptions.find((o) => o.value === comboboxControlValue)
      setInputValue(option ? option.name : displayValue || "")
    }
  }, [
    comboboxControlValue,
    displayValue,
    flatOptions,
    setInputValue,
    comboboxOpen,
  ])

  // Sync editing state with combobox open state
  useEffect(() => {
    if (onEditChange) return

    setIsEditing(comboboxOpen)
  }, [comboboxOpen, setIsEditing, onEditChange])

  const isMenuOrComboType =
    effectiveControlType === "menu" || effectiveControlType === "combo"

  // Focus and select the input, then open the menu. Double requestAnimationFrame
  // ensures selection happens after all rendering, matching Combobox.handleFocus.
  const openComboboxWithFocus = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          inputRef.current.select()
        }
        setComboboxOpen(true)
      })
    })
  }, [setComboboxOpen])

  useEffect(() => {
    if (isEditing && isMenuOrComboType) {
      openComboboxWithFocus()
    }
  }, [isEditing, isMenuOrComboType, property.key, openComboboxWithFocus])

  const optionsPosition = useComboboxPosition({
    open: comboboxOpen,
    frameRef,
    comboboxRef,
  })

  if (!property.controlType) {
    return null
  }

  const formatPlaceholder = (): string => {
    const placeholder = getPlaceholder()

    // For combo/menu types, return empty string (no placeholder needed)
    if (effectiveControlType === "combo" || effectiveControlType === "menu") {
      return ""
    }

    if (effectiveControlType === "number" && units.length > 0) {
      const placeholderHasUnits = units.some((unit) =>
        placeholder.includes(unit),
      )
      if (!placeholderHasUnits) {
        return `${placeholder} (${units.join(", ")})`
      }
    }

    return placeholder
  }

  const renderIconFunction = (option?: {
    value: string
    name: string
  }): React.ReactNode => {
    if (property.key === "theme" && option) {
      if (option.value === "none") {
        return null
      }
      const optionTheme = themes.find((t) => t.id === option.value)
      if (optionTheme) {
        return <ThemeSwatches colors={resolveThemeSwatchColors(optionTheme)} />
      }
      return null
    }

    if (option) {
      const swatchColor = getThemeTokenIconColor(option.value, theme)
      if (swatchColor) {
        return <IconCustomColorValue color={swatchColor} />
      }
      if (isThemeValueKey(option.value)) {
        return <IconSeldonToken />
      }
    }

    if (property.key === "symbol" && option) {
      // Icon turned off in its workspace set renders as a red Missing icon.
      if (isWorkspaceIconUnavailable(option.value as IconId, workspace)) {
        return <LoadEditorIcons iconId={option.value as IconId} unavailable />
      }
      // Check if this is an unused icon (missing from iconLabels)
      if (option.name === "[Unused Icon]") {
        return <IconSeldonMissing />
      }
      return <LoadEditorIcons iconId={option.value as IconId} />
    }

    const IconComponent = getIconComponent()
    if (IconComponent) {
      return <IconComponent />
    }

    return null
  }

  const placeholder = formatPlaceholder()

  const standaloneComboboxStyle: React.CSSProperties = {
    width: "100%",
    minWidth: 0,
    ...propertyControlTextStyle,
    background: "transparent",
    border: "none",
    padding: 0,
    ...(color ? { color } : {}),
    ...(property.isDimmed ? { opacity: 0.5 } : {}),
  }

  const containerStyle: React.CSSProperties = {
    ...propertyControlContainerStyle,
    ...(property.isDimmed ? { opacity: 0.5 } : {}),
  }

  const handleControlClick = (event: React.MouseEvent) => {
    if (isMenuOrComboType && !comboboxOpen && !property.isDimmed) {
      event.stopPropagation()
      openComboboxWithFocus()
    }
  }

  const handleComboboxClose = () => {
    // If no selection was made, restore the original value (cancel).
    if (!hasSelectionRef.current && originalValueRef.current !== undefined) {
      const option = flatOptions.find(
        (o) => o.value === originalValueRef.current,
      )
      setInputValue(option ? option.name : originalValueRef.current || "")
    }
    setComboboxOpen(false)
    if (effectiveControlType === "menu") {
      onBlur?.()
    }
  }

  if (effectiveControlType === "text" || effectiveControlType === "number") {
    return (
      <div onBlur={onBlur} style={propertyControlTextWrapperStyle}>
        <Combobox
          mode="standalone"
          value={displayValue}
          onValueChange={handleChange}
          placeholder={placeholder}
          validate={validationFunction}
          disabled={property.isDimmed}
          autoFocus={isEditing}
          style={standaloneComboboxStyle}
        />
      </div>
    )
  }

  const comboboxField = (
    <Combobox
      mode="combobox"
      inputRef={inputRef}
      value={inputValue}
      onValueChange={handleInputChange}
      open={comboboxOpen}
      setOpen={setComboboxOpen}
      handleSubmit={handleSubmitInput}
      isValid={isValid}
      placeholder={placeholder}
      disabled={property.isDimmed}
      autoFocus={isEditing}
      hideChevron={true}
      options={
        filteredOptions as
          | Array<{
              name: string
              value: string
              hidden?: boolean
              disabled?: boolean
            }>
          | Array<
              Array<{
                name: string
                value: string
                hidden?: boolean
                disabled?: boolean
              }>
            >
      }
      onOptionSelect={handleSelect}
      onHighlightedValueChange={setHighlightedValue}
      style={{
        width: "100%",
        minWidth: 0,
        flex: property.pickerVariant === "themeAssignment" ? 1 : undefined,
        ...(color ? { color } : {}),
      }}
    />
  )

  return (
    <div ref={comboboxRef} onClick={handleControlClick} style={containerStyle}>
      <div style={propertyControlWrapperStyle}>
        <div style={propertyControlInnerStyle}>
          {comboboxField}
          <ComboboxOptions
            open={comboboxOpen && hasFilteredOptions}
            position={optionsPosition}
            handleClose={handleComboboxClose}
          >
            <ComboboxOptionList
              filteredOptions={
                filteredOptions as
                  | Array<{
                      name: string
                      value: string
                      hidden?: boolean
                      disabled?: boolean
                    }>
                  | Array<
                      Array<{
                        name: string
                        value: string
                        hidden?: boolean
                        disabled?: boolean
                      }>
                    >
              }
              hasSections={hasSections}
              value={comboboxControlValue}
              highlightedValue={highlightedValue}
              renderIcon={renderIconFunction}
              onSelect={handleSelect}
              onHighlight={setHighlightedValue}
            />
          </ComboboxOptions>
        </div>
      </div>
    </div>
  )
}
