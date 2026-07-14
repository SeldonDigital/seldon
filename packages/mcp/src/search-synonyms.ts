/**
 * Curated query synonyms for search_catalog. Maps a query term to the
 * catalog vocabulary it should also match. This list is deliberately small:
 * the zero-result log is the evidence stream that grows it,
 * and the embedding layer covers paraphrases these seeds miss.
 */
export const CURATED_SYNONYMS: Record<string, readonly string[]> = {
  cta: ["button"],
  photo: ["image"],
  picture: ["image"],
  pic: ["image"],
  typeface: ["font"],
  modal: ["dialog"],
  popup: ["dialog"],
  divider: ["hr"],
  separator: ["hr"],
  price: ["pricing"],
  headline: ["header"],
  dropdown: ["select", "menu"],
  textbox: ["input"],
  textfield: ["input"],
  photograph: ["image", "photo"],
  funnel: ["filter"],
  marker: ["pin", "location"],
  tick: ["check", "checkmark"],
  magnifier: ["search"],
  cog: ["settings", "gear"],
  bin: ["trash", "delete"],
}
