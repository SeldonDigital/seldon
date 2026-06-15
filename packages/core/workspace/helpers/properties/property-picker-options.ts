import {
  ComponentLevel,
  ComputedFunction,
  Theme,
  ValueType,
  Workspace,
} from "@seldon/core"
import {
  getBuiltInLookSectionForPropertyKey,
  getThemeLookPickerToken,
  getThemeLookSection,
  isThemeLookPresetSchemaName,
  listThemeLookIds,
} from "@seldon/core/themes/looks"
import { resolveThemeTokenEntry } from "@seldon/core/themes/schemas"

import { HSLObjectToString } from "../../../helpers/color/hsl-object-to-string"
import { LCHObjectToString } from "../../../helpers/color/lch-object-to-string"
import { RGBObjectToString } from "../../../helpers/color/rgb-object-to-string"
import { stringifyValue } from "../../../helpers/properties/stringify-value"
import { getThemeValueName } from "../../../helpers/theme/get-theme-value-name"
import { isHSLObject } from "../../../helpers/type-guards/color/is-hsl-object"
import { isLCHObject } from "../../../helpers/type-guards/color/is-lch-object"
import { isRGBObject } from "../../../helpers/type-guards/color/is-rgb-object"
import { COMPUTED_FUNCTION_DISPLAY_NAMES } from "../../../properties/compute"
import { isCompoundCatalogProperty } from "../../../properties/constants/shared/compound-properties"
import {
  getCatalogKeyForPropertyPath,
  getPresetOptionsAsLabelValue,
  getPropertySchema,
} from "../../../properties/schemas/helpers"
import {
  type PropertyKey,
  isLayeredPaintProperty,
} from "../../../properties/types/property-keys"
import type { PropertySchema } from "../../../properties/types/schema"
import { Resize } from "../../../properties/values/layout/resize"
import { Harmony } from "../../../themes/constants/enums"
import { workspaceFontCollectionService } from "../../services/font-collection/font-collection.service"

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
    .filter((option) => option.name.trim() !== "" && option.value.trim() !== "")
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

/**
 * Builds one picker group per workspace font collection, each listing that
 * collection's enabled families. Used by the font family pickers so collections
 * render as separated groups.
 */
function buildFontCollectionFamilyGroups(
  workspace: Workspace,
): PropertyPickerOption[][] {
  return workspaceFontCollectionService
    .collectWorkspaceFamilyGroups(workspace)
    .map((group) =>
      group.map((family) => ({
        name: family.name,
        value: family.stack ?? family.name,
      })),
    )
    .filter((group) => group.length > 0)
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

  const fitOptions = presetOptions.filter(
    (option) => option.value === Resize.FIT,
  )
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

/**
 * Collapses a shorthand or compound value (margin, padding, border, ...) to a
 * single representative sub-value when all present sub-values resolve to the
 * same string. Atomic values are returned as-is. Mixed values return null.
 */
function resolveAtomicValue(
  value: unknown,
): { type: ValueType; value?: unknown } | null {
  if (!value || typeof value !== "object") {
    return null
  }
  if ("type" in value) {
    return value as { type: ValueType; value?: unknown }
  }

  const subValues = Object.values(value).filter(
    (subValue): subValue is object =>
      typeof subValue === "object" && subValue !== null,
  )
  if (subValues.length === 0) {
    return null
  }

  const strings = subValues.map((subValue) => {
    try {
      return stringifyValue(subValue as never)
    } catch {
      return undefined
    }
  })
  const first = strings[0]
  if (first === undefined || !strings.every((entry) => entry === first)) {
    return null
  }

  const representative = subValues[0]
  return representative && "type" in representative
    ? (representative as { type: ValueType; value?: unknown })
    : null
}

function getCurrentValueOption(
  property: { value: unknown },
  theme?: Theme,
): PropertyPickerOption | null {
  const atomic = resolveAtomicValue(property.value)
  if (
    !atomic ||
    (atomic.type !== ValueType.EXACT && atomic.type !== ValueType.OPTION)
  ) {
    return null
  }

  const raw = "value" in atomic ? atomic.value : null
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

    if (isRGBObject(raw)) {
      const colorString = RGBObjectToString(raw)
      return { value: colorString, name: colorString }
    }

    if (isLCHObject(raw)) {
      const colorString = LCHObjectToString(raw)
      return { value: colorString, name: colorString }
    }

    if ("value" in raw && "unit" in raw) {
      const dimensionString = `${(raw as { value: number }).value}${(raw as { unit: string }).unit}`
      return { value: dimensionString, name: dimensionString }
    }
  }

  return null
}

/**
 * Inserts the active exact value as its own group directly below the
 * Default/Inherit group, so it renders between separators as the current
 * selection. Skips values already represented by a preset or theme option.
 */
function insertCurrentValueGroup(
  groups: PropertyPickerOption[][],
  input: PropertyPickerInput,
): PropertyPickerOption | undefined {
  const currentValueOption = getCurrentValueOption(
    { value: input.value },
    input.theme,
  )
  if (!currentValueOption) {
    return undefined
  }

  const alreadyListed = groups.some((group) =>
    group.some((option) => option.value === currentValueOption.value),
  )
  if (alreadyListed) {
    return undefined
  }

  groups.splice(1, 0, [currentValueOption])
  return currentValueOption
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

/** Custom token ordinal (`custom3` -> 3), or -1 when the key is a reserved token. */
function customTokenIndex(key: string): number {
  const id = key.startsWith("@") ? (key.split(".").pop() ?? key) : key
  const match = /^custom(\d+)$/.exec(id)
  return match ? parseInt(match[1]!, 10) : -1
}

/**
 * Keeps reserved tokens in their existing order and appends custom tokens last,
 * sorted by their `customN` index. Mirrors how custom swatches list after the
 * standard palette, so a named custom token like "Humongous" lands at the end.
 */
function sortThemeKeysCustomLast(themeKeys: string[]): string[] {
  const reserved = themeKeys.filter((key) => customTokenIndex(key) < 0)
  const custom = themeKeys
    .filter((key) => customTokenIndex(key) >= 0)
    .sort((a, b) => customTokenIndex(a) - customTokenIndex(b))
  return [...reserved, ...custom]
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
  const sortedKeys = sortThemeKeysCustomLast(themeKeys)

  return sortedKeys.map((key) => {
    const themeKey = key.startsWith("@") ? key : `@${themeSection}.${key}`
    return {
      value: themeKey,
      name: getThemeValueName(themeKey, theme),
    }
  })
}

function buildThemeOptions(
  schema: PropertySchema,
  theme: Theme,
): PropertyPickerOption[] {
  const options: PropertyPickerOption[] = []

  if (schema.themeCategoricalKeys) {
    const themeSection = getThemeSectionFromSchema(schema, theme, "categorical")
    if (themeSection) {
      options.push(
        ...createThemeOptions(
          schema.themeCategoricalKeys(theme),
          themeSection,
          theme,
        ),
      )
    }
  }

  if (schema.themeOrdinalKeys) {
    const themeSection = getThemeSectionFromSchema(schema, theme, "ordinal")
    if (themeSection) {
      options.push(
        ...createThemeOptions(
          schema.themeOrdinalKeys(theme),
          themeSection,
          theme,
        ),
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

  // Font family lists the theme slots (Primary/Secondary) first as their own group,
  // then a separated group of font-collection families. Other properties keep theme
  // options last.
  const isFontFamily = schema.name === "fontFamily"
  const themeOptions = input.theme ? buildThemeOptions(schema, input.theme) : []

  if (isFontFamily && themeOptions.length > 0) {
    groups.push(themeOptions)
  }

  const presetOptions = buildPresetOptions(schema, input.theme, input.workspace)
  if (presetOptions.length > 0) {
    groups.push(...groupPresetOptions(schema, presetOptions))
  }

  // Font families come from the workspace's font collection boards. Each
  // collection is its own separated group; theme slots stay above (lines 538-540).
  if (isFontFamily && input.workspace) {
    groups.push(...buildFontCollectionFamilyGroups(input.workspace))
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

  if (!isFontFamily && themeOptions.length > 0) {
    groups.push(themeOptions)
  }

  // Place the active exact value in its own separated group directly below
  // Default/Inherit so it reads as the current selection.
  const currentValueOption = insertCurrentValueGroup(groups, input)

  return {
    options: groups,
    hasCurrentValue: currentValueOption !== undefined,
    currentValueOption,
  }
}

/**
 * Maps one theme look id to a picker option, or null when the section entry has
 * no usable name.
 */
function themeLookPickerOption(
  parentKey: string,
  section: Record<string, unknown>,
  id: string,
): PropertyPickerOption | null {
  const entry = section[id]
  if (!entry || typeof entry !== "object" || !("name" in entry)) {
    return null
  }
  return {
    value: getThemeLookPickerToken(parentKey, id),
    name: String((entry as Record<string, unknown>).name),
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
    const presetOptions = buildPresetOptions(
      schema,
      input.theme,
      input.workspace,
    )
    if (presetOptions.length > 0) {
      groups.push(...groupPresetOptions(schema, presetOptions))
    }
  }

  const theme = input.theme
  const section = theme ? getThemeLookSection(theme, parentKey) : undefined

  if (!theme || !section || typeof section !== "object") {
    const currentValueOption = insertCurrentValueGroup(groups, input)
    return {
      options: groups,
      hasCurrentValue: currentValueOption !== undefined,
      currentValueOption,
    }
  }

  const lookSection = getBuiltInLookSectionForPropertyKey(parentKey)
  const presetGroup: PropertyPickerOption[] =
    lookSection === null
      ? []
      : listThemeLookIds(theme, lookSection)
          .map((id) =>
            themeLookPickerOption(
              parentKey,
              section as Record<string, unknown>,
              id,
            ),
          )
          .filter((option): option is PropertyPickerOption => option !== null)

  if (presetGroup.length > 0) {
    groups.push(presetGroup)
  }

  const currentValueOption = insertCurrentValueGroup(groups, input)

  return {
    options: groups,
    hasCurrentValue: currentValueOption !== undefined,
    currentValueOption,
  }
}

/** Drops the synthetic `Default`/`Inherit` entries so theme tokens list only real choices. */
function stripDefaultInherit(
  groups: PropertyPickerOption[][],
): PropertyPickerOption[][] {
  return groups
    .map((group) =>
      group.filter(
        (option) => option.value !== "" && option.value !== "inherit",
      ),
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

  // The theme font slots pick from the workspace's font collection boards, like the
  // node-level `fontFamily` picker. Local families store their CSS token; remote
  // families store their name.
  if (
    input.path === "fontFamily.primary" ||
    input.path === "fontFamily.secondary"
  ) {
    const familyGroups = buildFontCollectionFamilyGroups(input.workspace)
    if (familyGroups.length > 0) {
      return { options: familyGroups, hasCurrentValue: false }
    }
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

/**
 * Builds picker options for the background parent combo. Background layers are
 * typed by an explicit `kind` rather than theme presets, so the menu reads
 * Default / Inherit / --- / None / --- / Color / Image / Gradient.
 */
function buildBackgroundKindPickerOptions(): PropertyPickerResult {
  const schema = getPropertySchema("backgroundKind")
  const groups: PropertyPickerOption[][] = []
  groups.push(
    schema
      ? buildDefaultOptions(schema)
      : [
          { value: "", name: "Default" },
          { value: "inherit", name: "Inherit" },
        ],
  )
  groups.push([{ value: "none", name: "None" }])
  groups.push([
    { value: "color", name: "Color" },
    { value: "image", name: "Image" },
    { value: "gradient", name: "Gradient" },
  ])
  return { options: groups, hasCurrentValue: false }
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
 * the active theme, and workspace context.
 */
export function getPropertyPickerOptions(
  input: PropertyPickerInput,
): PropertyPickerResult {
  if (
    input.path === "background" ||
    input.path === "background.preset" ||
    /^background\.\d+\.(preset|kind)$/.test(input.path)
  ) {
    return buildBackgroundKindPickerOptions()
  }

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
    return buildHarmonyPickerOptions()
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
