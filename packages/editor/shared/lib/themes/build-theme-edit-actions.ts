import {
  Colorspace,
  type Harmony,
  LOOK_FACETS,
  type LookFacetEntry,
  type Ratio,
  type ScaleTokenInput,
  type ScaleTokenSection,
  type ThemeCustomSwatchId,
  type ThemeFontId,
  type ThemeLineHeightId,
  Unit,
  type WorkspaceAction,
  isBridgedLookFacet,
  isLookSection,
} from "@seldon/core"
import {
  parseHSLString,
  toHSLString,
} from "@seldon/core/helpers/color/convert-color"
import { getOverrideAtPath } from "@seldon/core/workspace/helpers/general/override-paths"
import { getThemeOverrides } from "@seldon/core/workspace/helpers/themes/get-theme-overrides"
import { getThemeOverridePath } from "@seldon/core/workspace/helpers/themes/theme-override-paths"
import type { EntryThemeId, Workspace } from "@seldon/core/workspace/types"
import { serializeColor } from "../properties/serialize-color"
import { serializeValue } from "../properties/serialize-value"

/** Scale sections whose `.step` row edits route through `set_theme_scale_slot`. */
const SCALE_SLOT_SECTIONS = new Set<ScaleTokenSection>([
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "corners",
  "fontSize",
  "blur",
  "spread",
  "borderWidth",
])

function isScaleSlotSection(section: string): section is ScaleTokenSection {
  return SCALE_SLOT_SECTIONS.has(section as ScaleTokenSection)
}

/** Computed-section groups handled by the generic setter path. */
const COMPUTED_GENERIC_GROUPS = new Set([
  "matchColor",
  "highContrast",
  "opticalPadding",
  "autoFit",
])

function parseComputedGroupKey(
  key: string,
): { group: string; facet: string } | null {
  const [group, facet] = key.split(".")
  if (!group || !facet || !COMPUTED_GENERIC_GROUPS.has(group)) return null
  return { group, facet }
}

/** Parses a control value to a finite number, stripping unit suffixes. Null on failure. */
function parseNumericInput(raw: string): number | null {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === "object" && parsed !== null && "value" in parsed) {
      const n = Number((parsed as { value: unknown }).value)
      return Number.isFinite(n) ? n : null
    }
  } catch {
    // Not JSON; fall through to plain numeric parsing.
  }
  const cleaned = raw.replace(/\s*(%|px|rem|deg|em|vw|vh)\s*$/i, "").trim()
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

/**
 * Parses a scale `.step` row input. A bare number is a modulated step; a `px`
 * or `rem` suffix makes it an exact length. Returns null for unparseable input.
 */
function parseScaleInput(raw: string): ScaleTokenInput | null {
  const match = /^(-?\d*\.?\d+)\s*(px|rem)?$/i.exec(raw.trim())
  if (!match) return null
  const numeric = parseFloat(match[1]!)
  if (!Number.isFinite(numeric)) return null
  const unit = match[2]?.toLowerCase()
  if (unit === "px") {
    return { kind: "exact", parameters: { unit: Unit.PX, value: numeric } }
  }
  if (unit === "rem") {
    return { kind: "exact", parameters: { unit: Unit.REM, value: numeric } }
  }
  return { kind: "modulated", parameters: { step: numeric } }
}

function mergeRecord(
  base: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const next = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof next[key] === "object" &&
      next[key] !== null &&
      !Array.isArray(next[key])
    ) {
      next[key] = mergeRecord(
        next[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      )
    } else {
      next[key] = value
    }
  }
  return next
}

function setOverride(
  themeId: EntryThemeId,
  path: string,
  value: unknown,
): WorkspaceAction {
  return { type: "set_theme_override", payload: { themeId, path, value } }
}

/** Reads the current merged value at a path and writes it back with a patch merged in. */
function mergeOverride(
  themeId: EntryThemeId,
  workspace: Workspace,
  path: string,
  patch: Record<string, unknown>,
): WorkspaceAction | null {
  const entry = workspace.themes[themeId]
  if (!entry) return null
  const merged = getThemeOverrides(entry, workspace)
  const current =
    (getOverrideAtPath(merged as Record<string, unknown>, path) as
      | Record<string, unknown>
      | undefined) ?? {}
  return setOverride(themeId, path, mergeRecord(current, patch))
}

function scaleSlot(
  themeId: EntryThemeId,
  section: ScaleTokenSection,
  key: string,
  value: ScaleTokenInput,
): WorkspaceAction {
  return {
    type: "set_theme_scale_slot",
    payload: { themeId, section, key, value },
  }
}

/**
 * Maps one theme token panel edit to the workspace action(s) that apply it.
 * Ports the React `useThemeProperties` routing and `useThemeEntryEditor` path
 * builders into a pure function so both editors dispatch identical actions.
 * Returns an empty array when the input cannot be parsed.
 */
export function buildThemeEditActions(
  themeId: EntryThemeId,
  key: string,
  rawValue: string,
  workspace: Workspace,
): WorkspaceAction[] {
  const only = (action: WorkspaceAction | null): WorkspaceAction[] =>
    action ? [action] : []

  // Modulation group.
  if (key === "modulation.ratio") {
    return only(
      setOverride(
        themeId,
        "modulation.parameters.ratio",
        Number(rawValue) as Ratio,
      ),
    )
  }
  if (key === "modulation.baseFontSize") {
    const n = parseNumericInput(rawValue)
    return n === null
      ? []
      : only(setOverride(themeId, "modulation.parameters.baseFontSize", n))
  }
  if (key === "modulation.baseSize") {
    const n = parseNumericInput(rawValue)
    return n === null
      ? []
      : only(setOverride(themeId, "modulation.parameters.baseSize", n))
  }

  // Color harmony group.
  if (key === "colorHarmony.baseColor") {
    const hsl = parseHSLString(toHSLString(rawValue))
    return only(setOverride(themeId, "colorHarmony.parameters.baseColor", hsl))
  }
  if (key === "colorHarmony.harmony") {
    return only(
      setOverride(
        themeId,
        "colorHarmony.parameters.harmony",
        Number(rawValue) as Harmony,
      ),
    )
  }
  if (key.startsWith("colorHarmony.")) {
    const colorKey = key.split(".")[1]!
    const n = parseNumericInput(rawValue)
    if (n === null) return []
    return only(
      mergeOverride(themeId, workspace, "colorHarmony.parameters", {
        [colorKey]: n,
      }),
    )
  }

  // Display mode group.
  if (key === "displayMode.mode") {
    return only(
      setOverride(
        themeId,
        "displayMode.parameters.mode",
        rawValue === "dark" ? "dark" : "light",
      ),
    )
  }
  if (key.startsWith("displayMode.")) {
    const colorKey = key.split(".")[1]!
    const n = parseNumericInput(rawValue)
    if (n === null) return []
    return only(
      mergeOverride(themeId, workspace, "displayMode.parameters", {
        [colorKey]: n,
      }),
    )
  }

  // Font family group.
  if (key === "fontFamily.primary" || key === "fontFamily.secondary") {
    const slot = key.split(".")[1]!
    return only(setOverride(themeId, `fontFamily.parameters.${slot}`, rawValue))
  }

  // Other Computed-section groups: matchColor, highContrast, opticalPadding, autoFit.
  const computedFacet = parseComputedGroupKey(key)
  if (computedFacet) {
    const { group, facet } = computedFacet
    if (facet === "fallbackColor") {
      return only(
        setOverride(
          themeId,
          `${group}.parameters.${facet}`,
          serializeColor(rawValue),
        ),
      )
    }
    if (
      facet === "includeBrightness" ||
      facet === "includeOpacity" ||
      facet === "includeBleed"
    ) {
      return only(
        setOverride(
          themeId,
          `${group}.parameters.${facet}`,
          rawValue === "true" || rawValue === "On",
        ),
      )
    }
    const n = parseNumericInput(rawValue)
    if (n === null) return []
    return only(setOverride(themeId, `${group}.parameters.${facet}`, n))
  }

  // Swatch values are stored as HSL objects under `swatch.<id>.parameters.value`.
  if (key.startsWith("swatch.")) {
    const swatchId = key.split(".").slice(2).join(".") as ThemeCustomSwatchId
    const hsl = parseHSLString(toHSLString(rawValue))
    return only(
      mergeOverride(themeId, workspace, "swatch", {
        [swatchId]: { parameters: { colorspace: Colorspace.HSL, value: hsl } },
      }),
    )
  }

  // Scale `.step` rows. A bare number is a modulated step; `px`/`rem` makes the
  // token an exact length. `lineHeight` stays an exact unitless number.
  if (key.includes(".step")) {
    const parts = key.split(".")
    const section = parts[0]!
    const subKey = parts[1] as string

    if (section === "lineHeight") {
      return only(
        mergeOverride(
          themeId,
          workspace,
          `lineHeight.${subKey as ThemeLineHeightId}.parameters`,
          {
            step: Number(rawValue),
          },
        ),
      )
    }
    if (isScaleSlotSection(section)) {
      const parsed = parseScaleInput(rawValue)
      return parsed ? [scaleSlot(themeId, section, subKey, parsed)] : []
    }
  }

  // Font weight.
  if (key.startsWith("fontWeight.")) {
    const fontWeightKey = key.split(".")[1] as ThemeFontId
    return only(
      mergeOverride(themeId, workspace, `fontWeight.${fontWeightKey}`, {
        value: Number(rawValue),
      }),
    )
  }

  // Look facets (shadow, border, background, gradient, font, scrollbar).
  const [section, lookId, facet] = key.split(".")
  if (isLookSection(section) && lookId && facet) {
    const entry = (LOOK_FACETS[section] as readonly LookFacetEntry[]).find(
      (item) => item.facet === facet,
    )
    if (!entry) return []

    let serialized: unknown
    if (isBridgedLookFacet(entry)) {
      serialized = serializeValue(
        rawValue,
        undefined,
        undefined,
        entry.propertyKey,
      )
    } else if (entry.valueType === "color") {
      serialized = serializeColor(rawValue)
    } else if (entry.valueType === "boolean") {
      serialized = rawValue === "true" || rawValue === "On"
    } else {
      serialized = serializeValue(rawValue)
    }

    return only(
      mergeOverride(themeId, workspace, `${section}.${lookId}.parameters`, {
        [facet]: serialized,
      }),
    )
  }

  return []
}

/** Builds the reset action that drops one token's override, or null. */
export function buildThemeResetAction(
  themeId: EntryThemeId,
  key: string,
): WorkspaceAction | null {
  const path = getThemeOverridePath(key)
  if (!path) return null
  return { type: "reset_theme_override", payload: { themeId, path } }
}
