import { WritableDraft } from "immer"
import { isEqual } from "lodash"
import { Workspace } from "../../index"
import { ValueType } from "../../properties/constants/value-types"
import { PropertyKey, SubPropertyKey } from "../../properties/types/properties"
import { ThemeValue } from "../../properties/types/theme-value"
import { Value } from "../../properties/types/value"
import { HSL } from "../../properties/values/color/hsl"
import { Theme, ThemeId, ThemeOption } from "../../themes/types"
import { canNodeHaveChildren } from "../../workspace/helpers/can-node-have-children"
import { getNodeProperties } from "../../workspace/helpers/get-node-properties"
import { themeService } from "../../workspace/services/theme.service"
import { workspaceService } from "../../workspace/services/workspace.service"
import { Instance, InstanceId, Variant, VariantId } from "../../workspace/types"
import { isCompoundProperty } from "../type-guards/compound/is-compound-property"
import { isThemeValue } from "../type-guards/value/is-theme-value"
import { getThemeKeyComponents } from "./get-theme-key-components"
import { getThemeOption } from "./get-theme-option"

const SWATCH_PRESET_SLOTS = [
  "none",
  "transparent",
  "background",
  "black",
  "gray",
  "white",
  "primary",
  "swatch1",
  "swatch2",
  "swatch3",
  "swatch4",
] as const

type MigrationContext = {
  value: ThemeValue
  currentTheme: Theme
  newTheme: Theme
  node: WritableDraft<Variant | Instance>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}

type MatchingResult = {
  matched: boolean
  newOptionId?: string
}

/**
 * Creates a new theme value with updated reference.
 */
function createUpdatedThemeValue(
  originalValue: ThemeValue,
  section: string,
  newOptionId: string,
): ThemeValue {
  return {
    ...originalValue,
    value: `@${section}.${newOptionId}` as typeof originalValue.value,
  } as ThemeValue
}

/**
 * Sets a theme value on a node, handling both regular and sub-properties.
 */
function setThemeValueOnNode(
  node: WritableDraft<Variant | Instance>,
  propertyKey: PropertyKey,
  subpropertyKey: SubPropertyKey | undefined,
  newValue: ThemeValue,
): void {
  if (subpropertyKey) {
    setNodeSubProperty(node, propertyKey, subpropertyKey, newValue)
  } else {
    setNodeProperty(node, propertyKey, newValue)
  }
}

/**
 * Finds a matching theme option by exact name (case insensitive).
 */
function findMatchByName(
  newThemeEntries: [string, ThemeOption][],
  currentOption: ThemeOption | undefined,
): string | undefined {
  if (!currentOption || typeof currentOption !== "object") {
    return undefined
  }

  return newThemeEntries.find(([_, possibleMatch]: [string, ThemeOption]) => {
    if (typeof possibleMatch === "object" && "name" in possibleMatch) {
      return (
        possibleMatch.name.toLowerCase() === currentOption.name.toLowerCase()
      )
    }
    return false
  })?.[0]
}

/**
 * Finds a matching theme option by exact value.
 */
function findMatchByValue(
  newThemeEntries: [string, ThemeOption][],
  currentOption: ThemeOption | undefined,
): string | undefined {
  if (
    !currentOption ||
    typeof currentOption !== "object" ||
    !("value" in currentOption)
  ) {
    return undefined
  }

  return newThemeEntries.find(([_, possibleMatch]: [string, ThemeOption]) => {
    if (typeof possibleMatch === "object" && "value" in possibleMatch) {
      return isEqual(possibleMatch.value, currentOption.value)
    }
    return false
  })?.[0]
}

/**
 * Attempts to find a matching theme option using the 4-tier strategy.
 */
function findMatchingThemeOption(
  section: string,
  optionId: string,
  currentOption: ThemeOption | undefined,
  newTheme: Theme,
): MatchingResult {
  const newThemeEntries = Object.entries(newTheme[section as keyof Theme]) as [
    string,
    ThemeOption,
  ][]

  const matchingPreset = newThemeEntries.find(([key]) => key === optionId)
  if (matchingPreset) {
    return { matched: true, newOptionId: optionId }
  }

  if (optionId.startsWith("custom")) {
    const matchByName = findMatchByName(newThemeEntries, currentOption)
    if (matchByName) {
      return { matched: true, newOptionId: matchByName }
    }

    const matchByValue = findMatchByValue(newThemeEntries, currentOption)
    if (matchByValue) {
      return { matched: true, newOptionId: matchByValue }
    }
  }

  return { matched: false }
}

/**
 * Handles swatch-specific migration logic.
 */
function migrateSwatchValue(context: MigrationContext): boolean {
  const { value, newTheme, node, propertyKey, subpropertyKey } = context
  const { section, optionId } = getThemeKeyComponents(value.value)

  let currentOption: ThemeOption | undefined
  try {
    currentOption = getThemeOption(value.value, context.currentTheme)
  } catch (error) {
    return false
  }

  if (SWATCH_PRESET_SLOTS.includes(optionId as any)) {
    const newThemeEntries = Object.entries(
      newTheme[section as keyof Theme],
    ) as [string, ThemeOption][]
    const matchingSlot = newThemeEntries.find(([key]) => key === optionId)

    if (matchingSlot) {
      const newValue = createUpdatedThemeValue(value, section, optionId)
      setThemeValueOnNode(node, propertyKey, subpropertyKey, newValue)
      return true
    }
  }

  if (optionId.startsWith("custom")) {
    const result = findMatchingThemeOption(
      section,
      optionId,
      currentOption,
      newTheme,
    )
    if (result.matched && result.newOptionId) {
      const newValue = createUpdatedThemeValue(
        value,
        section,
        result.newOptionId,
      )
      setThemeValueOnNode(node, propertyKey, subpropertyKey, newValue)
      return true
    }
  }

  if (currentOption) {
    detachThemeValue(context)
    return true
  }

  return false
}

/**
 * Handles non-swatch theme value migration.
 */
function migrateNonSwatchValue(context: MigrationContext): boolean {
  const { value, currentTheme, newTheme, node, propertyKey, subpropertyKey } =
    context
  const { section, optionId } = getThemeKeyComponents(value.value)

  let currentOption: ThemeOption | undefined
  try {
    currentOption = getThemeOption(value.value, currentTheme)
  } catch (error) {
    return false
  }

  const result = findMatchingThemeOption(
    section,
    optionId,
    currentOption,
    newTheme,
  )

  if (result.matched && result.newOptionId) {
    const newValue = createUpdatedThemeValue(value, section, result.newOptionId)
    setThemeValueOnNode(node, propertyKey, subpropertyKey, newValue)
    return true
  }

  detachThemeValue(context)
  return true
}

/**
 * Migrates theme values from one theme to another for a node and all its children.
 * @param nodeId - The ID of the node to migrate
 * @param currentThemeId - The current theme ID
 * @param newThemeId - The new theme ID to migrate to
 * @param workspace - The workspace containing the node
 */
export function migrateNodePropertiesToTheme(
  nodeId: InstanceId | VariantId,
  currentThemeId: ThemeId,
  newThemeId: ThemeId,
  workspace: WritableDraft<Workspace>,
) {
  const currentTheme = themeService.getTheme(currentThemeId, workspace)
  const newTheme = themeService.getTheme(newThemeId, workspace)
  const node = workspaceService.getNode(nodeId, workspace)
  const properties = getNodeProperties(node, workspace)

  for (const [key, value] of Object.entries(properties)) {
    const propertyKey = key as PropertyKey

    if (isCompoundProperty(propertyKey)) {
      for (const [subKey, subProperty] of Object.entries(value)) {
        const subpropertyKey = subKey as SubPropertyKey
        if (isThemeValue(subProperty)) {
          migrateThemeValue({
            value: subProperty,
            currentTheme,
            newTheme,
            node,
            propertyKey,
            subpropertyKey,
          })
        }
      }
    } else if (isThemeValue(value)) {
      migrateThemeValue({
        value,
        currentTheme,
        newTheme,
        node,
        propertyKey,
      })
    }
  }

  if (canNodeHaveChildren(node)) {
    node.children.forEach((childId) =>
      migrateNodePropertiesToTheme(
        childId as InstanceId,
        currentThemeId,
        newThemeId,
        workspace,
      ),
    )
  }
}

/**
 * Migrates a theme value to a new theme using a 4-tier matching strategy.
 * @param value - The theme value to migrate
 * @param currentTheme - The current theme
 * @param newTheme - The new theme to migrate to
 * @param node - The node containing the property
 * @param propertyKey - The property key
 * @param subpropertyKey - Optional subproperty key for compound properties
 */
function migrateThemeValue({
  value,
  currentTheme,
  newTheme,
  node,
  propertyKey,
  subpropertyKey,
}: {
  value: ThemeValue
  currentTheme: Theme
  newTheme: Theme
  node: WritableDraft<Variant | Instance>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}) {
  const { section } = getThemeKeyComponents(value.value)

  const context: MigrationContext = {
    value,
    currentTheme,
    newTheme,
    node,
    propertyKey,
    subpropertyKey,
  }

  if (section === "swatch") {
    migrateSwatchValue(context)
  } else {
    migrateNonSwatchValue(context)
  }
}

/**
 * Sets a property value on a node.
 */
function setNodeProperty(
  node: WritableDraft<Variant | Instance>,
  key: PropertyKey,
  value: Value,
) {
  Object.assign(node.properties, { [key]: value })
}

/**
 * Sets a subproperty value on a node's compound property.
 */
function setNodeSubProperty(
  node: WritableDraft<Variant | Instance>,
  key: PropertyKey,
  subpropertyKey: SubPropertyKey,
  value: Value,
) {
  if (!node.properties[key]) {
    Object.assign(node.properties, { [key]: {} })
  }

  Object.assign(node.properties[key]!, { [subpropertyKey]: value })
}

/**
 * Converts a theme value to an exact value when no matching theme option exists.
 */
function detachThemeValue({
  value,
  currentTheme,
  node,
  propertyKey,
  subpropertyKey,
}: {
  value: ThemeValue
  currentTheme: Theme
  node: WritableDraft<Variant | Instance>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}) {
  const themeOption = getThemeOption(value.value, currentTheme)

  if (
    typeof themeOption === "string" ||
    !("value" in themeOption) ||
    !themeOption.value
  ) {
    return
  }

  if (typeof themeOption.value === "object" && "step" in themeOption.value) {
    return
  }

  const newValue: Value = {
    type: ValueType.EXACT,
    value: themeOption.value as string | number | HSL,
  }

  if (subpropertyKey) {
    setNodeSubProperty(node, propertyKey, subpropertyKey, newValue)
  } else {
    setNodeProperty(node, propertyKey, newValue)
  }
}
