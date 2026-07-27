import { DesignSemanticsConfig } from "../types/design-semantics-types"

/**
 * Design Semantics Configuration
 *
 * The single source for how a spoken design concept maps to a concrete property
 * edit. `intents` route a concept to an ordered list of candidate property
 * paths. A concept is only deterministic once a target is known, so the resolver
 * picks the first candidate whose root key the target component exposes; "size"
 * becomes `font.size` on text but `width` on a frame. `tokenSynonyms` map
 * descriptive words to real theme token ids per scope, so a request like
 * "make it big" resolves to `@fontSize.xxlarge` deterministically instead of the
 * model guessing the scale. Magnitude words such as "big" and "bold" live only
 * here, not in intent `phrases`, since they are values on a scale, not concepts.
 *
 * Synonym keys are pre-normalized (lowercase, alphanumerics only), matching the
 * normalization the resolver applies to the user's word. Synonym values are the
 * exact theme token ids from `themes/types/theme-token-ids.ts`; the resolver only
 * returns a token that exists in the live computed theme, so an id that a theme
 * drops never resolves.
 */
export const designSemantics: DesignSemanticsConfig = {
  intents: [
    {
      id: "text",
      phrases: ["text", "content", "label text", "copy", "wording", "caption"],
      candidates: ["content"],
      note: 'Visible text is the "content" property on a Text node. There is no "text" key.',
    },
    {
      id: "icon",
      phrases: ["icon", "glyph", "symbol"],
      candidates: ["symbol"],
      note: 'Icons are the "symbol" property, an icon id like "seldon-plus" (call search_icons), never a display name.',
    },
    {
      id: "direction",
      phrases: [
        "direction",
        "reading direction",
        "rtl",
        "ltr",
        "right to left",
        "left to right",
      ],
      candidates: ["direction"],
      note: 'Reading direction is the "direction" property: "ltr" or "rtl". Never fake it with align, margin, padding, float, or orientation.',
    },
    {
      id: "weight",
      phrases: ["weight", "font weight", "boldness", "emphasis", "stroke", "stroke weight"],
      candidates: [
        { path: "font.weight", whenLevel: ["element", "primitive"] },
        "border.width",
      ],
      note: 'Weight depends on the component: text weight is the "font" look "weight" facet (@fontWeight.*, bold, semibold, light); stroke weight is the "border" look "width" facet (@borderWidth.*).',
    },
    {
      id: "size",
      phrases: ["size", "font size", "type size"],
      candidates: ["font.size", "size", "width"],
      note: 'Size depends on the component: the "font" look "size" facet (@fontSize.*) on text, the "size" property on an icon, or "width" and "height" on a frame or image. Set the one the component exposes.',
    },
    {
      id: "family",
      phrases: ["font", "font family", "typeface"],
      candidates: ["font.family"],
      note: 'Font family is the "font" look "family" facet: an enabled family value (call search_fonts), an @fontFamily.* slot, or a custom family name. Slant is the "style" facet ("italic", "oblique").',
    },
    {
      id: "color",
      phrases: ["color", "colour", "fill"],
      candidates: ["color", "background"],
      note: 'Color is the "color" property for text or icon fill, or a "background" layer for a container fill. Pick by the component and whether you mean text or fill; prefer an @swatch.* token over a literal.',
    },
    {
      id: "gap",
      phrases: ["gap", "gutter", "space between", "spacing between"],
      candidates: ["gap"],
      note: 'Gap between a container\'s children is the "gap" property, an @gap.* token (tight, cozy, open).',
    },
    {
      id: "spacing",
      phrases: ["spacing", "space", "whitespace", "white space"],
      candidates: ["gap", "padding", "margin"],
      note: 'Spacing depends on where: "gap" between children, "padding" inside the box, "margin" outside it. Each is an ordinal token (tight, cozy, open).',
    },
    {
      id: "padding",
      phrases: ["padding", "inner spacing", "inset"],
      candidates: ["padding"],
      note: 'Padding is space inside the box, the "padding" property, an @padding.* token (tight, cozy, open).',
    },
    {
      id: "margin",
      phrases: ["margin", "outer spacing", "offset"],
      candidates: ["margin"],
      note: 'Margin is space outside the box, the "margin" property, an @margin.* token (tight, cozy, open).',
    },
    {
      id: "corners",
      phrases: ["corners", "rounding", "radius", "corner radius", "roundness"],
      candidates: ["corners"],
      note: 'Corner rounding is the "corners" property, an @corners.* token (tight, cozy, open).',
    },
  ],

  tokenSynonyms: [
    {
      scope: "fontSize",
      synonyms: {
        tiny: "tiny",
        smallest: "tiny",
        verysmall: "xxsmall",
        xxsmall: "xxsmall",
        xsmall: "xsmall",
        extrasmall: "xsmall",
        small: "small",
        little: "small",
        medium: "medium",
        normal: "medium",
        regular: "medium",
        default: "medium",
        large: "large",
        big: "large",
        bigger: "large",
        larger: "large",
        xlarge: "xlarge",
        extralarge: "xlarge",
        xxlarge: "xxlarge",
        huge: "huge",
        biggest: "huge",
        massive: "huge",
        giant: "huge",
      },
    },
    {
      scope: "fontWeight",
      synonyms: {
        thin: "thin",
        extralight: "xlight",
        xlight: "xlight",
        light: "light",
        lighter: "light",
        normal: "normal",
        regular: "normal",
        book: "normal",
        medium: "medium",
        semibold: "semibold",
        demibold: "semibold",
        bold: "bold",
        bolder: "bold",
        extrabold: "xbold",
        xbold: "xbold",
        ultrabold: "xbold",
        black: "black",
        heavy: "black",
        heaviest: "black",
      },
    },
    {
      scope: "swatch",
      synonyms: {
        primary: "primary",
        brand: "primary",
        accent: "accent",
        positive: "positive",
        success: "positive",
        negative: "negative",
        error: "negative",
        danger: "negative",
        warning: "warning",
        caution: "warning",
        white: "white",
        black: "black",
        gray: "gray",
        grey: "gray",
        foreground: "foreground",
        background: "background",
        offblack: "offBlack",
        offwhite: "offWhite",
      },
    },
    {
      scope: "gap",
      synonyms: {
        tight: "tight",
        tightest: "tight",
        compact: "compact",
        cozy: "cozy",
        normal: "cozy",
        default: "cozy",
        regular: "cozy",
        comfortable: "comfortable",
        roomy: "comfortable",
        relaxed: "comfortable",
        open: "open",
        spacious: "open",
        airy: "open",
        loose: "open",
        wide: "open",
      },
    },
    {
      scope: "padding",
      synonyms: {
        tight: "tight",
        tightest: "tight",
        compact: "compact",
        cozy: "cozy",
        normal: "cozy",
        default: "cozy",
        regular: "cozy",
        comfortable: "comfortable",
        roomy: "comfortable",
        relaxed: "comfortable",
        open: "open",
        spacious: "open",
        airy: "open",
        loose: "open",
        wide: "open",
      },
    },
    {
      scope: "margin",
      synonyms: {
        tight: "tight",
        tightest: "tight",
        compact: "compact",
        cozy: "cozy",
        normal: "cozy",
        default: "cozy",
        regular: "cozy",
        comfortable: "comfortable",
        roomy: "comfortable",
        relaxed: "comfortable",
        open: "open",
        spacious: "open",
        airy: "open",
        loose: "open",
        wide: "open",
      },
    },
    {
      scope: "corners",
      synonyms: {
        tight: "tight",
        sharp: "tight",
        square: "tight",
        compact: "compact",
        cozy: "cozy",
        normal: "cozy",
        default: "cozy",
        comfortable: "comfortable",
        rounded: "comfortable",
        open: "open",
        round: "open",
        pill: "open",
      },
    },
    {
      scope: "borderWidth",
      synonyms: {
        hairline: "xsmall",
        thinnest: "xsmall",
        tiny: "xsmall",
        xsmall: "xsmall",
        thin: "small",
        small: "small",
        medium: "medium",
        normal: "medium",
        thick: "large",
        large: "large",
        thickest: "xlarge",
        heavy: "xlarge",
        xlarge: "xlarge",
      },
    },
  ],

  operations: [
    {
      phrases: ["more space", "add space", "increase spacing", "loosen", "looser", "roomier", "spread out"],
      concept: "spacing",
      direction: "increase",
    },
    {
      phrases: ["less space", "reduce spacing", "tighten", "tighter", "condense", "compact"],
      concept: "spacing",
      direction: "decrease",
    },
    {
      phrases: ["bigger", "larger", "increase size", "scale up", "grow"],
      concept: "size",
      direction: "increase",
    },
    {
      phrases: ["smaller", "reduce size", "scale down", "shrink"],
      concept: "size",
      direction: "decrease",
    },
    {
      phrases: ["bolder", "heavier", "more weight"],
      concept: "weight",
      direction: "increase",
    },
    {
      phrases: ["lighter", "thinner", "less weight"],
      concept: "weight",
      direction: "decrease",
    },
    {
      phrases: ["rounder", "more rounded", "increase rounding"],
      concept: "corners",
      direction: "increase",
    },
    {
      phrases: ["sharper", "less rounded", "reduce rounding"],
      concept: "corners",
      direction: "decrease",
    },
  ],

  spacingFeels: [
    { id: "tight", phrases: ["tight", "dense", "cramped"], baseSize: 0.75 },
    { id: "compact", phrases: ["compact", "snug"], baseSize: 0.85 },
    { id: "cozy", phrases: ["cozy", "default", "normal", "balanced"], baseSize: 1 },
    {
      id: "comfortable",
      phrases: ["comfortable", "relaxed", "roomy"],
      baseSize: 1.2,
    },
    { id: "spacious", phrases: ["spacious", "open", "airy"], baseSize: 1.35 },
    {
      id: "breathe",
      phrases: ["breathe", "breathing", "breathable", "let it breathe"],
      baseSize: 1.5,
    },
  ],
}
