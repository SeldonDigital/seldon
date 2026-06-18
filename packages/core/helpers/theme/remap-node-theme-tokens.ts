import { WritableDraft } from "immer"
import { isEqual } from "lodash"

import { isComponentId } from "../../components/constants"
import { Workspace } from "../../index"
import { ValueType } from "../../properties"
import {
  PropertyKey,
  SubPropertyKey,
  ThemeValue,
  Value,
} from "../../properties/types"
import { isLayeredPaintProperty } from "../../properties/types/property-keys"
import { HSL } from "../../properties/values/shared/exact/hsl"
import { TokenType } from "../../themes/constants/token-type"
import { Theme, ThemeInstanceId, ThemeOption } from "../../themes/types"
import type { ThemeFontFamilyToken } from "../../themes/values"
import { getEffectiveNodeProperties } from "../../workspace/compute"
import { getBoardByNodeId } from "../../workspace/helpers/components/get-board-by-node-id"
import { getChildrenIds } from "../../workspace/helpers/components/get-children-ids"
import type { EntryNode } from "../../workspace/model/entry-node"
import { parseNodeCatalog } from "../../workspace/model/template-ref"
import {
  nodeRetrievalService,
  workspaceThemeService,
} from "../../workspace/services"
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

type RemapContext = {
  value: ThemeValue
  currentTheme: Theme
  newTheme: Theme
  node: WritableDraft<EntryNode>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
  /** Paint-layer slot when the token sits inside a layered paint stack. */
  layerIndex?: number
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
    option.type === TokenType.FONT_FAMILY &&
    "parameters" in option &&
    typeof (option as ThemeFontFamilyToken).parameters === "string"
  ) {
    return (option as ThemeFontFamilyToken).parameters
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
 * Sets a theme value on a node, handling regular, sub-property, and layered
 * paint targets.
 */
function setThemeValueOnNode(
  node: WritableDraft<EntryNode>,
  propertyKey: PropertyKey,
  subpropertyKey: SubPropertyKey | undefined,
  newValue: Value,
  layerIndex?: number,
): void {
  if (subpropertyKey && layerIndex != null) {
    setNodeLayeredSubProperty(
      node,
      propertyKey,
      layerIndex,
      subpropertyKey,
      newValue,
    )
  } else if (subpropertyKey) {
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
 * Finds a matching option in the new theme: first by exact slot id, then by name
 * or value for `custom` slots.
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

/** Remaps a swatch theme value, carrying over reserved slots when present. */
function remapSwatchValue(context: RemapContext): boolean {
  const { value, newTheme, node, propertyKey, subpropertyKey, layerIndex } =
    context

  if (!value.value) {
    return false
  }

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

  if ((SWATCH_PRESET_SLOTS as readonly string[]).includes(optionId)) {
    const newThemeEntries = Object.entries(
      newTheme[section as keyof Theme],
    ) as [string, ThemeOption][]
    const matchingSlot = newThemeEntries.find(([key]) => key === optionId)

    if (matchingSlot) {
      const newValue = createUpdatedThemeValue(value, section, optionId)
      setThemeValueOnNode(
        node,
        propertyKey,
        subpropertyKey,
        newValue,
        layerIndex,
      )
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
      setThemeValueOnNode(
        node,
        propertyKey,
        subpropertyKey,
        newValue,
        layerIndex,
      )
      return true
    }
  }

  if (currentOption) {
    detachThemeValue(context)
    return true
  }

  return false
}

/** Remaps a non-swatch theme value to its match in the new theme. */
function remapNonSwatchValue(context: RemapContext): boolean {
  const {
    value,
    currentTheme,
    newTheme,
    node,
    propertyKey,
    subpropertyKey,
    layerIndex,
  } = context

  if (!value.value) {
    return false
  }

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
    setThemeValueOnNode(node, propertyKey, subpropertyKey, newValue, layerIndex)
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

    if (isLayeredPaintProperty(propertyKey)) {
      remapLayeredThemeTokens(value, {
        currentTheme,
        newTheme,
        node,
        propertyKey,
      })
    } else if (isCompoundProperty(propertyKey)) {
      remapCompoundThemeTokens(value, {
        currentTheme,
        newTheme,
        node,
        propertyKey,
      })
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

  const board = getBoardByNodeId(workspace as Workspace, nodeId)
  const childIds = board ? getChildrenIds(board, nodeId) : []

  const catalogParsed = parseNodeCatalog(node.template)
  const componentId =
    catalogParsed?.kind === "catalog" &&
    isComponentId(catalogParsed.componentId)
      ? catalogParsed.componentId
      : undefined

  if (componentId && childIds.length > 0) {
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

/** Remaps every theme token facet inside one compound property value. */
function remapCompoundThemeTokens(
  compoundValue: unknown,
  context: {
    currentTheme: Theme
    newTheme: Theme
    node: WritableDraft<EntryNode>
    propertyKey: PropertyKey
  },
): void {
  for (const [subKey, subProperty] of Object.entries(
    compoundValue as Record<string, unknown>,
  )) {
    const subValue = subProperty as Value
    if (!isThemeValue(subValue)) continue
    remapThemeToken({
      value: subValue,
      ...context,
      subpropertyKey: subKey as SubPropertyKey,
    })
  }
}

/**
 * Remaps theme token facets inside a layered paint stack (`background`,
 * `shadow`). Each layer is its own facet map, so the layer slot is tracked and
 * carried through to the override write-back. A non-array value is treated as a
 * single layer at index 0.
 */
function remapLayeredThemeTokens(
  layeredValue: unknown,
  context: {
    currentTheme: Theme
    newTheme: Theme
    node: WritableDraft<EntryNode>
    propertyKey: PropertyKey
  },
): void {
  const layers = Array.isArray(layeredValue) ? layeredValue : [layeredValue]

  layers.forEach((layer, layerIndex) => {
    if (!layer || typeof layer !== "object") return

    for (const [subKey, subProperty] of Object.entries(
      layer as Record<string, unknown>,
    )) {
      const subValue = subProperty as Value
      if (!isThemeValue(subValue)) continue
      remapThemeToken({
        value: subValue,
        ...context,
        subpropertyKey: subKey as SubPropertyKey,
        layerIndex,
      })
    }
  })
}

/** Remaps one theme token on a node override using slot, name, and value matching. */
function remapThemeToken({
  value,
  currentTheme,
  newTheme,
  node,
  propertyKey,
  subpropertyKey,
  layerIndex,
}: {
  value: ThemeValue
  currentTheme: Theme
  newTheme: Theme
  node: WritableDraft<EntryNode>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
  layerIndex?: number
}) {
  if (!value.value) {
    return
  }

  if (!isThemeValueKey(value.value)) {
    return
  }

  const { section } = getThemeKeyComponents(value.value)

  const context: RemapContext = {
    value,
    currentTheme,
    newTheme,
    node,
    propertyKey,
    subpropertyKey,
    layerIndex,
  }

  if (section === "swatch") {
    remapSwatchValue(context)
  } else {
    remapNonSwatchValue(context)
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
 * Sets a facet value on one paint-layer slot of a layered paint property.
 * Earlier layers are padded with empty bags so the template layers show through
 * the merge while the targeted layer carries the remapped value.
 */
function setNodeLayeredSubProperty(
  node: WritableDraft<EntryNode>,
  key: PropertyKey,
  layerIndex: number,
  subpropertyKey: SubPropertyKey,
  value: Value,
) {
  if (!node.overrides) {
    node.overrides = {}
  }

  const existing = node.overrides[key]
  const layers = (Array.isArray(existing) ? existing : []) as Record<
    string,
    unknown
  >[]

  while (layers.length <= layerIndex) {
    layers.push({})
  }

  const layer =
    layers[layerIndex] && typeof layers[layerIndex] === "object"
      ? layers[layerIndex]
      : {}
  layer[subpropertyKey] = value
  layers[layerIndex] = layer

  Object.assign(node.overrides, { [key]: layers })
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
  layerIndex,
}: {
  value: ThemeValue
  currentTheme: Theme
  node: WritableDraft<EntryNode>
  propertyKey: PropertyKey
  subpropertyKey?: SubPropertyKey
  layerIndex?: number
}) {
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

  setThemeValueOnNode(node, propertyKey, subpropertyKey, newValue, layerIndex)
}
