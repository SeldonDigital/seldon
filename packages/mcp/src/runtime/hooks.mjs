/**
 * Node ESM resolve hooks for running Core as-is (registered by main.ts).
 *
 * Core's source assumes a bundler-style resolver; bundlers and vitest oblige,
 * plain `node --import tsx` does not. Core is consumed unmodified,
 * so the gaps are bridged here:
 *
 * 1. CJS interop: Core imports named exports from two CommonJS packages whose
 *    exports Node's cjs-module-lexer cannot detect statically (`import
 *    { plural } from "pluralize"`, `import { isEqual } from "lodash"`). Bare
 *    specifiers for those packages resolve to ESM shims that load the real
 *    package through `require` and re-export it.
 *
 * 2. Extensionless directory/file imports: Core uses relative imports like
 *    `../../../themes/looks` (a directory) and the package's `./*` wildcard
 *    export maps such specifiers to a nonexistent `<path>.ts`. tsx resolves
 *    them only when a tsconfig is in scope — true when launched from this
 *    package, false when an MCP client spawns the server from an arbitrary
 *    cwd. On ERR_MODULE_NOT_FOUND, retry with `.ts` and `/index.ts` appended.
 */
const SHIMS = new Map([
  ["pluralize", new URL("./shims/pluralize.mjs", import.meta.url).href],
  ["lodash", new URL("./shims/lodash.mjs", import.meta.url).href],
])

export async function resolve(specifier, context, nextResolve) {
  const shim = SHIMS.get(specifier)
  if (shim) return { url: shim, shortCircuit: true }

  try {
    return await nextResolve(specifier, context)
  } catch (error) {
    if (
      error?.code !== "ERR_MODULE_NOT_FOUND" ||
      /\.[a-z]+$/i.test(specifier)
    ) {
      throw error
    }
    // ".ts"/"/index.ts" repair relative paths; "/index" repairs bare
    // specifiers that go through the package's `./*` → `./*.ts` wildcard
    // (where appending ".ts" would map to a doubled "….ts.ts").
    for (const suffix of [".ts", "/index.ts", "/index"]) {
      try {
        return await nextResolve(specifier + suffix, context)
      } catch {
        // fall through to the original error
      }
    }
    throw error
  }
}
