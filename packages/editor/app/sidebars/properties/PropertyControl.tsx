import { RefObject, useEffect, useMemo, useRef, useState } from "react"
import {
  Board,
  Instance,
  Theme,
  Value,
  ValueType,
  Variant,
} from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import type {
  PropertyKey,
  SubPropertyKey,
} from "@seldon/core/properties/types/property-keys"
import type { ThemeInstanceId } from "@seldon/core/themes/types/theme-id"
import {
  getThemePickerOptions,
} from "@seldon/core/helpers/properties/properties-bridge"
import { isThemeValueKey } from "@seldon/core/helpers/validation/theme"
import { IconId } from "@seldon/core/icon-sets"
import { IconSeldonMissing } from "@seldon/core/icon-sets/catalog/seldon/user-interface/actions/IconSeldonMissing"
import { isComponentEntry } from "@seldon/core/workspace/helpers/components/is-component-entry"
import { getBoardThemeRef } from "./helpers/theme-assignment-display"
import { themeService } from "@seldon/core/workspace/services/theme/theme.service"
import { useComboboxState } from "./controls/combobox/hooks/use-combobox-state"
import { useComboboxPosition } from "./hooks/use-combobox-position"
import { usePropertyControlData } from "./hooks/use-property-control-data"
import { usePropertyValidation } from "./hooks/use-property-validation"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey, resolveComponentKey } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { LoadEditorIcons } from "@components/LoadEditorIcons"
import { useImageUploadPanel } from "@components/panels/hooks/use-upload-image-panel"
import { IconTokenValue } from "@components/seldon/custom-icons/TokenValue"
import { IconCustomColorValue } from "../../seldon/custom-icons"
import { serializeValue } from "@lib/properties/serialize-value"
import { ThemeSwatches } from "@components/ui/ThemeSwatches"
import { useThemes } from "@lib/themes/hooks/use-themes"
import { Combobox } from "./controls/combobox/Combobox"
import { ComboboxOption } from "./controls/combobox/Option"
import { ComboboxOptionGroup } from "./controls/combobox/OptionGroup"
import { ComboboxOptions } from "./controls/combobox/Options"
import { createPresetPropertyUpdate } from "./helpers/compound-properties"
import { handleComputedValueChange } from "./helpers/computed-property-handler"
import { isComputedFunctionOption } from "./helpers/computed-utils"
import { getComboboxStoredValue } from "./helpers/combobox-stored-value"
import { getDisplayValue } from "./helpers/display-value-utils"
import { getThemeTokenIconColor } from "./helpers/theme-token-icon-color"
import { generatePropertyOptions } from "./helpers/options-utils"
import { FlatProperty } from "./helpers/properties-data"
import { RESET_VALUES } from "./helpers/property-control-constants"
import { shouldUsePresetPropertyBehavior } from "./helpers/property-types"
import {
  isLayeredPaintRoot,
  layeredFacetPath,
  parsePropertyPath,
} from "@lib/properties/property-paths"
import type { LayeredPaintKey } from "@seldon/core/properties/types/property-keys"
import { updateProperty } from "./helpers/property-update-handler"
import {
  propertyControlInnerStyle,
  propertyControlTextStyle,
  propertyControlWrapperStyle,
} from "../helpers/sidebar-styles"

function compoundPresetPropertyKey(propertyKey: string): string {
  if (isLayeredPaintRoot(propertyKey)) {
    return layeredFacetPath(propertyKey as LayeredPaintKey, "preset")
  }
  return `${propertyKey}.preset`
}

interface ThemeEditingContext {
  isThemeEditing: true
  updateThemeProperty: (property: FlatProperty, newValue: string) => void
  themeProperties: FlatProperty[]
}

interface FontCollectionEditingContext {
  isFontCollectionEditing: true
  updateFontCollectionProperty: (
    property: FlatProperty,
    newValue: string,
  ) => void
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
}: PropertyControlProps) {
  const { setProperties, resetProperty } = useObjectProperties()
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { selection, selectedBoardId } = useSelection()
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

    if (property.key === "theme" && subject) {
      const newThemeId =
        newValue === "none" ? null : (newValue as ThemeInstanceId)
      if (isComponentEntry(subject)) {
        dispatch({
          type: "set_component_theme",
          payload: {
            componentKey:
              selectedBoardId ?? resolveComponentKey(subject, workspace),
            theme: newThemeId || "seldon",
          },
        })
      } else {
        dispatch({
          type: "set_node_theme",
          payload: {
            nodeId: subject.id,
            theme: newThemeId,
          },
        })
      }
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

  const options = useMemo(() => {
    if (
      !property.controlType ||
      (property.controlType !== "combo" && property.controlType !== "menu")
    ) {
      return undefined
    }

    // Rows that carry their own options (font collection family rows) are not
    // backed by the property schema, so use the supplied options directly.
    if (property.options) {
      return [property.options]
    }

    if (property.key === "theme") {
      return [
        getThemePickerOptions({
          workspace,
          allowInherit: !(subject && isComponentEntry(subject)),
        }),
      ]
    }

    const componentId: ComponentId | undefined =
      subject && isComponentEntry(subject)
        ? (getComponentKey(subject) as ComponentId)
        : subject
          ? (getNodeCatalogComponentId(subject, workspace) ?? undefined)
          : undefined
    const componentLevel =
      subject && isComponentEntry(subject)
        ? undefined
        : (subject?.level as ComponentLevel | undefined)

    const result = generatePropertyOptions(
      property,
      theme,
      componentId,
      componentLevel,
      workspace,
      subject ?? undefined,
    )

    return result.options
  }, [property, theme, subject, workspace])

  const propertyValue = getPropertyValueForDisplay()
  const effectiveControlType = property.controlType

  const comboboxStoredValue = useMemo(() => {
    if (property.key === "theme") {
      if (subject && isComponentEntry(subject)) {
        return getBoardThemeRef(subject)
      }
      if (subject && !isComponentEntry(subject)) {
        return subject.theme ?? "none"
      }
      return "none"
    }
    return getComboboxStoredValue(property.value)
  }, [property.key, property.value, subject])

  const displayValue = getDisplayValue(
    propertyValue,
    property.key,
    subject && !isComponentEntry(subject)
      ? subject.id
      : subject && isComponentEntry(subject)
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
  }, [comboboxControlValue, displayValue, flatOptions, setInputValue, comboboxOpen])

  // Sync editing state with combobox open state
  useEffect(() => {
    if (onEditChange) return

    setIsEditing(comboboxOpen)
  }, [comboboxOpen, setIsEditing, onEditChange])

  useEffect(() => {
    if (
      isEditing &&
      (effectiveControlType === "menu" || effectiveControlType === "combo")
    ) {
      // Use double requestAnimationFrame to ensure selection happens after all rendering
      // This matches the pattern used in Combobox.handleFocus for programmatic focus
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
          }
          setComboboxOpen(true)
        })
      })
    }
  }, [isEditing, effectiveControlType, property.key, setComboboxOpen])

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
        return <ThemeSwatches theme={optionTheme} />
      }
      return null
    }

    if (option) {
      const swatchColor = getThemeTokenIconColor(option.value, theme)
      if (swatchColor) {
        return <IconCustomColorValue color={swatchColor} />
      }
      if (isThemeValueKey(option.value)) {
        return <IconTokenValue />
      }
    }

    if (property.key === "symbol" && option) {
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

  if (effectiveControlType === "text" || effectiveControlType === "number") {
    return (
      <div
        onBlur={onBlur}
        style={{
          width: "100%",
          minWidth: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Combobox
          mode="standalone"
          value={displayValue}
          onValueChange={handleChange}
          placeholder={placeholder}
          validate={validationFunction}
          disabled={property.isDimmed}
          autoFocus={isEditing}
          style={{
            width: "100%",
            minWidth: 0,
            ...propertyControlTextStyle,
            background: "transparent",
            border: "none",
            padding: 0,
            ...(color ? { color } : {}),
            ...(property.isDimmed ? { opacity: 0.5 } : {}),
          }}
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
    <div
      ref={comboboxRef}
      onClick={(e) => {
        if (
          (effectiveControlType === "menu" ||
            effectiveControlType === "combo") &&
          !comboboxOpen &&
          !property.isDimmed
        ) {
          e.stopPropagation()
          // Use double requestAnimationFrame for reliable text selection
          // This ensures selection happens after all rendering completes
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (inputRef.current) {
                inputRef.current.focus()
                inputRef.current.select()
              }
              setComboboxOpen(true)
            })
          })
        }
      }}
      style={{
        width: "100%",
        minWidth: 0,
        height: "100%",
        display: "flex",
        alignItems: "center",
        ...propertyControlTextStyle,
        cursor: "pointer",
        ...(property.isDimmed ? { opacity: 0.5 } : {}),
      }}
    >
      <div style={propertyControlWrapperStyle}>
        <div style={propertyControlInnerStyle}>
          {comboboxField}
          <ComboboxOptions
            open={comboboxOpen && hasFilteredOptions}
            position={optionsPosition}
            handleClose={() => {
              // If no selection was made, restore original value
              if (
                !hasSelectionRef.current &&
                originalValueRef.current !== undefined
              ) {
                const option = flatOptions.find(
                  (o) => o.value === originalValueRef.current,
                )
                setInputValue(
                  option ? option.name : originalValueRef.current || "",
                )
                // Don't call handleChange - we're canceling
              }
              setComboboxOpen(false)
              if (effectiveControlType === "menu") {
                onBlur?.()
              }
            }}
          >
            {hasSections
              ? (
                  filteredOptions as Array<
                    Array<{ value: string; name: string }>
                  >
                ).map((group, index) => (
                  <ComboboxOptionGroup
                    key={index}
                    isLast={index === filteredOptions.length - 1}
                  >
                    {group.map((option, optionIndex) => (
                      <ComboboxOption
                        key={`${option.name}-${optionIndex}`}
                        option={option}
                        value={comboboxControlValue}
                        renderIcon={renderIconFunction}
                        handleSelect={handleSelect}
                        hidden={(option as { hidden?: boolean }).hidden}
                        disabled={(option as { disabled?: boolean }).disabled}
                        highlighted={option.value === highlightedValue}
                        onHighlight={setHighlightedValue}
                      />
                    ))}
                  </ComboboxOptionGroup>
                ))
              : (
                  filteredOptions as Array<{
                    value: string
                    name: string
                    hidden?: boolean
                    disabled?: boolean
                  }>
                ).map((option, index) => (
                  <ComboboxOption
                    key={`${option.name}-${index}`}
                    option={option}
                    hidden={option.hidden}
                    value={comboboxControlValue}
                    renderIcon={renderIconFunction}
                    handleSelect={handleSelect}
                    disabled={option.disabled}
                    highlighted={option.value === highlightedValue}
                    onHighlight={setHighlightedValue}
                  />
                ))}
          </ComboboxOptions>
        </div>
      </div>
    </div>
  )
}
