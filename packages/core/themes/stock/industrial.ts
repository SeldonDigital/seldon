import { BackgroundRepeat } from "../../properties/constants/background-repeats"
import { BorderStyle } from "../../properties/constants/border-styles"
import { BorderWidth } from "../../properties/constants/border-widths"
import { FontStyle } from "../../properties/constants/font-styles"
import { GradientType } from "../../properties/constants/gradient-types"
import { ImageFit } from "../../properties/constants/image-fits"
import { TextCasing } from "../../properties/constants/text-cases"
import { Unit } from "../../properties/constants/units"
import { ValueType } from "../../properties/constants/value-types"
import { computeTheme } from "../helpers/compute-theme"
import { Harmony, Ratio, StaticTheme } from "../types"

const theme: StaticTheme = {
  id: "industrial",
  name: "Industrial",
  description:
    "A modern and versatile theme with a cool, monochromatic color palette inspired by steel. It features a range of customizable typography, layout, and color options to suit various design needs.",
  intent:
    "To provide a sleek and professional look with high contrast and readability, suitable for a wide range of applications.",
  core: {
    ratio: Ratio.MajorThird,
    fontSize: 16,
    size: 1,
  },
  fontFamily: {
    primary: "Lora",
    secondary: "Barlow Condensed",
  },
  color: {
    baseColor: { hue: 210, saturation: 30, lightness: 20 },
    harmony: Harmony.Monochromatic,
    angle: 20,
    step: 12,
    whitePoint: 90,
    grayPoint: 60,
    blackPoint: 20,
    bleed: 80,
    contrastRatio: 2.5,
  },

  // Layout values
  size: {
    tiny: { name: "Tiny", parameters: { step: -9.32 } },
    xxsmall: { name: "Compact", parameters: { step: -6.21 } },
    xsmall: { name: "Extra small", parameters: { step: -3.11 } },
    small: { name: "Small", parameters: { step: -1.29 } },
    medium: { name: "Medium", parameters: { step: 0 } },
    large: { name: "Large", parameters: { step: 1.82 } },
    xlarge: { name: "Extra large", parameters: { step: 3.11 } },
    xxlarge: { name: "Big", parameters: { step: 4.92 } },
    huge: { name: "Huge", parameters: { step: 6.21 } },
  },
  dimension: {
    tiny: { name: "Tiny", parameters: { step: -6.21 } },
    xxsmall: { name: "Compact", parameters: { step: -3.11 } },
    xsmall: { name: "Extra small", parameters: { step: 0 } },
    small: { name: "Small", parameters: { step: 1.82 } },
    medium: { name: "Medium", parameters: { step: 3.11 } },
    large: { name: "Large", parameters: { step: 4.92 } },
    xlarge: { name: "Extra large", parameters: { step: 6.21 } },
    xxlarge: { name: "Big", parameters: { step: 8.03 } },
    huge: { name: "Huge", parameters: { step: 9.32 } },
  },
  margin: {
    tight: { name: "Tight", parameters: { step: -6.21 } },
    compact: { name: "Compact", parameters: { step: -3.11 } },
    cozy: { name: "Cozy", parameters: { step: 0 } },
    comfortable: { name: "Comfortable", parameters: { step: 3.11 } },
    open: { name: "Open", parameters: { step: 6.21 } },
  },
  padding: {
    tight: { name: "Tight", parameters: { step: -6.21 } },
    compact: { name: "Compact", parameters: { step: -3.11 } },
    cozy: { name: "Cozy", parameters: { step: 0 } },
    comfortable: { name: "Comfortable", parameters: { step: 3.11 } },
    open: { name: "Open", parameters: { step: 6.21 } },
  },
  gap: {
    tight: { name: "Tight", parameters: { step: -6.21 } },
    compact: { name: "Compact", parameters: { step: -3.11 } },
    cozy: { name: "Cozy", parameters: { step: 0 } },
    comfortable: { name: "Comfortable", parameters: { step: 3.11 } },
    open: { name: "Open", parameters: { step: 6.21 } },
  },
  corners: {
    tight: { name: "Tight", parameters: { step: -6.21 } },
    compact: { name: "Compact", parameters: { step: -3.11 } },
    cozy: { name: "Cozy", parameters: { step: 0 } },
    comfortable: { name: "Comfortable", parameters: { step: 1.82 } },
    open: { name: "Open", parameters: { step: 3.11 } },
  },

  // Iconography values
  icon: {
    intent: "General purpose icon set",
    set: "google-material",
    defaultColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
    defaultSize: { type: ValueType.THEME_ORDINAL, value: "@size.medium" },
  },

  // Swatch values
  swatch: {
    background: {
      name: "Background",
      intent:
        "The default color used to fill backgrounds, often white or black.",
      type: "hsl",
      value: {
        hue: 210,
        saturation: 80,
        lightness: 20,
      },
    },
    custom1: {
      name: "Red",
      intent: "Used mostly for error conditions",
      type: "hsl",
      value: {
        hue: 0,
        saturation: 100,
        lightness: 65,
      },
    },
    custom2: {
      name: "Green",
      intent: "Used mostly for positive conditions",
      type: "hsl",
      value: {
        hue: 135,
        saturation: 76,
        lightness: 59,
      },
    },
    custom3: {
      name: "Blue",
      intent: "A calming color for backgrounds",
      type: "hsl",
      value: {
        hue: 203,
        saturation: 100,
        lightness: 62,
      },
    },
    custom4: {
      name: "Yellow",
      intent: "A call to action color",
      type: "hsl",
      value: {
        hue: 60,
        saturation: 100,
        lightness: 46,
      },
    },
    custom5: {
      name: "Charcoal",
      intent: "Off black to temper the overall color of the palette.",
      type: "hsl",
      value: {
        hue: 0,
        saturation: 0,
        lightness: 15,
      },
    },
  },

  // Background values
  background: {
    primary: {
      name: "Color fill",
      parameters: {
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      },
    },
    background1: {
      name: "Image",
      parameters: {
        image: {
          type: ValueType.EXACT,
          value:
            "https://img.freepik.com/premium-photo/white-abstract-background-with-subtle-d-texture_947794-79438.jpg",
        },
        repeat: { type: ValueType.PRESET, value: BackgroundRepeat.NO_REPEAT },
        size: { type: ValueType.PRESET, value: ImageFit.COVER },
      },
    },
    background2: {
      name: "Image repeated",
      parameters: {
        image: {
          type: ValueType.EXACT,
          value:
            "https://img.freepik.com/premium-photo/white-abstract-background-with-subtle-d-texture_947794-79438.jpg",
        },
        repeat: { type: ValueType.PRESET, value: BackgroundRepeat.REPEAT },
        size: { type: ValueType.PRESET, value: ImageFit.ORIGINAL },
      },
    },
  },

  // Border values
  border: {
    hairline: {
      name: "Hairline",
      parameters: {
        width: { type: ValueType.PRESET, value: BorderWidth.HAIRLINE },
        style: { type: ValueType.PRESET, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    thin: {
      name: "Thin line",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.small" },
        style: { type: ValueType.PRESET, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    normal: {
      name: "Solid line",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.medium" },
        style: { type: ValueType.PRESET, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    thick: {
      name: "Thick line",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.large" },
        style: { type: ValueType.PRESET, value: BorderStyle.SOLID },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 100, unit: Unit.PERCENT },
        },
      },
    },
    bevel: {
      name: "Bevel",
      parameters: {
        width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.medium" },
        style: { type: ValueType.PRESET, value: BorderStyle.GROOVE },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 90, unit: Unit.PERCENT },
        },
      },
    },
  },
  borderWidth: {
    xsmall: { name: "Extra small", parameters: { step: -15.53 } },
    small: { name: "Small", parameters: { step: -12 } },
    medium: { name: "Medium", parameters: { step: -9.32 } },
    large: { name: "Large", parameters: { step: -6.21 } },
    xlarge: { name: "Extra large", parameters: { step: -3.11 } },
  },

  // Typography values
  font: {
    display: {
      name: "Display",
      intent: "For display text, often H1",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.bold" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xxlarge" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.solid",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: -0.25 },
        },
      },
    },
    heading: {
      name: "Heading",
      intent: "For heading text, often H2",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: {
          type: ValueType.THEME_ORDINAL,
          value: "@fontWeight.semibold",
        },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xlarge" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    subheading: {
      name: "Subheading",
      intent: "For subheading text, often H3",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.secondary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.large" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    title: {
      name: "Title",
      intent: "For title text, often H4",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    subtitle: {
      name: "Subtitle",
      intent: "For subtitle text, often H5",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.small" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    callout: {
      name: "Callout",
      intent: "For callout text, sometimes H6",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.light" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xsmall" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.compact",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    body: {
      name: "Body",
      intent: "For general text",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    label: {
      name: "Label",
      intent: "For labels on form elements",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.small" },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.solid",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 0.1 },
        },
      },
    },
    tagline: {
      name: "Tagline",
      intent: "For supporting text on images and diagrams",
      value: {
        family: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@fontFamily.primary",
        },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.xsmall" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
    code: {
      name: "Code",
      intent: "For displaying code-like snippets",
      value: {
        family: { type: ValueType.PRESET, value: "Inconsolata" },
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
        style: { type: ValueType.PRESET, value: FontStyle.NORMAL },
        lineHeight: {
          type: ValueType.THEME_ORDINAL,
          value: "@lineHeight.tight",
        },
        textCase: { type: ValueType.PRESET, value: TextCasing.NORMAL },
        letterSpacing: { type: ValueType.EMPTY, value: null },
      },
    },
  },
  fontSize: {
    tiny: { name: "Tiny", parameters: { step: -3.11 } },
    xxsmall: { name: "Petite", parameters: { step: -2.11 } },
    xsmall: { name: "Extra small", parameters: { step: -1.29 } },
    small: { name: "Small", parameters: { step: -0.6 } },
    medium: { name: "Medium", parameters: { step: 0 } },
    large: { name: "Large", parameters: { step: 1.82 } },
    xlarge: { name: "Extra large", parameters: { step: 3.11 } },
    xxlarge: { name: "Big", parameters: { step: 4.92 } },
    huge: { name: "Huge", parameters: { step: 6.21 } },
  },
  fontWeight: {
    thin: { name: "Thin", value: 100 },
    xlight: { name: "Extra light", value: 200 },
    light: { name: "Light", value: 300 },
    normal: { name: "Normal", value: 400 },
    medium: { name: "Medium", value: 500 },
    semibold: { name: "Semibold", value: 600 },
    bold: { name: "Bold", value: 700 },
    xbold: { name: "Extra bold", value: 800 },
    black: { name: "Black", value: 900 },
  },
  lineHeight: {
    none: { name: "None", value: 1.0 },
    solid: { name: "Solid", value: 1.15 },
    tight: { name: "Tight", value: 1.25 },
    compact: { name: "Compact", value: 1.33 },
    cozy: { name: "Cozy", value: 1.5 },
    comfortable: { name: "Comfortable", value: 2.0 },
    open: { name: "Open", value: 2.5 },
  },

  // Gradient values
  gradient: {
    primary: {
      name: "Default",
      parameters: {
        gradientType: { type: ValueType.PRESET, value: GradientType.LINEAR },
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
          value: { unit: Unit.PERCENT, value: 100 },
        },
        endPosition: {
          type: ValueType.EXACT,
          value: { unit: Unit.PERCENT, value: 100 },
        },
      },
    },
    gradient1: {
      name: "Linear",
      parameters: {
        gradientType: { type: ValueType.PRESET, value: GradientType.LINEAR },
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
          value: "@swatch.swatch1",
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
    gradient2: {
      name: "Radial",
      parameters: {
        gradientType: { type: ValueType.PRESET, value: GradientType.RADIAL },
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
          value: "@swatch.swatch1",
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
  },

  // Shadow values
  blur: {
    tiny: { name: "Tiny", parameters: { step: -12.43 } },
    xxsmall: { name: "Compact", parameters: { step: -9.32 } },
    xsmall: { name: "Extra small", parameters: { step: -6.21 } },
    small: { name: "Small", parameters: { step: -4.4 } },
    medium: { name: "Medium", parameters: { step: -3.11 } },
    large: { name: "Large", parameters: { step: -1.29 } },
    xlarge: { name: "Extra large", parameters: { step: 0 } },
    xxlarge: { name: "Big", parameters: { step: 1.82 } },
    huge: { name: "Huge", parameters: { step: 3.11 } },
  },
  spread: {
    tiny: { name: "Tiny", parameters: { step: -15.53 } },
    xxsmall: { name: "Compact", parameters: { step: -12.43 } },
    xsmall: { name: "Extra small", parameters: { step: -9.32 } },
    small: { name: "Small", parameters: { step: -7.5 } },
    medium: { name: "Medium", parameters: { step: -6.21 } },
    large: { name: "Large", parameters: { step: -4.4 } },
    xlarge: { name: "Extra large", parameters: { step: -3.11 } },
    xxlarge: { name: "Big", parameters: { step: -2.11 } },
    huge: { name: "Huge", parameters: { step: -1.29 } },
  },
  shadow: {
    xlight: {
      name: "Subtle",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 1 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.xxsmall" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.tiny" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 33, unit: Unit.PERCENT },
        },
      },
    },
    light: {
      name: "Soft",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 2 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.small" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.xsmall" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 33, unit: Unit.PERCENT },
        },
      },
    },
    moderate: {
      name: "Light",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 4 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.medium" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.small" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 33, unit: Unit.PERCENT },
        },
      },
    },
    strong: {
      name: "Moderate",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 6 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.large" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.medium" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 33, unit: Unit.PERCENT },
        },
      },
    },
    xstrong: {
      name: "Strong",
      parameters: {
        offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
        offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 8 } },
        blur: { type: ValueType.THEME_ORDINAL, value: "@blur.large" },
        spread: { type: ValueType.THEME_ORDINAL, value: "@spread.large" },
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
        opacity: {
          type: ValueType.EXACT,
          value: { value: 33, unit: Unit.PERCENT },
        },
      },
    },
  },

  scrollbar: {
    primary: {
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
        rounded: true,
      },
    },
  },
}

export default computeTheme(theme)
