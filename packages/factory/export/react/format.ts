import prettier from "prettier"

import { exportPrettierConfig } from "../export-prettier-config"

export async function format(
  content: string,
  options?: { skipFormat?: boolean },
) {
  if (options?.skipFormat) {
    return content
  }
  // We have to run this twice: first without the sort-imports plugin so each
  // import lands on its own line, then again with the plugin to sort them.
  // https://github.com/trivago/prettier-plugin-sort-imports/issues/222
  const source = await prettier.format(content, {
    parser: "typescript",
    semi: exportPrettierConfig.semi,
  })

  return prettier.format(source, {
    ...exportPrettierConfig,
    parser: "typescript",
  })
}
