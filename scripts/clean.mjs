// Removes regenerable build output so `npm run clean` resets the repo without a
// reinstall. It wipes every workspace's `dist`, the root `dist` and `coverage`,
// stray `*.tsbuildinfo` files, and the editor font cache. It never touches
// `node_modules` or the `.seldon` workspace store, so a following `dev`/`build`
// rebuilds and re-materializes fonts from the warm upstream without `npm install`.
//
// Pass `--dist-only` to remove only compiled output (`dist` and `*.tsbuildinfo`)
// and keep the font cache and coverage, so a following build skips the font
// re-fetch.
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

const distOnly = process.argv.includes("--dist-only")

const rootPackage = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"))
const workspaces = rootPackage.workspaces ?? []

// Compiled output, always removed. Each workspace contributes its `dist`; the
// root contributes its own build output.
const distDirs = [...workspaces.map((ws) => join(ROOT, ws, "dist")), join(ROOT, "dist")]

// Coverage and the editor font cache. Kept under `--dist-only` so a build skips
// the font re-fetch.
const cacheDirs = [
  join(ROOT, "coverage"),
  join(ROOT, "packages/editor/shared/public/font-files"),
  join(ROOT, "packages/editor/shared/public/font-licenses"),
]

const targetDirs = distOnly ? distDirs : [...distDirs, ...cacheDirs]

// Incremental TypeScript build info sits at each workspace root and the repo root.
const tsbuildinfoDirs = [ROOT, ...workspaces.map((ws) => join(ROOT, ws))]

/** Total size of a file or directory tree in bytes, or 0 when it is absent. */
function sizeOf(path) {
  if (!existsSync(path)) return 0
  const stats = statSync(path)
  if (!stats.isDirectory()) return stats.size

  let total = 0
  for (const entry of readdirSync(path)) {
    total += sizeOf(join(path, entry))
  }
  return total
}

function formatBytes(bytes) {
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

function remove(path) {
  const bytes = sizeOf(path)
  if (bytes === 0 && !existsSync(path)) return { removed: false, bytes: 0 }
  rmSync(path, { recursive: true, force: true })
  return { removed: true, bytes }
}

let freed = 0
let count = 0

for (const dir of targetDirs) {
  const { removed, bytes } = remove(dir)
  if (!removed) continue
  freed += bytes
  count += 1
  console.log(`- ${dir.replace(`${ROOT}/`, "")}  (${formatBytes(bytes)})`)
}

for (const dir of tsbuildinfoDirs) {
  if (!existsSync(dir)) continue
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith(".tsbuildinfo")) continue
    const path = join(dir, entry)
    const { removed, bytes } = remove(path)
    if (!removed) continue
    freed += bytes
    count += 1
    console.log(`- ${path.replace(`${ROOT}/`, "")}  (${formatBytes(bytes)})`)
  }
}

const kept = distOnly ? "node_modules, .seldon, and the font cache" : "node_modules and .seldon"
console.log(`\nCleaned ${count} path(s), freed ${formatBytes(freed)}.`)
console.log(`Kept ${kept}. Run dev or build to rebuild.`)
