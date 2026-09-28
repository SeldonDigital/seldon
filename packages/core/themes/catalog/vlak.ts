import { Unit, ValueType } from "../../properties"
import { Colorspace, Harmony, Ratio, TokenType } from "../types"
import { theme as highContrastTheme } from "./high-contrast"

import type { StockTheme } from "../types"

export const theme: StockTheme = {
  ...highContrastTheme,
  metadata: {
    id: "vlak",
    name: "Vlak",
    description: "A quiet, monochrome product theme based on paper, ink, gray, and hairline rules.",
    intent:
      "To create precise product interfaces where typography, spacing, and alignment establish hierarchy.",
  },
  modulation: {
    type: TokenType.COMPUTED,
    parameters: { ratio: Ratio.MinorThird, baseFontSize: 15, baseSize: 1 },
  },
  colorHarmony: {
    type: TokenType.COMPUTED,
    parameters: {
      baseColor: { hue: 0, saturation: 0, lightness: 10 },
      harmony: Harmony.Monochromatic,
      angle: 20,
      step: 20,
      whitePoint: 96,
      grayPoint: 42,
      blackPoint: 10,
      bleed: 0,
    },
  },
  displayMode: {
    type: TokenType.COMPUTED,
    parameters: {
      mode: "light",
      chromaChange: 0,
      lightnessChange: 0,
    },
  },
  fontFamily: {
    type: TokenType.COMPUTED,
    parameters: {
      primary: { type: TokenType.FONT_FAMILY, parameters: "Inter" },
      secondary: { type: TokenType.FONT_FAMILY, parameters: "Inter" },
    },
  },
  margin: {
    ...highContrastTheme.margin,
    tight: { type: TokenType.EXACT, name: "Tight", parameters: { unit: Unit.PX, value: 4 } },
    compact: {
      type: TokenType.EXACT,
      name: "Compact",
      parameters: { unit: Unit.PX, value: 8 },
    },
    cozy: { type: TokenType.EXACT, name: "Cozy", parameters: { unit: Unit.PX, value: 12 } },
    comfortable: {
      type: TokenType.EXACT,
      name: "Comfortable",
      parameters: { unit: Unit.PX, value: 20 },
    },
    open: { type: TokenType.EXACT, name: "Open", parameters: { unit: Unit.PX, value: 32 } },
  },
  padding: {
    ...highContrastTheme.padding,
    tight: { type: TokenType.EXACT, name: "Tight", parameters: { unit: Unit.PX, value: 4 } },
    compact: {
      type: TokenType.EXACT,
      name: "Compact",
      parameters: { unit: Unit.PX, value: 8 },
    },
    cozy: { type: TokenType.EXACT, name: "Cozy", parameters: { unit: Unit.PX, value: 12 } },
    comfortable: {
      type: TokenType.EXACT,
      name: "Comfortable",
      parameters: { unit: Unit.PX, value: 20 },
    },
    open: { type: TokenType.EXACT, name: "Open", parameters: { unit: Unit.PX, value: 32 } },
  },
  gap: {
    ...highContrastTheme.gap,
    tight: { type: TokenType.EXACT, name: "Tight", parameters: { unit: Unit.PX, value: 4 } },
    compact: {
      type: TokenType.EXACT,
      name: "Compact",
      parameters: { unit: Unit.PX, value: 8 },
    },
    cozy: { type: TokenType.EXACT, name: "Cozy", parameters: { unit: Unit.PX, value: 12 } },
    comfortable: {
      type: TokenType.EXACT,
      name: "Comfortable",
      parameters: { unit: Unit.PX, value: 20 },
    },
    open: { type: TokenType.EXACT, name: "Open", parameters: { unit: Unit.PX, value: 32 } },
  },
  corners: {
    ...highContrastTheme.corners,
    tight: { type: TokenType.EXACT, name: "Tight", parameters: { unit: Unit.PX, value: 0 } },
    compact: {
      type: TokenType.EXACT,
      name: "Compact",
      parameters: { unit: Unit.PX, value: 0 },
    },
    cozy: { type: TokenType.EXACT, name: "Cozy", parameters: { unit: Unit.PX, value: 0 } },
    comfortable: {
      type: TokenType.EXACT,
      name: "Comfortable",
      parameters: { unit: Unit.PX, value: 4 },
    },
    open: { type: TokenType.EXACT, name: "Open", parameters: { unit: Unit.PX, value: 4 } },
  },
  lineHeight: {
    ...highContrastTheme.lineHeight,
    solid: { type: TokenType.EXACT, name: "Solid", parameters: { unit: Unit.NUMBER, value: 1.05 } },
    tight: { type: TokenType.EXACT, name: "Tight", parameters: { unit: Unit.NUMBER, value: 1.2 } },
    compact: {
      type: TokenType.EXACT,
      name: "Compact",
      parameters: { unit: Unit.NUMBER, value: 1.3 },
    },
    cozy: { type: TokenType.EXACT, name: "Cozy", parameters: { unit: Unit.NUMBER, value: 1.45 } },
  },
  swatch: {
    ...highContrastTheme.swatch,
    foreground: {
      type: TokenType.SWATCH,
      name: "Foreground",
      intent: "Ink for readable text and interface marks.",
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 0, saturation: 0, lightness: 10 },
      },
    },
    background: {
      type: TokenType.SWATCH,
      name: "Background",
      intent: "Warm paper surface.",
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 45, saturation: 29, lightness: 96 },
      },
    },
    offBlack: {
      type: TokenType.SWATCH,
      name: "Off Black",
      intent: "Ink for text on paper.",
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 0, saturation: 0, lightness: 10 },
      },
    },
    offWhite: {
      type: TokenType.SWATCH,
      name: "Off White",
      intent: "Warm paper for light surfaces.",
      parameters: {
        colorspace: Colorspace.HSL,
        value: { hue: 45, saturation: 29, lightness: 96 },
      },
    },
  },
  font: {
    ...highContrastTheme.font,
    display: {
      ...highContrastTheme.font.display,
      parameters: {
        ...highContrastTheme.font.display.parameters,
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.semibold" },
        size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.huge" },
        letterSpacing: { type: ValueType.EXACT, value: { unit: Unit.PX, value: -1.82 } },
      },
    },
    heading: {
      ...highContrastTheme.font.heading,
      parameters: {
        ...highContrastTheme.font.heading.parameters,
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.semibold" },
      },
    },
    body: {
      ...highContrastTheme.font.body,
      parameters: {
        ...highContrastTheme.font.body.parameters,
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.medium" },
        lineHeight: { type: ValueType.THEME_ORDINAL, value: "@lineHeight.cozy" },
      },
    },
    label: {
      ...highContrastTheme.font.label,
      parameters: {
        ...highContrastTheme.font.label.parameters,
        weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.semibold" },
      },
    },
  },
  border: {
    ...highContrastTheme.border,
    hairline: {
      ...highContrastTheme.border.hairline,
      parameters: {
        ...highContrastTheme.border.hairline.parameters,
        color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.foreground" },
        opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 42 } },
      },
    },
  },
  shadow: {
    ...highContrastTheme.shadow,
    xlight: {
      ...highContrastTheme.shadow.xlight,
      parameters: {
        ...highContrastTheme.shadow.xlight.parameters,
        opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 0 } },
      },
    },
    light: {
      ...highContrastTheme.shadow.light,
      parameters: {
        ...highContrastTheme.shadow.light.parameters,
        opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 0 } },
      },
    },
    moderate: {
      ...highContrastTheme.shadow.moderate,
      parameters: {
        ...highContrastTheme.shadow.moderate.parameters,
        opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 0 } },
      },
    },
    strong: {
      ...highContrastTheme.shadow.strong,
      parameters: {
        ...highContrastTheme.shadow.strong.parameters,
        opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 0 } },
      },
    },
    xstrong: {
      ...highContrastTheme.shadow.xstrong,
      parameters: {
        ...highContrastTheme.shadow.xstrong.parameters,
        opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 0 } },
      },
    },
  },
}
