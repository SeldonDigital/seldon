import { ComputedFunction, ValueType } from "../constants"
import type { Properties } from "../types/properties"
import {
  type CompoundPropertyKey,
  LAYERED_PAINT_KEYS,
  type LayeredPaintKey,
  type PropertyKey,
  type SubPropertyKey,
  isObjectFacetMapProperty,
} from "../types/property-keys"
import type { Value } from "../types/value"
import type { ComputedAutoFitValue } from "../values/shared/computed/auto-fit"
import type { ComputedValue } from "../values/shared/computed/computed-value"
import type { ComputedHighContrastValue } from "../values/shared/computed/high-contrast-color"
import type { ComputedMatchValue } from "../values/shared/computed/match"
import type { ComputedOpticalPaddingValue } from "../values/shared/computed/optical-padding"
import { computeAutoFit } from "./compute-auto-fit"
import { computeHighContrastColor } from "./compute-high-contrast-color"
import { computeLayeredPaintStack } from "./compute-layered-paint"
import { computeMatch } from "./compute-match"
import { applyMatchColorMirror } from "./compute-match-mirror"
import { computeOpticalPadding } from "./compute-optical-padding"
import { ComputeContext, ComputeKeys } from "./types"

function getCompoundPropertyValue<T extends CompoundPropertyKey>(
  target: Properties,
  key: T,
): Properties[T] | undefined {
  return target[key]
}

function setCompoundPropertyValue<T extends CompoundPropertyKey>(
  target: Properties,
  key: T,
  value: Properties[T],
): void {
  target[key] = value
}

function setSubPropertyValue(
  compoundValue: Record<string, Value>,
  subKey: string,
  value: Value,
): void {
  compoundValue[subKey] = value
}

/**
 * Returns a new `Properties` object with the same top-level keys as `inputProperties`. Every
 * `COMPUTED` value at the top level, under object facet maps (`border`, `font`, `margin`, …) per
 * {@link isObjectFacetMapProperty}, or inside each entry of `background` / `gradient` / `shadow`
 * layer arrays (see {@link computeLayeredPaintStack}), is replaced by the engine result. Other
 * values are copied through. Does not mutate `inputProperties`.
 *
 * @param inputProperties - Node properties after merge with defaults where your pipeline does that
 * @param context - This node's properties, optional parent chain, and theme for engines
 * @returns Resolved properties safe to hand to resolution or export
 */
export function computeProperties(
  inputProperties: Properties,
  context: ComputeContext,
): Properties {
  const computedProperties: Properties = {}

  Object.entries(inputProperties).forEach(([k, value]) => {
    const propertyKey = k as PropertyKey

    if (
      LAYERED_PAINT_KEYS.has(propertyKey as LayeredPaintKey) &&
      Array.isArray(value)
    ) {
      const resolvedLayers = computeLayeredPaintStack(
        propertyKey as LayeredPaintKey,
        value,
        context,
        dispatchComputed,
      )
      ;(computedProperties as Record<string, unknown>)[k] = resolvedLayers
      return
    }

    if (LAYERED_PAINT_KEYS.has(propertyKey as LayeredPaintKey)) {
      Object.assign(computedProperties, { [propertyKey]: value })
      return
    }

    if (isObjectFacetMapProperty(propertyKey)) {
      const compoundValue = value as Record<string, Value>
      Object.entries(compoundValue).forEach(([sk, subpropertyValue]) => {
        const subPropertyKey = sk as SubPropertyKey

        if (!getCompoundPropertyValue(computedProperties, propertyKey)) {
          setCompoundPropertyValue(
            computedProperties,
            propertyKey,
            {} as Properties[typeof propertyKey],
          )
        }

        const currentCompoundValue = getCompoundPropertyValue(
          computedProperties,
          propertyKey,
        ) as Record<string, Value>

        if (
          subpropertyValue &&
          typeof subpropertyValue === "object" &&
          "type" in subpropertyValue &&
          subpropertyValue.type === ValueType.COMPUTED
        ) {
          const resolved = dispatchComputed(
            subpropertyValue as ComputedValue,
            context,
            {
              propertyKey,
              subPropertyKey: subPropertyKey,
            },
          )
          setSubPropertyValue(currentCompoundValue, subPropertyKey, resolved)
        } else {
          setSubPropertyValue(
            currentCompoundValue,
            subPropertyKey,
            subpropertyValue as Value,
          )
        }
      })

      const resolvedCompound = getCompoundPropertyValue(
        computedProperties,
        propertyKey,
      ) as Record<string, Value> | undefined
      if (resolvedCompound) {
        applyMatchColorMirror(compoundValue, resolvedCompound, context)
      }
    } else {
      if (
        value &&
        typeof value === "object" &&
        "type" in value &&
        value.type === ValueType.COMPUTED
      ) {
        const computedValue = value as ComputedValue
        const computedResult = dispatchComputed(computedValue, context, {
          propertyKey,
        })
        Object.assign(computedProperties, { [propertyKey]: computedResult })
      } else {
        Object.assign(computedProperties, { [propertyKey]: value })
      }
    }
  })

  return computedProperties
}

/**
 * Sends the computed value to `computeAutoFit`, `computeHighContrastColor`, `computeOpticalPadding`,
 * or `computeMatch` based on the stored function key.
 *
 * @throws When the value is not `COMPUTED` or the function key is unknown
 */
function dispatchComputed(
  value: ComputedValue,
  context: ComputeContext,
  keys: ComputeKeys,
): Value {
  if (value.type !== ValueType.COMPUTED) {
    throw new Error("Value is not a computed value")
  }

  const functionType = value.value
  switch (functionType) {
    case ComputedFunction.HIGH_CONTRAST_COLOR:
      return computeHighContrastColor(
        value as ComputedHighContrastValue,
        context,
      ) as Value
    case ComputedFunction.OPTICAL_PADDING:
      return computeOpticalPadding(
        value as ComputedOpticalPaddingValue,
        context,
        keys,
      ) as Value
    case ComputedFunction.AUTO_FIT:
      return computeAutoFit(value as ComputedAutoFitValue, context) as Value
    case ComputedFunction.MATCH:
      return computeMatch(value as ComputedMatchValue, context) as Value
    default:
      throw new Error(`Unknown computed function: ${functionType}`)
  }
}
