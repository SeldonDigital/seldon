import type { Options } from "prettier"

/**
 * Prettier options the code export formats its output with. The export loads
 * this explicitly, so it is independent of the Prettier config the surrounding
 * repository uses on its own source. The filename is intentionally not a name
 * Prettier auto-discovers, so a consumer's Prettier never applies it to their
 * own files.
 *
 * These defaults mirror the Seldon repository's effective config so generated
 * files land already formatted and never churn on the next format pass. Adopters
 * exporting into a differently formatted codebase edit this one file.
 */
export const exportPrettierConfig: Options = {
  semi: false,
  printWidth: 100,
  importOrder: [
    "<BUILTIN_MODULES>",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@seldon/core(.*)$",
    "",
    "^#(.*)$",
    "^[./]",
    "",
    "<TYPES>",
  ],
  importOrderTypeScriptVersion: "5.8.0",
  importOrderCaseSensitive: true,
}
