/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  plugins: ["@trivago/prettier-plugin-sort-imports"],

  importOrder: [
    // Node built-ins
    "^node:(.*)$",

    // Packages
    "<THIRD_PARTY_MODULES>",

    // Types and Constants
    "^@seldon/core",

    // Internal Aliases
    "^#(.*)$",

    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}

export default config
