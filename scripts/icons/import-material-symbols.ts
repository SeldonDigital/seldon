/**
 * Imports missing Google Material Symbols into the material icon catalog.
 *
 * Additive only: icons already in `materialAllIconIds` are skipped and existing
 * TSX files are never overwritten. For each missing symbol the script:
 *
 * 1. Derives the icon id and component name from the official snake_case name.
 * 2. Picks a category path from the Google Fonts metadata categories.
 * 3. Downloads the Material Symbols Outlined 24px SVG from Google's GitHub.
 * 4. Writes the component into `catalog/material/{category}/{subcategory}/`.
 *
 * Afterwards it regenerates `catalog/material/index-all.ts` from the folder
 * tree and inserts the new ids and labels into the registry in
 * `packages/core/icon-sets/index.ts`.
 *
 * Run with: bun scripts/icons/import-material-symbols.ts
 * Follow with: bun scripts/icons/generate-mappings.ts
 */
import fs from "node:fs"
import path from "node:path"
import { categoryPaths } from "../../packages/core/icon-sets/constants/categories"

const REPO_ROOT = path.resolve(import.meta.dir, "../..")
const MATERIAL_DIR = path.join(
  REPO_ROOT,
  "packages/core/icon-sets/catalog/material",
)
const REGISTRY_PATH = path.join(REPO_ROOT, "packages/core/icon-sets/index.ts")

const VERSIONS_URL =
  "https://raw.githubusercontent.com/google/material-design-icons/master/update/current_versions.json"
const METADATA_URL =
  "https://fonts.google.com/metadata/icons?incomplete=1&key=material_symbols"
const svgUrl = (name: string) =>
  `https://raw.githubusercontent.com/google/material-design-icons/master/symbols/web/${name}/materialsymbolsoutlined/${name}_24px.svg`

const DOWNLOAD_CONCURRENCY = 20
const DOWNLOAD_RETRIES = 3

/**
 * Google Symbols category -> Seldon category path. First match in this order
 * wins when an icon has several categories.
 */
const CATEGORY_TRANSLATION: Array<[string, string]> = [
  ["AI", "system/ai"],
  ["Home", "specialized/smart-home"],
  ["Android", "system/connectivity"],
  ["Privacy", "system/security"],
  ["Text", "user-interface/text"],
  ["Communicate", "user-interface/communication"],
  ["Audio&Video", "user-interface/media"],
  ["Images", "user-interface/media"],
  ["Maps", "utility/location"],
  ["Transit", "specialized/transportation"],
  ["Travel", "specialized/transportation"],
  ["Household", "specialized/household"],
  ["Hardware", "system/devices"],
  ["Business", "business/operations"],
  ["Activities", "specialized/sports"],
  ["Social", "social-media/social"],
  ["UI actions", "user-interface/actions"],
  ["Actions", "user-interface/actions"],
]

const FALLBACK_CATEGORY_PATH = "miscellaneous/miscellaneous"

/**
 * Converts an official snake_case symbol name into catalog naming.
 *
 * `arrow_back_2` -> id name `arrowBack_2`, component `IconMaterialArrowBack_2`
 * `timer_10_select` -> `timer_10Select` / `IconMaterialTimer_10Select`
 * `1k_plus` -> `1kPlus` / `IconMaterial1kPlus`
 *
 * Segments starting with a digit keep their leading underscore, except a
 * leading first segment.
 */
function deriveNaming(symbolName: string): {
  iconId: string
  componentName: string
} {
  const segments = symbolName.split("_")
  let idName = ""
  for (const [index, segment] of segments.entries()) {
    if (index === 0) {
      idName += segment
    } else if (/^\d/.test(segment)) {
      idName += `_${segment}`
    } else {
      idName += segment.charAt(0).toUpperCase() + segment.slice(1)
    }
  }
  const componentName = `IconMaterial${idName.charAt(0).toUpperCase()}${idName.slice(1)}`
  return { iconId: `material-${idName}`, componentName }
}

/**
 * Display label following the registry convention: split the id name at
 * uppercase boundaries and capitalize each token. Underscore-digit runs stay
 * attached to their token, e.g. `battery_0Bar` -> `Battery_0 Bar`.
 */
function deriveLabel(iconId: string): string {
  const name = iconId.slice("material-".length)
  const tokens = name.split(/(?=[A-Z])/)
  return tokens
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ")
}

function pickCategoryPath(categories: string[] | undefined): string {
  if (categories && categories.length > 0) {
    for (const [google, seldonPath] of CATEGORY_TRANSLATION) {
      if (categories.includes(google)) return seldonPath
    }
  }
  return FALLBACK_CATEGORY_PATH
}

/** Converts kebab-case SVG attributes to their JSX camelCase form. */
function toJsxAttributes(markup: string): string {
  return markup.replace(
    /(fill|clip|stroke|font|text|stop|color|flood|letter|marker|shape|word)-([a-z])([a-z]*)=/g,
    (_, head: string, first: string, rest: string) =>
      `${head}${first.toUpperCase()}${rest}=`,
  )
}

function buildComponentSource(
  componentName: string,
  viewBox: string,
  innerSvg: string,
): string {
  const propsBreak = componentName.length > 23
  const signature = propsBreak
    ? `export function ${componentName}(\n  props: SVGAttributes<SVGSVGElement>,\n) {`
    : `export function ${componentName}(props: SVGAttributes<SVGSVGElement>) {`
  return `import { SVGAttributes } from "react"

${signature}
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="${viewBox}"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      ${innerSvg}
    </svg>
  )
}
`
}

async function fetchWithRetry(url: string): Promise<string> {
  let lastError: unknown
  for (let attempt = 1; attempt <= DOWNLOAD_RETRIES; attempt++) {
    try {
      const response = await fetch(url)
      if (response.ok) return await response.text()
      lastError = new Error(`HTTP ${response.status}`)
      if (response.status === 404) break
    } catch (error) {
      lastError = error
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * attempt))
  }
  throw new Error(`Failed to fetch ${url}: ${lastError}`)
}

/**
 * Extracts the viewBox and inner markup from a downloaded SVG. A few symbols
 * ship without a viewBox in plain 24px coordinates, so the width and height
 * attributes become the viewBox.
 */
function parseSvg(svg: string): { viewBox: string; inner: string } {
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  if (!innerMatch) {
    throw new Error("Unexpected SVG shape")
  }
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)
  let viewBox = viewBoxMatch?.[1]
  if (!viewBox) {
    const width = svg.match(/<svg[^>]*\swidth="(\d+)"/)?.[1]
    const height = svg.match(/<svg[^>]*\sheight="(\d+)"/)?.[1]
    if (!width || !height) {
      throw new Error("Unexpected SVG shape")
    }
    viewBox = `0 0 ${width} ${height}`
  }
  return { viewBox, inner: toJsxAttributes(innerMatch[1].trim()) }
}

function parseExistingIconIds(): Set<string> {
  const source = fs.readFileSync(
    path.join(MATERIAL_DIR, "index-all.ts"),
    "utf8",
  )
  const match = source.match(
    /export const materialAllIconIds[^=]*= \[([\s\S]*?)\] as const/,
  )
  if (!match) throw new Error("Could not find materialAllIconIds")
  const ids = new Set<string>()
  for (const idMatch of match[1].matchAll(/"([^"]+)"/g)) ids.add(idMatch[1])
  return ids
}

/** Regenerates material/index-all.ts from the catalog folder tree. */
function regenerateIndexAll(): string[] {
  const exportLines: string[] = []
  const idLines: string[] = []
  const orderedIds: string[] = []

  for (const categoryPath of categoryPaths) {
    const dir = path.join(MATERIAL_DIR, categoryPath)
    if (!fs.existsSync(dir)) continue
    const files = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".tsx"))
      .sort()
    if (files.length === 0) continue

    exportLines.push(`// ${categoryPath}`)
    for (const file of files) {
      const componentName = file.replace(/\.tsx$/, "")
      const idName =
        componentName.slice("IconMaterial".length).charAt(0).toLowerCase() +
        componentName.slice("IconMaterial".length + 1)
      const iconId = `material-${idName}`
      exportLines.push(
        `export { ${componentName} } from "./${categoryPath}/${componentName}"`,
      )
      idLines.push(`  "${iconId}",`)
      orderedIds.push(iconId)
    }
    exportLines.push("")
  }

  const source = `import { IconId } from "@seldon/core/icon-sets"

// All icons from material icon set, organized by category
${exportLines.join("\n")}
export const materialAllIconIds: readonly IconId[] = [
${idLines.join("\n")}
] as const
`
  fs.writeFileSync(path.join(MATERIAL_DIR, "index-all.ts"), source)
  return orderedIds
}

/**
 * Inserts new material entries into the `iconIds` array and `iconLabels` map
 * in the registry. Each new entry is inserted before the first existing
 * material entry that sorts after it, keeping the block ordered.
 */
function updateRegistry(newIds: string[]): void {
  const source = fs.readFileSync(REGISTRY_PATH, "utf8")

  // Some ids predate the import and are already registered without a catalog
  // file. Skip them so the registry never gains duplicate entries.
  const registeredIds = new Set(
    [...source.matchAll(/"(material-[^"]+)"/g)].map((match) => match[1]),
  )
  const idsToInsert = newIds.filter((id) => !registeredIds.has(id))
  if (idsToInsert.length === 0) return
  const lines = source.split("\n")

  const insertSorted = (
    entryPattern: RegExp,
    renderLine: (id: string) => string,
  ) => {
    const blockIndexes: number[] = []
    for (const [index, line] of lines.entries()) {
      if (entryPattern.test(line)) blockIndexes.push(index)
    }
    if (blockIndexes.length === 0) {
      throw new Error(`No material block found for ${entryPattern}`)
    }

    const idOfLine = (line: string) => line.match(/"(material-[^"]+)"/)![1]
    // Insert in reverse-sorted order so earlier line indexes stay valid.
    const sortedNew = [...idsToInsert].sort((a, b) => b.localeCompare(a))
    for (const id of sortedNew) {
      let insertAt = blockIndexes[blockIndexes.length - 1] + 1
      for (const index of blockIndexes) {
        if (idOfLine(lines[index]).localeCompare(id) > 0) {
          insertAt = index
          break
        }
      }
      lines.splice(insertAt, 0, renderLine(id))
      for (let i = 0; i < blockIndexes.length; i++) {
        if (blockIndexes[i] >= insertAt) blockIndexes[i] += 1
      }
    }
  }

  insertSorted(/^  "material-[^"]+",$/, (id) => `  "${id}",`)
  insertSorted(
    /^  "material-[^"]+": "[^"]*",$/,
    (id) => `  "${id}": "${deriveLabel(id)}",`,
  )

  fs.writeFileSync(REGISTRY_PATH, lines.join("\n"))
}

async function main(): Promise<void> {
  console.log("Fetching official symbol list and metadata...")
  const [versionsRaw, metadataRaw] = await Promise.all([
    fetchWithRetry(VERSIONS_URL),
    fetchWithRetry(METADATA_URL),
  ])

  const versions = JSON.parse(versionsRaw) as Record<string, unknown>
  const symbolNames = [
    ...new Set(
      Object.keys(versions)
        .filter((key) => key.startsWith("symbols::"))
        .map((key) => key.split("::")[1]),
    ),
  ].sort()

  // The metadata response is JSON prefixed with a `)]}'` guard line.
  const metadata = JSON.parse(metadataRaw.replace(/^\)\]\}'\n?/, "")) as {
    icons: Array<{ name: string; categories?: string[] }>
  }
  const categoriesByName = new Map<string, string[]>(
    metadata.icons.map((icon) => [icon.name, icon.categories ?? []]),
  )

  const existingIds = parseExistingIconIds()
  const missing = symbolNames
    .map((name) => ({ name, ...deriveNaming(name) }))
    .filter((entry) => !existingIds.has(entry.iconId))

  console.log(
    `${symbolNames.length} official symbols, ${existingIds.size} in catalog, ${missing.length} to import`,
  )

  const failures: string[] = []
  const byCategory = new Map<string, number>()
  let completed = 0

  const queue = [...missing]
  const workers = Array.from(
    { length: DOWNLOAD_CONCURRENCY },
    async (): Promise<void> => {
      for (;;) {
        const entry = queue.shift()
        if (!entry) return
        const categoryPath = pickCategoryPath(categoriesByName.get(entry.name))
        const targetDir = path.join(MATERIAL_DIR, categoryPath)
        const targetFile = path.join(targetDir, `${entry.componentName}.tsx`)
        try {
          if (!fs.existsSync(targetFile)) {
            const svg = await fetchWithRetry(svgUrl(entry.name))
            const { viewBox, inner } = parseSvg(svg)
            fs.mkdirSync(targetDir, { recursive: true })
            fs.writeFileSync(
              targetFile,
              buildComponentSource(entry.componentName, viewBox, inner),
            )
          }
          byCategory.set(categoryPath, (byCategory.get(categoryPath) ?? 0) + 1)
        } catch (error) {
          failures.push(`${entry.name}: ${error}`)
        }
        completed += 1
        if (completed % 250 === 0) {
          console.log(`  ${completed}/${missing.length} processed`)
        }
      }
    },
  )
  await Promise.all(workers)

  console.log("\nImported icons by category:")
  for (const [categoryPath, count] of [...byCategory.entries()].sort()) {
    console.log(`  ${categoryPath}: ${count}`)
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} downloads failed:`)
    for (const failure of failures) console.error(`  - ${failure}`)
    console.error("Re-run the script to retry the failed downloads.")
  }

  console.log("\nRegenerating index-all.ts...")
  const allIds = regenerateIndexAll()
  console.log(`index-all.ts now lists ${allIds.length} icons`)

  const registryNewIds = missing
    .map((entry) => entry.iconId)
    .filter((id) => allIds.includes(id) && !existingIds.has(id))
  console.log(`Inserting ${registryNewIds.length} ids into the registry...`)
  updateRegistry(registryNewIds)

  if (failures.length > 0) {
    process.exitCode = 1
  }
}

await main()
