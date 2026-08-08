import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

/**
 * Package hygiene gate for the publishable Seldon packages. It guards against the
 * failure modes that only surface once a package leaves the monorepo:
 *
 * - Import boundaries: every `@seldon/*` a package imports must be one of its own
 *   declared dependencies, and `@seldon/core` must depend on no `@seldon/*`.
 * - Lifecycle safety: no publishable package may run a `postinstall` or `prepare`
 *   hook, so a consumer install runs nothing repo-specific.
 * - Tarball contents: `npm pack --dry-run` must never carry `node_modules`, and
 *   the file list is reported for review.
 * - Exports and types: `publint` and `@arethetypeswrong/cli` run when available.
 *
 * The native checks are the hard gate. The external tools are advisory and are
 * skipped when not installed, so this script never depends on the network.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.dirname(scriptDir)

/** Publishable packages, by directory relative to the repo root. */
const PACKAGES = [
  "packages/core",
  "packages/factory",
  "packages/ai",
  "packages/editor/shared",
  "packages/bundles/terminus",
  "packages/bundles/hari",
  "packages/bundles/foundation",
]

const SELDON_IMPORT = /(?:from\s+|import\(\s*|require\(\s*)["'](@seldon\/[a-z-]+)/g
const errors = []
const warnings = []

for (const relDir of PACKAGES) {
  const dir = path.join(repoRoot, relDir)
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"))
  const name = manifest.name

  checkLifecycle(name, manifest)
  checkImportBoundaries(name, dir, manifest)
  checkTarball(name, dir)
}

runExternalTool("publint", ["publint", "--strict"])
runExternalTool("attw", ["attw", "--pack", "--profile", "node16"])

report()

function declaredSeldonDeps(manifest) {
  const deps = {
    ...manifest.dependencies,
    ...manifest.peerDependencies,
  }

  return new Set(Object.keys(deps).filter((dep) => dep.startsWith("@seldon/")))
}

function checkLifecycle(name, manifest) {
  const scripts = manifest.scripts ?? {}

  for (const hook of ["postinstall", "prepare", "install", "preinstall"]) {
    if (scripts[hook]) {
      errors.push(`${name}: has a "${hook}" lifecycle script, which runs on consumer install.`)
    }
  }
}

function checkImportBoundaries(name, dir, manifest) {
  const allowed = declaredSeldonDeps(manifest)
  const isCore = name === "@seldon/core"
  const found = new Set()

  for (const file of collectSourceFiles(dir)) {
    const source = fs.readFileSync(file, "utf8")

    for (const match of source.matchAll(SELDON_IMPORT)) {
      found.add(match[1])
    }
  }

  for (const imported of found) {
    if (imported === name) {
      continue
    }

    if (isCore) {
      errors.push(`${name}: imports ${imported}; core must depend on no @seldon/* package.`)
      continue
    }

    if (!allowed.has(imported)) {
      errors.push(
        `${name}: imports ${imported} but does not declare it as a dependency or peerDependency.`,
      )
    }
  }
}

function collectSourceFiles(dir) {
  const files = []

  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === "dist") {
        continue
      }

      const full = path.join(current, entry.name)

      if (entry.isDirectory()) {
        walk(full)
      } else if (/\.(ts|tsx|mts|cts)$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
        files.push(full)
      }
    }
  }

  walk(dir)

  return files
}

function checkTarball(name, dir) {
  let output

  try {
    output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
      cwd: dir,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      maxBuffer: 256 * 1024 * 1024,
    })
  } catch (error) {
    errors.push(`${name}: "npm pack --dry-run" failed: ${error.message}`)
    return
  }

  let parsed

  try {
    parsed = JSON.parse(output)
  } catch {
    warnings.push(`${name}: could not parse "npm pack" output; skipping tarball review.`)
    return
  }

  const entry = Array.isArray(parsed) ? parsed[0] : parsed
  const files = (entry?.files ?? []).map((file) => file.path)
  const bundled = files.filter((file) => file.includes("node_modules/"))

  if (bundled.length > 0) {
    errors.push(`${name}: tarball would carry node_modules (${bundled.length} files).`)
  }

  const tests = files.filter((file) => /\.test\./.test(file))

  if (tests.length > 0) {
    warnings.push(`${name}: tarball carries ${tests.length} test file(s).`)
  }

  console.log(`  ${name}: ${files.length} files, ${formatSize(entry?.unpackedSize)} unpacked`)
}

function formatSize(bytes) {
  if (!bytes) {
    return "unknown size"
  }

  return `${(bytes / 1024 / 1024).toFixed(1)}mb`
}

function runExternalTool(label, args) {
  const packagesWithDist = PACKAGES.filter((relDir) =>
    fs.existsSync(path.join(repoRoot, relDir, "dist")),
  )

  let toolCrashed = false

  for (const relDir of packagesWithDist) {
    const dir = path.join(repoRoot, relDir)

    try {
      const output = execFileSync("npx", ["--no-install", ...args], {
        cwd: dir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      })

      console.log(`  ${label} ${relDir}: ok`)

      if (output.trim()) {
        console.log(indent(output.trim()))
      }
    } catch (error) {
      const message = `${error.stdout ?? ""}${error.stderr ?? ""}`.trim()

      if (/could not determine executable|not found|no such/i.test(message)) {
        warnings.push(`${label}: not installed; skipped ${relDir}.`)
      } else if (/Cannot read properties of undefined/i.test(message)) {
        // attw crashes internally on these ESM-only manifests regardless of the
        // profile. It is advisory, and publint already covers exports and types,
        // so report the tool bug once rather than per package.
        toolCrashed = true
      } else {
        warnings.push(`${label} ${relDir}:\n${indent(message)}`)
      }
    } finally {
      // `attw --pack` writes a tarball and, when it crashes, leaves it behind.
      // Remove any pack artifact so the tool never litters the working tree.
      removePackArtifacts(dir)
    }
  }

  if (toolCrashed) {
    warnings.push(`${label}: skipped; the tool crashed internally on these packages (advisory).`)
  }
}

function removePackArtifacts(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (entry.endsWith(".tgz")) {
      fs.rmSync(path.join(dir, entry), { force: true })
    }
  }
}

function indent(text) {
  return text
    .split("\n")
    .map((line) => `    ${line}`)
    .join("\n")
}

function report() {
  console.log("")

  for (const warning of warnings) {
    console.warn(`WARN  ${warning}`)
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`ERROR ${error}`)
    }

    console.error(`\nverify:packages failed with ${errors.length} error(s).`)
    process.exit(1)
  }

  console.log(`\nverify:packages passed (${warnings.length} warning(s)).`)
}
