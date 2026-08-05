/**
 * Generates the compact icon data file for a set from its upstream Iconify
 * package, falling back to the committed `.tsx` glyph for any id the upstream
 * does not carry. Run deliberately; the emitted data is committed and the
 * upstream package is a pinned devDependency, so a consumer install never
 * touches upstream and an upstream release never changes a build.
 *
 * Usage: node scripts/generate-icons.mjs material
 *
 * Output: packages/core/icon-sets/data/<set>.icons.json
 *   { "<idSuffix>": { "body": "<svg inner>", "viewBox": "0 0 24 24" }, ... }
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
 * Set config: id prefix, upstream Iconify data package, catalog folder, and the
 * preferred fill `style`. Material Symbols ships each glyph as a filled base
 * name and an `-outline` variant; `style: "outline"` prefers the outlined glyph
 * and falls back to the base for icons that ship a single style.
 */
const SETS = {
  material: {
    prefix: "material",
    upstream: "@iconify-json/material-symbols/icons.json",
    catalogFolder: "material",
    style: "outline",
  },
  carbon: {
    prefix: "carbon",
    upstream: "@iconify-json/carbon/icons.json",
    catalogFolder: "carbon",
    style: "default",
  },
  lucide: {
    prefix: "lucide",
    upstream: "@iconify-json/lucide/icons.json",
    catalogFolder: "lucide",
    style: "default",
  },
}

const setName = process.argv[2]
const config = SETS[setName]

if (!config) {
  console.error(`Unknown set "${setName}". Known: ${Object.keys(SETS).join(", ")}.`)
  process.exit(1)
}

generate(config)

function generate({ prefix, upstream, catalogFolder, style }) {
  const ids = readSeldonIds(catalogFolder, prefix)
  const iconSet = JSON.parse(fs.readFileSync(path.join(repoRoot, "node_modules", upstream), "utf8"))
  const glyphIndex = buildGlyphIndex(path.join(catalogDir, catalogFolder))
  const previous = readExistingData()

  const data = {}
  let fromUpstream = 0
  const fallback = []
  const missing = []

  for (const id of ids) {
    const suffix = id.slice(prefix.length + 1)
    const upstreamEntry = resolveUpstream(iconSet, suffix, style)

    if (upstreamEntry) {
      data[suffix] = upstreamEntry
      fromUpstream += 1
      continue
    }

    // Ids the upstream cannot provide keep their existing glyph: the committed
    // `.tsx` when one is still present, otherwise the last generated data. This
    // makes regeneration self-sustaining once the source files are removed.
    const kept = readCommittedGlyph(glyphIndex, id) ?? previous[suffix]

    if (kept) {
      data[suffix] = kept
      fallback.push(suffix)
      continue
    }

    missing.push(suffix)
  }

  if (missing.length > 0) {
    console.error(`\n[${setName}] ${missing.length} id(s) resolved neither upstream nor from a committed glyph:`)
    for (const id of missing) console.error(`  - ${prefix}-${id}`)
    process.exit(1)
  }

  fs.mkdirSync(dataDir, { recursive: true })
  const outPath = path.join(dataDir, `${setName}.icons.json`)
  fs.writeFileSync(outPath, serialize(data))

  console.log(
    `[${setName}] ${ids.length} icons (${style} style) -> ${path.relative(repoRoot, outPath)} ` +
      `(${fromUpstream} upstream, ${fallback.length} from committed glyph)`,
  )

  if (fallback.length > 0) {
    console.log(`  fallback ids: ${fallback.join(", ")}`)
  }
}

/** Reads the previously generated data file, or an empty map when none exists. */
function readExistingData() {
  const outPath = path.join(dataDir, `${setName}.icons.json`)

  return fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : {}
}

/** Reads the set's ids from its `<set>AllIconIds` array in index-all.ts. */
function readSeldonIds(catalogFolder, prefix) {
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

/** Extracts the inner SVG and viewBox from a committed `.tsx` glyph. */
function readCommittedGlyph(glyphIndex, id) {
  const filePath = glyphIndex.get(normalizeName(componentNameFor(id)))

  if (!filePath) {
    return null
  }

  const source = fs.readFileSync(filePath, "utf8")
  const inner = source.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)
  const viewBox = source.match(/viewBox="([^"]+)"/)

  if (!inner || !viewBox) {
    return null
  }

  return { body: collapse(inner[1]), viewBox: viewBox[1] }
}

/**
 * Derives the exported component name from a Seldon id, matching the codebase
 * `pascalCase` rule, e.g. `material-personAddAlt_1` -> `IconMaterialPersonAddAlt_1`.
 */
function componentNameFor(id) {
  const words = id
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9\s_]/g, " ")
    .split(/[\s_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  const pascal = words.join("").replace(/([a-zA-Z])(\d)/g, "$1_$2")

  return `Icon${pascal}`
}

/**
 * Indexes every glyph file under a set by its normalized component name. The id
 * loses original casing and underscore placement (`addAPhoto`, `starPurple500`),
 * so normalizing to lowercase alphanumerics matches the file regardless.
 */
function buildGlyphIndex(root) {
  const index = new Map()
  const stack = [root]

  while (stack.length > 0) {
    const dir = stack.pop()

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        stack.push(full)
      } else if (entry.name.endsWith(".tsx")) {
        index.set(normalizeName(entry.name.replace(/\.tsx$/, "")), full)
      }
    }
  }

  return index
}

function normalizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

function camelToKebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase()
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function collapse(markup) {
  return markup.replace(/\s+/g, " ").trim()
}

function serialize(data) {
  const sorted = Object.keys(data).sort()
  const lines = sorted.map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(data[key])}`)

  return `{\n${lines.join(",\n")}\n}\n`
}
