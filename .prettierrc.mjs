/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^node:(.*)$",
    "<THIRD_PARTY_MODULES>",
    "^@seldon/core",
    "^#(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderSideEffects: false,
  overrides: [
    {
      files: ["packages/editor/**/*.{ts,tsx,js,mjs}"],
      options: {
        importOrderSeparation: false,
        importOrder: [
          "<THIRD_PARTY_MODULES>",
          "^@seldon/core",
          "^@lib/(.*)/hooks/(.*)",
          "^@lib/hooks/(.*)",
          "^[./].*hooks.*",
          "^@lib/workspace/(.*)",
          "^@lib/api/hooks/(.*)",
          "^@seldon/components/(.*)",
          "^@app/(.*)",
          "^[./].*ui.*",
          "^[./]",
        ],
      },
    },
  ],
}

export default config
