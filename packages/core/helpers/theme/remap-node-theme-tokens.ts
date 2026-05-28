import { WritableDraft } from "immer"
import { isEqual } from "lodash"
import { getComponentSchema } from "../../components/catalog"
import { isComponentId, type ComponentId } from "../../components/constants"
import { Workspace } from "../../index"
import { ValueType } from "../../properties"
import {
  PropertyKey,
  SubPropertyKey,
  ThemeValue,
  Value,
} from "../../properties/types"
import { HSL } from "../../properties/values/shared/exact/hsl"
import { TokenType } from "../../themes/constants/token-type"
import { Theme, ThemeInstanceId, ThemeOption } from "../../themes/types"
import type { ThemeFamilyToken } from "../../themes/values"
import { getChildrenIds } from "../../workspace/helpers/components/get-children-ids"
import { getComponentByNodeId } from "../../workspace/helpers/components/get-component-by-node-id"
import { parseNodeCatalog } from "../../workspace/model/template-ref"
import { getEffectiveNodeProperties } from "../../workspace/compute"
import {
  nodeRetrievalService,
  workspaceThemeService,
} from "../../workspace/services"
import type { EntryNode } from "../../workspace/model/entry-node"
import { InstanceId, VariantId } from "../../workspace/types"
import { isCompoundProperty } from "../type-guards/compound/is-compound-property"
import { isThemeValue } from "../type-guards/value/is-theme-value"
import { isThemeValueKey } from "../validation/theme"
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
  node: WritableDraft<EntryNode>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}

type MatchingResult = {
  matched: boolean
  newOptionId?: string
}

function themeOptionComparableName(
  option: ThemeOption | undefined,
): string | undefined {
  if (!option || typeof option !== "object") return undefined
  if ("name" in option && typeof option.name === "string") return option.name
  if (
    "type" in option &&
    option.type === TokenType.FAMILY &&
    "value" in option &&
    typeof (option as ThemeFamilyToken).value === "string"
  ) {
    return (option as ThemeFamilyToken).value
  }
  return undefined
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
  node: WritableDraft<EntryNode>,
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

  const currentName = themeOptionComparableName(currentOption)
  if (!currentName) return undefined

  return newThemeEntries.find(([_, possibleMatch]: [string, ThemeOption]) => {
    const matchName = themeOptionComparableName(possibleMatch)
    if (!matchName) return false
    return matchName.toLowerCase() === currentName.toLowerCase()
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

  // Handle null values
  if (!value.value) {
    return false
  }

  // Validate that the value is a valid theme key
  if (!isThemeValueKey(value.value)) {
    return false
  }

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

  // Handle null values
  if (!value.value) {
    return false
  }

  // Validate that the value is a valid theme key
  if (!isThemeValueKey(value.value)) {
    return false
  }

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
 * Remaps `@` theme token references in overrides when the active theme changes.
 * Walks the node subtree and matches tokens in the new theme by slot, name, or value.
 */
export function remapNodeThemeTokens(
  nodeId: InstanceId | VariantId,
  currentThemeId: ThemeInstanceId,
  newThemeId: ThemeInstanceId,
  workspace: WritableDraft<Workspace>,
) {
  const currentTheme = workspaceThemeService.getTheme(currentThemeId, workspace)
  const newTheme = workspaceThemeService.getTheme(newThemeId, workspace)
  const node = nodeRetrievalService.getNode(nodeId, workspace)
  const properties = getEffectiveNodeProperties(nodeId, workspace)

  for (const [key, value] of Object.entries(properties)) {
    const propertyKey = key as PropertyKey

    if (isCompoundProperty(propertyKey)) {
      for (const [subKey, subProperty] of Object.entries(value)) {
        const subpropertyKey = subKey as SubPropertyKey
        const subValue = subProperty as Value
        if (isThemeValue(subValue)) {
          remapThemeToken({
            value: subValue,
            currentTheme,
            newTheme,
            node,
            propertyKey,
            subpropertyKey,
          })
        }
      }
    } else if (isThemeValue(value as Value)) {
      remapThemeToken({
        value: value as ThemeValue,
        currentTheme,
        newTheme,
        node,
        propertyKey,
      })
    }
  }

  const board = getComponentByNodeId(workspace as Workspace, nodeId)
  const childIds = board ? getChildrenIds(board, nodeId) : []

  const catalogParsed = parseNodeCatalog(node.template)
  const componentId =
    catalogParsed?.kind === "catalog" && isComponentId(catalogParsed.componentId)
      ? catalogParsed.componentId
      : undefined

  if (
    componentId &&
    isComponentId(componentId) &&
    getComponentSchema(componentId).restrictions?.addChildren !== false &&
    childIds.length > 0
  ) {
    for (const childId of childIds) {
      remapNodeThemeTokens(
        childId as InstanceId,
        currentThemeId,
        newThemeId,
        workspace,
      )
    }
  }
}

/** Remaps one theme token on a node override using slot, name, and value matching. */
function remapThemeToken({
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
  node: WritableDraft<EntryNode>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}) {
  // Handle null values
  if (!value.value) {
    return
  }

  // Validate that the value is a valid theme key
  if (!isThemeValueKey(value.value)) {
    return
  }

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
  node: WritableDraft<EntryNode>,
  key: PropertyKey,
  value: Value,
) {
  if (!node.overrides) {
    node.overrides = {}
  }
  Object.assign(node.overrides, { [key]: value })
}

/**
 * Sets a subproperty value on a node's compound property.
 */
function setNodeSubProperty(
  node: WritableDraft<EntryNode>,
  key: PropertyKey,
  subpropertyKey: SubPropertyKey,
  value: Value,
) {
  if (!node.overrides) {
    node.overrides = {}
  }
  if (!node.overrides[key]) {
    Object.assign(node.overrides, { [key]: {} })
  }

  Object.assign(node.overrides[key]!, { [subpropertyKey]: value })
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
  node: WritableDraft<EntryNode>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
}) {
  // Handle null values
  if (!value.value) {
    return
  }

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
