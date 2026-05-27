import { type PropertyKey, type Workspace } from "@seldon/core"
import { isCompoundProperty } from "@seldon/core/helpers/type-guards/compound/is-compound-property"
import type { Properties } from "@seldon/core/properties/types/properties"
import {
  compoundSubPropertyPath,
  getCompoundLayerValue,
  getCompoundPropertyStructure,
  getEffectiveProperties,
  getPropertyOverridesBag,
  getSchemaProperties,
  getSubPropertyKeysFromSchema,
  getTypedNode,
  hasSchemaSubProperty,
  isShorthandProperty,
  isValueEmpty,
  isValueSet,
  propertyValuesMatch,
  type PropertyPanelSubject,
} from "./shared"

export type PropertyStatus = "set" | "unset" | "override" | "not used"

function hasPropertyOverride(
  node: PropertyPanelSubject,
  key: string,
  subKey?: string,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false

  const propertyValue = (bag as Record<string, unknown>)[key]
  if (!propertyValue || typeof propertyValue !== "object") return false

  if (subKey) {
    return subKey in propertyValue
  }

  return true
}

function hasSubPropertyOverride(
  node: PropertyPanelSubject,
  key: string,
  subKey: string,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false
  const layer = getCompoundLayerValue((bag as Record<string, unknown>)[key])
  return !!(layer && subKey in layer)
}

function hasNonEmptySubProperties(propertyValue: unknown): boolean {
  const layer = getCompoundLayerValue(propertyValue)
  if (!layer) return false
  return Object.keys(layer)
    .filter((key) => key !== "preset")
    .some((key) => isValueSet(layer[key]))
}

function hasOverriddenSiblingProperties(
  node: PropertyPanelSubject,
  key: string,
): boolean {
  const bag = getPropertyOverridesBag(node)
  if (!bag || !(key in bag)) return false
  const layer = getCompoundLayerValue((bag as Record<string, unknown>)[key])
  if (!layer) return false
  return Object.keys(layer)
    .filter((subKey) => subKey !== "preset")
    .some((subKey) => hasSubPropertyOverride(node, key, subKey))
}

function calculatePropertyStatus(
  key: string,
  hasNodeOverride: boolean,
  hasSchemaDefault: boolean,
  nodePropertyValue: unknown,
  schemaValue: unknown,
  node: PropertyPanelSubject,
): PropertyStatus {
  if (hasNodeOverride) {
    if (isCompoundProperty(key as PropertyKey)) {
      return hasOverriddenSiblingProperties(node, key)
        ? "override"
        : hasNonEmptySubProperties(nodePropertyValue)
          ? "set"
          : "unset"
    }

    if (hasSchemaDefault && schemaValue && propertyValuesMatch(nodePropertyValue, schemaValue)) {
      return "set"
    }

    return "override"
  }

  if (hasSchemaDefault) {
    return isValueEmpty(schemaValue) ? "unset" : "set"
  }

  return "not used"
}

function calculateSubPropertyStatus(
  key: string,
  subKey: string,
  hasSubOverride: boolean,
  hasSubDefault: boolean,
  parentProperty: Record<string, unknown> | null,
  schemaSubValue: unknown,
): PropertyStatus {
  if (hasSubOverride) {
    if (isCompoundProperty(key as PropertyKey)) {
      if (subKey === "preset") {
        const subValue = parentProperty?.[subKey]
        if (hasSubDefault && schemaSubValue && propertyValuesMatch(subValue, schemaSubValue)) {
          return "set"
        }
        return "override"
      }

      const subValue = parentProperty?.[subKey]
      return isValueEmpty(subValue) ? "unset" : "override"
    }

    return "override"
  }

  if (isCompoundProperty(key as PropertyKey) && subKey === "preset") {
    const siblingKeys = Object.keys(parentProperty ?? {}).filter(
      (siblingKey) => siblingKey !== "preset",
    )
    const allSiblingsUnset = siblingKeys.every((siblingKey) =>
      isValueEmpty(parentProperty?.[siblingKey]),
    )
    if (allSiblingsUnset) return "unset"
    return hasNonEmptySubProperties(parentProperty) ? "override" : "set"
  }

  if (hasSubDefault) {
    return isValueEmpty(schemaSubValue) ? "unset" : "set"
  }

  return "not used"
}

function aggregateSubPropertyStatuses(
  subStatuses: PropertyStatus[],
): PropertyStatus {
  if (subStatuses.length === 0) {
    return "not used"
  }
  if (subStatuses.includes("not used")) {
    return "not used"
  }
  if (subStatuses.includes("override")) {
    return "override"
  }
  if (subStatuses.includes("set")) {
    return "set"
  }
  return "unset"
}

export function getPropertyStatus(
  nodeId: string,
  workspace: Workspace,
): Record<string, PropertyStatus> {
  const node = getTypedNode(nodeId, workspace)
  const schemaProperties = getSchemaProperties(node, workspace)
  const status: Record<string, PropertyStatus> = {}
  if (!schemaProperties) return status

  const effective = getEffectiveProperties(nodeId, workspace)
  const bag = getPropertyOverridesBag(node)

  for (const key of Object.keys(effective)) {
    const hasNodeOverride = hasPropertyOverride(node, key)
    const hasSchemaDefault = key in schemaProperties
    const nodeValue = hasNodeOverride ? bag?.[key as keyof Properties] : null
    const schemaValue = hasSchemaDefault
      ? (schemaProperties as Record<string, unknown>)[key]
      : null

    status[key] = calculatePropertyStatus(
      key,
      hasNodeOverride,
      hasSchemaDefault,
      nodeValue,
      schemaValue,
      node,
    )

    if (isCompoundProperty(key as PropertyKey)) {
      const compoundValue = (effective as Record<string, unknown>)[key]
      const compoundLayer = getCompoundLayerValue(compoundValue)
      if (compoundLayer) {
        const subKeys = getCompoundPropertyStructure(
          key,
          compoundValue,
          node,
          workspace,
        )
        const schemaLayer = getCompoundLayerValue(
          (schemaProperties as Record<string, unknown> | null)?.[key],
        )
        const subStatuses: PropertyStatus[] = []
        for (const subKey of subKeys) {
          const hasSubDefault = hasSchemaSubProperty(
            schemaProperties,
            key,
            subKey,
          )
          const schemaSubValue = hasSubDefault ? schemaLayer?.[subKey] : null

          const subStatus = calculateSubPropertyStatus(
            key,
            subKey,
            hasSubPropertyOverride(node, key, subKey),
            hasSubDefault,
            compoundLayer,
            schemaSubValue,
          )
          status[compoundSubPropertyPath(key, subKey)] = subStatus
          subStatuses.push(subStatus)
        }
        status[key] = aggregateSubPropertyStatuses(subStatuses)
      }
    }

    if (isShorthandProperty(key)) {
      const subKeys = getSubPropertyKeysFromSchema(key, node, workspace)
      const subStatuses: PropertyStatus[] = []

      for (const subKey of subKeys) {
        const hasSubDefault = hasSchemaSubProperty(
          schemaProperties,
          key,
          subKey,
        )
        const shorthandSchemaValue = (
          schemaProperties as Record<string, Record<string, unknown> | undefined>
        )[key]
        const schemaSubValue = hasSubDefault
          ? shorthandSchemaValue?.[subKey] ?? null
          : null

        const subStatus = calculateSubPropertyStatus(
          key,
          subKey,
          hasSubPropertyOverride(node, key, subKey),
          hasSubDefault,
          (effective as Record<string, Record<string, unknown> | null>)[key] ?? null,
          schemaSubValue,
        )

        status[`${key}.${subKey}`] = subStatus
        subStatuses.push(subStatus)
      }

      status[key] = aggregateSubPropertyStatuses(subStatuses)
    }
  }

  return status
}
