/*
 * Copies each packaged Google font family's license file into the editor's
 * served static assets so the properties sidebar can link to it.
 *
 * Source: `packages/core/font-collections/catalog/google/<slug>/{OFL,LICENSE}.txt`
 * Destination: `packages/editor/public/font-licenses/<slug>.txt`
 *
 * Idempotent: re-running overwrites the copied files.
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
const destRoot = join(editorRoot, "public/font-licenses")

const LICENSE_FILES = ["OFL.txt", "LICENSE.txt", "UFL.txt"]

if (!existsSync(sourceRoot)) {
  console.warn(`Font license source not found: ${sourceRoot}`)
  process.exit(0)
}

mkdirSync(destRoot, { recursive: true })

let copied = 0

for (const slug of readdirSync(sourceRoot)) {
  const familyDir = join(sourceRoot, slug)
  if (!statSync(familyDir).isDirectory()) continue

  const licenseName = LICENSE_FILES.find((name) =>
    existsSync(join(familyDir, name)),
  )
  if (!licenseName) continue

  copyFileSync(join(familyDir, licenseName), join(destRoot, `${slug}.txt`))
  copied += 1
}

console.log(`Copied ${copied} font license file(s) to public/font-licenses.`)
