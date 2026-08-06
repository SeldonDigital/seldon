/** One Fontshare family and every static variant string the family ships. */
export type FontshareFontFamily = {
  family: string
  variants: string[]
}

/**
 * Curated Fontshare families the font picker offers when the Fontshare collection
 * is added to a workspace. Variants list the static weights and styles each family
 * ships, named in the same `weight`/`weightitalic` form as the Google catalog.
 * Variable and non-standard width faces are omitted. The font materializer resolves
 * each variant to a Fontshare woff2, and export builds a Fontshare CSS API link.
 */
export const FONTSHARE_FONT_FAMILIES: FontshareFontFamily[] = [
  {
    family: "Satoshi",
    variants: ["300", "regular", "500", "700", "900", "300italic", "italic", "500italic", "700italic", "900italic"],
  },
  {
    family: "General Sans",
    variants: ["200", "300", "regular", "500", "600", "700", "200italic", "300italic", "italic", "500italic", "600italic", "700italic"],
  },
  {
    family: "Switzer",
    variants: ["100", "200", "300", "regular", "500", "600", "700", "800", "900", "100italic", "200italic", "300italic", "italic", "500italic", "600italic", "700italic", "800italic", "900italic"],
  },
  {
    family: "Supreme",
    variants: ["100", "200", "300", "regular", "500", "700", "800", "100italic", "200italic", "300italic", "italic", "500italic", "700italic", "800italic"],
  },
  {
    family: "Ranade",
    variants: ["100", "300", "regular", "500", "700", "100italic", "300italic", "italic", "500italic", "700italic"],
  },
  {
    family: "Chillax",
    variants: ["200", "300", "regular", "500", "600", "700"],
  },
  {
    family: "Quilon",
    variants: ["regular", "500", "600", "700"],
  },
  {
    family: "Synonym",
    variants: ["200", "300", "regular", "500", "600", "700"],
  },
  {
    family: "Sentient",
    variants: ["200", "300", "regular", "500", "700", "200italic", "300italic", "italic", "500italic", "700italic"],
  },
  {
    family: "Gambetta",
    variants: ["300", "regular", "500", "600", "700", "300italic", "italic", "500italic", "600italic", "700italic"],
  },
  {
    family: "Zodiak",
    variants: ["100", "300", "regular", "700", "800", "900", "100italic", "300italic", "italic", "700italic", "800italic", "900italic"],
  },
  {
    family: "Author",
    variants: ["200", "300", "regular", "500", "600", "700", "200italic", "300italic", "italic", "500italic", "600italic", "700italic"],
  },
  {
    family: "Erode",
    variants: ["300", "regular", "500", "600", "700", "300italic", "italic", "500italic", "600italic", "700italic"],
  },
  {
    family: "Bespoke Serif",
    variants: ["300", "regular", "500", "700", "800", "300italic", "italic", "500italic", "700italic", "800italic"],
  },
  {
    family: "Clash Display",
    variants: ["200", "300", "regular", "500", "600", "700"],
  },
  {
    family: "Clash Grotesk",
    variants: ["200", "300", "regular", "500", "600", "700"],
  },
  {
    family: "Cabinet Grotesk",
    variants: ["100", "200", "300", "regular", "500", "700", "800", "900"],
  },
  {
    family: "Melodrama",
    variants: ["300", "regular", "500", "600", "700"],
  },
  {
    family: "Boska",
    variants: ["200", "300", "regular", "500", "700", "900", "200italic", "300italic", "italic", "500italic", "700italic", "900italic"],
  },
  {
    family: "Technor",
    variants: ["200", "300", "regular", "500", "600", "700", "900"],
  },
  {
    family: "Tanker",
    variants: ["regular"],
  },
  {
    family: "Stardom",
    variants: ["regular"],
  },
  {
    family: "Panchang",
    variants: ["200", "300", "regular", "500", "600", "700", "800"],
  },
  {
    family: "Excon",
    variants: ["100", "300", "regular", "500", "700", "900"],
  },
  {
    family: "Amulya",
    variants: ["300", "regular", "500", "700", "300italic", "italic", "500italic", "700italic"],
  },
  {
    family: "Tabular",
    variants: ["300", "regular", "500", "600", "700", "300italic", "italic", "500italic", "600italic", "700italic"],
  },
]
