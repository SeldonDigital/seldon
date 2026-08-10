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
 * The registry comes from the @seldon scope in .npmrc, so no --registry flag is
 * needed. Republishing an existing version fails; bump the lockstep version
 * first (`npm run changeset` then `npm run version`).
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

  execFileSync("npm", ["publish", "--workspace", name, "--registry", REGISTRY], {
    stdio: "inherit",
  })
}

process.stdout.write(`\nPublished ${PACKAGES.length} packages to ${REGISTRY}\n`)
