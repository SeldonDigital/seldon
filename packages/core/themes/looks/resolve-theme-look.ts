import { ValueType, type Theme } from "@seldon/core"
import {
  BUILT_IN_LOOK_SECTIONS,
  type BuiltInLookSection,
  getBuiltInLookSectionForPropertyKey,
  getBuiltInLookId,
  getBuiltInLookToken,
  isBuiltInLookSection,
} from "./built-in-looks"

export type ThemeLookPreset = {
  name: string
  parameters?: Record<string, unknown>
}

export function isThemeLookPreset(value: unknown): value is ThemeLookPreset {
  return !!(
    value &&
    typeof value === "object" &&
    "name" in value &&
    typeof (value as ThemeLookPreset).name === "string"
  )
}

export function parseThemeLookRef(
  value: unknown,
): { section: BuiltInLookSection; id: string } | null {
  if (typeof value !== "string" || !value.startsWith("@")) {
    return null
  }
  const path = value.slice(1)
  const dot = path.indexOf(".")
  if (dot <= 0) {
    return null
  }
  const section = path.slice(0, dot)
  const id = path.slice(dot + 1)
  if (!isBuiltInLookSection(section) || !id) {
    return null
  }
  return { section, id }
}

export function themeLookRefIsValid(
  value: unknown,
  theme?: Theme,
  expectedSection?: BuiltInLookSection,
): boolean {
  const parsed = parseThemeLookRef(value)
  if (!parsed || !theme) {
    return false
  }
  if (expectedSection && parsed.section !== expectedSection) {
    return false
  }
  const section = (theme as Record<string, unknown>)[parsed.section]
  if (!section || typeof section !== "object") {
    return false
  }
  return parsed.id in section
}

export function validateThemeLookPresetRef(
  section: BuiltInLookSection,
  value: unknown,
  theme?: Theme,
): boolean {
  return themeLookRefIsValid(value, theme, section)
}

export function listThemeLookIds(
  theme: Theme,
  section: BuiltInLookSection,
): string[] {
  const themeSection = (theme as Record<string, unknown>)[section]
  if (!themeSection || typeof themeSection !== "object") {
    return []
  }
  const ids = Object.keys(themeSection)
  const builtInId = getBuiltInLookId(section)
  if (!ids.includes(builtInId)) {
    return ids
  }
  return [builtInId, ...ids.filter((id) => id !== builtInId)]
}

export function getThemeLookSection(
  theme: Theme,
  propertyKey: string,
): Record<string, unknown> | null {
  const sectionKey = getBuiltInLookSectionForPropertyKey(propertyKey)
  if (!sectionKey) {
    return null
  }
  const section = (theme as Record<string, unknown>)[sectionKey]
  if (!section || typeof section !== "object") {
    return null
  }
  return section as Record<string, unknown>
}

export function resolveThemeLook(
  theme: Theme,
  propertyKey: string,
  tokenOrName: string,
): ThemeLookPreset | null {
  const section = getThemeLookSection(theme, propertyKey)
  if (!section) {
    return null
  }

  const parsed = parseThemeLookRef(tokenOrName)
  if (parsed) {
    const cell = section[parsed.id]
    return isThemeLookPreset(cell) ? cell : null
  }

  for (const cell of Object.values(section)) {
    if (isThemeLookPreset(cell) && cell.name === tokenOrName) {
      return cell
    }
  }

  return null
}

export function getThemeLookPickerToken(
  propertyKey: string,
  lookId: string,
): string {
  const sectionKey = getBuiltInLookSectionForPropertyKey(propertyKey)
  if (!sectionKey) {
    return `@${propertyKey}.${lookId}`
  }
  return `@${sectionKey}.${lookId}`
}

export function isBuiltInClearedLookToken(
  propertyKey: string,
  presetValue: unknown,
): boolean {
  const sectionKey = getBuiltInLookSectionForPropertyKey(propertyKey)
  if (!sectionKey) {
    return false
  }
  const parsed = parseThemeLookRef(presetValue)
  if (!parsed || parsed.section !== sectionKey) {
    return false
  }
  return parsed.id === getBuiltInLookId(sectionKey)
}

export function isThemeLookPresetSchemaName(schemaName: string): boolean {
  return BUILT_IN_LOOK_SECTIONS.some(
    (section) => schemaName === `${section}Preset`,
  )
}

export function resolveBuiltInLookApplyName(
  propertyKey: string,
  preset: string,
): string | null {
  const sectionKey = getBuiltInLookSectionForPropertyKey(propertyKey)
  if (!sectionKey) {
    return null
  }
  if (preset === "" || preset === "Default" || preset === "unset") {
    return null
  }
  if (sectionKey === "font") {
    if (preset === "Normal" || preset === getBuiltInLookToken("font")) {
      return "Normal"
    }
    return null
  }
  if (preset === "None" || preset === getBuiltInLookToken(sectionKey)) {
    return "None"
  }
  return null
}

export function readPresetThemeLookRef(layer: Record<string, unknown>): string | null {
  const preset = layer.preset
  if (
    preset &&
    typeof preset === "object" &&
    "type" in preset &&
    preset.type === ValueType.THEME_CATEGORICAL &&
    "value" in preset &&
    typeof preset.value === "string"
  ) {
    return preset.value
  }
  return null
}
