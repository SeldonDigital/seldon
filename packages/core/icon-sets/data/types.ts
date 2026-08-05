/**
 * Compact glyph data for one icon, in the Iconify shape. `body` is the inner
 * SVG markup and `viewBox` its coordinate system. This is the render- and
 * export-neutral payload; the editor draws it and the factory emits a component
 * from it, so neither ships a per-icon source file.
 */
export interface IconData {
  body: string
  viewBox: string
}
