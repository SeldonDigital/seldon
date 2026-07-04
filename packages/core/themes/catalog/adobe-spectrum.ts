import {
  BorderStyle,
  BorderWidth,
  GradientType,
  TextCasing,
  Unit,
  ValueType,
} from "../../properties"
import { Colorspace, Harmony, Ratio, StockTheme, TokenType } from "../types"

export const theme: StockTheme = {
  metadata: {
    id: "adobeSpectrum",
    name: "Adobe Spectrum",
    description:
      "A clean, product-focused theme based on Adobe's Spectrum design system. It pairs neutral grays with Spectrum blue, the Source type family, rounded corners, and restrained elevation.",
    intent:
      "To provide a calm, accessible application look with clear hierarchy, strong contrast, and highly legible typography.",
  },
  modulation: {
    type: TokenType.COMPUTED,
    parameters: { ratio: Ratio.MinorThird, baseFontSize: 16, baseSize: 1 },
  },
  colorHarmony: {
    type: TokenType.COMPUTED,
    parameters: {
      baseColor: { hue: 210, saturation: 85, lightness: 48 },
      harmony: Harmony.Monochromatic,
      angle: 16,
      step: 15,
      whitePoint: 98,
      grayPoint: 56,
      blackPoint: 12,
      bleed: 4,
    },
  },
  displayMode: {
    type: TokenType.COMPUTED,
    parameters: {
      mode: "light",
      chromaChange: -10,
      lightnessChange: 5,
    },
  },
  matchColor: {
    type: TokenType.COMPUTED,
    parameters: { includeBrightness: true, includeOpacity: true },
  },
  highContrast: {
    type: TokenType.COMPUTED,
    parameters: {
      contrastRatio: 2.5,
      fallbackColor: { type: ValueType.EXACT, value: "#FFFFFF" },
      includeBleed: true,
    },
  },
  opticalPadding: {
    type: TokenType.COMPUTED,
    parameters: { leftRhythm: 0.75, rightRhythm: 0.875, verticalRhythm: 0.5 },
  },
  autoFit: {
    type: TokenType.COMPUTED,
    parameters: { factor: 0.8 },
  },
  fontFamily: {
    type: TokenType.COMPUTED,
    parameters: {
      primary: { type: TokenType.FONT_FAMILY, parameters: "Source Sans 3" },
      secondary: { type: TokenType.FONT_FAMILY, parameters: "Source Sans 3" },
    },
  },
  size: {
    tiny: {
      type: TokenType.MODULATED,
      name: "Tiny",
      parameters: { step: -9.32 },
    },
    xxsmall: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -6.21 },
    },
    xsmall: {
      type: TokenType.MODULATED,
      name: "Extra small",
      parameters: { step: -3.11 },
    },
    small: {
      type: TokenType.MODULATED,
      name: "Small",
      parameters: { step: -1.29 },
    },
    medium: {
      type: TokenType.MODULATED,
      name: "Medium",
      parameters: { step: 0 },
    },
    large: {
      type: TokenType.MODULATED,
      name: "Large",
      parameters: { step: 1.82 },
    },
    xlarge: {
      type: TokenType.MODULATED,
      name: "Extra large",
      parameters: { step: 3.11 },
    },
    xxlarge: {
      type: TokenType.MODULATED,
      name: "Big",
      parameters: { step: 4.92 },
    },
    huge: {
      type: TokenType.MODULATED,
      name: "Huge",
      parameters: { step: 6.21 },
    },
  },
  dimension: {
    tiny: {
      type: TokenType.MODULATED,
      name: "Tiny",
      parameters: { step: -6.21 },
    },
    xxsmall: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -3.11 },
    },
    xsmall: {
      type: TokenType.MODULATED,
      name: "Extra small",
      parameters: { step: 0 },
    },
    small: {
      type: TokenType.MODULATED,
      name: "Small",
      parameters: { step: 1.82 },
    },
    medium: {
      type: TokenType.MODULATED,
      name: "Medium",
      parameters: { step: 3.11 },
    },
    large: {
      type: TokenType.MODULATED,
      name: "Large",
      parameters: { step: 4.92 },
    },
    xlarge: {
      type: TokenType.MODULATED,
      name: "Extra large",
      parameters: { step: 6.21 },
    },
    xxlarge: {
      type: TokenType.MODULATED,
      name: "Big",
      parameters: { step: 8.03 },
    },
    huge: {
      type: TokenType.MODULATED,
      name: "Huge",
      parameters: { step: 9.32 },
    },
  },
  margin: {
    tight: {
      type: TokenType.MODULATED,
      name: "Tight",
      parameters: { step: -6.21 },
    },
    compact: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -3.11 },
    },
    cozy: { type: TokenType.MODULATED, name: "Cozy", parameters: { step: 0 } },
    comfortable: {
      type: TokenType.MODULATED,
      name: "Comfortable",
      parameters: { step: 3.11 },
    },
    open: {
      type: TokenType.MODULATED,
      name: "Open",
      parameters: { step: 6.21 },
    },
  },
  padding: {
    tight: {
      type: TokenType.MODULATED,
      name: "Tight",
      parameters: { step: -6.21 },
    },
    compact: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -3.11 },
    },
    cozy: { type: TokenType.MODULATED, name: "Cozy", parameters: { step: 0 } },
    comfortable: {
      type: TokenType.MODULATED,
      name: "Comfortable",
      parameters: { step: 3.11 },
    },
    open: {
      type: TokenType.MODULATED,
      name: "Open",
      parameters: { step: 6.21 },
    },
  },
  gap: {
    tight: {
      type: TokenType.MODULATED,
      name: "Tight",
      parameters: { step: -6.21 },
    },
    compact: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -3.11 },
    },
    cozy: { type: TokenType.MODULATED, name: "Cozy", parameters: { step: 0 } },
    comfortable: {
      type: TokenType.MODULATED,
      name: "Comfortable",
      parameters: { step: 3.11 },
    },
    open: {
      type: TokenType.MODULATED,
      name: "Open",
      parameters: { step: 6.21 },
    },
  },
  corners: {
    tight: {
      type: TokenType.MODULATED,
      name: "Tight",
      parameters: { step: -6.21 },
    },
    compact: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -3.11 },
    },
    cozy: {
      type: TokenType.MODULATED,
      name: "Cozy",
      parameters: { step: 1.82 },
    },
    comfortable: {
      type: TokenType.MODULATED,
      name: "Comfortable",
      parameters: { step: 3.11 },
    },
    open: {
      type: TokenType.MODULATED,
      name: "Open",
      parameters: { step: 4.92 },
    },
  },
  borderWidth: {
    xsmall: {
      type: TokenType.MODULATED,
      name: "Extra small",
      parameters: { step: -15.53 },
    },
    small: {
      type: TokenType.MODULATED,
      name: "Small",
      parameters: { step: -12 },
    },
    medium: {
      type: TokenType.MODULATED,
      name: "Medium",
      parameters: { step: -9.32 },
    },
    large: {
      type: TokenType.MODULATED,
      name: "Large",
      parameters: { step: -6.21 },
    },
    xlarge: {
      type: TokenType.MODULATED,
      name: "Extra large",
      parameters: { step: -3.11 },
    },
  },
  blur: {
    tiny: {
      type: TokenType.MODULATED,
      name: "Tiny",
      parameters: { step: -12.43 },
    },
    xxsmall: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -9.32 },
    },
    xsmall: {
      type: TokenType.MODULATED,
      name: "Extra small",
      parameters: { step: -6.21 },
    },
    small: {
      type: TokenType.MODULATED,
      name: "Small",
      parameters: { step: -4.4 },
    },
    medium: {
      type: TokenType.MODULATED,
      name: "Medium",
      parameters: { step: -3.11 },
    },
    large: {
      type: TokenType.MODULATED,
      name: "Large",
      parameters: { step: -1.29 },
    },
    xlarge: {
      type: TokenType.MODULATED,
      name: "Extra large",
      parameters: { step: 0 },
    },
    xxlarge: {
      type: TokenType.MODULATED,
      name: "Big",
      parameters: { step: 1.82 },
    },
    huge: {
      type: TokenType.MODULATED,
      name: "Huge",
      parameters: { step: 3.11 },
    },
  },
  spread: {
    tiny: {
      type: TokenType.MODULATED,
      name: "Tiny",
      parameters: { step: -15.53 },
    },
    xxsmall: {
      type: TokenType.MODULATED,
      name: "Compact",
      parameters: { step: -12.43 },
    },
    xsmall: {
      type: TokenType.MODULATED,
      name: "Extra small",
      parameters: { step: -9.32 },
    },
    small: {
      type: TokenType.MODULATED,
      name: "Small",
      parameters: { step: -7.5 },
    },
    medium: {
      type: TokenType.MODULATED,
      name: "Medium",
      parameters: { step: -6.21 },
    },
    large: {
      type: TokenType.MODULATED,
      name: "Large",
      parameters: { step: -4.4 },
    },
    xlarge: {
      type: TokenType.MODULATED,
      name: "Extra large",
      parameters: { step: -3.11 },
    },
    xxlarge: {
      type: TokenType.MODULATED,
      name: "Big",
      parameters: { step: -2.11 },
    },
    huge: {
      type: TokenType.MODULATED,
      name: "Huge",
      parameters: { step: -1.29 },
    },
  },
  fontSize: {
    tiny: {
      type: TokenType.MODULATED,
      name: "Tiny",
      parameters: { step: -3.11 },
    },
    xxsmall: {
      type: TokenType.MODULATED,
      name: "Petite",
      parameters: { step: -2.11 },
    },
    xsmall: {
      type: TokenType.MODULATED,
      name: "Extra small",
      parameters: { step: -1.29 },
    },
    small: {
      type: TokenType.MODULATED,
      name: "Small",
      parameters: { step: -0.6 },
    },
    medium: {
      type: TokenType.MODULATED,
      name: "Medium",
      parameters: { step: 0 },
    },
    large: {
      type: TokenType.MODULATED,
      name: "Large",
      parameters: { step: 1.82 },
    },
    xlarge: {
      type: TokenType.MODULATED,
      name: "Extra large",
      parameters: { step: 3.11 },
    },
    xxlarge: {
      type: TokenType.MODULATED,
      name: "Big",
      parameters: { step: 4.92 },
    },
    huge: {
      type: TokenType.MODULATED,
      name: "Huge",
      parameters: { step: 6.21 },
    },
  },
  fontWeight: {
    thin: {
      type: TokenType.EXACT,
      name: "Thin",
      parameters: { unit: Unit.NUMBER, value: 100 },
    },
    xlight: {
      type: TokenType.EXACT,
      name: "Extra light",
      parameters: { unit: Unit.NUMBER, value: 200 },
    },
    light: {
      type: TokenType.EXACT,
      name: "Light",
      parameters: { unit: Unit.NUMBER, value: 300 },
    },
    normal: {
      type: TokenType.EXACT,
      name: "Normal",
      parameters: { unit: Unit.NUMBER, value: 400 },
    },
    medium: {
      type: TokenType.EXACT,
      name: "Medium",
      parameters: { unit: Unit.NUMBER, value: 500 },
    },
    semibold: {
      type: TokenType.EXACT,
      name: "Semibold",
      parameters: { unit: Unit.NUMBER, value: 600 },
    },
    bold: {
      type: TokenType.EXACT,
      name: "Bold",
      parameters: { unit: Unit.NUMBER, value: 700 },
    },
    xbold: {
      type: TokenType.EXACT,
      name: "Extra bold",
      parameters: { unit: Unit.NUMBER, value: 800 },
    },
    black: {
      type: TokenType.EXACT,
      name: "Black",
      parameters: { unit: Unit.NUMBER, value: 900 },
    },
  },
  lineHeight: {
    none: {
      type: TokenType.EXACT,
      name: "None",
      parameters: { unit: Unit.NUMBER, value: 1.0 },
    },
    solid: {
      type: TokenType.EXACT,
      name: "Solid",
      parameters: { unit: Unit.NUMBER, value: 1.15 },
    },
    tight: {
      type: TokenType.EXACT,
      name: "Tight",
      parameters: { unit: Unit.NUMBER, value: 1.25 },
    },
    compact: {
      type: TokenType.EXACT,
      name: "Compact",
      parameters: { unit: Unit.NUMBER, value: 1.33 },
    },
    cozy: {
      type: TokenType.EXACT,
      name: "Cozy",
      parameters: { unit: Unit.NUMBER, value: 1.5 },
    },
    comfortable: {
      type: TokenType.EXACT,
      name: "Comfortable",
      parameters: { unit: Unit.NUMBER, value: 2.0 },
    },
    open: {
      type: TokenType.EXACT,
      name: "Open",
      parameters: { unit: Unit.NUMBER, value: 2.5 },
    },
  },
  iconSet: {
    intent: "General purpose icon set",
    set: "google-material",
    defaultColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
    defaultSize: { type: ValueType.THEME_ORDINAL, value: "@size.medium" },
  },
  swatch: {
    white: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "white",
      intent: "The color white",
    },
    gray: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "gray",
      intent: "The color gray",
    },
    black: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "black",
      intent: "The color black",
    },
    primary: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "primary",
      intent: "The primary color",
    },
    swatch1: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "swatch1",
      intent: "A tint of the primary color",
    },
    swatch2: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "swatch2",
      intent: "A tint of the primary color",
    },
    swatch3: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "swatch3",
      intent: "A tint of the primary color",
    },
    swatch4: {
      type: TokenType.DYNAMIC_SWATCH,
      role: "swatch4",
      intent: "A tint of the primary color",
    },
    foreground: {
      name: "Foreground",
      intent: "The default color used for text and foreground content.",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 210, saturation: 8, lightness: 14 },
      },
    },
    background: {
      name: "Background",
      intent:
        "The default color used to fill backgrounds, often white or black.",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 210, saturation: 6, lightness: 98 },
      },
    },
    active: {
      name: "Active",
      intent: "Active color for all important actions",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 210, saturation: 85, lightness: 48 },
      },
    },
    punch: {
      name: "Punch",
      intent: "Used for high contrast elements",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 326, saturation: 59, lightness: 49 },
      },
    },
    positive: {
      name: "Positive",
      intent: "To be used for supporting text or iconography",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 160, saturation: 66, lightness: 35 },
      },
    },
    negative: {
      name: "Negative",
      intent: "Used for all error states",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 356, saturation: 63, lightness: 49 },
      },
    },
    warning: {
      name: "Warning",
      intent: "Used to indicate caution or attention",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 34, saturation: 93, lightness: 44 },
      },
    },
    accent: {
      name: "Accent",
      intent: "To act as an accent color",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 239, saturation: 65, lightness: 60 },
      },
    },
    offBlack: {
      name: "Off Black",
      intent: "A low contrast black color.",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 0, saturation: 0, lightness: 15 },
      },
    },
    offWhite: {
      name: "Off White",
      intent: "Light color for text on dark backgrounds",
      type: TokenType.SWATCH,
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 210, saturation: 10, lightness: 97 },
      },
    },
  },
  font: {
    display: {
      type: TokenType.LOOK,
      name: "Display",
      intent: "For display text, often H1",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.bold" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xxlarge" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.solid",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: -0.25 },
        },
      },
    },
    heading: {
      type: TokenType.LOOK,
      name: "Heading",
      intent: "For heading text, often H2",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontWeight.semibold",
        },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xlarge" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    subheading: {
      type: TokenType.LOOK,
      name: "Subheading",
      intent: "For subheading text, often H3",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.large" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    title: {
      type: TokenType.LOOK,
      name: "Title",
      intent: "For title text, often H4",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    subtitle: {
      type: TokenType.LOOK,
      name: "Subtitle",
      intent: "For subtitle text, often H5",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.small" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    callout: {
      type: TokenType.LOOK,
      name: "Callout",
      intent: "For callout text, sometimes H6",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.light" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xsmall" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.compact",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    body: {
      type: TokenType.LOOK,
      name: "Body",
      intent: "For general text",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    label: {
      type: TokenType.LOOK,
      name: "Label",
      intent: "For labels on form elements",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.small" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.solid",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0.1 },
        },
      },
    },
    tagline: {
      type: TokenType.LOOK,
      name: "Tagline",
      intent: "For supporting text on images and diagrams",
      parameters: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xsmall" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    code: {
      type: TokenType.LOOK,
      name: "Code",
      intent: "For displaying code-like snippets",
      parameters: {
        family: { type: ValueType.EXACT, value: "Source Code Pro" },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.OPTION, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
  },
  border: {
    hairline: {
      type: TokenType.LOOK,
      name: "Single Pixel",
      parameters: {
        width: { type: ValueType.OPTION, value: BorderWidth.HAIRLINE },
        style: { type: ValueType.OPTION, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    thin: {
      type: TokenType.LOOK,
      name: "Thin line",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.small" },
        style: { type: ValueType.OPTION, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    normal: {
      type: TokenType.LOOK,
      name: "Solid line",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.medium" },
        style: { type: ValueType.OPTION, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    thick: {
      type: TokenType.LOOK,
      name: "Thick line",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.large" },
        style: { type: ValueType.OPTION, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    bevel: {
      type: TokenType.LOOK,
      name: "Bevel",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.medium" },
        style: { type: ValueType.OPTION, value: BorderStyle.GROOVE },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 90, unit: Unit.PERCENT },
        },
      },
    },
  },
  gradient: {
    primary: {
      type: TokenType.LOOK,
      name: "Ramp",
      parameters: {
        gradientType: { type: ValueType.OPTION, value: GradientType.LINEAR },
        angle: {
          type: ValueType.EXACT,
          value: { unit: Unit.DEGREES, value: 0 },
        },
        startColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
        startOpacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
        startPosition: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 0 },
        },
        endColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.black",
        },
        endOpacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
        endPosition: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
      },
    },
    gradient1: {
      type: TokenType.LOOK,
      name: "Fade Out",
      parameters: {
        gradientType: { type: ValueType.OPTION, value: GradientType.LINEAR },
        angle: {
          type: ValueType.EXACT,
          value: { unit: Unit.DEGREES, value: 0 },
        },
        startColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        startOpacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
        startPosition: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 0 },
        },
        endColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        endOpacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 0 },
        },
        endPosition: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
      },
    },
    gradient2: {
      type: TokenType.LOOK,
      name: "Burst",
      parameters: {
        gradientType: { type: ValueType.OPTION, value: GradientType.RADIAL },
        angle: {
          type: ValueType.EXACT,
          value: { unit: Unit.DEGREES, value: 0 },
        },
        startColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        startOpacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
        startPosition: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 0 },
        },
        endColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        endOpacity: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 0 },
        },
        endPosition: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
      },
    },
  },
  shadow: {
    xlight: {
      type: TokenType.LOOK,
      name: "Subtle",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 1 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.xxsmall" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.tiny" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 22, unit: Unit.PERCENT },
        },
      },
    },
    light: {
      type: TokenType.LOOK,
      name: "Soft",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 2 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.small" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.xsmall" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 22, unit: Unit.PERCENT },
        },
      },
    },
    moderate: {
      type: TokenType.LOOK,
      name: "Light",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 4 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.medium" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.small" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 22, unit: Unit.PERCENT },
        },
      },
    },
    strong: {
      type: TokenType.LOOK,
      name: "Moderate",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 6 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.large" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.medium" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 22, unit: Unit.PERCENT },
        },
      },
    },
    xstrong: {
      type: TokenType.LOOK,
      name: "Strong",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 8 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.large" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.large" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 22, unit: Unit.PERCENT },
        },
      },
    },
  },
  scrollbar: {
    primary: {
      type: TokenType.LOOK,
      name: "Primary",
      parameters: {
        trackColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
        thumbColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.swatch2",
        },
        thumbHoverColor: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.swatch3",
        },
        trackSize: {
          type: ValueType.EXACT,
          value: { unit: Unit.REM, value: 0.5 },
        },
        rounded: { type: ValueType.EXACT, value: true },
      },
    },
  },
}
