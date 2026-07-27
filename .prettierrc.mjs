/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  printWidth: 100,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
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
    "<TYPES>^(node:|@earendil|typebox)",
    "<TYPES>^@seldon",
    "<TYPES>^[#./]",
  ],
  importOrderTypeScriptVersion: "5.8.0",
  importOrderCaseSensitive: true,
  overrides: [
    {
      files: ["packages/editor/shared/**/*.{ts,tsx,js,mjs}"],
      options: {
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
          "",
          "<TYPES>",
        ],
      },
    },
  ],
}

export default config
