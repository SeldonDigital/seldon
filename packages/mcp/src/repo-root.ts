import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

/**
 * The Seldon monorepo root, shared by every Factory invocation (previews and
 * workspace_export alike).
 *
 * As `rootDirectory` it is NOT an asset base for the workspace — Factory's
 * own `createNodeExportAssetReader` (@seldon/factory/export/asset-reader)
 * uses it to locate ITS OWN bundled source at
 * `<rootDirectory>/packages/core/components/native-react`. Get this wrong
 * (e.g. pass the workspace file's directory) and native component files
 * silently fail to generate — `getNativeComponentFiles` swallows the miss,
 * and the bundle later fails with "not in the virtual export" for every
 * `../native-react/HTML.*` import. It must be the actual monorepo root,
 * computed the same way the Factory-SSR spike computes it (relative to this
 * source file's own location — packages/mcp/src — not anything
 * caller-supplied).
 */
export const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
)

/**
 * Fail fast when the repo-root derivation is broken (moved install,
 * repackaged layout): without this, the miss surfaces much later as a
 * confusing "not in the virtual export: ../native-react/HTML.*" bundle
 * error, because Factory swallows the missing-native-components failure
 * silently.
 */
export function assertFactorySourcesReachable(): void {
  const nativeReact = path.join(
    REPO_ROOT,
    "packages/core/components/native-react",
  )
  if (!fs.existsSync(nativeReact)) {
    throw new Error(
      `Cannot generate Factory output: expected Factory's native component ` +
        `sources at "${nativeReact}" but the directory does not exist. The ` +
        `MCP server must run from inside the Seldon repository.`,
    )
  }
}
