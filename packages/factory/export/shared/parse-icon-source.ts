/**
 * Framework-neutral icon geometry extracted from a catalog icon source. Both
 * export targets can render from this shape: React emits component files today,
 * and the Vue target renders an `Icon.vue` over this data. Keeping the parser in
 * `export/shared` lets any future target reuse the same geometry.
 */
export type IconGeometry = {
  /** SVG `viewBox`, e.g. "0 0 24 24". */
  viewBox: string
  /** Root `fill`, usually "currentColor". */
  fill?: string
  /** Inner SVG markup with attributes de-Reactified for HTML/SVG. */
  body: string
}

const REACT_TO_SVG_ATTRS: Array<[RegExp, string]> = [
  [/fillRule=/g, "fill-rule="],
  [/clipRule=/g, "clip-rule="],
  [/strokeWidth=/g, "stroke-width="],
  [/strokeLinecap=/g, "stroke-linecap="],
  [/strokeLinejoin=/g, "stroke-linejoin="],
  [/strokeMiterlimit=/g, "stroke-miterlimit="],
  [/strokeDasharray=/g, "stroke-dasharray="],
  [/strokeDashoffset=/g, "stroke-dashoffset="],
  [/strokeOpacity=/g, "stroke-opacity="],
  [/fillOpacity=/g, "fill-opacity="],
  [/stopColor=/g, "stop-color="],
  [/stopOpacity=/g, "stop-opacity="],
  [/clipPath=/g, "clip-path="],
]

/**
 * Parses a catalog icon source file's SVG into {@link IconGeometry}. Returns
 * `null` when the source has no `<svg>` element. The body is de-Reactified so it
 * renders directly in a Vue template via `v-html`.
 */
export function parseIconSource(source: string): IconGeometry | null {
  const svgMatch = source.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/)
  if (!svgMatch) return null

  const svgAttrs = svgMatch[1]
  const rawBody = svgMatch[2]

  const viewBoxMatch = svgAttrs.match(/viewBox="([^"]+)"/)
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 24 24"

  const fillMatch = svgAttrs.match(/fill="([^"]+)"/)
  const fill = fillMatch ? fillMatch[1] : undefined

  let body = rawBody
  for (const [pattern, replacement] of REACT_TO_SVG_ATTRS) {
    body = body.replace(pattern, replacement)
  }
  // Drop the React props spread that only appears on the root element.
  body = body.replace(/\{\.\.\.props\}/g, "").trim()

  return { viewBox, fill, body }
}
