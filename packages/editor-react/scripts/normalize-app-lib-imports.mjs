// Rewrites @app/* and @lib/* import specifiers in editor-react so the prefix
// matches where the target file actually lives: .ts logic under lib/, .tsx
// views under app/. Idempotent; run after moving files between app/ and lib/.
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { dirname, join, normalize, relative } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const libRoot = join(root, "lib")
const appRoot = join(root, "app")

function existsWithExt(base) {
  for (const ext of [".ts", ".tsx", ".css", ".json"]) {
    try {
      statSync(base + ext)
      return true
    } catch {}
  }
  for (const idx of ["/index.ts", "/index.tsx"]) {
    try {
      statSync(base + idx)
      return true
    } catch {}
  }
  return false
}

function resolvePrefix(rest, current) {
  const inLib = existsWithExt(join(libRoot, rest))
  const inApp = existsWithExt(join(appRoot, rest))
  if (inLib && !inApp) return "lib"
  if (inApp && !inLib) return "app"
  return current // ambiguous or unknown: leave untouched
}

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist") continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (/\.(ts|tsx)$/.test(name)) out.push(full)
  }
}

const files = []
for (const d of [libRoot, appRoot, join(root, "src")]) {
  try {
    walk(d, files)
  } catch {}
}

// Subpath (relative to app/ or lib/) of an absolute module path, or null when
// it sits outside both trees (e.g. src/).
function subrelOf(abs) {
  const relLib = relative(libRoot, abs)
  if (!relLib.startsWith("..")) return relLib
  const relApp = relative(appRoot, abs)
  if (!relApp.startsWith("..")) return relApp
  return null
}

const aliasSpec = /(["'])@(app|lib)\/([^"']+)\1/g
const relSpec = /(["'])(\.\.?\/[^"']+)\1/g
let changed = 0
for (const file of files) {
  const src = readFileSync(file, "utf8")
  const fileTree = file.startsWith(libRoot)
    ? "lib"
    : file.startsWith(appRoot)
      ? "app"
      : null
  let next = src.replace(aliasSpec, (m, q, cur, rest) => {
    const p = resolvePrefix(rest, cur)
    return `${q}@${p}/${rest}${q}`
  })
  // Rewrite relative imports that cross the app<->lib boundary into aliases.
  if (fileTree) {
    next = next.replace(relSpec, (m, q, rel) => {
      const abs = normalize(join(dirname(file), rel))
      const subrel = subrelOf(abs)
      if (subrel === null) return m // outside both trees
      const p = resolvePrefix(subrel, fileTree)
      if (p === fileTree) return m // same tree: keep relative
      if (!existsWithExt(join(p === "lib" ? libRoot : appRoot, subrel)))
        return m
      return `${q}@${p}/${subrel}${q}`
    })
  }
  if (next !== src) {
    writeFileSync(file, next)
    changed++
  }
}
console.log(`normalized ${changed} file(s) of ${files.length} scanned`)
