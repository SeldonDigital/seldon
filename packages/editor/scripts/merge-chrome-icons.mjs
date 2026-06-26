import fs from "node:fs"
import path from "node:path"

const dir = path.dirname(new URL(import.meta.url).pathname)
const editorRoot = path.dirname(dir)
const oldIndex = path.join(editorRoot, "seldon/icons/index.ts")
const newIndex = path.join(editorRoot, "seldon-NEW/icons/index.ts")

const exportRe = /export \{ (Icon[A-Za-z0-9]+) \} from ["'](.*)["']/

function parse(file) {
  const map = new Map()
  for (const raw of fs.readFileSync(file, "utf8").split("\n")) {
    const m = raw.match(exportRe)
    if (m) map.set(m[1], m[2])
  }
  return map
}

const oldMap = parse(oldIndex)
const newMap = parse(newIndex)

const lines = []
let copied = 0
for (const [name, rel] of oldMap) {
  if (newMap.has(name)) continue
  const src = path.join(editorRoot, "seldon/icons", `${rel.replace(/^\.\//, "")}.tsx`)
  const dst = path.join(editorRoot, "seldon-NEW/icons", `${rel.replace(/^\.\//, "")}.tsx`)
  if (!fs.existsSync(dst)) {
    if (!fs.existsSync(src)) {
      console.log("MISSING SOURCE:", name, src)
      continue
    }
    fs.mkdirSync(path.dirname(dst), { recursive: true })
    fs.copyFileSync(src, dst)
    copied++
  }
  lines.push(`export { ${name} } from "${rel}"`)
}

if (lines.length) {
  const banner =
    "\n// Editor-chrome icons re-added after factory re-export (not workspace components).\n"
  fs.appendFileSync(newIndex, banner + lines.join("\n") + "\n")
}

console.log("files copied:", copied)
console.log("exports appended:", lines.length)
