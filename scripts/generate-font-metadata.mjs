/**
 * Captures descriptive font metadata (category, designer, description) from each
 * vendor and writes it into core as committed data. Core keeps only catalog data
 * at runtime and never fetches, so this build step gathers the vendor blurbs once
 * and the editor renders them from the generated files.
 *
 * Sources, all already used by `generate-fonts.mjs`:
 * - Google: `METADATA.pb` (designer, category) and `DESCRIPTION.en_us.html`
 *   (description) from the google/fonts GitHub, under the same license dir the
 *   font files resolve from.
 * - Fontshare: the family catalog API (`story`, `designers`, `category`).
 *
 * Output (committed, small text only):
 * - packages/core/font-collections/catalog/google/metadata.ts
 * - packages/core/font-collections/catalog/fontshare/metadata.ts
 *
 * Run from the repo with Node 22.18+:
 *
 *   node scripts/generate-font-metadata.mjs                Regenerate every family.
 *   node scripts/generate-font-metadata.mjs "Roboto" Inter Regenerate a subset.
 */
import { writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { format, resolveConfig } from "prettier"

import { GOOGLE_FONT_FAMILIES } from "../packages/core/properties/constants/typography/font-families.ts"
import { FONTSHARE_FONT_FAMILIES } from "../packages/core/properties/constants/typography/fontshare-font-families.ts"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = dirname(scriptDir)
const googleOut = join(repoRoot, "packages/core/font-collections/catalog/google/metadata.ts")
const fontshareOut = join(repoRoot, "packages/core/font-collections/catalog/fontshare/metadata.ts")

const GOOGLE_FONTS_RAW = "https://raw.githubusercontent.com/google/fonts/main"
const FONTSHARE_API = "https://api.fontshare.com/v2/fonts"

// google/fonts license directories a family may live under, tried in order.
const LICENSE_DIRS = ["ofl", "apache", "ufl"]

/** `IBM Plex Sans` -> `ibm-plex-sans` (font slot id, matching the stock builders). */
function toSlug(family) {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/** `IBM Plex Sans` -> `ibmplexsans` (google/fonts directory name). */
function toGoogleDir(family) {
  return family.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

async function fetchText(url, attempts = 3) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url)
      if (response.status === 404) return null
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`)
      return await response.text()
    } catch (error) {
      lastError = error
      if (attempt < attempts) await new Promise((r) => setTimeout(r, 500 * attempt))
    }
  }
  throw lastError
}

/** Decodes the handful of HTML entities that appear in vendor blurbs. */
function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&nbsp;/g, " ")
}

/** Strips tags and returns the first paragraph's text, collapsed to one line. */
function firstParagraphText(html) {
  if (!html) return undefined
  const match = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)
  const body = match ? match[1] : html
  const text = decodeEntities(body.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()

  return text.length > 0 ? text : undefined
}

/** Title-cases a vendor category token, e.g. `SANS_SERIF` -> `Sans Serif`. */
function titleCaseCategory(token) {
  if (!token) return undefined

  return token
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/** Reads the first quoted value of a `key: "value"` line from a METADATA.pb body. */
function readPbField(pb, key) {
  const match = pb.match(new RegExp(`^${key}:\\s*"([^"]*)"`, "m"))

  return match ? match[1] : undefined
}

async function fetchGoogleMeta(family) {
  const dirName = toGoogleDir(family)

  for (const licenseDir of LICENSE_DIRS) {
    const base = `${GOOGLE_FONTS_RAW}/${licenseDir}/${dirName}`
    const pb = await fetchText(`${base}/METADATA.pb`)
    if (!pb) continue

    const description = firstParagraphText(await fetchText(`${base}/DESCRIPTION.en_us.html`))
    const meta = {
      category: titleCaseCategory(readPbField(pb, "category")),
      designer: readPbField(pb, "designer") || undefined,
      description,
    }

    return meta
  }

  return null
}

let fontshareCatalogPromise = null

async function fetchFontshareCatalog() {
  if (!fontshareCatalogPromise) {
    fontshareCatalogPromise = (async () => {
      const bySlug = new Map()
      for (let offset = 0; ; offset += 100) {
        const body = await fetchText(`${FONTSHARE_API}?limit=100&offset=${offset}`)
        if (!body) break
        const page = JSON.parse(body)
        const items = page.data ?? page.fonts ?? (Array.isArray(page) ? page : [])
        for (const font of items) bySlug.set(font.slug, font)
        if (items.length < 100) break
      }

      return bySlug
    })()
  }

  return fontshareCatalogPromise
}

/** Joins Fontshare designer names, falling back to the publisher. */
function readFontshareDesigner(font) {
  const designers = Array.isArray(font.designers) ? font.designers : []
  const names = designers
    .map((entry) => (typeof entry === "string" ? entry : entry?.name))
    .filter((name) => typeof name === "string" && name.length > 0)

  if (names.length > 0) return names.join(", ")

  return typeof font.publisher === "string" && font.publisher.length > 0
    ? font.publisher
    : undefined
}

async function fetchFontshareMeta(family) {
  const catalog = await fetchFontshareCatalog()
  const font = catalog.get(toSlug(family))
  if (!font) return null

  return {
    category: titleCaseCategory(font.category),
    designer: readFontshareDesigner(font),
    description: firstParagraphText(font.story),
  }
}

/** Drops undefined fields so absent metadata does not write empty keys. */
function compact(meta) {
  const out = {}
  if (meta.category) out.category = meta.category
  if (meta.designer) out.designer = meta.designer
  if (meta.description) out.description = meta.description

  return out
}

function serialize(exportName, entries) {
  const sorted = Object.keys(entries).sort()
  const body = sorted
    .map((slug) => `  ${JSON.stringify(slug)}: ${JSON.stringify(entries[slug])},`)
    .join("\n")

  return `/**
 * Generated by scripts/generate-font-metadata.mjs. Do not edit by hand.
 * Descriptive metadata captured from the vendor, keyed by family slot id.
 */
import type { FontFamilyMeta } from "../../types/font-collection"

export const ${exportName}: Record<string, FontFamilyMeta> = {
${body}
}
`
}

async function collect(families, fetchMeta, label) {
  const entries = {}
  let filled = 0

  for (const { family } of families) {
    process.stdout.write(`- ${family} ... `)
    try {
      const meta = await fetchMeta(family)
      if (meta) {
        const compacted = compact(meta)
        if (Object.keys(compacted).length > 0) {
          entries[toSlug(family)] = compacted
          filled++
          console.log(Object.keys(compacted).join(", "))
        } else {
          console.log("no metadata")
        }
      } else {
        console.log("not found")
      }
    } catch (error) {
      console.log(`ERROR: ${error}`)
    }
  }

  console.log(`\n${label}: ${filled}/${families.length} families with metadata.\n`)

  return entries
}

/** Writes a generated file, formatting it with the repo's Prettier config. */
async function writeFormatted(path, source) {
  const options = await resolveConfig(path)
  const formatted = await format(source, { ...options, filepath: path })

  await writeFile(path, formatted, "utf8")
}

async function main() {
  const filter = process.argv.slice(2)
  const wanted = (list) => (filter.length ? list.filter((f) => filter.includes(f.family)) : list)

  const googleFamilies = wanted(GOOGLE_FONT_FAMILIES)
  const fontshareFamilies = wanted(FONTSHARE_FONT_FAMILIES)

  console.log(`Capturing Google metadata (${googleFamilies.length} families)\n`)
  const google = await collect(googleFamilies, fetchGoogleMeta, "Google")

  console.log(`Capturing Fontshare metadata (${fontshareFamilies.length} families)\n`)
  const fontshare = await collect(fontshareFamilies, fetchFontshareMeta, "Fontshare")

  await writeFormatted(googleOut, serialize("googleFontMetadata", google))
  await writeFormatted(fontshareOut, serialize("fontshareFontMetadata", fontshare))

  console.log(`Wrote:\n  ${googleOut}\n  ${fontshareOut}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
