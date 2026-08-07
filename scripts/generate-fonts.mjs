/**
 * Materializes the remote font woff2 and license files the editor canvas
 * self-hosts. Core keeps only catalog data (`GOOGLE_FONT_FAMILIES` and
 * `FONTSHARE_FONT_FAMILIES`); this script fetches each wanted variant's woff2 and
 * a license, then writes them into the editor's gitignored public dir. Nothing is
 * committed or shipped.
 *
 * Two sources feed the same output layout:
 * - Google families fetch woff2 from google-webfonts-helper and a redistributable
 *   license from the google/fonts GitHub.
 * - Fontshare families fetch woff2 from the Fontshare CDN and write a license
 *   pointer for the family's ITF or OFL terms.
 *
 * The output dir doubles as the cache: a family whose woff2 and license already
 * exist is skipped without any network call, so reruns are fast and an offline
 * rerun with a warm cache succeeds.
 *
 * Run from the repo with Node 22.18+ (the TypeScript catalog import relies on
 * built-in type stripping):
 *
 *   node scripts/generate-fonts.mjs                Materialize every family.
 *   node scripts/generate-fonts.mjs "Roboto" Inter Materialize only a subset.
 */
import { existsSync, mkdirSync, statSync } from "node:fs"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { GOOGLE_FONT_FAMILIES } from "../packages/core/properties/constants/typography/font-families.ts"
import { FONTSHARE_FONT_FAMILIES } from "../packages/core/properties/constants/typography/fontshare-font-families.ts"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = dirname(scriptDir)
const editorPublic = join(repoRoot, "packages/editor/shared/public")
const fontFilesDir = join(editorPublic, "font-files")
const fontLicensesDir = join(editorPublic, "font-licenses")

const GWFH_API = "https://gwfh.mranftl.com/api/fonts"
const GOOGLE_FONTS_RAW = "https://raw.githubusercontent.com/google/fonts/main"

const FONTSHARE_API = "https://api.fontshare.com/v2/fonts"
const FONTSHARE_LICENSE_URLS = {
  itf_ffl: "https://www.fontshare.com/licenses/itf-ffl",
  ofl: "https://www.fontshare.com/licenses/ofl",
}

// google-webfonts-helper names weight 400 `regular` and 400 italic `italic`.
// Some families author those variants as `400`/`400italic`, so map to the gwfh
// id for lookup while keeping the catalog variant as the file name.
const GWFH_VARIANT_ALIAS = { 400: "regular", "400italic": "italic" }

// google-webfonts-helper subset to request per family. Latin covers the
// general-purpose set; the multilingual families need their primary script.
const SUBSET_BY_FAMILY = {
  "Noto Sans Arabic": "arabic",
  Cairo: "arabic",
  Tajawal: "arabic",
  "Noto Sans JP": "japanese",
  "Noto Serif JP": "japanese",
  "Noto Sans KR": "korean",
  "Noto Sans SC": "chinese-simplified",
  "Noto Sans TC": "chinese-traditional",
}

// google/fonts license directories, tried in order. All three are redistributable.
const LICENSE_DIRS = [
  { dir: "ofl", file: "OFL.txt" },
  { dir: "apache", file: "LICENSE.txt" },
  { dir: "ufl", file: "UFL.txt" },
]

/** `IBM Plex Sans` -> `ibm-plex-sans` (font slot id and google-webfonts-helper id). */
function toSlug(family) {
  return family
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/** `IBM Plex Sans` -> `ibmplexsans` (google/fonts directory name). */
function toLicenseDir(family) {
  return family.toLowerCase().replace(/[^a-z0-9]+/g, "")
}

async function fetchWithRetry(url, { binary = false, attempts = 3 } = {}) {
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url)
      if (response.status === 404) return { status: 404 }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} for ${url}`)
      }
      const body = binary ? Buffer.from(await response.arrayBuffer()) : await response.text()
      return { status: 200, body }
    } catch (error) {
      lastError = error
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
      }
    }
  }
  throw lastError
}

/** Finds the first redistributable license for a family, or null. */
async function resolveLicense(family) {
  const dir = toLicenseDir(family)
  for (const { dir: licenseDir, file } of LICENSE_DIRS) {
    const url = `${GOOGLE_FONTS_RAW}/${licenseDir}/${dir}/${file}`
    const result = await fetchWithRetry(url)
    if (result.status === 200) {
      return { type: licenseDir.toUpperCase(), text: result.body }
    }
  }
  return null
}

async function fetchFontMetadata(apiId, subset) {
  const url = `${GWFH_API}/${apiId}?subsets=${subset}`
  const result = await fetchWithRetry(url)
  if (result.status === 404) return null
  return JSON.parse(result.body)
}

/** True when a file exists on disk with a non-zero size. */
function isCached(path) {
  return existsSync(path) && statSync(path).size > 0
}

async function materializeGoogleFamily(entry) {
  const { family, variants } = entry
  const slug = toSlug(family)
  const subset = SUBSET_BY_FAMILY[family] ?? "latin"
  const familyDir = join(fontFilesDir, slug)
  const licensePath = join(fontLicensesDir, `${slug}.txt`)

  const wantedFiles = variants.map((variant) => ({
    variant,
    path: join(familyDir, `${slug}-${variant}.woff2`),
  }))
  const missingFiles = wantedFiles.filter((f) => !isCached(f.path))
  const licenseMissing = !isCached(licensePath)

  if (missingFiles.length === 0 && !licenseMissing) {
    return { family, status: "cached" }
  }

  const license = await resolveLicense(family)
  if (!license) {
    return { family, status: "skipped", reason: "no redistributable license found" }
  }

  const metadata = await fetchFontMetadata(slug, subset)
  if (!metadata || !Array.isArray(metadata.variants)) {
    return {
      family,
      status: "skipped",
      reason: `font not found on google-webfonts-helper (id: ${slug})`,
    }
  }

  const available = new Map(metadata.variants.map((v) => [v.id, v]))
  const toDownload = []
  const missing = []
  for (const { variant, path } of missingFiles) {
    const match = available.get(GWFH_VARIANT_ALIAS[variant] ?? variant)
    if (match && match.woff2) toDownload.push({ variant, path, url: match.woff2 })
    else missing.push(variant)
  }

  await mkdir(fontLicensesDir, { recursive: true })
  await writeFile(licensePath, license.text, "utf8")

  if (toDownload.length > 0) {
    await mkdir(familyDir, { recursive: true })
  }

  let written = 0
  for (const { variant, path, url } of toDownload) {
    const file = await fetchWithRetry(url, { binary: true })
    if (file.status !== 200) {
      missing.push(variant)
      continue
    }
    await writeFile(path, file.body)
    written++
  }

  return { family, status: "materialized", license: license.type, subset, written, missing }
}

let fontshareCatalogPromise = null

/** Fetches and memoizes the Fontshare family catalog, keyed by slug. */
async function fetchFontshareCatalog() {
  if (!fontshareCatalogPromise) {
    fontshareCatalogPromise = (async () => {
      const bySlug = new Map()
      for (let offset = 0; ; offset += 100) {
        const result = await fetchWithRetry(`${FONTSHARE_API}?limit=100&offset=${offset}`)
        if (result.status === 404) break
        const page = JSON.parse(result.body)
        const items = page.data ?? page.fonts ?? (Array.isArray(page) ? page : [])
        for (const font of items) bySlug.set(font.slug, font)
        if (items.length < 100) break
      }
      return bySlug
    })()
  }
  return fontshareCatalogPromise
}

// Fontshare numbers italics as weight plus one (700 upright, 701 italic), so a
// catalog variant such as `700italic` maps to weight 700 with the italic flag.
function findFontshareStyle(styles, variant) {
  const italic = variant.endsWith("italic")
  const weightPart = italic ? variant.slice(0, -"italic".length) : variant
  const weight = weightPart === "" || weightPart === "regular" ? 400 : Number(weightPart)

  return (
    styles.find(
      (s) =>
        !s.is_variable &&
        Boolean(s.is_italic) === italic &&
        (s.is_italic ? s.weight.number - 1 : s.weight.number) === weight,
    ) ?? null
  )
}

async function materializeFontshareFamily(entry) {
  const { family, variants } = entry
  const slug = toSlug(family)
  const familyDir = join(fontFilesDir, slug)
  const licensePath = join(fontLicensesDir, `${slug}.txt`)

  const wantedFiles = variants.map((variant) => ({
    variant,
    path: join(familyDir, `${slug}-${variant}.woff2`),
  }))
  const missingFiles = wantedFiles.filter((f) => !isCached(f.path))
  const licenseMissing = !isCached(licensePath)

  if (missingFiles.length === 0 && !licenseMissing) {
    return { family, status: "cached" }
  }

  const catalog = await fetchFontshareCatalog()
  const font = catalog.get(slug)
  if (!font || !Array.isArray(font.styles)) {
    return { family, status: "skipped", reason: `font not found on Fontshare (slug: ${slug})` }
  }

  const licenseType = font.license_type ?? "itf_ffl"
  const licenseUrl = FONTSHARE_LICENSE_URLS[licenseType] ?? FONTSHARE_LICENSE_URLS.itf_ffl
  const licenseText = `${family}\nFontshare license: ${licenseType.toUpperCase()}\n${licenseUrl}\n`

  const toDownload = []
  const missing = []
  for (const { variant, path } of missingFiles) {
    const style = findFontshareStyle(font.styles, variant)
    if (style && style.file) toDownload.push({ variant, path, url: `https:${style.file}.woff2` })
    else missing.push(variant)
  }

  await mkdir(fontLicensesDir, { recursive: true })
  await writeFile(licensePath, licenseText, "utf8")

  if (toDownload.length > 0) {
    await mkdir(familyDir, { recursive: true })
  }

  let written = 0
  for (const { variant, path, url } of toDownload) {
    const file = await fetchWithRetry(url, { binary: true })
    if (file.status !== 200) {
      missing.push(variant)
      continue
    }
    await writeFile(path, file.body)
    written++
  }

  return {
    family,
    status: "materialized",
    license: licenseType.toUpperCase(),
    subset: "latin",
    written,
    missing,
  }
}

/**
 * Font sources to materialize. Each entry pairs a catalog family list with its
 * `source` tag and materializer. Add or remove a remote font vendor by editing
 * this one list; nothing else in the script hardcodes a vendor.
 */
const FONT_SOURCES = [
  { source: "google", families: GOOGLE_FONT_FAMILIES, materialize: materializeGoogleFamily },
  {
    source: "fontshare",
    families: FONTSHARE_FONT_FAMILIES,
    materialize: materializeFontshareFamily,
  },
]

const MATERIALIZE_BY_SOURCE = Object.fromEntries(FONT_SOURCES.map((s) => [s.source, s.materialize]))

/** Dispatches to the right source materializer. */
async function materializeFamily(entry) {
  const materialize = MATERIALIZE_BY_SOURCE[entry.source] ?? materializeGoogleFamily
  return materialize(entry)
}

async function main() {
  const filter = process.argv.slice(2)
  const allFamilies = FONT_SOURCES.flatMap(({ source, families }) =>
    families.map((f) => ({ ...f, source })),
  )
  const families = filter.length
    ? allFamilies.filter((f) => filter.includes(f.family))
    : allFamilies

  if (families.length === 0) {
    console.error("No families matched the filter.")
    process.exit(1)
  }

  mkdirSync(fontFilesDir, { recursive: true })
  mkdirSync(fontLicensesDir, { recursive: true })

  console.log(`Materializing ${families.length} families into ${editorPublic}\n`)

  const results = []
  for (const entry of families) {
    process.stdout.write(`- ${entry.family} ... `)
    try {
      const result = await materializeFamily(entry)
      results.push(result)
      if (result.status === "materialized") {
        const note = result.missing.length ? ` (missing: ${result.missing.join(", ")})` : ""
        console.log(`${result.license}, ${result.written} woff2 [${result.subset}]${note}`)
      } else if (result.status === "cached") {
        console.log("cached")
      } else {
        console.log(`SKIPPED: ${result.reason}`)
      }
    } catch (error) {
      results.push({ family: entry.family, status: "error", reason: String(error) })
      console.log(`ERROR: ${error}`)
    }
  }

  const materialized = results.filter((r) => r.status === "materialized")
  const cached = results.filter((r) => r.status === "cached")
  const skipped = results.filter((r) => r.status === "skipped" || r.status === "error")

  console.log(
    `\nDone. Materialized ${materialized.length}, cached ${cached.length}, skipped ${skipped.length}.`,
  )
  if (skipped.length) {
    console.log("\nSkipped / errored families:")
    for (const r of skipped) console.log(`  - ${r.family}: ${r.reason}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
