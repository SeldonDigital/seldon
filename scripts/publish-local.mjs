import { execFileSync } from "node:child_process"

/**
 * Publishes the seven publishable @seldon packages to the local Verdaccio
 * registry in dependency order, so each package's @seldon dependencies already
 * exist in the registry when it publishes.
 *
 * Prerequisites:
 *   1. Verdaccio is running: `npm run verdaccio`.
 *   2. A registry user exists: `npm adduser --registry http://localhost:4873`.
 *   3. The packages are built: `npm run build:packages`.
 *
 * The registry comes from the @seldon scope in .npmrc, but the unpublish and
 * publish calls pass it explicitly. Each package is unpublished before it
 * publishes, so re-running on the same version replaces the local copy instead
 * of failing on the immutable-version 409.
 */
const REGISTRY = "http://localhost:4873/"

/** Publish order follows the dependency graph: a package publishes after its @seldon deps. */
const PACKAGES = [
  "@seldon/core",
  "@seldon/factory",
  "@seldon/ai",
  "@seldon/editor",
  "@seldon/terminus",
  "@seldon/hari",
  "@seldon/foundation",
]

for (const name of PACKAGES) {
  process.stdout.write(`\nPublishing ${name} to ${REGISTRY}\n`)

  // Local iteration stays on one version, so drop any existing copy first. A
  // published version is immutable, so republishing the same version fails with
  // a 409 otherwise. Ignore the error when the package is not yet in the registry.
  try {
    execFileSync("npm", ["unpublish", name, "--registry", REGISTRY, "--force"], {
      stdio: "inherit",
    })
  } catch {
    // Not present in the registry yet; nothing to remove.
  }

  execFileSync("npm", ["publish", "--workspace", name, "--registry", REGISTRY], {
    stdio: "inherit",
  })
}

process.stdout.write(`\nPublished ${PACKAGES.length} packages to ${REGISTRY}\n`)
