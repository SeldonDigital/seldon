import prettier from "prettier"

export async function format(content: string) {
  // We have to run this twice to make sure the imports (but first without the plugin)
  // to make sure each import has it's own line
  // https://github.com/trivago/prettier-plugin-sort-imports/issues/222
  let source = await prettier.format(content, {
    parser: "typescript",
    semi: false,
  })

  return prettier.format(source, {
    semi: false,
    parser: "typescript",
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrderSeparation: false,
    importOrder: [
      // Packages
      "<THIRD_PARTY_MODULES>",
      // Types and Constants
      "^@seldon/core/components/(catalog|constants)",
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
  })
}
