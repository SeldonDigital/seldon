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
    "core" in theme &&
    "color" in theme &&
    typeof theme.core === "object" &&
    theme.core !== null &&
    "fontSize" in theme.core &&
    "size" in theme.core &&
    typeof theme.color === "object" &&
    theme.color !== null &&
    "baseColor" in theme.color
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
    type === TokenType.DYNAMIC_SWATCH
  ) {
    return type
  }
  return undefined
}

export function normalizeThemeInput(
  theme: ThemePipelineInput | { [key: string]: unknown },
): ThemePipelineInput {
  if (!isThemePipelineInput(theme)) {
    throw new Error("Theme must have core and color properties")
  }

  const themeCore = theme.core
  const themeColor = theme.color

  const normalized = {
    ...theme,
    metadata: normalizeMetadata(theme),
    core: {
      ...themeCore,
      fontSize: normalizeThemeNumber(themeCore.fontSize),
      size: normalizeThemeNumber(themeCore.size),
    },
    color: {
      ...themeColor,
      baseColor: parseColorspaceLiteral(themeColor.baseColor),
      angle: normalizeThemeNumber(themeColor.angle),
      step: normalizeThemeNumber(themeColor.step),
      whitePoint: normalizeThemeNumber(themeColor.whitePoint),
      grayPoint: normalizeThemeNumber(themeColor.grayPoint),
      blackPoint: normalizeThemeNumber(themeColor.blackPoint),
      bleed: normalizeThemeNumber(themeColor.bleed),
      contrastRatio: normalizeThemeNumber(themeColor.contrastRatio),
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
    background: normalizeLookRecord(theme.background),
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

function normalizeFontFamily(
  ff: StockTheme["fontFamily"],
): StockTheme["fontFamily"] {
  function slot(
    v: StockTheme["fontFamily"]["primary"] | string,
  ): StockTheme["fontFamily"]["primary"] {
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
  return {
    primary: slot(ff.primary as StockTheme["fontFamily"]["primary"] | string),
    secondary: slot(
      ff.secondary as StockTheme["fontFamily"]["secondary"] | string,
    ),
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
      if (
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
