import prettier from "prettier"

import { exportPrettierConfig } from "../export-prettier-config"

export async function format(content: string, options?: { skipFormat?: boolean }) {
  if (options?.skipFormat) {
    return content
  }

  return prettier.format(content, {
    ...exportPrettierConfig,
    parser: "typescript",
  })
}
