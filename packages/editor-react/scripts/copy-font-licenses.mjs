/*
 * Copies each packaged Google font family's license file into the editor's
 * served static assets so the properties sidebar can link to it.
 *
 * Source: `packages/core/font-collections/catalog/google/<slug>/{OFL,LICENSE}.txt`
 * Destination: `packages/editor/public/font-licenses/<slug>.txt`
 *
 * Idempotent: files with matching contents are skipped, so re-running does not
 * rewrite unchanged files or touch their mtimes.
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const editorRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = join(editorRoot, "../core/font-collections/catalog/google")
const destRoot = join(editorRoot, "../editor/public/font-licenses")

const LICENSE_FILES = ["OFL.txt", "LICENSE.txt", "UFL.txt"]

if (!existsSync(sourceRoot)) {
  console.warn(`Font license source not found: ${sourceRoot}`)
  process.exit(0)
}

mkdirSync(destRoot, { recursive: true })

let copied = 0
let skipped = 0

for (const slug of readdirSync(sourceRoot)) {
  const familyDir = join(sourceRoot, slug)
  if (!statSync(familyDir).isDirectory()) continue

  const licenseName = LICENSE_FILES.find((name) =>
    existsSync(join(familyDir, name)),
  )
  if (!licenseName) continue

  const source = join(familyDir, licenseName)
  const dest = join(destRoot, `${slug}.txt`)

  if (
    existsSync(dest) &&
    statSync(dest).size === statSync(source).size &&
    readFileSync(dest).equals(readFileSync(source))
  ) {
    skipped += 1
    continue
  }

  copyFileSync(source, dest)
  copied += 1
}

console.log(
  `Copied ${copied} font license file(s) to public/font-licenses (${skipped} up to date).`,
)
