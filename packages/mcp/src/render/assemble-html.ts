/**
 * Assembles one full HTML document from a rendered component body plus the
 * pieces of an export that a single render needs: the shared
 * component stylesheet, the rendered targets' theme stylesheets, and any
 * remote-font `<link>` tags. Icons need no assembly step — they render as
 * inlined `<svg>` markup by the component render itself (confirmed by the
 * Factory-SSR spike).
 */
import { getThemeSlug } from "@seldon/factory/export/css/generation/get-theme-slug"
import type { FileToExport } from "@seldon/factory/export/types"

import type { Workspace } from "@seldon/core/workspace/types"

/** Matches the `<link .../>` lines get-fonts-component.ts emits, if any. */
const FONT_LINK_PATTERN = /<link\s+rel="stylesheet"\s+href="[^"]*"\s*\/>/g

function readTextFile(
  files: ReadonlyMap<string, FileToExport>,
  path: string,
): string {
  const file = files.get(path)
  if (!file) {
    throw new Error(`Export is missing expected file "${path}".`)
  }
  if (typeof file.content !== "string") {
    throw new Error(`Expected "${path}" to be text, got binary content.`)
  }
  return file.content
}

/**
 * The shared component stylesheet plus each rendered theme's variable
 * stylesheet, concatenated. Component classes reference unprefixed `--sdn-*`
 * custom properties; each theme file defines them under its own
 * `[data-theme="{slug}"]` selector (the seldon default also answers bare
 * `:root`), so the element carrying `data-theme` picks the active theme. A
 * board sheet may render variants under different themes, hence a list;
 * attribute scoping keeps the concatenation collision-free.
 */
export function assembleStyles(
  files: ReadonlyMap<string, FileToExport>,
  themeIds: readonly string[],
  workspace: Workspace,
  componentsFolder: string,
): string {
  const shared = readTextFile(files, `${componentsFolder}/styles.css`)
  const slugs = [...new Set(themeIds.map((id) => getThemeSlug(id, workspace)))]
  const themes = slugs.map((slug) =>
    readTextFile(files, `${componentsFolder}/styles/${slug}.css`),
  )
  return [shared, ...themes].join("\n")
}

/** Remote-font `<link>` tags from the generated Fonts.tsx, if any. */
export function extractFontLinks(
  files: ReadonlyMap<string, FileToExport>,
  componentsFolder: string,
): string[] {
  const source = readTextFile(files, `${componentsFolder}/Fonts.tsx`)
  return [...source.matchAll(FONT_LINK_PATTERN)].map((match) => match[0])
}

/**
 * The board-sheet body: every variant of one board side by side, each under
 * a small monospace label. Each section carries its variant's `data-theme`
 * so themes resolve per section even when they differ across the sheet.
 * Inline styles only — the sheet is chrome around Factory output, never
 * part of it.
 */
export function assembleBoardSheet(
  sections: ReadonlyArray<{ label: string; html: string; themeSlug: string }>,
): string {
  const bodies = sections.map(
    ({ label, html, themeSlug }) =>
      `<section data-theme="${themeSlug}"><header style="font:12px/2 monospace;color:#666">${label}</header>${html}</section>`,
  )
  return `<div style="display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start">${bodies.join("")}</div>`
}

/**
 * One full, self-contained HTML document — the `view_node` "html" format and
 * the input to the "image" format's screenshot. The body sits on a neutral
 * light stage so components are legible regardless of their own background.
 */
export function assembleDocument(
  files: ReadonlyMap<string, FileToExport>,
  bodyHtml: string,
  themeIds: readonly string[],
  workspace: Workspace,
  componentsFolder: string,
): string {
  const styles = assembleStyles(files, themeIds, workspace, componentsFolder)
  const fontLinks = extractFontLinks(files, componentsFolder)
  // A single-theme document activates its theme on <body>; multi-theme board
  // sheets leave the body on the :root default and scope per section instead.
  const slugs = [...new Set(themeIds.map((id) => getThemeSlug(id, workspace)))]
  const themeAttr = slugs.length === 1 ? ` data-theme="${slugs[0]}"` : ""
  return [
    "<!doctype html>",
    '<html><head><meta charset="utf-8">',
    ...fontLinks,
    `<style>${styles}</style>`,
    "</head>",
    `<body${themeAttr} style="margin:0;padding:24px;background:#f7f7f7">`,
    bodyHtml,
    "</body>",
    "</html>",
  ].join("\n")
}
