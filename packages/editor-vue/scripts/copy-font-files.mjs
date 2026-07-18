/*
 * Copies each packaged Google font family's woff2 files into the Vue editor's
 * served static assets so the canvas can self-host them through @font-face.
 *
 * Source: `packages/core/font-collections/catalog/google/<slug>/<slug>-<variant>.woff2`
 * Destination: `packages/editor-vue/public/font-files/<slug>/<slug>-<variant>.woff2`
 *
 * Idempotent: files with a matching size are skipped, so re-running is fast.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const editorRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = join(editorRoot, "../core/font-collections/catalog/google")
const destRoot = join(editorRoot, "public/font-files")

if (!existsSync(sourceRoot)) {
  console.warn(`Font file source not found: ${sourceRoot}`)
  process.exit(0)
}

mkdirSync(destRoot, { recursive: true })

let copied = 0
let skipped = 0

for (const slug of readdirSync(sourceRoot)) {
  const familyDir = join(sourceRoot, slug)
  if (!statSync(familyDir).isDirectory()) continue

  const woff2Files = readdirSync(familyDir).filter((name) =>
    name.endsWith(".woff2"),
  )
  if (woff2Files.length === 0) continue

  const destFamilyDir = join(destRoot, slug)
  mkdirSync(destFamilyDir, { recursive: true })

  for (const file of woff2Files) {
    const source = join(familyDir, file)
    const dest = join(destFamilyDir, file)
    if (existsSync(dest) && statSync(dest).size === statSync(source).size) {
      skipped += 1
      continue
    }
    copyFileSync(source, dest)
    copied += 1
  }
}

console.log(
  `Copied ${copied} font file(s) to public/font-files (${skipped} up to date).`,
)
