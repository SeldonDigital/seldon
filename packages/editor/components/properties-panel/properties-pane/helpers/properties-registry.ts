import { getPropertyCategory } from "@seldon/core/properties/schemas"
import { IconAlignValue } from "@components/icons/values/Align"
import { IconBackgroundColorValue } from "@components/icons/values/BackgroundColor"
import { IconBorderColorValue } from "@components/icons/values/BorderColor"
import { IconBorderStyleValue } from "@components/icons/values/BorderStyle"
import { IconBrightnessValue } from "@components/icons/values/Brightness"
import { IconCornerValue } from "@components/icons/values/Corners"
import { IconDisplayShowValue } from "@components/icons/values/DisplayShow"
import { IconFontFamily } from "@components/icons/values/FontFamily"
import { IconFontSizeValue } from "@components/icons/values/FontSize"
import { IconFontWeightValue } from "@components/icons/values/FontWeight"
import { IconGapValue } from "@components/icons/values/Gap"
import { IconGradientValue } from "@components/icons/values/Gradient"
import { IconHeightValue } from "@components/icons/values/Height"
import { IconImageValue } from "@components/icons/values/Image"
import { IconImageFit } from "@components/icons/values/ImageFit"
import { IconInputTypeValue } from "@components/icons/values/InputType"
import { IconLetterSpacingValue } from "@components/icons/values/LetterSpacing"
import { IconLineHeightValue } from "@components/icons/values/LineHeight"
import { IconMarginSideValue } from "@components/icons/values/Margin"
import { IconOpacityValue } from "@components/icons/values/Opacity"
import { IconPaddingSideValue } from "@components/icons/values/Padding"
import { IconRadioUncheckedValue } from "@components/icons/values/RadioUnchecked"
import { IconRotationValue } from "@components/icons/values/Rotation"
import { IconShadowValue } from "@components/icons/values/Shadow"
import { IconSizeValue } from "@components/icons/values/Size"
import { IconTextValue } from "@components/icons/values/Text"
import { IconTextAlignValue } from "@components/icons/values/TextAlign"
import { IconTextDecoration } from "@components/icons/values/TextDecoration"
import { IconTokenValue } from "@components/icons/values/Token"
import { IconWidthValue } from "@components/icons/values/Width"
import { IconWrapValue } from "@components/icons/values/Wrap"

// Icon mapping from string names to React components
export const ICON_MAP: Record<string, React.ComponentType> = {
  IconAlignValue,
  IconBackgroundColorValue,
  IconBorderColorValue,
  IconBorderStyleValue,
  IconBrightnessValue,
  IconCornerValue,
  IconDisplayShowValue,
  IconFontFamily,
  IconFontSizeValue,
  IconFontWeightValue,
  IconGapValue,
  IconGradientValue,
  IconHeightValue,
  IconImageFit,
  IconImageValue,
  IconInputTypeValue,
  IconLetterSpacingValue,
  IconLineHeightValue,
  IconMarginSideValue,
  IconOpacityValue,
  IconPaddingSideValue,
  IconRadioUncheckedValue,
  IconRotationValue,
  IconShadowValue,
  IconSizeValue,
  IconTextAlignValue,
  IconTextDecoration,
  IconTextValue,
  IconTokenValue,
  IconWidthValue,
  IconWrapValue,
}

export type ControlType = "combo" | "menu" | "number" | "text" | "error"

export interface PropertyOption {
  value: string
  name: string
}

export interface PropertyRegistryEntry {
  label?: string
  icon: string
  control?: ControlType
  subProperties?: {
    [subPropertyKey: string]: PropertyRegistryEntry
  }
}

export interface PropertyRegistry {
  [propertyKey: string]: PropertyRegistryEntry
}

/**
 * Runtime UI params for property registry
 * These define presentation-only concerns and are deep-merged with core schemas at runtime
 */
const UI_OVERRIDES: PropertyRegistry = {
  // ========================================
  // 1. ATTRIBUTES PROPERTIES
  // ========================================
  content: {
    icon: "IconTextValue",
    control: "text",
  },
  altText: {
    icon: "IconTextValue",
    control: "text",
  },
  ariaLabel: {
    icon: "IconTextValue",
    control: "text",
  },
  ariaHidden: {
    icon: "IconRadioUncheckedValue",
    control: "menu",
  },
  placeholder: {
    icon: "IconTextValue",
    control: "text",
  },
  checked: {
    icon: "IconRadioUncheckedValue",
    control: "menu",
  },
  inputType: {
    icon: "IconInputTypeValue",
    control: "menu",
  },
  htmlElement: {
    label: "HTML Element",
    icon: "IconTokenValue",
    control: "menu",
  },
  symbol: {
    icon: "IconTokenValue",
    control: "combo",
  },
  source: {
    icon: "IconImageValue",
    control: "text",
  },
  imageFit: {
    icon: "IconImageFit",
    control: "menu",
  },
  display: {
    icon: "IconDisplayShowValue",
    control: "menu",
  },
  size: {
    icon: "IconSizeValue",
    control: "combo",
  },
  buttonSize: {
    icon: "IconFontSizeValue",
    control: "combo",
  },

  // ========================================
  // 2. LAYOUT
  // ========================================
  direction: {
    icon: "IconAlignValue",
    control: "menu",
  },
  position: {
    icon: "IconTextValue",
    control: "text",
    subProperties: {
      top: {
        label: "Top",
        icon: "IconTextValue",
        control: "number",
      },
      right: {
        label: "Right",
        icon: "IconTextValue",
        control: "number",
      },
      bottom: {
        label: "Bottom",
        icon: "IconTextValue",
        control: "number",
      },
      left: {
        label: "Left",
        icon: "IconTextValue",
        control: "number",
      },
    },
  },
  orientation: {
    icon: "IconTokenValue",
    control: "menu",
  },
  align: {
    icon: "IconAlignValue",
    control: "menu",
  },
  cellAlign: {
    icon: "IconAlignValue",
    control: "menu",
  },
  width: {
    icon: "IconWidthValue",
    control: "combo",
  },
  height: {
    icon: "IconHeightValue",
    control: "combo",
  },
  screenWidth: {
    icon: "IconWidthValue",
    control: "combo",
  },
  screenHeight: {
    icon: "IconHeightValue",
    control: "combo",
  },
  margin: {
    icon: "IconMarginSideValue",
    control: "combo",
    subProperties: {
      top: {
        icon: "IconMarginSideValue",
        control: "combo",
      },
      right: {
        icon: "IconMarginSideValue",
        control: "combo",
      },
      bottom: {
        icon: "IconMarginSideValue",
        control: "combo",
      },
      left: {
        icon: "IconMarginSideValue",
        control: "combo",
      },
    },
  },
  padding: {
    icon: "IconPaddingSideValue",
    control: "combo",
    subProperties: {
      top: {
        icon: "IconPaddingSideValue",
        control: "combo",
      },
      right: {
        icon: "IconPaddingSideValue",
        control: "combo",
      },
      bottom: {
        icon: "IconPaddingSideValue",
        control: "combo",
      },
      left: {
        icon: "IconPaddingSideValue",
        control: "combo",
      },
    },
  },
  gap: {
    icon: "IconGapValue",
    control: "combo",
  },
  rotation: {
    icon: "IconRotationValue",
    control: "number",
  },
  wrapChildren: {
    icon: "IconWrapValue",
    control: "menu",
  },
  clip: {
    icon: "IconClipValue",
    control: "menu",
  },
  cursor: {
    icon: "IconTokenValue",
    control: "menu",
  },
  columns: {
    icon: "IconTokenValue",
    control: "number",
  },
  rows: {
    icon: "IconTokenValue",
    control: "number",
  },

  // ========================================
  // 3. APPEARANCE
  // ========================================
  color: {
    icon: "IconColorValue",
    control: "combo",
  },
  accentColor: {
    icon: "IconColorValue",
    control: "combo",
  },
  brightness: {
    icon: "IconBrightnessValue",
    control: "number",
  },
  opacity: {
    icon: "IconOpacityValue",
    control: "number",
  },
  background: {
    icon: "IconColorValue",
    subProperties: {
      preset: {
        icon: "IconColorValue",
        control: "combo",
      },
      color: {
        icon: "IconBackgroundColorValue",
        control: "combo",
      },
      brightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      opacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
      image: {
        icon: "IconImageValue",
        control: "text",
      },
      position: {
        icon: "IconTokenValue",
        control: "menu",
      },
      size: {
        icon: "IconTokenValue",
        control: "menu",
      },
      repeat: {
        icon: "IconTokenValue",
        control: "menu",
      },
    },
  },
  border: {
    icon: "IconBorderStyleValue",
    subProperties: {
      preset: {
        icon: "IconBorderStyleValue",
        control: "combo",
      },
      style: {
        icon: "IconBorderStyleValue",
        control: "menu",
      },
      color: {
        icon: "IconBorderColorValue",
        control: "combo",
      },
      width: {
        icon: "IconBorderStyleValue",
        control: "combo",
      },
      brightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      opacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
      // Individual border sides
      topStyle: {
        icon: "IconBorderStyleValue",
        control: "menu",
      },
      topColor: {
        icon: "IconBorderColorValue",
        control: "combo",
      },
      topWidth: {
        icon: "IconBorderStyleValue",
        control: "combo",
      },
      topBrightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      topOpacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
      rightStyle: {
        icon: "IconBorderStyleValue",
        control: "menu",
      },
      rightColor: {
        icon: "IconBorderColorValue",
        control: "combo",
      },
      rightWidth: {
        icon: "IconBorderStyleValue",
        control: "combo",
      },
      rightBrightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      rightOpacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
      bottomStyle: {
        icon: "IconBorderStyleValue",
        control: "menu",
      },
      bottomColor: {
        icon: "IconBorderColorValue",
        control: "combo",
      },
      bottomWidth: {
        icon: "IconBorderStyleValue",
        control: "combo",
      },
      bottomBrightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      bottomOpacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
      leftStyle: {
        icon: "IconBorderStyleValue",
        control: "menu",
      },
      leftColor: {
        icon: "IconBorderColorValue",
        control: "combo",
      },
      leftWidth: {
        icon: "IconBorderStyleValue",
        control: "combo",
      },
      leftBrightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      leftOpacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
    },
  },
  borderCollapse: {
    icon: "IconTokenValue",
    control: "menu",
  },
  corners: {
    icon: "IconCornerValue",
    control: "combo",
    subProperties: {
      topLeft: {
        icon: "IconCornerValue",
        control: "combo",
      },
      topRight: {
        icon: "IconCornerValue",
        control: "combo",
      },
      bottomRight: {
        icon: "IconCornerValue",
        control: "combo",
      },
      bottomLeft: {
        icon: "IconCornerValue",
        control: "combo",
      },
    },
  },

  // ========================================
  // 4. TYPOGRAPHY
  // ========================================
  font: {
    icon: "IconFontValue",
    subProperties: {
      preset: {
        icon: "IconFontValue",
        control: "combo",
      },
      family: {
        icon: "IconFontFamily",
        control: "combo",
      },
      style: {
        icon: "IconTokenValue",
        control: "menu",
      },
      weight: {
        icon: "IconFontWeightValue",
        control: "combo",
      },
      size: {
        icon: "IconFontSizeValue",
        control: "combo",
      },
      lineHeight: {
        icon: "IconLineHeightValue",
        control: "combo",
      },
      textCase: {
        icon: "IconTokenValue",
        control: "menu",
      },
    },
  },
  textAlign: {
    icon: "IconTextAlignValue",
    control: "menu",
  },
  letterSpacing: {
    icon: "IconLetterSpacingValue",
    control: "number",
  },
  textDecoration: {
    icon: "IconTextDecoration",
    control: "menu",
  },
  wrapText: {
    icon: "IconWrapValue",
    control: "menu",
  },
  lines: {
    icon: "IconLinesValue",
    control: "number",
  },

  // ========================================
  // 5. GRADIENTS
  // ========================================
  gradient: {
    icon: "IconGradientValue",
    subProperties: {
      preset: {
        icon: "IconGradientValue",
        control: "combo",
      },
      gradientType: {
        icon: "IconGradientValue",
        control: "menu",
      },
      angle: {
        icon: "IconTextValue",
        control: "number",
      },
      startColor: {
        icon: "IconColorValue",
        control: "combo",
      },
      startBrightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      startOpacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
      startPosition: {
        icon: "IconTextValue",
        control: "number",
      },
      endColor: {
        icon: "IconColorValue",
        control: "combo",
      },
      endBrightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      endOpacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
      endPosition: {
        icon: "IconTextValue",
        control: "number",
      },
    },
  },

  // ========================================
  // 6. EFFECTS
  // ========================================
  shadow: {
    icon: "IconShadowValue",
    subProperties: {
      preset: {
        icon: "IconShadowValue",
        control: "combo",
      },
      offsetX: {
        icon: "IconTokenValue",
        control: "number",
      },
      offsetY: {
        icon: "IconTokenValue",
        control: "number",
      },
      blur: {
        icon: "IconTokenValue",
        control: "combo",
      },
      spread: {
        icon: "IconTokenValue",
        control: "combo",
      },
      color: {
        icon: "IconColorValue",
        control: "combo",
      },
      brightness: {
        icon: "IconBrightnessValue",
        control: "number",
      },
      opacity: {
        icon: "IconOpacityValue",
        control: "number",
      },
    },
  },
  scroll: {
    icon: "IconTokenValue",
    control: "menu",
  },
  scrollbarStyle: {
    icon: "IconTokenValue",
    control: "menu",
  },
}

let __registryMemo: PropertyRegistry | null = null

function mapCategoryToType(
  category?: string,
): "atomic" | "compound" | "shorthand" {
  if (category === "compound") return "compound"
  if (category === "shorthand") return "shorthand"
  return "atomic"
}

function mergeEntry(
  base: PropertyRegistryEntry,
  override?: PropertyRegistryEntry,
): PropertyRegistryEntry {
  if (!override) return base
  const merged: PropertyRegistryEntry = {
    label: override.label ?? base.label,
    icon: override.icon ?? base.icon,
    control: override.hasOwnProperty("control")
      ? override.control
      : base.control,
  }
  if (base.subProperties || override.subProperties) {
    merged.subProperties = {}
    const keys = new Set<string>([
      ...Object.keys(base.subProperties ?? {}),
      ...Object.keys(override.subProperties ?? {}),
    ])
    keys.forEach((k) => {
      const b = base.subProperties?.[k]
      const o = override.subProperties?.[k]
      if (b || o) {
        merged.subProperties![k] = mergeEntry(
          b || (o as PropertyRegistryEntry),
          o,
        )
      }
    })
  }
  return merged
}

function buildBaseEntry(propertyKey: string): PropertyRegistryEntry {
  const category = getPropertyCategory(propertyKey)
  const type = mapCategoryToType(category)
  const override = UI_OVERRIDES[propertyKey]

  // Set default control based on property type, but only if override doesn't have subProperties without control
  const hasSubPropertiesWithoutControl =
    override?.subProperties && !override?.hasOwnProperty("control")
  const base: PropertyRegistryEntry = {
    icon: "IconTokenValue",
    control: hasSubPropertiesWithoutControl
      ? undefined
      : type === "atomic"
        ? "combo"
        : "text",
  }
  // For compound/shorthand, infer sub-properties from overrides first for order
  const overrideSub = override?.subProperties
  if (type === "compound" || type === "shorthand") {
    const subMap: Record<string, PropertyRegistryEntry> = {}
    if (overrideSub) {
      Object.keys(overrideSub).forEach((subKey) => {
        const subOverride = overrideSub[subKey]
        subMap[subKey] = {
          label: subOverride?.label,
          icon: subOverride?.icon ?? "IconTokenValue",
          control: subOverride?.control ?? "combo",
        }
      })
    }
    // Ensure any missing subprops exist at least as atomic controls; actual existence is ensured by flatten
    base.subProperties = Object.keys(subMap).length
      ? subMap
      : base.subProperties
  }
  return mergeEntry(base, override)
}

function getPropertyRegistry(): PropertyRegistry {
  if (__registryMemo) return __registryMemo
  const result: PropertyRegistry = {}
  // Seed from UI overrides to keep ordering stable and ensure coverage
  for (const key of Object.keys(UI_OVERRIDES)) {
    result[key] = buildBaseEntry(key)
  }
  __registryMemo = result
  return result
}

// Clear cache to ensure changes take effect
__registryMemo = null

export const PROPERTY_REGISTRY: PropertyRegistry = getPropertyRegistry()

// Force cache clear for the new changes
clearPropertyRegistryCache()

export function clearPropertyRegistryCache(): void {
  __registryMemo = null
}

export function getPropertyRegistryEntry(
  propertyPath: string,
): PropertyRegistryEntry | undefined {
  const parts = propertyPath.split(".")
  let current: PropertyRegistryEntry | undefined = PROPERTY_REGISTRY[parts[0]]

  for (let i = 1; i < parts.length && current; i++) {
    current = current.subProperties?.[parts[i]]
  }

  return current
}
