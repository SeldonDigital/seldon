import { ComponentLevel, ComputedFunction, Theme, ValueType, Workspace } from "@seldon/core"
import { Harmony } from "../../../themes/constants/enums"
import { HSLObjectToString } from "../../../helpers/color/hsl-object-to-string"
import { getThemeValueName } from "../../../helpers/theme/get-theme-value-name"
import { findInObject } from "../../../helpers/utils/find-in-object"
import { isHSLObject } from "../../../helpers/type-guards/color/is-hsl-object"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "../../../properties/compute"
import { isCompoundCatalogProperty } from "../../../properties/constants/shared/compound-properties"
import {
  getCatalogKeyForPropertyPath,
  getPresetOptionsAsLabelValue,
  getPropertySchema,
} from "../../../properties/schemas/helpers"
import type { PropertySchema } from "../../../properties/types/schema"
import {
  isLayeredPaintProperty,
  type LayeredPaintKey,
  type PropertyKey,
} from "../../../properties/types/property-keys"
import type { Properties } from "../../../properties/types/properties"
import { Resize } from "../../../properties/values/layout/resize"
import { getEffectiveNodeProperties } from "../../compute/compute-node-properties"
import type { WorkspacePropertySource } from "../../compute/compute-node-properties"
import {
  getBuiltInLookSectionForPropertyKey,
  getThemeLookPickerToken,
  getThemeLookSection,
  isThemeLookPresetSchemaName,
  listThemeLookIds,
} from "@seldon/core/themes/looks"
import { resolveThemeTokenEntry } from "@seldon/core/themes/schemas"
import { getCompoundLayerValue } from "./shared"

export type PropertyPickerOption = { value: string; name: string }

export type PropertyPickerResult = {
  options: PropertyPickerOption[][]
  hasCurrentValue: boolean
  currentValueOption?: PropertyPickerOption
}

export type PropertyPickerInput = {
  path: string
  value: unknown
  subjectId: string
  workspace: Workspace
  theme?: Theme
  componentLevel?: ComponentLevel
}

const LAYERED_PAINT_LAYER_INDEX = "0"

function isPresetPropertyPath(path: string): boolean {
  return path.endsWith(".preset")
}

function getCompoundPresetPickerPath(compoundKey: string): string {
  if (isLayeredPaintProperty(compoundKey as PropertyKey)) {
    return `${compoundKey}.${LAYERED_PAINT_LAYER_INDEX}.preset`
  }
  return `${compoundKey}.preset`
}

function getParentPathForPreset(presetPath: string): string {
  const segments = presetPath.split(".").filter(Boolean)
  if (
    segments.length === 3 &&
    isLayeredPaintProperty(segments[0] as PropertyKey) &&
    segments[1] === LAYERED_PAINT_LAYER_INDEX
  ) {
    return segments[0]!
  }
  if (segments.length >= 2) {
    return segments[0]!
  }
  return presetPath.replace(/\.preset$/, "")
}

function resolveValueAtPropertyPath(
  properties: Properties,
  path: string,
): unknown {
  const direct = findInObject<unknown>(properties, path)
  if (direct !== undefined && direct !== null) {
    return direct
  }

  const segments = path.split(".").filter(Boolean)
  const root = segments[0]
  if (root && isLayeredPaintProperty(root as PropertyKey)) {
    if (segments.length === 3 && segments[1] === LAYERED_PAINT_LAYER_INDEX) {
      const facet = segments[2]
      if (facet) {
        const layer = getCompoundLayerValue(properties[root as keyof Properties])
        return layer?.[facet]
      }
    }
    if (segments.length === 2) {
      const facet = segments[1]
      if (facet) {
        const layer = getCompoundLayerValue(properties[root as keyof Properties])
        return layer?.[facet]
      }
    }
  }

  return undefined
}

function getRestrictionsAllowedValues(
  properties: Properties,
  path: string,
): string[] | undefined {
  const value = resolveValueAtPropertyPath(properties, path)
  if (!value || typeof value !== "object" || value === null) {
    return undefined
  }
  const restrictions = (value as { restrictions?: { allowedValues?: unknown } })
    .restrictions
  if (!restrictions?.allowedValues || !Array.isArray(restrictions.allowedValues)) {
    return undefined
  }
  return restrictions.allowedValues.map(String)
}

function applyRestrictionsFilter(
  groups: PropertyPickerOption[][],
  allowedValues: string[] | undefined,
): PropertyPickerOption[][] {
  if (!allowedValues || allowedValues.length === 0) {
    return groups
  }
  const allowed = new Set(allowedValues)
  return groups
    .map((group) => group.filter((opt) => allowed.has(opt.value)))
    .filter((group) => group.length > 0)
}

function normalizeOptions(
  options: unknown[],
  theme?: Theme,
): PropertyPickerOption[] {
  return options
    .map((option) => {
      if (
        typeof option === "object" &&
        option !== null &&
        "name" in option &&
        "value" in option
      ) {
        return {
          name: String((option as { name: string }).name),
          value: String((option as { value: unknown }).value),
        }
      }

      if (typeof option === "boolean") {
        return {
          name: option ? "On" : "Off",
          value: String(option),
        }
      }

      const value = String(option)
      return {
        name: theme ? getThemeValueName(value, theme) : value,
        value,
      }
    })
    .filter(
      (option) =>
        option.name.trim() !== "" && option.value.trim() !== "",
    )
}

function buildDefaultOptions(schema: PropertySchema): PropertyPickerOption[] {
  const defaultGroup: PropertyPickerOption[] = [{ value: "", name: "Default" }]
  if (schema.supports.includes("inherit")) {
    defaultGroup.push({ value: "inherit", name: "Inherit" })
  }
  return defaultGroup
}

function buildPresetOptions(
  schema: PropertySchema,
  theme?: Theme,
  workspace?: Workspace,
): PropertyPickerOption[] {
  if (!schema.presetOptions) {
    return []
  }

  const catalogKey = schema.name
  const labeled = getPresetOptionsAsLabelValue(catalogKey, workspace)
  if (labeled.length > 0) {
    return labeled.map((entry) => ({
      name: entry.label,
      value: String(entry.value),
    }))
  }

  let presetOptions: unknown[] = []
  if (typeof schema.presetOptions === "function") {
    if (workspace !== undefined) {
      presetOptions = (
        schema.presetOptions as (workspace?: Workspace) => unknown[]
      )(workspace)
    }
    if (!Array.isArray(presetOptions) && theme !== undefined) {
      presetOptions = (
        schema.presetOptions as unknown as (theme?: Theme) => unknown[]
      )(theme)
    }
    if (!Array.isArray(presetOptions)) {
      presetOptions = (schema.presetOptions as () => unknown[])()
    }
  } else {
    presetOptions = schema.presetOptions as unknown[]
  }

  return normalizeOptions(presetOptions, theme)
}

function groupPresetOptions(
  schema: PropertySchema,
  presetOptions: PropertyPickerOption[],
): PropertyPickerOption[][] {
  if (presetOptions.length === 0) {
    return []
  }

  if (schema.name !== "boardPreset") {
    return [presetOptions]
  }

  const fitOptions = presetOptions.filter((option) => option.value === Resize.FIT)
  const deviceOptions = presetOptions.filter(
    (option) => option.value !== Resize.FIT,
  )

  const groups: PropertyPickerOption[][] = []
  if (fitOptions.length > 0) {
    groups.push(fitOptions)
  }
  if (deviceOptions.length > 0) {
    groups.push(deviceOptions)
  }
  return groups
}

function getCurrentValueOption(
  property: { value: unknown },
  theme?: Theme,
): PropertyPickerOption | null {
  if (
    !property.value ||
    typeof property.value !== "object" ||
    property.value === null ||
    !("type" in property.value) ||
    (property.value.type !== ValueType.EXACT &&
      property.value.type !== ValueType.OPTION)
  ) {
    return null
  }

  const raw = "value" in property.value ? property.value.value : null
  if (raw === null || raw === undefined) return null

  if (typeof raw === "string") {
    if (raw.startsWith("@") && theme) {
      return { value: raw, name: getThemeValueName(raw, theme) }
    }
    return {
      value: raw,
      name: theme ? getThemeValueName(raw, theme) : raw,
    }
  }

  if (typeof raw === "boolean") {
    return {
      value: String(raw),
      name: raw ? "On" : "Off",
    }
  }

  if (typeof raw === "object" && raw !== null) {
    if (isHSLObject(raw)) {
      const colorString = HSLObjectToString(raw)
      return { value: colorString, name: colorString }
    }

    if ("value" in raw && "unit" in raw) {
      const dimensionString = `${(raw as { value: number }).value}${(raw as { unit: string }).unit}`
      return { value: dimensionString, name: dimensionString }
    }
  }

  return null
}

function buildCurrentValueOption(
  property: { value: unknown },
  presetOptions: PropertyPickerOption[],
  theme?: Theme,
): PropertyPickerOption[] {
  const currentValueOption = getCurrentValueOption(property, theme)
  if (!currentValueOption) {
    return []
  }

  const isPresetValue = presetOptions.some(
    (preset) => preset.value === currentValueOption.value,
  )

  return isPresetValue ? [] : [currentValueOption]
}

function buildComputedOptions(
  computedFunctions: ComputedFunction[],
  componentLevel?: ComponentLevel,
  theme?: Theme,
): PropertyPickerOption[] {
  const filteredFunctions = computedFunctions.filter((fn) => {
    if (fn === ComputedFunction.OPTICAL_PADDING) {
      return componentLevel !== ComponentLevel.PRIMITIVE
    }
    return true
  })

  return normalizeOptions(
    filteredFunctions.map((fn) => ({
      value: fn,
      name: COMPUTED_FUNCTION_DISPLAY_NAMES[fn] ?? fn,
    })),
    theme,
  )
}

function sortSwatchKeys(themeKeys: string[]): string[] {
  const standardSwatches = themeKeys.filter((key) => !key.startsWith("custom"))
  const customSwatches = themeKeys.filter((key) => key.startsWith("custom"))
  const sortedCustom = customSwatches.sort(
    (a, b) =>
      parseInt(a.replace("custom", ""), 10) -
      parseInt(b.replace("custom", ""), 10),
  )
  return [...standardSwatches, ...sortedCustom]
}

function getThemeSectionFromSchema(
  schema: PropertySchema,
  theme: Theme,
  type: "categorical" | "ordinal",
): string | null {
  const getKeys =
    type === "categorical"
      ? schema.themeCategoricalKeys
      : schema.themeOrdinalKeys
  if (!getKeys) return null

  const keys = getKeys(theme)
  if (keys.length === 0) return null

  // Full token keys already name their section (`@fontWeight.thin` -> `fontWeight`),
  // so derive it directly. This avoids matching a property name against the theme
  // and works for any schema that returns `@`-prefixed keys.
  const firstKey = keys[0]!
  if (firstKey.startsWith("@")) {
    const section = firstKey.slice(1).split(".")[0]
    if (section && theme[section as keyof Theme]) {
      return section
    }
  }

  for (const [sectionName, sectionData] of Object.entries(theme)) {
    if (typeof sectionData === "object" && sectionData !== null) {
      const sectionKeys = Object.keys(sectionData)
      if (keys.every((key) => sectionKeys.includes(key))) {
        return sectionName
      }
    }
  }

  return null
}

function createThemeOptions(
  themeKeys: string[],
  themeSection: string,
  theme: Theme,
): PropertyPickerOption[] {
  const sortedKeys =
    themeSection === "swatch" ? sortSwatchKeys(themeKeys) : themeKeys

  return sortedKeys.map((key) => {
    const themeKey = key.startsWith("@") ? key : `@${themeSection}.${key}`
    return {
      value: themeKey,
      name: getThemeValueName(themeKey, theme),
    }
  })
}

function buildThemeOptions(schema: PropertySchema, theme: Theme): PropertyPickerOption[] {
  const options: PropertyPickerOption[] = []

  if (schema.themeCategoricalKeys) {
    const themeSection = getThemeSectionFromSchema(schema, theme, "categorical")
    if (themeSection) {
      options.push(
        ...createThemeOptions(schema.themeCategoricalKeys(theme), themeSection, theme),
      )
    }
  }

  if (schema.themeOrdinalKeys) {
    const themeSection = getThemeSectionFromSchema(schema, theme, "ordinal")
    if (themeSection) {
      options.push(
        ...createThemeOptions(schema.themeOrdinalKeys(theme), themeSection, theme),
      )
    }
  }

  return options
}

function propertySupportsImageUpload(path: string): boolean {
  if (path === "source") return true
  if (path === "background.0.image" || path === "background.image") {
    return true
  }
  return false
}

function getPropertySchemaForPath(path: string): PropertySchema | null {
  const catalogKey = getCatalogKeyForPropertyPath(path)
  if (catalogKey) {
    return getPropertySchema(catalogKey) ?? null
  }
  return getPropertySchema(path) ?? null
}

function buildPropertyOptionsFromSchema(
  input: PropertyPickerInput,
  schema: PropertySchema,
): PropertyPickerResult {
  const groups: PropertyPickerOption[][] = []

  if (propertySupportsImageUpload(input.path)) {
    groups.push([{ value: "__upload__", name: "Upload" }])
  }

  groups.push(buildDefaultOptions(schema))

  const presetOptions = buildPresetOptions(schema, input.theme, input.workspace)
  if (presetOptions.length > 0) {
    groups.push(...groupPresetOptions(schema, presetOptions))
  }

  const currentValueOptions = buildCurrentValueOption(
    { value: input.value },
    presetOptions,
    input.theme,
  )
  if (currentValueOptions.length > 0) {
    groups.push(currentValueOptions)
  }

  if (schema.computedFunctions) {
    const computedOptions = buildComputedOptions(
      schema.computedFunctions(),
      input.componentLevel,
      input.theme,
    )
    if (computedOptions.length > 0) {
      groups.push(computedOptions)
    }
  }

  if (input.theme) {
    const themeOptions = buildThemeOptions(schema, input.theme)
    if (themeOptions.length > 0) {
      groups.push(themeOptions)
    }
  }

  const currentValueOption =
    currentValueOptions.length > 0 ? currentValueOptions[0] : undefined

  const effective = getEffectiveNodeProperties(
    input.subjectId,
    input.workspace as WorkspacePropertySource,
  )
  const restrictionAllowed = getRestrictionsAllowedValues(effective, input.path)

  return {
    options: applyRestrictionsFilter(groups, restrictionAllowed),
    hasCurrentValue: currentValueOption !== undefined,
    currentValueOption,
  }
}

function buildCompoundPresetPickerOptions(
  input: PropertyPickerInput,
): PropertyPickerResult {
  const parentKey = getParentPathForPreset(input.path)
  const presetSchemaName = `${parentKey}Preset`

  const schema =
    getPropertySchemaForPath(presetSchemaName) ||
    getPropertySchemaForPath(parentKey) ||
    getPropertySchemaForPath(input.path)

  if (!schema) {
    return {
      options: [[{ value: "", name: "Error" }]],
      hasCurrentValue: false,
    }
  }

  const groups: PropertyPickerOption[][] = []
  groups.push(buildDefaultOptions(schema))

  if (!isThemeLookPresetSchemaName(schema.name)) {
    const presetOptions = buildPresetOptions(schema, input.theme, input.workspace)
    if (presetOptions.length > 0) {
      groups.push(...groupPresetOptions(schema, presetOptions))
    }
  }

  const theme = input.theme
  const section = theme ? getThemeLookSection(theme, parentKey) : undefined

  if (!theme || !section || typeof section !== "object") {
    const effective = getEffectiveNodeProperties(
      input.subjectId,
      input.workspace as WorkspacePropertySource,
    )
    const restrictionAllowed = getRestrictionsAllowedValues(effective, input.path)
    return {
      options: applyRestrictionsFilter(groups, restrictionAllowed),
      hasCurrentValue: false,
    }
  }

  const lookSection = getBuiltInLookSectionForPropertyKey(parentKey)
  const presetGroup: PropertyPickerOption[] =
    lookSection === null
      ? []
      : listThemeLookIds(theme, lookSection)
          .map((id) => {
            const v = section[id]
            if (!v || typeof v !== "object" || !("name" in v)) {
              return null
            }
            return {
              value: getThemeLookPickerToken(parentKey, id),
              name: String((v as Record<string, unknown>).name),
            }
          })
          .filter((option): option is PropertyPickerOption => option !== null)

  if (presetGroup.length > 0) {
    groups.push(presetGroup)
  }

  const effective = getEffectiveNodeProperties(
    input.subjectId,
    input.workspace as WorkspacePropertySource,
  )
  const restrictionAllowed = getRestrictionsAllowedValues(effective, input.path)

  return {
    options: applyRestrictionsFilter(groups, restrictionAllowed),
    hasCurrentValue: false,
  }
}

/** Drops the synthetic `Default`/`Inherit` entries so theme tokens list only real choices. */
function stripDefaultInherit(
  groups: PropertyPickerOption[][],
): PropertyPickerOption[][] {
  return groups
    .map((group) =>
      group.filter((option) => option.value !== "" && option.value !== "inherit"),
    )
    .filter((group) => group.length > 0)
}

/**
 * Builds picker options for a theme token path. Theme tokens are not in
 * `PROPERTY_SCHEMAS`, so options come from the bridged property schema, inline
 * token options, or an On/Off pair for boolean controls.
 */
function buildThemeTokenPickerOptions(
  input: PropertyPickerInput,
): PropertyPickerResult | null {
  const tokenSchema = resolveThemeTokenEntry(input.path, input.theme)
  if (!tokenSchema) {
    return null
  }

  if (tokenSchema.propertyKey) {
    const prop = getPropertySchema(tokenSchema.propertyKey)
    if (prop) {
      const result = buildPropertyOptionsFromSchema(input, prop)
      return { ...result, options: stripDefaultInherit(result.options) }
    }
  }

  if (tokenSchema.options && tokenSchema.options.length > 0) {
    return {
      options: [
        tokenSchema.options.map((option) => ({
          name: option.label,
          value: String(option.value),
        })),
      ],
      hasCurrentValue: false,
    }
  }

  if (
    tokenSchema.controlType === "boolean" ||
    tokenSchema.supports.includes("boolean")
  ) {
    return {
      options: [
        [
          { name: "On", value: "true" },
          { name: "Off", value: "false" },
        ],
      ],
      hasCurrentValue: false,
    }
  }

  return null
}

function buildHarmonyPickerOptions(): PropertyPickerResult {
  return {
    options: [
      [
        { name: "Monochromatic", value: String(Harmony.Monochromatic) },
        { name: "Complementary", value: String(Harmony.Complementary) },
        {
          name: "Split Complementary",
          value: String(Harmony.SplitComplementary),
        },
        { name: "Triadic", value: String(Harmony.Triadic) },
        { name: "Analogous", value: String(Harmony.Analogous) },
        { name: "Square", value: String(Harmony.Square) },
      ],
    ],
    hasCurrentValue: false,
  }
}

/**
 * Builds grouped picker options for a property path using catalog schemas,
 * the active theme, workspace context, and effective value restrictions.
 */
export function getPropertyPickerOptions(
  input: PropertyPickerInput,
): PropertyPickerResult {
  if (isPresetPropertyPath(input.path)) {
    return buildCompoundPresetPickerOptions(input)
  }

  if (isCompoundCatalogProperty(input.path)) {
    return buildCompoundPresetPickerOptions({
      ...input,
      path: getCompoundPresetPickerPath(input.path),
    })
  }

  if (input.path === "color.harmony") {
    const effective = getEffectiveNodeProperties(
      input.subjectId,
      input.workspace as WorkspacePropertySource,
    )
    const restrictionAllowed = getRestrictionsAllowedValues(
      effective,
      input.path,
    )
    const harmony = buildHarmonyPickerOptions()
    return {
      ...harmony,
      options: applyRestrictionsFilter(harmony.options, restrictionAllowed),
    }
  }

  // Theme look facets (for example `font.callout.size`) share their last path
  // segment with unrelated catalog keys (`size`, `width`, `color`), so resolving by
  // path would pick the wrong schema. When the path matches a theme token entry,
  // build options from that entry's bridged `propertyKey` instead.
  if (input.theme && resolveThemeTokenEntry(input.path, input.theme)) {
    const themeTokenOptions = buildThemeTokenPickerOptions(input)
    if (themeTokenOptions) {
      return themeTokenOptions
    }
  }

  const schema = getPropertySchemaForPath(input.path)
  if (!schema) {
    const themeTokenOptions = buildThemeTokenPickerOptions(input)
    if (themeTokenOptions) {
      return themeTokenOptions
    }
    return {
      options: [
        [{ value: "ERROR", name: `No schema found for ${input.path}` }],
      ],
      hasCurrentValue: false,
    }
  }

  return buildPropertyOptionsFromSchema(input, schema)
}
