// Custom Prettier config for editor service
// Extends the centralized config but adds import sorting
import baseConfig from "../../.prettierrc.mjs"

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  ...baseConfig,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrderSeparation: false,
  importOrder: [
    // Packages
    "<THIRD_PARTY_MODULES>",
    // Types and Constants
    "^@seldon/core",
    // Hooks
    "^@lib/(.*)/hooks/(.*)",
    "^@lib/hooks/(.*)",
    "^[./].*hooks.*",
    "^@lib/workspace/(.*)",
    "^@lib/api/hooks/(.*)",
    // Seldon Components
    "^@components/seldon/(.*)",
    "^[./].*seldon.*",
    // Components
    "^@components/(.*)",
    "^[./].*ui.*",
    "^[./]",
  ],
  importOrderSortSpecifiers: true,
}

export default config
