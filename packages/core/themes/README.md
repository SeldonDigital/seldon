# Seldon · Themes and Tokens

Themes package every reusable visual decision in a Seldon design system, such as colors, type, spacing, borders, and shadows, into a single named bundle. Components do not hard-code those values. They reference theme **tokens** by name and pick up whichever theme is active.

Component properties reference tokens with `@` paths (for example `@fontSize.medium`, `@swatch.primary`).

---

## What Are Themes

A theme is a saved set of design tokens organized into fixed sections (computed, size, typography, looks, and so on). Tokens are addressed by `@<scope>.<key>` references and resolved at compute time. Swapping the active theme on a board or node retunes every component that references those tokens without touching component overrides.

### Stock Themes

Stock themes ship with Seldon as starting points and reference implementations. Each has a fixed id used in catalog templates (`catalog:<id>`) and can be cloned to bootstrap a custom theme.

| Stock Theme ID | Description |
| --- | --- |
| `seldon` | Seldon brand theme used as the default stock preset. |
| `earth` | Warm natural swatches with analogous harmony, humanist type tone, and comfortable scales. |
| `highContrast` | Neutral high-contrast theme with simple typography and strong readability. |
| `industrial` | Cool steel tones with monochromatic harmony, dense rhythm, and stronger weight choices. |
| `googleMaterial` | Theme aligned with Material Design 3, using Roboto and the M3 baseline palette. |
| `popPunk` | Expressive split-complementary theme with high contrast and punchy scales. |
| `ibmCarbon` | IBM Carbon-inspired theme with neutral grays, IBM Blue, IBM Plex type, and square corners. |
| `adobeSpectrum` | Adobe Spectrum-inspired theme with neutral grays, Spectrum blue, Source type, and rounded corners. |
| `sunsetBlue` | Warm-cool split-complementary theme with relaxed typography. |
| `wildberry` | Rich square-harmony theme with saturated berry colors and bold styling. |

`metadata.id` and catalog template ids use the same string as **Stock Theme ID**. For example: `catalog:earth`, `catalog:ibmCarbon`.

---

## Theme Structure

Themes use fixed top-level entries to organize a saved theme file. The entry order below is not semantic, but use this order for readability and consistency in designing themes.

```json
{
  /* Computed */
  "metadata": {},
  "modulation": {},
  "colorHarmony": {},
  "fontFamily": {},
  "matchColor": {},
  "highContrast": {},
  "opticalPadding": {},
  "autoFit": {},

  /* Size and Spacing */
  "size": {},
  "dimension": {},
  "margin": {},
  "padding": {},
  "gap": {},
  "corners": {},
  "borderWidth": {},
  "blur": {},
  "spread": {},

  /* Typography */
  "fontSize": {},
  "fontWeight": {},
  "lineHeight": {},

  /* Iconography */
  "iconSet": {},

  /* Color */
  "swatch": {},

  /* Looks */
  "font": {},
  "border": {},
  "gradient": {},
  "shadow": {},
  "scrollbar": {}
}
```

---

### Metadata

Metadata identifies the theme. The `id` is how the theme is referenced in code, while the other fields describe what the theme is and when to use it.

| Token | Type | Values |
| --- | --- | --- |
| `metadata.id` | string | Theme template id |
| `metadata.name` | string | Display name |
| `metadata.description` | string | Description |
| `metadata.intent` | string | Intent text |

---

### Computed

The Computed section holds the inputs that drive the compute engines and the color-harmony generator. Each group is one `TokenType.COMPUTED` cell with a typed `parameters` object. The editor renders each group as a parent row with its facets nested beneath, like a look and its facets. These groups are not referenceable through an `@` path. The compute functions read them directly.

`modulation` anchors modulated tokens. A modulated token's `step` is multiplied against these to produce its final size. Changing one value moves every modulated token together.

| Token | Type | Values |
| --- | --- | --- |
| `modulation.parameters.ratio` | `Ratio` | `option: MinorSecond, MajorSecond, MinorThird, MajorThird, PerfectFourth, AugmentedFourth, PerfectFifth, MinorSixth, GoldenRatio, MajorSixth, MinorSeventh, MajorSeventh, Octave, MajorTenth, MajorEleventh, MajorTwelfth, DoubleOctave` (`themes/constants/enums.ts`) |
| `modulation.parameters.baseFontSize` | number | Base font size in pixels |
| `modulation.parameters.baseSize` | number | Base scale unit for modulation |

`colorHarmony` drives the dynamic swatches: the primary color, four accent colors, and the white, gray, and black neutrals.

| Token | Type | Values |
| --- | --- | --- |
| `colorHarmony.parameters.baseColor` | `ColorSpaceLiteral` | HSL \| RGB \| LCH object \| hex \| CSS string (`properties/values/shared/exact/color-spaces.ts`) |
| `colorHarmony.parameters.harmony` | `Harmony` | `option: Complementary, SplitComplementary, Triadic, Analogous, Square, Monochromatic` |
| `colorHarmony.parameters.angle` | number | Hue spacing (degrees) |
| `colorHarmony.parameters.step` | number | Lightness spacing for palette math |
| `colorHarmony.parameters.whitePoint` | number | Lightness anchor, white |
| `colorHarmony.parameters.grayPoint` | number | Lightness anchor, gray |
| `colorHarmony.parameters.blackPoint` | number | Lightness anchor, black |
| `colorHarmony.parameters.bleed` | number | Hue bleed into neutrals |
| `colorHarmony.parameters.mode` | `ThemeMode` | `option: light, dark` (`themes/constants/enums.ts`) |
| `colorHarmony.parameters.chromaChange` | number | Chroma shift in percent, -100 through 100 |

`mode` names the mode the theme's authored colored swatches represent. `chromaChange` shifts the chroma of derived opposite-mode colors. Neither changes how theme colors compute. Factory export builds each mode's swatch table through `getModeSwatches` in `compute/get-mode-swatches.ts`.

Every theme authors its neutral pairs literally: `offWhite` holds a light color and `offBlack` a dark one. The pairs `white`/`black`, `foreground`/`background`, and `offBlack`/`offWhite` never derive. The light table serves them as authored. The dark table serves each slot its partner's authored value. This assignment does not depend on the theme's `mode`.

Every other swatch stays authored in the theme's own `mode` and derives for the opposite mode: the color converts to LCH, lightness inverts, and chroma scales by `chromaChange` percent. `gray` inverts without a chroma shift.

`fontFamily` holds the primary and secondary font stacks. Each slot is a `TokenType.FONT_FAMILY` cell, referenced through `@fontFamily.primary` and `@fontFamily.secondary`.

`matchColor` configures the `MATCH_COLOR` compute function.

| Token | Type | Values |
| --- | --- | --- |
| `matchColor.parameters.includeBrightness` | boolean | Bake the matched layer's brightness into the color |
| `matchColor.parameters.includeOpacity` | boolean | Bake the matched layer's opacity into the color |

`highContrast` configures the `HIGH_CONTRAST_COLOR` compute function.

| Token | Type | Values |
| --- | --- | --- |
| `highContrast.parameters.contrastRatio` | number | Contrast ratio (1-21) at which text switches from black to white |
| `highContrast.parameters.fallbackColor` | `ColorValue` | Reference surface used when the based-on color cannot be resolved |
| `highContrast.parameters.includeBleed` | boolean | On returns `@swatch.white`/`@swatch.black`. Off builds a neutral white or black from the color-harmony white/black points with zero saturation |

`opticalPadding` configures the side ratios for the `OPTICAL_PADDING` compute function.

| Token | Type | Values |
| --- | --- | --- |
| `opticalPadding.parameters.leftRhythm` | number | Left padding ratio |
| `opticalPadding.parameters.rightRhythm` | number | Right padding ratio |
| `opticalPadding.parameters.verticalRhythm` | number | Top and bottom padding ratio |

`autoFit` configures the `AUTO_FIT` compute function.

| Token | Type | Values |
| --- | --- | --- |
| `autoFit.parameters.factor` | number | Scale factor for every `AUTO_FIT` computed value |

---

### Iconography

The `iconSet` entry on `StockTheme` (see [`types/theme.ts`](./types/theme.ts)) is **not** a token table. It is a one-off aggregate that selects the active icon set and its default render values:

```typescript
iconSet: {
  intent: string
  set: IconSetId
  defaultColor: ColorValue
  defaultSize: SizeValue
}
```

Unlike the rest of the theme, `iconSet` has no `type` discriminator, no `@iconSet.*` reference paths, no reserved/`customN` slot convention, and no entry in `THEME_TOKEN_SECTIONS`. The structure block lists `iconSet` as a placeholder so authors know where it sits in a saved theme; a token-style schema for it will be designed alongside the upcoming `core/icons/` refactor.

---

## Theme Tokens

Theme data is a collection of token entries such as sizes, colors, fonts, and looks. Every entry lives at a `@namespace.slot` reference, for example `@swatch.primary`, `@fontSize.medium`, `@font.body`. Components then use `ValueType.THEME_CATEGORICAL` or `ValueType.THEME_ORDINAL` to reference theme values where applicable.

---

### Ordinal vs. Categorical tokens

Theme tokens are split into two types:

- **Ordinal** tokens are an ordered scale. `@fontSize.small` is one step below `@fontSize.medium`, which is one step below `@fontSize.large`. Properties walk this scale in fixed steps, so an instruction like "make the border thicker" can move one entry up the `@borderWidth.*` scale without inventing values.

- **Categorical** tokens are an unordered named set such as `@swatch.primary`, `@font.body`, and `@gradient.primary`. There is no "next" or "previous". Properties point at one of the named entries.

---

### Reserved vs. Custom key names

Two varieties of keys exist in every theme:

- **Reserved keys** are the named keys that ship with the schema. They must be present and cannot be renamed. Reserved key names carry meaning across themes. So for example, `@swatch.primary` is "the primary color" in every theme, while `@fontSize.medium` is "the medium step on the type scale" in every theme.

- **Custom keys** are user-added entries. They use the convention `custom1`, `custom2`, ... and appear in an editor using it's `name` field.

When adding a **custom** key to a theme:

- Use `custom1`, `custom2`, ... as key names when the type allows
- Set the `name` for the custom key for its display label.
- Do not invent custom key names like `font.myfont` or `shadow.softDepth`.

Custom tokens do not participate in either ordinal or categorical behaviors. They are loose extensions that components reference directly by their key. If a property references a key that is missing from the active theme, the property's default value is used.

Every token except `@fontFamily.*` accepts custom keys. Most stock themes ship without authoring any so color palettes and scale tokens stay consistent across themes. `earth` and `googleMaterial` author custom swatches as examples. A theme is free to add `custom1`, `custom2`, ... wherever they make sense.

---

### Complete list of theme tokens

| Token | Type | Reserved keys | Custom keys |
| --- | --- | --- | --- |
| `@fontFamily.*` | `theme.categorical` | `primary` \| `secondary` | -- |
| `@size.*` | `theme.ordinal` | `tiny` \| `xxsmall` \| `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` \| `xxlarge` \| `huge` | `custom1` \| `custom2` \| ... |
| `@dimension.*` | `theme.ordinal` | `tiny` \| `xxsmall` \| `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` \| `xxlarge` \| `huge` | `custom1` \| `custom2` \| ... |
| `@margin.*` | `theme.ordinal` | `tight` \| `compact` \| `cozy` \| `comfortable` \| `open` | `custom1` \| `custom2` \| ... |
| `@padding.*` | `theme.ordinal` | `tight` \| `compact` \| `cozy` \| `comfortable` \| `open` | `custom1` \| `custom2` \| ... |
| `@gap.*` | `theme.ordinal` | `tight` \| `compact` \| `cozy` \| `comfortable` \| `open` | `custom1` \| `custom2` \| ... |
| `@corners.*` | `theme.ordinal` | `tight` \| `compact` \| `cozy` \| `comfortable` \| `open` | `custom1` \| `custom2` \| ... |
| `@borderWidth.*` | `theme.ordinal` | `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` | `custom1` \| `custom2` \| ... |
| `@blur.*` | `theme.ordinal` | `tiny` \| `xxsmall` \| `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` \| `xxlarge` \| `huge` | `custom1` \| `custom2` \| ... |
| `@spread.*` | `theme.ordinal` | `tiny` \| `xxsmall` \| `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` \| `xxlarge` \| `huge` | `custom1` \| `custom2` \| ... |
| `@fontSize.*` | `theme.ordinal` | `tiny` \| `xxsmall` \| `xsmall` \| `small` \| `medium` \| `large` \| `xlarge` \| `xxlarge` \| `huge` | `custom1` \| `custom2` \| ... |
| `@fontWeight.*` | `theme.ordinal` | `thin` \| `xlight` \| `light` \| `normal` \| `medium` \| `semibold` \| `bold` \| `xbold` \| `black` | `custom1` \| `custom2` \| ... |
| `@lineHeight.*` | `theme.ordinal` | `solid` \| `tight` \| `compact` \| `cozy` \| `comfortable` \| `open` \| `none` | `custom1` \| `custom2` \| ... |
| `@swatch.*` | `theme.categorical` | `white` \| `gray` \| `black` \| `primary` \| `swatch1` \| `swatch2` \| `swatch3` \| `swatch4` \| `foreground` \| `background` \| `active` \| `punch` \| `positive` \| `negative` \| `warning` \| `accent` \| `offBlack` \| `offWhite` | `custom1` \| `custom2` \| ... |
| `@font.*` | `theme.categorical` | `display` \| `heading` \| `subheading` \| `title` \| `subtitle` \| `callout` \| `body` \| `label` \| `tagline` \| `code` | `custom1` \| `custom2` \| ... |
| `@border.*` | `theme.categorical` | `hairline` \| `thin` \| `normal` \| `thick` \| `bevel` | `custom1` \| `custom2` \| ... |
| `@gradient.*` | `theme.categorical` | `primary` \| `gradient1` \| `gradient2` | `custom1` \| `custom2` \| ... |
| `@shadow.*` | `theme.categorical` | `xlight` \| `light` \| `moderate` \| `strong` \| `xstrong` | `custom1` \| `custom2` \| ... |
| `@scrollbar.*` | `theme.categorical` | `primary` | `custom1` \| `custom2` \| ... |

`@swatch.swatch1` through `@swatch.swatch4` are reserved palette slots filled in by `computeTheme`; they are not custom slots even though their keys are numbered.

The look tables also reserve cleared ids that `computeTheme` injects at compute time: `@font.normal` plus `none` on `@border.*` and `@shadow.*`. They are part of every computed theme even though stock themes do not author them. The `@gradient.*` section has no cleared look.

```typescript
import { ValueType } from "@seldon/core"

{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" }
{ type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" }
```

---

## Theme Token Types

Every token is saved using one **token type**. That type defines what fields to expect on the same object, for example a modulated space value, a fixed pixel size, or an rgb color.

Every token cell uses a single input field named `parameters`. The shape of `parameters` depends on the token type.

| Type | `parameters` shape |
| --- | --- |
| `modulated` | `{ step: number }` |
| `exact` | `{ unit: "px" \| "rem" \| "%" \| "deg" \| "number", value: number }` |
| `dynamic.swatch` | (no `parameters`; uses `role: white \| gray \| black \| primary \| swatch1 \| swatch2 \| swatch3 \| swatch4`) |
| `swatch` | `{ colorspace: "hsl" \| "rgb" \| "lch" \| "hex" \| "name", value: <payload for that colorspace> }` |
| `font.family` | string (font family name) |
| `option` | string option key (e.g. `"hairline"`); the set of allowed keys is per-table |
| `look` | object of nested parameters specific to the look (font, shadow, border, gradient, scrollbar) |

```typescript
enum TokenType {
  MODULATED = "modulated",
  EXACT = "exact",
  SWATCH = "swatch",
  FONT_FAMILY = "font.family",
  OPTION = "option",
  LOOK = "look",
  DYNAMIC_SWATCH = "dynamic.swatch",
  COMPUTED = "computed.group",
}
```

---

### Modulated tokens and parameters

Modulation tokens keep a whole family of sizes, spacings, line widths, and font sizes in proportion. Instead of writing each value as a fixed number, you give them a `step`, a position on the theme's modular scale, relative to the base size set in `modulation.parameters.baseSize` and `modulation.parameters.ratio`.

A step of `0` is the base, positive steps grow larger, negative steps grow smaller. A step has the same meaning across themes. So when you switch the base size or the ratio of a theme, the whole scale moves together. This is what keeps a theme feeling consistent without hand-tuning every token.

The result of a modulated token is `modulation.parameters.baseSize * modulation.parameters.ratio ** parameters.step`.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | `TokenType.MODULATED` | Discriminator. |
| `name` | no | string | Display label for the token. |
| `intent` | no | string | Free-text description of about this modulated value. |
| `parameters.step` | yes | number | Position on the modular scale. The allowed range is -20 to 20 in increments of 0.01. `0` returns `modulation.parameters.baseSize`. |

```typescript
import { TokenType } from "@seldon/core/themes"

size: {
  medium: {
    type: TokenType.MODULATED,
    name: "Medium",
    parameters: { step: 0 },
  },
  xsmall: {
    type: TokenType.MODULATED,
    name: "Extra small",
    intent: "Used for tight inline visual affordances.",
    parameters: { step: -3.11 },
  },
},
margin: {
  compact: {
    type: TokenType.MODULATED,
    name: "Compact",
    parameters: { step: -3.11 },
  },
}
```

---

### Exact tokens and parameters

Exact tokens hold a fixed length or unitless number. Use them when a value should not or does not need to move with the modular scale. For example, adding specific font weight, a precise line-height multiplier, or a one-off pixel size.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | `TokenType.EXACT` | Discriminator. |
| `name` | no | string | Display label for the token. |
| `intent` | no | string | Free-text description. |
| `parameters.unit` | yes | `option: px, rem, %, deg, number` | Unit of the value. Which units are accepted in a given section is set by that section's token schema. |
| `parameters.value` | yes | number | Numeric value paired with the unit. |

```typescript
import { TokenType } from "@seldon/core/themes"

padding: {
  comfortable: {
    type: TokenType.EXACT,
    name: "Comfortable",
    parameters: { unit: Unit.PX, value: 32 },
  },
},
lineHeight: {
  open: {
    type: TokenType.EXACT,
    name: "Open",
    intent: "For airy, generous body text.",
    parameters: { unit: Unit.NUMBER, value: 2.5 },
  },
},
fontWeight: {
  bold: {
    type: TokenType.EXACT,
    name: "Bold",
    parameters: { unit: Unit.NUMBER, value: 700 },
  },
}
```

---

### Dynamic Swatch tokens and parameters

Dynamic swatches keep a theme's color system in alignment. Instead of writing eight individual colors by hand, you pick a `role` for the dynamic swatch and `computeTheme` fills in the actual color using values from the theme's `colorHarmony` group.

The eight roles are the classic palette every theme exposes:

- `white`, `gray`, and `black` are the three neutrals, each tinted by `bleed` if specified so they sit naturally next to the base color.
- `primary` which is the base color itself.
- `swatch1` through `swatch4` are four harmony colors derived from the primary, becoming complements, tints, shades, and so on, depending on the theme's harmony.

A role has the same meaning across themes. So when you switch the base color or harmony, the whole palette retunes together. This can keep a theme feeling consistent without hand-picking every color.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | `TokenType.DYNAMIC_SWATCH` | Discriminator. |
| `role` | yes | `option: white, gray, black, primary, swatch1, swatch2, swatch3, swatch4` | Palette slot to resolve. |
| `intent` | no | string | Free-text description. |

```typescript
import { TokenType } from "@seldon/core/themes"

swatch: {
  white: {
    type: TokenType.DYNAMIC_SWATCH,
    role: "white",
    intent: "Slight off-white to match brand.",
  },
  swatch3: {
    type: TokenType.DYNAMIC_SWATCH,
    role: "swatch3",
    intent: "A tint of the primary color.",
  },
}
```

---

### Swatch tokens and parameters

Swatch tokens hold a specified color, defined in one of the supported colorspaces. Use swatches for defining color as needed. Note that when switching themes, dynamic colors will always switch based on a matching dynamic color while custom swatches will follow the rules outlined in copying and pasting components.

The reserved fixed-color swatch keys are the ten interface slots: `foreground`, `background`, `active`, `punch`, `positive`, `negative`, `warning`, `accent`, `offBlack`, and `offWhite`. They stay slot-stable across themes, and missing slots fall back to the Seldon interface defaults during `computeTheme`. All other authored swatch keys are custom, with the `name` field being the main identifier for users, so use a meaningful value.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | `TokenType.SWATCH` | Discriminator. |
| `name` | no | string | Display label. |
| `intent` | no | string | Free-text description. |
| `parameters.colorspace` | yes | `option: hsl, rgb, lch, hex, name` | Color space discriminator. |
| `parameters.value` | yes | object or string | HSL/RGB/LCH object for those colorspaces; hex string like `"#aabbcc"` for `hex`; CSS named color string like `"purple"` for `name`. |

```typescript
import { Colorspace, TokenType } from "@seldon/core/themes"

swatch: {
  background: {
    type: TokenType.SWATCH,
    name: "Background",
    intent: "The default color used to fill backgrounds, often white or black.",
    parameters: {
      colorspace: Colorspace.HSL,
      value: { hue: 18, saturation: 12, lightness: 8 },
    },
  },
  forestGreen: {
    type: TokenType.SWATCH,
    name: "Forest Green",
    intent: "An earthy green used as a complementary color for content.",
    parameters: {
      colorspace: Colorspace.HEX,
      value: "#2c6e49",
    },
  },
}
```

---

### Font Family tokens and parameters

Font family tokens hold a typeface by name. A theme always exposes two slots, `fontFamily.primary` and `fontFamily.secondary`, so `font` looks can pick a pairing using `@fontFamily.primary` and `@fontFamily.secondary` instead of repeating long family strings everywhere.

Two slots is intentional: classic typographic systems work as pairs. A primary family carries continuous reading and form labels, while a secondary family carries headings, display, or accents. Think a calm sans paired with an expressive serif. Switching either font family token retunes the whole theme's typographic voice without touching individual `font` looks.

There is no `name` field. The display label in the product is derived from the family string itself (the value you write in `parameters`). Intents are optional.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | `TokenType.FONT_FAMILY` | Discriminator. |
| `intent` | no | string | Free-text description. |
| `parameters` | yes | string | Font family name (e.g. `"Inter"`, `"Raleway"`). |

```typescript
import { TokenType } from "@seldon/core/themes"

fontFamily: {
  primary: {
    type: TokenType.FONT_FAMILY,
    intent: "Used for body text.",
    parameters: "Raleway",
  },
  secondary: {
    type: TokenType.FONT_FAMILY,
    intent: "Used for headings.",
    parameters: "Inter",
  },
}
```

---

### Option tokens and parameters

Option tokens hold a discrete option key instead of a numeric value. Use them when a section needs to expose a named, non-numeric behavior alongside its regular scale, for example the `hairline` option on `borderWidth`, which renders as a single physical pixel regardless of the modular scale.

The set of allowed option keys is defined per-table by the section that consumes them, so a future option such as a half-pixel border is added by extending that table's allowed keys. The token shape itself does not change.

Names and intents are optional.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | `TokenType.OPTION` | Discriminator. |
| `name` | no | string | Display label. |
| `intent` | no | string | Free-text description. |
| `parameters` | yes | Option key as a string | The option to apply. |

```typescript
import { TokenType } from "@seldon/core/themes"

borderWidth: {
  hairline: {
    type: TokenType.OPTION,
    name: "Hairline",
    intent: "Single physical pixel, independent of the scale.",
    parameters: "hairline",
  },
}
```

---

### Look tokens and parameters

Look tokens describe a compound visual recipe as a set of nested parameters. A look can be a font, a border, a gradient, a shadow, or a scrollbar. Each look has its own `parameters` shape. The component `background` property resolves through the `gradient` look section.

In other systems looks are sometimes called recipes or styles. Seldon uses one word, "look", because the term covers all uniformly. `font` and `border` feel like a style, while `gradient` and `shadow` feel more like a recipe.

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `type` | yes | `TokenType.LOOK` | Discriminator. |
| `name` | no | string | Display label. |
| `intent` | no | string | Free-text description. |
| `parameters` | yes | object | Section-specific recipe. See `font`, `border`, `gradient`, `shadow`, `scrollbar` below. |

---

#### Font looks

Font looks bundle a typographic recipe of family, weight, size, line height, and optional case and spacing, so the same recipe can be applied across components via `@font.<id>`. All parameters are optional. Omit any field to leave it unset. Family typically resolves to `@fontFamily.primary` or `@fontFamily.secondary`.

| Parameter | Type | Values |
| --- | --- | --- |
| `family` | `atomic` | `empty` \| `theme.categorical: @fontFamily.*` \| `exact: string` |
| `weight` | `atomic` | `empty` \| `exact: number, 100–900` \| `theme.ordinal: @fontWeight.*` |
| `size` | `atomic` | `empty` \| `exact: px, rem` \| `theme.ordinal: @fontSize.*` |
| `lineHeight` | `atomic` | `empty` \| `exact: px, rem, %` \| `exact: unitless number, >0` \| `theme.ordinal: @lineHeight.*` |
| `style` | `atomic` | `empty` \| `option: normal, italic, oblique` |
| `textCase` | `atomic` | `empty` \| `option: normal, lowercase, uppercase, capitalize` |
| `letterSpacing` | `atomic` | `empty` \| `exact: px, rem` \| `theme.ordinal: @size.*` |

> Note: `LetterSpacingValue` currently accepts `empty | px | rem` only. The `theme.ordinal: @size.*` shape is the eventual target. No stock theme uses it today.

```typescript
import { TokenType, ValueType } from "@seldon/core/themes"

font: {
  body: {
    type: TokenType.LOOK,
    name: "Body",
    parameters: {
      family: { type: ValueType.THEME_CATEGORICAL, value: "@fontFamily.primary" },
      weight: { type: ValueType.THEME_ORDINAL, value: "@fontWeight.normal" },
      size: { type: ValueType.THEME_ORDINAL, value: "@fontSize.medium" },
      lineHeight: { type: ValueType.THEME_ORDINAL, value: "@lineHeight.tight" },
    },
  },
}
```

---

#### Border looks

Border looks describe a border treatment of style, width, color, opacity, and brightness, so the same border can be applied across components via `@border.<id>`. Border collapse lives at the component level, not on the look. All parameters are optional.

| Parameter | Type | Values |
| --- | --- | --- |
| `style` | `atomic` | `empty` \| `option: none, solid, dashed, dotted, double, groove, ridge, inset, outset, hidden` |
| `width` | `atomic` | `empty` \| `exact: px, rem` \| `option: hairline` \| `theme.ordinal: @borderWidth.*` |
| `color` | `atomic` | `empty` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` |
| `opacity` | `atomic` | `empty` \| `exact: %, 0–100` |
| `brightness` | `atomic` | `empty` \| `exact: %, 0–100` |

```typescript
import { TokenType, ValueType } from "@seldon/core/themes"

border: {
  thin: {
    type: TokenType.LOOK,
    name: "Thin line",
    parameters: {
      width: { type: ValueType.THEME_ORDINAL, value: "@borderWidth.small" },
      style: { type: ValueType.OPTION, value: BorderStyle.SOLID },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary" },
      opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 100 } },
    },
  },
}
```

---

#### Gradient looks

Gradient looks describe a two-stop linear or radial gradient with type, angle, and a start and an end stop carrying color, opacity, brightness, and position, so the same gradient can be applied across components via `@gradient.<id>`. All parameters are optional. Omit a stop's fields to fall back to defaults. `angle` applies only to linear gradients.

| Parameter | Type | Values |
| --- | --- | --- |
| `gradientType` | `atomic` | `empty` \| `option: linear, radial` |
| `angle` | `atomic` | `empty` \| `exact: degrees` |
| `startColor` | `atomic` | `empty` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` |
| `startOpacity` | `atomic` | `empty` \| `exact: %, 0–100` |
| `startBrightness` | `atomic` | `empty` \| `exact: %, 0–100` |
| `startPosition` | `atomic` | `empty` \| `exact: %, 0–100` |
| `endColor` | `atomic` | `empty` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` |
| `endOpacity` | `atomic` | `empty` \| `exact: %, 0–100` |
| `endBrightness` | `atomic` | `empty` \| `exact: %, 0–100` |
| `endPosition` | `atomic` | `empty` \| `exact: %, 0–100` |

```typescript
import { TokenType, ValueType } from "@seldon/core/themes"

gradient: {
  primary: {
    type: TokenType.LOOK,
    name: "Ramp",
    parameters: {
      gradientType: { type: ValueType.OPTION, value: GradientType.LINEAR },
      angle: { type: ValueType.EXACT, value: { unit: Unit.DEGREES, value: 0 } },
      startColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
      endColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
    },
  },
}
```

---

#### Shadow looks

Shadow looks describe a drop-shadow with offsets, blur, spread, color, brightness, and opacity, so the same shadow can be applied across components via `@shadow.<id>`. All parameters are optional. `offsetX` is the horizontal offset. `offsetY` is the vertical offset.

| Parameter | Type | Values |
| --- | --- | --- |
| `offsetX` | `atomic` | `empty` \| `exact: px, rem` |
| `offsetY` | `atomic` | `empty` \| `exact: px, rem` |
| `blur` | `atomic` | `empty` \| `exact: px, rem` \| `theme.ordinal: @blur.*` |
| `spread` | `atomic` | `empty` \| `exact: px, rem` \| `theme.ordinal: @spread.*` |
| `color` | `atomic` | `empty` \| `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` |
| `brightness` | `atomic` | `empty` \| `exact: %, 0–100` |
| `opacity` | `atomic` | `empty` \| `exact: %, 0–100` |

```typescript
import { TokenType, ValueType } from "@seldon/core/themes"

shadow: {
  light: {
    type: TokenType.LOOK,
    name: "Soft",
    parameters: {
      offsetX: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 0 } },
      offsetY: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 2 } },
      blur: { type: ValueType.THEME_ORDINAL, value: "@blur.small" },
      spread: { type: ValueType.THEME_ORDINAL, value: "@spread.xsmall" },
      color: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.black" },
      opacity: { type: ValueType.EXACT, value: { unit: Unit.PERCENT, value: 33 } },
    },
  },
}
```

---

#### Scrollbar looks

Scrollbar looks describe how a scrollbar is painted with track color, thumb color, hover color, track thickness, and whether the thumb is rounded, so the same scrollbar can be applied across components via `@scrollbar.<id>`. Unlike the other looks, every scrollbar parameter is required, with no `empty` clause.

| Parameter | Type | Values |
| --- | --- | --- |
| `trackColor` | `atomic` | `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` |
| `thumbColor` | `atomic` | `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` |
| `thumbHoverColor` | `atomic` | `exact: hex, hsl, rgb, lch` \| `option: transparent` \| `theme.categorical: @swatch.*` |
| `trackSize` | `atomic` | `exact: px, rem` |
| `rounded` | `atomic` | `exact: boolean` |

```typescript
import { TokenType, ValueType } from "@seldon/core/themes"

scrollbar: {
  primary: {
    type: TokenType.LOOK,
    name: "Primary",
    parameters: {
      trackColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.white" },
      thumbColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.swatch2" },
      thumbHoverColor: { type: ValueType.THEME_CATEGORICAL, value: "@swatch.swatch3" },
      trackSize: { type: ValueType.EXACT, value: { unit: Unit.REM, value: 0.5 } },
      rounded: { type: ValueType.EXACT, value: true },
    },
  },
}
```

---

## Theme Composition

`instantiateTheme` in `themes/compute/instantiate-theme.ts` deep-merges a packaged stock authoring row with an overrides patch via `lodash/merge`, then runs `computeTheme` on the result. Pass the catalog id first, the overrides object second, and a `PresetThemesById` map (e.g. `STOCK_THEMES_BY_ID`) third. Empty or missing `overrides` skips the merge step and runs `computeTheme(base)` only.

```typescript
// Compose more than two sources by chaining `lodash/merge` outside of
// `instantiateTheme`, then handing the result to `computeTheme`:
import merge from "lodash/merge"

import { STOCK_THEMES_BY_ID } from "@seldon/core/themes"
import { computeTheme } from "@seldon/core/themes"
import { instantiateTheme } from "@seldon/core/themes/compute"

const branded = instantiateTheme(
  "seldon",
  {
    colorHarmony: {
      parameters: { baseColor: { hue: 200, saturation: 70, lightness: 45 } },
    },
  },
  STOCK_THEMES_BY_ID,
)

const layered = computeTheme(
  merge({}, STOCK_THEMES_BY_ID.googleMaterial, brandOverrides, scaleOverrides),
)
```

Workspace pipelines pick a stock template by id and apply user-supplied overrides on top, then materialize once per active theme.

### Workspace serialization

[`workspace.json`](../workspace/README.md) holds **raw authoring state** only: each board / node references a theme by an opaque string ref (for example `theme-earth-default`) and the editable theme source rows live under the top-level `themes` map. Computed theme rows are produced by read-side selectors (`computeWorkspaceThemes`, `getComputedTheme`); they are **not** persisted back into the file.

[`catalog-ids.ts`](./catalog-ids.ts) exports `packagedThemeCatalogIds`. Workspace validation uses the ids to check theme board `catalogId` values.

### Computed resolution (imports)

The main [`@seldon/core/themes`](./index.ts) barrel re-exports `computeTheme` and `normalizeTheme` from [`./helpers`](./helpers/index.ts), but keeps palette math, `instantiateTheme`, and the input normalizer in **[`@seldon/core/themes/compute`](./compute/index.ts)** to avoid an import cycle with `themes/catalog`. Use **`@seldon/core/themes/compute`** for `instantiateTheme`, `normalizeThemeInput`, `getDynamicSwatchColors`, `getPalette`, and the colorspace helpers. Resolving an `@<scope>.<key>` reference into a concrete CSS value is **property-side** (`helpers/resolution`), not this package; behavior and palette rules for theme materialization are documented in [`compute/README.md`](./compute/README.md).

---

## Validation Examples

```typescript
// ✅ Valid theme token cells
const validSwatch: ThemeSwatch = {
  type: TokenType.SWATCH,
  parameters: { colorspace: Colorspace.HEX, value: "#2c6e49" },
}
const validStep: ThemeScaleToken = {
  type: TokenType.MODULATED,
  parameters: { step: -2 },
}

// ❌ TypeScript will catch invalid theme tokens
const invalidStep: ThemeScaleToken = {
  type: "exact", // wrong discriminator for a modulated step
  parameters: { step: "small" }, // step must be a number
}
const invalidRef: BorderColorValue = {
  type: ValueType.THEME_CATEGORICAL,
  value: "@swatch.does-not-exist", // not in `ThemeSwatchKey`
}
```

At runtime, workspace validation middleware checks token values when a theme action is dispatched. There is no standalone token validator in this package.

---

## Type Safety

### Theme Id Constraints

[`types/theme-id.ts`](./types/theme-id.ts) exposes the catalog union and the workspace-instance union:

```typescript
// 10 packaged stock rows
export type ThemeTemplateId =
  | "seldon"
  | "earth"
  | "highContrast"
  | "industrial"
  | "googleMaterial"
  | "popPunk"
  | "ibmCarbon"
  | "adobeSpectrum"
  | "sunsetBlue"
  | "wildberry"

export type ThemeInstanceId = ThemeTemplateId
```

In a workspace file, **board theme refs, node `theme` fields, and keys in the `themes` map** are opaque **strings** (for example `theme-earth-default`); resolution happens through `getComputedTheme` / `computeWorkspaceThemes`. Treat those refs as `string` at workspace boundaries until workspace types are aligned.

### Token Table Shape

**Authoritative table types** live in [`types/helpers.ts`](./types/helpers.ts) as `ThemeTokenTable<TUnion, TCell>`. Reserved keys (the part of `TUnion` outside `ThemeCustomKey`) are required; `customN` slots are optional:

```typescript
export type ThemeCustomKey = `custom${number}`

export type ThemeTokenTable<TUnion extends string, TCell> = Record<
  Exclude<TUnion, ThemeCustomKey>,
  TCell
> &
  Partial<Record<ThemeCustomKey, TCell>>
```

This is how every token namespace except `fontFamily` (which only has fixed `primary` / `secondary` slots) is composed on `BaseTheme`.

### Token Id Unions

**Authoritative slot id unions** live in [`types/theme-token-ids.ts`](./types/theme-token-ids.ts). Each is a union of reserved literals plus `` `custom${number}` `` and is what restricts a token table's keys:

```typescript
// Abbreviated from `types/theme-token-ids.ts` — see source for full unions.
export type ThemeFontSizeId =
  | "tiny"
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "huge"
  | `custom${number}`

export type ThemeSpacingId =
  | "tight"
  | "compact"
  | "cozy"
  | "comfortable"
  | "open"
  | `custom${number}`

export type ThemeSwatchId =
  | "white"
  | "gray"
  | "black"
  | "primary"
  | "swatch1"
  | "swatch2"
  | "swatch3"
  | "swatch4"
  | ThemeStaticSwatchId // the ten interface slots | `custom${number}`
```

### Theme Reference Validation

**Authoritative `@`-reference unions** live in [`types/theme-reference-keys.ts`](./types/theme-reference-keys.ts) as `ThemeSwatchKey`, `ThemeFontSizeKey`, `ThemeMarginKey`, etc., plus their union `ThemeValueKey`. These are template-string types built from the slot unions above:

```typescript
// Abbreviated from `types/theme-reference-keys.ts` — see source for the full set.
export type ThemeSwatchKey   = `@swatch.${ThemeSwatchId}`
export type ThemeFontSizeKey = `@fontSize.${ThemeFontSizeId}`
export type ThemeMarginKey   = `@margin.${ThemeSpacingId}`

{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.primary"  } // ✅ Valid
{ type: ValueType.THEME_ORDINAL,     value: "@fontSize.medium" } // ✅ Valid
{ type: ValueType.THEME_CATEGORICAL, value: "@swatch.invalid"  } // ❌ Type error against ThemeSwatchKey
```

---

## Theme Remapping Rules

Swapping the active theme on a board or node does not just retune `@` references in place. Seldon walks the affected node overrides and rewrites each theme token so it points at the right slot in the new theme. This keeps reserved tokens aligned across themes and decides what to do when a token has no home in the target theme.

---

### When Remapping Occurs

There are two entry points:

- **Board theme swap** (`setComponentTheme`) sets the board's `componentTheme`, then remaps every variant whose `theme` is `null`. A variant with its own theme keeps that theme and is skipped.
- **Node theme swap** (`setNodeTheme`) remaps the node from its current theme to the new one, then stores the new `theme` on the node. A `null` theme means the node inherits from its parent or board.

Both paths walk the node's effective properties, remap each theme token they find, and recurse into child nodes when the node's template is a catalog component.

---

### Matching Behavior

Each `@<section>.<slot>` reference is split into a section and a slot, then matched against the new theme in order:

1. **Exact slot match.** If the new theme has the same slot, the reference is rewritten to that slot. Reserved slots like `@fontSize.medium`, `@margin.compact`, and `@border.thin` always match this way because every theme ships the same reserved keys. The value retunes to the new theme.
2. **Name match.** For `customN` slots only, Seldon compares the token `name` from the current theme against names in the new theme. The match is case insensitive. Font family tokens compare their family string.
3. **Value match.** For `customN` slots only, Seldon compares the token's stored value against values in the new theme.

Swatch tokens follow the same order with one addition. The reserved palette slots `none`, `transparent`, `background`, `black`, `gray`, `white`, `primary`, and `swatch1` through `swatch4` carry over by slot. Dynamic palette swatches always switch to the matching role in the new theme, so the palette retunes together. Custom swatches match by slot, then name, then value.

---

### No Match Behavior

A reserved slot always exists in the new theme, so only `customN` slots can go unmatched. When no match is found, Seldon detaches the token instead of leaving a broken reference, with two exceptions:

- **Exact value tokens** become an `EXACT` literal read from the current theme. This covers custom swatch colors, exact font weights, and exact line heights. The component keeps its current value but loses the token link.
- **Modulated tokens** keep their original reference. Sizes, spacing, gaps, and modulated font sizes hold a `step`, so detaching to a fixed number would break the scale. The reference stays, and the property falls back to its schema default at compute time.
- **String parameter tokens** keep their original reference. Font family tokens and option tokens such as `hairline` have no concrete value to freeze. They also fall back to the schema default at compute time.

This is why a missing `customN` color bakes into a fixed color, while a missing `customN` size quietly returns to its default. The behavior matches the rule in [Graceful Degradation](#graceful-degradation): a property that references an absent slot falls back to its schema default.

---

## Performance Considerations

**Note:** The bullets below are **general engineering guidance** for systems that use themes heavily. They are not a guarantee that every optimization is implemented or measured inside this package.

### Optimization Strategies

1. **Prefer the precomputed constants**. Use `THEMES_BY_ID`, `THEMES`, and `defaultTheme` from `themes/catalog` instead of recomputing stock rows on each access.
2. **Let `instantiateTheme` short-circuit**. Calling it with no `overrides` skips the merge and runs `computeTheme(base)` only.
3. **Cache dynamic palettes**. Results from `getDynamicSwatchColors` and `getPalette` are stable for a given `modulation` and `colorHarmony` group. Reuse the surrounding `ComputedTheme` instance.
4. **Prefer `@token` references**. Reach for stock palette and scale slots before introducing inline `customN` swatches or one-off exact values.

### Memory Management

1. **Reuse one `ComputedTheme` per active id**. Hand the same instance to every consumer rather than recomputing per call site.
2. **Avoid deep-cloning token tables**. They are designed to be replaced by reference. Mutate via `instantiateTheme(templateId, overrides, …)` instead.
3. **Use immutable updates**. Apply overrides as a new top-level patch object. Do not mutate stock rows in place.
4. **Drop unused custom slots**. Clean up `customN` keys when their referencing properties go away so workspace serialization stays small.

---

## Error Handling

**Note:** This section describes **typical failure modes** at a product level (TypeScript, validation, theme materialization). Specific error strings, logging hooks, or fallbacks depend on the caller and are not all implemented as APIs in `packages/core/themes`.

### Validation Errors

- **Invalid theme structure**: TypeScript compilation errors against `StockTheme` and `ComputedTheme`.
- **Missing pipeline shape**: `normalizeThemeInput` throws `"Theme must have modulation and colorHarmony properties"` when those groups are missing.
- **Missing icon set**: `normalizeThemeInput` throws `"Theme must define iconSet"` when neither `iconSet` nor the legacy `icon` field is present.
- **Unknown stock template**: `instantiateTheme` throws `Unknown theme template: <id>` when the id is not in the supplied `PresetThemesById` map.
- **Bad token cell**: workspace validation middleware rejects unknown keys and shape-mismatched payloads when a theme action is dispatched.

### Graceful Degradation

- **Missing `customN` keys**: properties that reference an absent custom slot fall back to their schema default.
- **Partial color overrides**: dynamic swatches recompute from whatever `colorHarmony` inputs are provided. Unset fields keep the stock value.
- **Legacy theme JSON**: `normalizeThemeInput` coerces missing `TokenType` tags and unit-shaped numbers before palette math runs.

### Debugging Support

- **Clear error messages** on the throws above name the offending block (`modulation` / `colorHarmony` / `iconSet`) or the unknown template id.
- **Token-key logging** when bridging to `validatePropertyValue` is the recommended product-level hook for surfacing which `@<scope>.<slot>` failed validation.
- **Stable palette intents**: `getDynamicSwatchName` provides human-readable labels for dynamic palette slots, useful in editor diagnostics.

---

## Adding Themes and Tokens to Core

This is a step-by-step process for introducing new theme content. Most needs (a fresh stock theme, a brand-tuned variant) are covered by **Adding a stock theme** below; reach for the broader recipe only when introducing a new reserved key, a new token kind, or a new section.

**1. Update theme types**

Touch [`types/theme.ts`](./types/theme.ts) only when adding a new top-level section to `BaseTheme`. To add a new reserved key inside an existing namespace, extend the matching union in [`types/theme-token-ids.ts`](./types/theme-token-ids.ts):

```typescript
// /packages/core/themes/types/theme-token-ids.ts
export type ThemeFontSizeId =
  | "tiny"
  | "xxsmall"
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "xlarge"
  | "xxlarge"
  | "huge"
  | "display" // ← new reserved slot
  | `custom${number}`
```

**2. Create or extend a token cell**

Add the cell module under `values/<segment>/` next to its peers. Re-export the shape and any helpers from [`values/index.ts`](./values/index.ts):

```typescript
// /packages/core/themes/values/typography/font.ts (illustrative)
import { TokenType } from "../../constants"

export interface ThemeFont {
  type: TokenType.LOOK
  name?: string
  intent?: string
  parameters: FontParameters
}
```

**3. Constants, schemas, and section ordering**

- **`constants/`**: `TokenType`, `Colorspace`, `Harmony`, `Ratio`. Update only when introducing a new token kind or harmony.
- **`schemas/data/theme-token-schemas.ts`** and **`schemas/data/theme-dynamic-schemas.ts`**: register the new schema so editor menus can render it.
- **`schemas/sections.ts`**: add a row to `THEME_TOKEN_SECTION_ORDER` at the position where the section should render. The list order is the sidebar order. Look sections render after the scale sections they relate to.

**4. Update exports**

- Re-export new types and helpers from **`values/index.ts`**, **`constants/index.ts`**, **`types/index.ts`**, or **`schemas/index.ts`** as appropriate.
- The root **`themes/index.ts`** already re-exports `./constants`, `./schemas`, `./types`, plus `computeTheme` / `normalizeTheme`; consumers stay on `@seldon/core/themes` without duplicating paths.

**5. Adding a stock theme**

Most theme work goes through this sub-recipe rather than touching token kinds:

1. Add the new id to **`ThemeTemplateId`** in [`types/theme-id.ts`](./types/theme-id.ts).
2. Create the file under **`catalog/`** with every section listed in [Theme Structure](#theme-structure).
3. Register it in [`catalog/index.ts`](./catalog/index.ts) (`STOCK_THEMES`, `THEMES_BY_ID`).
4. Touch [`types/theme-token-ids.ts`](./types/theme-token-ids.ts) **only when** introducing genuinely new reserved keys or sections. Ordinary new themes do not need this. `customN` slots are built into every token table via `ThemeTokenTable`.
5. Run tests and validate `@`-paths against property schemas.

**6. Add tests**

Create test files following the existing patterns in this package:

```typescript
// /packages/core/themes/catalog/<id>.test.ts
import { describe, expect, it } from "vitest"

import { STOCK_THEMES_BY_ID, computeTheme } from "@seldon/core/themes"

describe("<id> stock theme", () => {
  it("materializes without throwing", () => {
    const computed = computeTheme(STOCK_THEMES_BY_ID["<id>"])
    expect(computed.id).toBe("<id>")
    expect(computed.swatch.primary).toBeDefined()
  })
})
```

---

## Licensing

License and contributor documents live at the repository root under [`license/`](../../../license/README.md). Links in this section resolve from `packages/core/themes/` via `../../../license/…`.

This project is licensed as follows:

- **Noncommercial Use** → Licensed under the [PolyForm Noncommercial License](../../../license/noncommercial/LICENSE.md)
- **Commercial Use** → Requires a separate paid license. See [Commercial License](../../../license/commercial/COMMERCIAL-LICENSE.md)
- **Contributors** → Must follow [Contributing Guidelines](../../../license/contributors/CONTRIBUTING.md) and sign the [Contributor License Agreement](../../../license/contributors/CLA.md)

### Quick Links

- [License index](../../../license/README.md)
- [Noncommercial License (default)](../../../license/noncommercial/LICENSE.md)
- [Licensing overview](../../../README.md#licensing)
- [Commercial license terms (full text)](../../../license/commercial/COMMERCIAL-LICENSE.md)
- [CLA – Contributor License Agreement](../../../license/contributors/CLA.md)
- [Official repository notice](../../../license/NOTICE.md)

**Reminder:** If you use this software in a business, SaaS product, or any commercial context, you **must obtain a commercial license**.

---

## Links

- [Core](../README.md)
- [Factory](../../factory/README.md)
- [Editor](../../editor/README.md)
- [Official Website](https://seldon.digital)
- [Issues & Discussions](https://github.com/seldon/issues)

---

## Notice for AI and LLM Training

You may not use this software, or any derivative works of it, in whole or in part, for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly) any machine learning or artificial intelligence system without written permission.
