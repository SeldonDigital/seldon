import { Unit } from "../../properties/constants/shared/units"
import { TokenType } from "../constants"
import type {
  StockTheme,
  ThemeMetadata,
  ThemePipelineInput,
} from "../types/theme"
import {
  BORDER_WIDTH_OPTIONS,
  type BorderWidthOption,
} from "../values/shared/option/theme-border-width-option"
import { parseColorspaceLiteral } from "./colorspaces"
import { normalizeThemeSwatchParameters } from "./normalize-theme-swatch-parameters"
import {
  normalizeThemeExactValue,
  normalizeThemeNumber,
} from "./normalize-theme-value"

/**
 * Normalizes theme values before palette completion. Accepts `StockTheme` or complete `Theme`-shaped input.
 * Coerces missing {@link TokenType} tags where applicable.
 */
function isThemePipelineInput(
  theme: ThemePipelineInput | { [key: string]: unknown },
): theme is ThemePipelineInput {
  return (
    typeof theme === "object" &&
    theme !== null &&
    ("metadata" in theme || "id" in theme) &&
    "modulation" in theme &&
    "colorHarmony" in theme &&
    typeof theme.modulation === "object" &&
    theme.modulation !== null &&
    typeof theme.colorHarmony === "object" &&
    theme.colorHarmony !== null
  )
}

/** Returns `type` only if it is a canonical {@link TokenType} string. */
function normalizeTokenType(type: unknown): TokenType | undefined {
  if (
    type === TokenType.MODULATED ||
    type === TokenType.EXACT ||
    type === TokenType.SWATCH ||
    type === TokenType.FONT_FAMILY ||
    type === TokenType.OPTION ||
    type === TokenType.LOOK ||
    type === TokenType.DYNAMIC_SWATCH ||
    type === TokenType.COMPUTED
  ) {
    return type
  }
  return undefined
}

export function normalizeThemeInput(
  theme: ThemePipelineInput | { [key: string]: unknown },
): ThemePipelineInput {
  if (!isThemePipelineInput(theme)) {
    throw new Error("Theme must have modulation and colorHarmony properties")
  }

  const modulation = theme.modulation as StockTheme["modulation"]
  const colorHarmony = theme.colorHarmony as StockTheme["colorHarmony"]

  const normalized = {
    ...theme,
    metadata: normalizeMetadata(theme),
    modulation: {
      ...modulation,
      type: TokenType.COMPUTED,
      parameters: {
        ...modulation.parameters,
        baseFontSize: normalizeThemeNumber(modulation.parameters.baseFontSize),
        baseSize: normalizeThemeNumber(modulation.parameters.baseSize),
      },
    },
    colorHarmony: {
      ...colorHarmony,
      type: TokenType.COMPUTED,
      parameters: {
        ...colorHarmony.parameters,
        baseColor: parseColorspaceLiteral(colorHarmony.parameters.baseColor),
        angle: normalizeThemeNumber(colorHarmony.parameters.angle),
        step: normalizeThemeNumber(colorHarmony.parameters.step),
        whitePoint: normalizeThemeNumber(colorHarmony.parameters.whitePoint),
        grayPoint: normalizeThemeNumber(colorHarmony.parameters.grayPoint),
        blackPoint: normalizeThemeNumber(colorHarmony.parameters.blackPoint),
        bleed: normalizeThemeNumber(colorHarmony.parameters.bleed),
      },
    },
    displayMode: normalizeDisplayMode(theme),
    matchColor: normalizeComputedGroup(
      theme.matchColor as StockTheme["matchColor"],
    ),
    highContrast: {
      ...(theme.highContrast as StockTheme["highContrast"]),
      type: TokenType.COMPUTED,
      parameters: {
        ...(theme.highContrast as StockTheme["highContrast"]).parameters,
        contrastRatio: normalizeThemeNumber(
          (theme.highContrast as StockTheme["highContrast"]).parameters
            .contrastRatio,
        ),
      },
    },
    opticalPadding: {
      ...(theme.opticalPadding as StockTheme["opticalPadding"]),
      type: TokenType.COMPUTED,
      parameters: {
        leftRhythm: normalizeThemeNumber(
          (theme.opticalPadding as StockTheme["opticalPadding"]).parameters
            .leftRhythm,
        ),
        rightRhythm: normalizeThemeNumber(
          (theme.opticalPadding as StockTheme["opticalPadding"]).parameters
            .rightRhythm,
        ),
        verticalRhythm: normalizeThemeNumber(
          (theme.opticalPadding as StockTheme["opticalPadding"]).parameters
            .verticalRhythm,
        ),
      },
    },
    autoFit: {
      ...(theme.autoFit as StockTheme["autoFit"]),
      type: TokenType.COMPUTED,
      parameters: {
        factor: normalizeThemeNumber(
          (theme.autoFit as StockTheme["autoFit"]).parameters.factor,
        ),
      },
    },
    fontFamily: normalizeFontFamily(
      theme.fontFamily as StockTheme["fontFamily"],
    ),
    iconSet: normalizeIconSet(theme as StockTheme),
    swatch: normalizeSwatches(theme.swatch as Record<string, unknown>),
    borderWidth: normalizeBorderWidth(
      theme.borderWidth as StockTheme["borderWidth"],
    ),
    size: normalizeScaleRecord(theme.size),
    blur: normalizeScaleRecord(theme.blur),
    margin: normalizeScaleRecord(theme.margin),
    padding: normalizeScaleRecord(theme.padding),
    gap: normalizeScaleRecord(theme.gap),
    corners: normalizeScaleRecord(theme.corners),
    fontSize: normalizeScaleRecord(theme.fontSize),
    dimension: normalizeScaleRecord(theme.dimension),
    spread: normalizeScaleRecord(theme.spread),
    fontWeight: normalizeNumberRecord(theme.fontWeight),
    lineHeight: normalizeNumberRecord(theme.lineHeight),
    font: normalizeLookRecord(theme.font),
    shadow: normalizeLookRecord(theme.shadow),
    border: normalizeLookRecord(theme.border),
    gradient: normalizeLookRecord(theme.gradient),
    scrollbar: normalizeLookRecord(theme.scrollbar),
  }

  if ("id" in normalized && normalized.id !== normalized.metadata.id) {
    normalized.id = normalized.metadata.id
  }

  return normalized as ThemePipelineInput
}

function normalizeMetadata(
  theme: ThemePipelineInput | { [key: string]: unknown },
): ThemeMetadata {
  const withMetadata = theme as { metadata?: Partial<ThemeMetadata> }
  if (withMetadata.metadata?.id) {
    return {
      id: withMetadata.metadata.id as ThemeMetadata["id"],
      name:
        withMetadata.metadata.name ?? (theme as { name?: string }).name ?? "",
      description:
        withMetadata.metadata.description ??
        (theme as { description?: string }).description ??
        "",
      intent:
        withMetadata.metadata.intent ??
        (theme as { intent?: string }).intent ??
        "",
    }
  }

  const legacy = theme as {
    id?: string
    name?: string
    description?: string
    intent?: string
  }
  return {
    id: (legacy.id ?? "seldon") as ThemeMetadata["id"],
    name: legacy.name ?? "",
    description: legacy.description ?? "",
    intent: legacy.intent ?? "",
  }
}

type FontFamilySlot = StockTheme["fontFamily"]["parameters"]["primary"]

function normalizeFontFamily(
  ff: StockTheme["fontFamily"],
): StockTheme["fontFamily"] {
  function slot(v: FontFamilySlot | string): FontFamilySlot {
    if (typeof v === "string") {
      return { type: TokenType.FONT_FAMILY, parameters: v }
    }
    if (
      v &&
      typeof v === "object" &&
      "parameters" in v &&
      typeof v.parameters === "string"
    ) {
      const intent =
        "intent" in v && typeof v.intent === "string" ? v.intent : undefined
      return {
        type: TokenType.FONT_FAMILY,
        parameters: v.parameters,
        ...(intent !== undefined ? { intent } : {}),
      }
    }
    return { type: TokenType.FONT_FAMILY, parameters: "" }
  }
  const params = ff.parameters
  return {
    ...ff,
    type: TokenType.COMPUTED,
    parameters: {
      primary: slot(params.primary as FontFamilySlot | string),
      secondary: slot(params.secondary as FontFamilySlot | string),
    },
  }
}

/** Pass-through normalizer for a computed group: force `type`, keep parameters. */
function normalizeComputedGroup<T extends { parameters: unknown }>(
  group: T,
): T {
  return {
    ...group,
    type: TokenType.COMPUTED,
  }
}

/**
 * Normalizes the `displayMode` group. Reads the group when present, and falls
 * back to the legacy `colorHarmony.parameters` fields for input saved before
 * `displayMode` existed, so an unmigrated theme still resolves a full group.
 */
function normalizeDisplayMode(
  theme: ThemePipelineInput | { [key: string]: unknown },
): StockTheme["displayMode"] {
  const displayMode = (theme as { displayMode?: { parameters?: unknown } })
    .displayMode
  const legacy =
    (theme.colorHarmony as { parameters?: Record<string, unknown> })
      ?.parameters ?? {}
  const source =
    (displayMode?.parameters as Record<string, unknown> | undefined) ?? legacy

  return {
    type: TokenType.COMPUTED,
    parameters: {
      mode: source.mode === "dark" ? "dark" : "light",
      chromaChange: normalizeThemeNumber(source.chromaChange ?? 0),
      lightnessChange: normalizeThemeNumber(source.lightnessChange ?? 0),
    },
  }
}

function normalizeIconSet(theme: StockTheme): StockTheme["iconSet"] {
  const iconSet =
    (theme as StockTheme & { icon?: StockTheme["iconSet"] }).iconSet ??
    (theme as StockTheme & { icon?: StockTheme["iconSet"] }).icon
  if (!iconSet) {
    throw new Error("Theme must define iconSet")
  }
  return iconSet
}

function normalizeSwatches(
  swatch: Record<string, unknown>,
): StockTheme["swatch"] {
  const out: Record<string, unknown> = {}
  for (const [key, cell] of Object.entries(swatch)) {
    if (!cell || typeof cell !== "object") {
      out[key] = cell
      continue
    }
    const c = cell as Record<string, unknown>
    if ("kind" in c && c.kind === "dynamic" && "role" in c) {
      out[key] = {
        type: TokenType.DYNAMIC_SWATCH,
        role: c.role,
        ...(typeof c.intent === "string" ? { intent: c.intent } : {}),
      }
      continue
    }
    if (normalizeTokenType(c.type) === TokenType.DYNAMIC_SWATCH) {
      out[key] = {
        type: TokenType.DYNAMIC_SWATCH,
        role: c.role,
        ...(typeof c.intent === "string" ? { intent: c.intent } : {}),
      }
      continue
    }
    if (normalizeTokenType(c.type) === TokenType.SWATCH && "parameters" in c) {
      out[key] = {
        type: TokenType.SWATCH,
        ...(typeof c.name === "string" ? { name: c.name } : {}),
        ...(typeof c.intent === "string" ? { intent: c.intent } : {}),
        parameters: normalizeThemeSwatchParameters(c.parameters),
      }
      continue
    }
    out[key] = cell
  }
  return out as StockTheme["swatch"]
}

function normalizeBorderWidth(
  bw: StockTheme["borderWidth"],
): StockTheme["borderWidth"] {
  const next = { ...bw } as Record<string, unknown>
  const isBorderWidthOption = (v: unknown): v is BorderWidthOption =>
    typeof v === "string" &&
    (BORDER_WIDTH_OPTIONS as readonly string[]).includes(v)

  for (const key of Object.keys(next)) {
    const item = next[key] as Record<string, unknown> | undefined
    if (!item || typeof item !== "object") continue
    if (
      normalizeTokenType(item.type) === TokenType.OPTION &&
      isBorderWidthOption(item.parameters)
    ) {
      next[key] = {
        type: TokenType.OPTION,
        ...(typeof item.name === "string" ? { name: item.name } : {}),
        ...(typeof item.intent === "string" ? { intent: item.intent } : {}),
        parameters: item.parameters,
      }
      continue
    }
    if (!("type" in item) && isBorderWidthOption(item.parameters)) {
      next[key] = {
        type: TokenType.OPTION,
        ...(typeof item.name === "string" ? { name: item.name } : {}),
        ...(typeof item.intent === "string" ? { intent: item.intent } : {}),
        parameters: item.parameters,
      }
      continue
    }
    if (
      normalizeTokenType(item.type) === TokenType.MODULATED ||
      ("parameters" in item &&
        item.parameters &&
        typeof item.parameters === "object" &&
        "step" in (item.parameters as object))
    ) {
      const params = item.parameters as { step?: unknown }
      next[key] = {
        ...item,
        type: TokenType.MODULATED,
        parameters: {
          ...params,
          step: normalizeThemeNumber(params.step),
        },
      }
      continue
    }
    next[key] = item
  }
  return next as StockTheme["borderWidth"]
}

function normalizeLookRecord<T extends Record<string, unknown>>(record: T): T {
  const normalized = {} as T
  for (const key in record) {
    const item = record[key] as Record<string, unknown>
    if (
      item &&
      typeof item === "object" &&
      "parameters" in item &&
      item.type !== TokenType.LOOK
    ) {
      normalized[key] = { ...item, type: TokenType.LOOK } as T[Extract<
        keyof T,
        string
      >]
    } else {
      normalized[key] = item as T[Extract<keyof T, string>]
    }
  }
  return normalized
}

function normalizeScaleRecord<T extends Record<string, unknown>>(record: T): T {
  const normalized = {} as T
  for (const key in record) {
    const item = record[key] as
      | {
          parameters?: { step?: unknown } | unknown
          name?: string
          type?: TokenType
        }
      | undefined
    if (item && typeof item === "object") {
      // An explicit `type: EXACT` wins over a stale `step`. Entry overrides
      // deep-merge onto the stock template, so a reserved token that switches to
      // an exact length still carries the template's `step`; honoring the
      // explicit type lets it fall through to the exact branch below.
      if (
        item.type !== TokenType.EXACT &&
        "parameters" in item &&
        item.parameters &&
        typeof item.parameters === "object" &&
        "step" in (item.parameters as object) &&
        (item.parameters as { step?: unknown }).step !== undefined
      ) {
        const typed =
          normalizeTokenType(item.type) === TokenType.MODULATED
            ? item
            : { ...item, type: TokenType.MODULATED }
        const params = item.parameters as { step: unknown }
        normalized[key] = {
          ...typed,
          parameters: {
            ...params,
            step: normalizeThemeNumber(params.step),
          },
        } as T[Extract<keyof T, string>]
        continue
      }

      if ("parameters" in item && item.parameters !== undefined) {
        const typed =
          item.type === TokenType.EXACT
            ? item
            : { ...item, type: TokenType.EXACT }
        normalized[key] = {
          ...typed,
          parameters: normalizeThemeExactValue(
            (typed as { parameters: unknown }).parameters,
          ),
        } as T[Extract<keyof T, string>]
        continue
      }
    }

    normalized[key] = item as T[Extract<keyof T, string>]
  }
  return normalized
}

function normalizeNumberRecord<T extends Record<string, unknown>>(
  record: T,
): T {
  const normalized = {} as T
  for (const key in record) {
    const item = record[key] as
      | { parameters?: unknown; name?: string; type?: TokenType }
      | undefined
    if (
      item &&
      typeof item === "object" &&
      "parameters" in item &&
      item.parameters !== undefined
    ) {
      const raw = item as {
        parameters: unknown
        name?: string
        type?: TokenType
      }
      const inner = raw.parameters
      const n =
        inner &&
        typeof inner === "object" &&
        "value" in inner &&
        typeof (inner as { value: unknown }).value === "number"
          ? normalizeThemeNumber((inner as { value: number }).value)
          : normalizeThemeNumber(inner)
      normalized[key] = {
        ...raw,
        type: TokenType.EXACT,
        parameters: { unit: Unit.NUMBER, value: n },
      } as T[Extract<keyof T, string>]
    } else {
      normalized[key] = item as T[Extract<keyof T, string>]
    }
  }
  return normalized
}
