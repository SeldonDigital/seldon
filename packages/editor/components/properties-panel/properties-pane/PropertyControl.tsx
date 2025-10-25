import {
  ComputedFunction,
  PropertyKey,
  SubPropertyKey,
  Theme,
  Value,
  ValueType,
} from "@seldon/core"
import { getUnitsForProperty } from "@seldon/core/properties"
import { getPropertyCategory } from "@seldon/core/properties/schemas"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"

import { useObjectProperties } from "../../../lib/workspace/use-object-properties"
import { useSelection } from "../../../lib/workspace/use-selection"
import { useWorkspace } from "../../../lib/workspace/use-workspace"
import { useAddToast } from "../../toaster/use-add-toast"
import { serializeValue } from "../helpers/serialize-value"
import { ComboControl } from "./controls/ComboControl"
import { MenuControl } from "./controls/MenuControl"
import { NumberControl } from "./controls/NumberControl"
import { TextControl } from "./controls/TextControl"
import { createPresetPropertyUpdate } from "./helpers/compound-properties"
import {
  canApplyComputedSafely,
  createComputedValue,
  getSuggestedBasedOnPath,
  isComputedFunctionOption,
} from "./helpers/computed-utils"
import { generatePropertyOptions } from "./helpers/options-utils"
import { FlatProperty } from "./helpers/properties-data"
import { ICON_MAP } from "./helpers/properties-registry"
import {
  getSubPropertyKeys,
  shouldUsePresetPropertyBehavior,
  shouldUseShorthandMainPropertyBehavior,
} from "./helpers/property-types"
import { getPropertyPlaceholder } from "./helpers/shared-utils"

interface PropertyControlProps {
  property: FlatProperty
  theme?: Theme
}

export function PropertyControl({ property, theme }: PropertyControlProps) {
  const { setProperties, resetProperty } = useObjectProperties()
  const { workspace } = useWorkspace()
  const { selection } = useSelection()
  const _addToast = useAddToast() // eslint-disable-line @typescript-eslint/no-unused-vars

  // Get the icon component for this property
  const getIconComponent = () => {
    const iconName = property.icon
    const IconComponent = ICON_MAP[iconName]
    return IconComponent || ICON_MAP.IconTokenValue
  }

  const localSerializeValue = (newValue: string, currentValue: unknown) => {
    return serializeValue(
      newValue,
      { currentValue: currentValue as Value | undefined },
      selection || undefined,
      property.key,
    )
  }

  const handleChange = (newValue: string) => {
    // Check if the selected value is a computed function
    if (isComputedFunctionOption(newValue)) {
      try {
        let computedValue = createComputedValue(newValue as ComputedFunction)

        // Optical Padding: ALWAYS set a suggested basedOn path
        if (newValue === ComputedFunction.OPTICAL_PADDING && selection) {
          const suggested = getSuggestedBasedOnPath(workspace, selection)
          if (!suggested) {
            console.error(
              `[PropertiesPane] Cannot apply computed function ${newValue} to ${property.key}: no suitable basedOn source found.`,
            )
            return
          }
          computedValue = {
            ...computedValue,
            value: {
              ...(typeof computedValue.value === "object" && computedValue.value
                ? (computedValue.value as Record<string, unknown>)
                : {}),
              input: {
                ...(typeof computedValue.value === "object" &&
                computedValue.value &&
                "input" in computedValue.value
                  ? ((computedValue.value as Record<string, unknown>)
                      .input as Record<string, unknown>)
                  : {}),
                basedOn: suggested,
                factor: 1.5,
              },
            },
          }
        } else if (
          selection &&
          !canApplyComputedSafely(
            newValue as ComputedFunction,
            workspace,
            selection,
          )
        ) {
          console.error(
            `[PropertiesPane] Cannot apply computed function ${newValue} to ${property.key}: required inputs missing.`,
          )
          return
        }

        if (property.isSubProperty) {
          // For sub-properties, set the individual sub-property to computed value
          const [compoundKey, subKey] = property.key.split(".")
          const currentCompoundValue = property.value || {}
          const cleanCurrentValue = Object.keys(currentCompoundValue).reduce(
            (acc, key) => {
              if (
                key !== "type" &&
                key !== "value" &&
                (currentCompoundValue as Record<string, unknown>)[key]
              ) {
                acc[key] = (currentCompoundValue as Record<string, unknown>)[
                  key
                ]
              }
              return acc
            },
            {} as Record<string, unknown>,
          )

          setProperties({
            [compoundKey]: {
              ...cleanCurrentValue,
              [subKey]: computedValue,
            },
          })
        } else {
          // For main properties, handle based on property type
          const propertyType = getPropertyCategory(property.key) || "atomic"

          if (propertyType === "atomic") {
            // Atomic: Simple set the value
            setProperties({
              [property.key]: computedValue,
            })
          } else if (propertyType === "shorthand") {
            // Set ALL sub-properties to the same computed value as a compound update
            const subPropertyKeys = getSubPropertyKeys(property.key)
            const compound: Record<string, unknown> = {}
            subPropertyKeys.forEach((subKey) => {
              compound[subKey] = computedValue
            })
            setProperties(
              { [property.key]: compound },
              { mergeSubProperties: false },
            )
          } else if (propertyType === "compound") {
            // Compound: Set the main property to computed value
            // Individual sub-properties can still be overridden
            setProperties({
              [property.key]: computedValue,
            })
          } else {
            // Fallback: Simple set
            setProperties({
              [property.key]: computedValue,
            })
          }
        }
        return
      } catch (error) {
        console.error("Failed to create computed value:", error)
        // Fall through to default handling
      }
    }

    if (newValue === "Default" || newValue === "None" || newValue === "") {
      // For preset properties, use the special update logic to clear all sibling properties
      if (shouldUsePresetPropertyBehavior(property.key)) {
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
        return
      }
      // For non-preset properties, reset the property
      handleReset()
      return
    }

    if (property.isSubProperty) {
      // Handle sub-property changes (e.g., padding.top)
      const [compoundKey, subKey] = property.key.split(".")

      // Special handling for preset properties
      if (shouldUsePresetPropertyBehavior(property.key)) {
        // For preset properties, handle preset selection and parameter setting
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
        return
      }

      // Get current compound property value - filter out type/value properties
      const currentCompoundValue = property.value || {}
      const cleanCurrentValue = Object.keys(currentCompoundValue).reduce(
        (acc, key) => {
          if (
            key !== "type" &&
            key !== "value" &&
            (currentCompoundValue as Record<string, unknown>)[key]
          ) {
            acc[key] = (currentCompoundValue as Record<string, unknown>)[key]
          }
          return acc
        },
        {} as Record<string, unknown>,
      )

      // Serialize the new value
      const serializedValue = localSerializeValue(newValue, property.value)

      // Create updated compound property
      const updatedCompoundValue = {
        ...cleanCurrentValue,
        [subKey]: serializedValue,
      }

      const updatePayload = {
        [compoundKey]: updatedCompoundValue,
      }

      setProperties(updatePayload)
    } else {
      // Handle main property changes
      const serializedValue = localSerializeValue(newValue, property.value)

      if (shouldUsePresetPropertyBehavior(property.key)) {
        // For preset properties, handle preset selection and parameter setting
        // Extract the parent key from the preset property key (e.g., "border.preset" -> "border")
        const _parentKey = property.key.replace(".preset", "") // eslint-disable-line @typescript-eslint/no-unused-vars
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
      } else if (shouldUseShorthandMainPropertyBehavior(property.key)) {
        // For shorthand properties, set ALL sub-properties to the same value
        // This is the "shortcut" behavior - main property sets all sub-properties
        const subPropertyKeys = getSubPropertyKeys(property.key)
        const compoundProperty: Record<string, unknown> = {}

        // Set each sub-property to the same value within the compound property
        subPropertyKeys.forEach((subKey) => {
          compoundProperty[subKey] = serializedValue
        })

        // Set the compound property directly with mergeSubProperties: false
        // This ensures we replace the entire compound property structure
        setProperties(
          {
            [property.key]: compoundProperty,
          },
          { mergeSubProperties: false },
        )
      } else {
        // For non-shorthand properties, set the main property directly
        const updatePayload = {
          [property.key]: serializedValue,
        }

        setProperties(updatePayload)
      }
    }
  }

  const handleReset = () => {
    if (property.isSubProperty) {
      // Reset sub-property
      const [compoundKey, subKey] = property.key.split(".")
      resetProperty(compoundKey as PropertyKey, subKey as SubPropertyKey)
    } else {
      // Reset main property (same behavior for shorthand and compound)
      resetProperty(property.key as PropertyKey)
    }
  }

  // Generate options using the PropertyOptionsService
  const getOptions = () => {
    // Extract component information from selection
    const componentId =
      selection && isBoard(selection) ? selection.id : selection?.component
    const componentLevel =
      selection && isBoard(selection) ? undefined : selection?.level

    const result = generatePropertyOptions(
      property,
      theme,
      componentId,
      componentLevel,
      workspace,
      selection || undefined,
    )

    return result.options
  }

  const getPlaceholder = (defaultPlaceholder: string) => {
    return getPropertyPlaceholder(property, defaultPlaceholder)
  }

  const getPropertyValueForDisplay = () => {
    // If the property is dimmed (controlled by a computed main property),
    // show the computed function name instead of the individual value
    if (property.isDimmed && property.actualValue) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    if (
      property.propertyType === "shorthand" &&
      property.actualValue &&
      property.actualValue !== "unset"
    ) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    if (shouldUsePresetPropertyBehavior(property.key)) {
      if (property.actualValue && property.actualValue !== "unset") {
        return { type: ValueType.EXACT, value: property.actualValue }
      } else {
        return { type: ValueType.EMPTY, value: null }
      }
    }

    if (property.isSubProperty && property.key.includes(".")) {
      const [parentKey] = property.key.split(".")
      if (shouldUsePresetPropertyBehavior(parentKey)) {
        if (property.actualValue && property.actualValue !== "unset") {
          return { type: ValueType.EXACT, value: property.actualValue }
        } else {
          return { type: ValueType.EMPTY, value: null }
        }
      }
    }

    // For theme properties, use the formatted actualValue if available
    if (
      property.actualValue &&
      property.value &&
      typeof property.value === "object" &&
      property.value !== null &&
      "type" in property.value &&
      (property.value.type === ValueType.THEME_ORDINAL ||
        property.value.type === ValueType.THEME_CATEGORICAL)
    ) {
      return { type: ValueType.EXACT, value: property.actualValue }
    }

    return property.value &&
      typeof property.value === "object" &&
      property.value !== null &&
      "type" in property.value &&
      property.value.type &&
      Object.values(ValueType).includes(property.value.type as ValueType)
      ? (property.value as Value)
      : { type: ValueType.EMPTY, value: null }
  }

  const propertyValue = getPropertyValueForDisplay()

  const controlStyle = {
    fontFamily: "IBM Plex Sans",
    fontSize: "0.75rem",
  }

  switch (property.controlType) {
    case undefined:
      // No control should be rendered for this property
      return null

    case "combo":
      return (
        <ComboControl
          value={propertyValue}
          onChange={property.isDimmed ? () => {} : handleChange}
          options={getOptions()} // ComboControl expects flat array
          placeholder={getPlaceholder("Select or enter value")}
          icon={getIconComponent()}
          propertyKey={property.key}
          allowCustom={true}
          style={{
            ...controlStyle,
            ...(property.isDimmed ? { opacity: 0.5 } : {}),
          }}
          disabled={property.isDimmed}
        />
      )

    case "menu":
      return (
        <MenuControl
          value={propertyValue}
          onChange={property.isDimmed ? () => {} : handleChange}
          options={getOptions()} // MenuControl expects flat array
          placeholder={getPlaceholder("Select value")}
          icon={getIconComponent()}
          propertyKey={property.key}
          allowCustom={false}
          style={{
            ...controlStyle,
            ...(property.isDimmed ? { opacity: 0.5 } : {}),
          }}
          disabled={property.isDimmed}
        />
      )

    case "number":
      return (
        <NumberControl
          value={propertyValue}
          onChange={property.isDimmed ? () => {} : handleChange}
          placeholder={getPlaceholder("Enter number")}
          icon={getIconComponent()}
          validation="both"
          units={getUnitsForProperty(property.key)}
          style={{
            ...controlStyle,
            ...(property.isDimmed ? { opacity: 0.5 } : {}),
          }}
          disabled={property.isDimmed}
        />
      )

    case "text":
      return (
        <TextControl
          value={propertyValue}
          onChange={property.isDimmed ? () => {} : handleChange}
          placeholder={getPlaceholder("Enter text")}
          icon={getIconComponent()}
          validation="text"
          style={{
            ...controlStyle,
            ...(property.isDimmed ? { opacity: 0.5 } : {}),
          }}
          disabled={property.isDimmed}
        />
      )

    default:
      return (
        <TextControl
          value={propertyValue}
          onChange={property.isDimmed ? () => {} : handleChange}
          placeholder={getPlaceholder("Enter value")}
          icon={getIconComponent()}
          validation="text"
          style={{
            ...controlStyle,
            ...(property.isDimmed ? { opacity: 0.5 } : {}),
          }}
          disabled={property.isDimmed}
        />
      )
  }
}
