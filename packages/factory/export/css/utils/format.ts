import prettier from "prettier"

import { exportPrettierConfig } from "../../export-prettier-config"

export async function format(content: string) {
  return await prettier.format(content, {
    ...exportPrettierConfig,
    parser: "css",
  })
}
