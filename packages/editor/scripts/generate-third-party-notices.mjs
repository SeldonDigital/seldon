/*
 * Generates an aggregated third-party license notice file for every production
 * dependency that ships with the editor build. This satisfies the attribution
 * terms of permissive licenses (MIT, ISC, BSD) and the NOTICE propagation term
 * of Apache-2.0.
 *
 * Source of truth: `npm query ".prod"` scoped to this workspace, which returns
 * the resolved production dependency tree with on-disk paths.
 * Destination: `packages/editor/public/THIRD-PARTY-NOTICES.txt`, which Vite
 * copies into the build output and serves at `/THIRD-PARTY-NOTICES.txt`.
 *
 * First-party `@seldon/*` packages are excluded since they are covered by the
 * repository license. The production tree may include build-time packages that
 * are not bundled into the browser output; including them is safe over
 * attribution and keeps the script simple.
 *
 * Idempotent: re-running overwrites the output file.
 */
import { execFileSync } from "node:child_process"
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const editorRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const destDir = join(editorRoot, "public")
const destFile = join(destDir, "THIRD-PARTY-NOTICES.txt")

const LICENSE_FILENAME = /^(license|licence|copying|unlicense)([.-].*)?$/i
const NOTICE_FILENAME = /^notice([.-].*)?$/i

/** Reads the resolved production dependency tree for this workspace. */
function queryProductionDependencies() {
  const raw = execFileSync("npm", ["query", ".prod"], {
    cwd: editorRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
  return JSON.parse(raw)
}

/** Returns the SPDX-ish license string declared in a node's package.json. */
function readDeclaredLicense(node) {
  if (typeof node.license === "string") return node.license
  if (node.license && typeof node.license === "object" && node.license.type) {
    return node.license.type
  }
  if (Array.isArray(node.licenses)) {
    return node.licenses.map((entry) => entry.type ?? entry).join(" OR ")
  }
  return "UNKNOWN"
}

/** Finds and reads license and NOTICE file text inside a package directory. */
function readLicenseTexts(packagePath) {
  const empty = { licenseText: "", notice: "" }
  if (!packagePath || !existsSync(packagePath)) return empty

  let entries
  try {
    entries = readdirSync(packagePath, { withFileTypes: true })
  } catch {
    return empty
  }

  const read = (matcher) => {
    const match = entries.find(
      (entry) => entry.isFile() && matcher.test(entry.name),
    )
    if (!match) return ""
    try {
      return readFileSync(join(packagePath, match.name), "utf8").trim()
    } catch {
      return ""
    }
  }

  return { licenseText: read(LICENSE_FILENAME), notice: read(NOTICE_FILENAME) }
}

const nodes = queryProductionDependencies()

const packages = new Map()
for (const node of nodes) {
  if (!node?.name || node.dev) continue
  if (node.name.startsWith("@seldon/")) continue
  if (!node.path) continue

  const key = `${node.name}@${node.version ?? "0.0.0"}`
  if (packages.has(key)) continue

  packages.set(key, {
    name: node.name,
    version: node.version ?? "",
    license: readDeclaredLicense(node),
    ...readLicenseTexts(node.path),
  })
}

const sorted = [...packages.values()].sort((a, b) =>
  a.name.localeCompare(b.name),
)

const divider = "-".repeat(80)
const sections = sorted.map((pkg) => {
  const title = `${pkg.name}${pkg.version ? `@${pkg.version}` : ""}`
  const header = `${title}\nLicense: ${pkg.license}`

  // Prefer the full license file text; fall back to the declared identifier.
  const licenseBody = pkg.licenseText || `SPDX identifier: ${pkg.license}`
  const noticeBody = pkg.notice ? `\n\nNOTICE:\n${pkg.notice}` : ""
  return `${header}\n\n${licenseBody}${noticeBody}`
})

const preamble = [
  "THIRD-PARTY SOFTWARE NOTICES",
  "",
  "The editor build includes the following third-party packages. Their",
  "licenses and required notices are reproduced below. First-party Seldon",
  "packages are covered by the repository license and are not listed here.",
  "",
  `Generated from the production dependency tree (${sorted.length} packages).`,
].join("\n")

const output = `${preamble}\n\n${divider}\n\n${sections.join(`\n\n${divider}\n\n`)}\n`

mkdirSync(destDir, { recursive: true })
writeFileSync(destFile, output, "utf8")

console.log(
  `Wrote ${sorted.length} third-party notice(s) to public/THIRD-PARTY-NOTICES.txt`,
)
