// Downloads the curated Google font families into per-family folders under
// `catalog/google/`. For each family it resolves a redistributable license
// (OFL / Apache / UFL), downloads the manifest's `.woff2` variants from
// google-webfonts-helper, and writes the license `.txt` alongside the fonts.
//
// Run from the repo with Node 22.18+ (TypeScript manifest import relies on
// built-in type stripping):
//
//   node packages/core/font-collections/catalog/google/google-fonts.mjs
//
// Optional: pass family names to download only a subset, e.g.
//   node .../google-fonts.mjs "Roboto" "Inter"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { GOOGLE_MANIFEST_FAMILIES } from "./google-fonts-manifest.ts"

const GOOGLE_DIR = dirname(fileURLToPath(import.meta.url))

const GWFH_API = "https://gwfh.mranftl.com/api/fonts"
const GOOGLE_FONTS_RAW = "https://raw.githubusercontent.com/google/fonts/main"

// google-webfonts-helper names weight 400 `regular` and 400 italic `italic`.
// Some manifest families author those variants as `400`/`400italic`, so map to
// the gwfh id for lookup while keeping the manifest variant as the file name.
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

/** `IBM Plex Sans` -> `ibm-plex-sans` (google-webfonts-helper id). */
function toApiId(family) {
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
      const body = binary
        ? Buffer.from(await response.arrayBuffer())
        : await response.text()
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
      return { type: licenseDir.toUpperCase(), file, text: result.body }
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

async function downloadFamily(entry) {
  const { family, variants } = entry
  const apiId = toApiId(family)
  const subset = SUBSET_BY_FAMILY[family] ?? "latin"
  const familyDir = join(GOOGLE_DIR, apiId)

  const license = await resolveLicense(family)
  if (!license) {
    return {
      family,
      status: "skipped",
      reason: "no redistributable license found",
    }
  }

  const metadata = await fetchFontMetadata(apiId, subset)
  if (!metadata || !Array.isArray(metadata.variants)) {
    return {
      family,
      status: "skipped",
      reason: `font not found on google-webfonts-helper (id: ${apiId})`,
    }
  }

  const available = new Map(metadata.variants.map((v) => [v.id, v]))
  const wanted = []
  const missing = []
  for (const variant of variants) {
    const match = available.get(GWFH_VARIANT_ALIAS[variant] ?? variant)
    if (match && match.woff2) wanted.push({ variant, url: match.woff2 })
    else missing.push(variant)
  }

  if (wanted.length === 0) {
    return {
      family,
      status: "skipped",
      reason: "none of the requested variants are available",
    }
  }

  await mkdir(familyDir, { recursive: true })
  await writeFile(join(familyDir, license.file), license.text, "utf8")

  let written = 0
  for (const { variant, url } of wanted) {
    const file = await fetchWithRetry(url, { binary: true })
    if (file.status !== 200) {
      missing.push(variant)
      continue
    }
    await writeFile(join(familyDir, `${apiId}-${variant}.woff2`), file.body)
    written++
  }

  return {
    family,
    status: "downloaded",
    license: license.type,
    subset,
    written,
    missing,
  }
}

async function main() {
  const filter = process.argv.slice(2)
  const families = filter.length
    ? GOOGLE_MANIFEST_FAMILIES.filter((f) => filter.includes(f.family))
    : GOOGLE_MANIFEST_FAMILIES

  if (families.length === 0) {
    console.error("No families matched the filter.")
    process.exit(1)
  }

  console.log(`Downloading ${families.length} families into ${GOOGLE_DIR}\n`)

  const results = []
  for (const entry of families) {
    process.stdout.write(`- ${entry.family} ... `)
    try {
      const result = await downloadFamily(entry)
      results.push(result)
      if (result.status === "downloaded") {
        const note = result.missing.length
          ? ` (missing: ${result.missing.join(", ")})`
          : ""
        console.log(
          `${result.license}, ${result.written} woff2 [${result.subset}]${note}`,
        )
      } else {
        console.log(`SKIPPED: ${result.reason}`)
      }
    } catch (error) {
      results.push({
        family: entry.family,
        status: "error",
        reason: String(error),
      })
      console.log(`ERROR: ${error}`)
    }
  }

  const downloaded = results.filter((r) => r.status === "downloaded")
  const skipped = results.filter((r) => r.status !== "downloaded")

  console.log(
    `\nDone. Downloaded ${downloaded.length}, skipped ${skipped.length}.`,
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
