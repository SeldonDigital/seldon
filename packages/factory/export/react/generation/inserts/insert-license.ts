import { TransformStrategy, transformSource } from "../../utils/transform-source"

export const LICENSE_HEADER = `/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/
`

export function insertLicense(source: string) {
  return transformSource({
    source,
    strategy: TransformStrategy.PREPEND,
    content: LICENSE_HEADER,
  })
}

/**
 * Inserts the license header inside a single-file component's first `<script>`
 * block, so Prettier's `vue` parser keeps it as a JS block comment instead of
 * reflowing a stray comment placed at the top of the file. Idempotent: a source
 * that already carries the header is returned unchanged. Falls back to a plain
 * prepend when the source has no `<script>` block.
 */
export function insertVueLicense(source: string): string {
  if (source.includes(LICENSE_HEADER.trim())) return source

  const scriptTag = source.match(/<script\b[^>]*>/)

  if (!scriptTag || scriptTag.index === undefined) return insertLicense(source)

  const insertAt = scriptTag.index + scriptTag[0].length

  return `${source.slice(0, insertAt)}\n${LICENSE_HEADER}${source.slice(insertAt)}`
}

/**
 * True for files emitted under an `icons/` directory. Icon output is generated
 * glyph data, so it carries no license header. Icon renderers and registries
 * live under other folders and keep the header.
 */
export function isIconExportPath(path: string): boolean {
  return /[\\/]icons[\\/]/.test(path)
}
