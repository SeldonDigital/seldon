import type { Options } from "prettier"

/**
 * Prettier options every export surface formats with. Editor, CLI, and MCP
 * share this object and the factory's Prettier install. A consumer project's
 * Prettier config is never applied, so the three surfaces write the same files.
 *
 * The filename is not a name Prettier auto-discovers, so a consumer's Prettier
 * never applies these options to their own source.
 */
export const exportPrettierConfig: Options = {
  semi: false,
  printWidth: 100,
}
