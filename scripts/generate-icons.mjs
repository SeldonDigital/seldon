/**
 * Generates the compact icon data file for a set from its pinned upstream
 * Iconify package. Every id in the set's `index-all.ts` manifest must resolve
 * upstream; the generator fails and lists any id that does not, so the emitted
 * data always matches the manifest. There is no vendor glyph fallback: a
 * referenced id that cannot render uses the Seldon `seldon-missing` glyph at
 * render and export time, handled by the consumer, not by this generator.
 *
 * The upstream package is a pinned devDependency, so a consumer install never
 * touches upstream and an upstream release never changes a build.
 *
 * Usage:
 *   node scripts/generate-icons.mjs                 Regenerate every set.
 *   node scripts/generate-icons.mjs material        Regenerate one set.
 *   node scripts/generate-icons.mjs --seed material  Refill one set's manifest
 *                                                    from upstream up to the cap
 *                                                    (deliberate, not part of a
 *                                                    normal regenerate).
 *
 * Output: packages/core/icon-sets/data/<set>.icons.json
 *   { "<idSuffix>": { "body": "<svg inner>", "viewBox": "..." }, ... }
 * keyed by the Seldon id without its set prefix, sorted for a stable diff.
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { getIconData } from "@iconify/utils"

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.dirname(scriptDir)
const catalogDir = path.join(repoRoot, "packages/core/icon-sets/catalog")
const dataDir = path.join(repoRoot, "packages/core/icon-sets/data")

/**
 * Set config: id prefix, upstream Iconify data package, catalog folder, the
 * preferred fill `style`, and the seed `cap`. Material Symbols ships each glyph
 * as a filled base name and an `-outline` variant; `style: "outline"` prefers
 * the outlined glyph and falls back to the base for single-style icons. `cap`
 * bounds how many icons `--seed` writes so a set stays a production-sized
 * subset rather than the full upstream package.
 */
const SETS = {
  material: {
    prefix: "material",
    upstream: "@iconify-json/material-symbols/icons.json",
    catalogFolder: "material",
    style: "outline",
    cap: 5000,
  },
  carbon: {
    prefix: "carbon",
    upstream: "@iconify-json/carbon/icons.json",
    catalogFolder: "carbon",
    style: "default",
    cap: 5000,
  },
  lucide: {
    prefix: "lucide",
    upstream: "@iconify-json/lucide/icons.json",
    catalogFolder: "lucide",
    style: "default",
    cap: 5000,
  },
}

const args = process.argv.slice(2)
const seed = args.includes("--seed")
const setName = args.find((arg) => !arg.startsWith("--"))

if (setName && !SETS[setName]) {
  console.error(`Unknown set "${setName}". Known: ${Object.keys(SETS).join(", ")}.`)
  process.exit(1)
}

if (seed) {
  if (!setName) {
    console.error(`--seed needs one set. Known: ${Object.keys(SETS).join(", ")}.`)
    process.exit(1)
  }
  seedManifest(SETS[setName])
} else if (setName) {
  generate(SETS[setName])
} else {
  for (const config of Object.values(SETS)) generate(config)
}

/**
 * Reads the manifest, resolves every id upstream, and writes the data file.
 * Fails listing any id that does not resolve upstream. Categories live in the
 * curated `constants/icon-categories.ts` source, so this does not touch them; a
 * seeded id absent from that source categorizes by the shared keyword table at
 * lookup time.
 */
function generate({ prefix, upstream, catalogFolder, style }) {
  const ids = readManifestIds(catalogFolder, prefix)
  const iconSet = loadUpstream(upstream)

  const data = {}
  const missing = []

  for (const id of ids) {
    const suffix = id.slice(prefix.length + 1)
    const entry = resolveUpstream(iconSet, suffix, style)

    if (entry) {
      data[suffix] = { body: sanitizeBody(entry.body, id), viewBox: entry.viewBox }
    } else {
      missing.push(id)
    }
  }

  if (missing.length > 0) {
    console.error(`\n[${prefix}] ${missing.length} manifest id(s) do not resolve upstream:`)
    for (const id of missing) console.error(`  - ${id}`)
    console.error(
      `\nRename them to an upstream-canonical id or remove them from ` +
        `catalog/${catalogFolder}/index-all.ts, then rerun.`,
    )
    process.exit(1)
  }

  fs.mkdirSync(dataDir, { recursive: true })
  const outPath = path.join(dataDir, `${prefix}.icons.json`)
  fs.writeFileSync(outPath, serialize(data))

  console.log(
    `[${prefix}] ${ids.length} icons (${style} style) -> ${path.relative(repoRoot, outPath)}`,
  )
}

/**
 * Refills the set manifest from upstream up to `cap`, grouping style variants to
 * one concept and dropping pure aliases and redundant twins. Deliberate: run to
 * grow a set, not as part of a normal regenerate. Prints the id count and does
 * not touch the data file; run the default mode afterwards.
 */
function seedManifest({ prefix, upstream, catalogFolder, style, cap }) {
  const iconSet = loadUpstream(upstream)
  const names = Object.keys(iconSet.icons || {})

  // One entry per concept: strip the style suffixes so `foo`, `foo-outline`,
  // `foo-rounded`, and `foo-sharp` collapse to `foo`.
  const concepts = new Map()
  for (const name of names) {
    const concept = name.replace(/-(outline|rounded|sharp|filled)$/g, "")
    if (!concepts.has(concept)) concepts.set(concept, name)
  }

  const chosen = [...concepts.keys()].sort().slice(0, cap)
  const ids = chosen.map((concept) => `${prefix}-${kebabToCamel(concept)}`)

  const manifestPath = path.join(catalogDir, catalogFolder, "index-all.ts")
  const header =
    `import type { IconId } from "@seldon/core/icon-sets"\n\n` +
    `export const ${catalogFolder}AllIconIds: readonly IconId[] = [\n`
  const body = ids.map((id) => `  "${id}",`).join("\n")
  fs.writeFileSync(manifestPath, `${header}${body}\n] as const\n`)

  console.log(
    `[${setName}] seeded ${ids.length} ids (cap ${cap}, ${style} style) -> ` +
      `${path.relative(repoRoot, manifestPath)}. Run "node scripts/generate-icons.mjs ${setName}" next.`,
  )
}

function loadUpstream(upstream) {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, "node_modules", upstream), "utf8"))
}

/** Reads the set's ids from its `<set>AllIconIds` array in index-all.ts. */
function readManifestIds(catalogFolder, prefix) {
  const source = fs.readFileSync(path.join(catalogDir, catalogFolder, "index-all.ts"), "utf8")
  const array = source.slice(source.indexOf(`${catalogFolder}AllIconIds`))
  const escaped = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`"(${escaped}-[^"]+)"`, "g")

  return [...array.matchAll(pattern)].map((match) => match[1])
}

/**
 * Resolves an upstream icon by the Seldon id suffix, trying the camelCase to
 * kebab-case name and a few common variant spellings. When `style` is
 * `"outline"` the `-outline` variant is tried first, so the whole set reads as
 * outlined and only falls back to the filled base for single-style glyphs.
 * Returns the normalized `{ body, viewBox }`, following aliases and inheriting
 * set dimensions.
 */
function resolveUpstream(iconSet, suffix, style) {
  const kebab = camelToKebab(suffix)
  const base = [kebab, kebab.replace(/-outline$/, ""), kebab.replace(/-filled$/, "")]
  const candidates =
    style === "outline" ? [`${kebab}-outline`, ...base] : [...base, `${kebab}-outline`]

  for (const name of candidates) {
    const full = getIconData(iconSet, name)

    if (full) {
      return normalize(full)
    }
  }

  return null
}

function normalize(full) {
  const left = full.left ?? 0
  const top = full.top ?? 0
  const width = full.width ?? 16
  const height = full.height ?? 16
  const viewBox = `${left} ${top} ${width} ${height}`

  return { body: full.body, viewBox }
}

/**
 * Strips markup that must never appear in a glyph body: scripts, `foreignObject`
 * (which can host HTML and scripts), inline event handlers, and `javascript:`
 * urls. The body is injected as raw SVG at render and export time, so this makes
 * the committed data safe to trust there. Upstream Iconify glyphs are pure shape
 * markup, so this normally changes nothing; it is a guard against a compromised
 * or mistaken upstream, and it fails the build if anything unsafe is found so a
 * regeneration cannot silently commit dangerous markup.
 */
function sanitizeBody(body, id) {
  const cleaned = body
    .replace(/<script[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<script\b[^>]*\/?>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject\s*>/gi, "")
    .replace(/<foreignObject\b[^>]*\/?>/gi, "")
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "")
    .replace(/\s(?:xlink:)?href\s*=\s*"(?:\s|&#\w+;)*javascript:[^"]*"/gi, "")
    .replace(/\s(?:xlink:)?href\s*=\s*'(?:\s|&#\w+;)*javascript:[^']*'/gi, "")

  if (cleaned !== body) {
    console.error(
      `\nUnsafe markup in "${id}" upstream glyph. ` +
        `Refusing to commit sanitized-but-suspect data. Inspect the pinned ` +
        `upstream package before regenerating.`,
    )
    process.exit(1)
  }

  return cleaned
}

function camelToKebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase()
}

function kebabToCamel(value) {
  return value.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
}

function serialize(data) {
  const sorted = Object.keys(data).sort()
  const lines = sorted.map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(data[key])}`)

  return `{\n${lines.join(",\n")}\n}\n`
}
