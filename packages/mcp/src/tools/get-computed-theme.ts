import { z } from "zod"

import { THEMES } from "@seldon/core/themes/catalog/index"
import type { ComputedTheme } from "@seldon/core/themes/types"
import { getComputedTheme } from "@seldon/core/workspace/compute"

import { ToolError } from "../errors"
import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const getComputedThemeInputSchema = {
  themeId: z
    .string()
    .describe(
      "A stock theme id (list_catalog) or a workspace theme entry id " +
        "(get_workspace_outline).",
    ),
}

export interface GetComputedThemeResult {
  theme: ComputedTheme
}

/**
 * The get_computed_theme tool: the fully resolved token table for one theme — every section
 * (swatch, font, size, …) with concrete token values, template chain and
 * overrides already applied. Stock themes resolve without a workspace;
 * workspace theme entries need one open.
 */
export function getComputedThemeTool(
  ctx: ToolContext,
  input: { themeId: string },
): GetComputedThemeResult {
  const workspace = ctx.session.open?.workspace

  let theme: ComputedTheme
  try {
    theme = getComputedTheme(input.themeId, workspace ?? { themes: {} })
  } catch {
    throw new ToolError({
      code: "theme_not_found",
      message: `No theme resolves from "${input.themeId}".`,
      recovery:
        "Use one of the ids in detail.availableThemeIds (stock ids are " +
        "always available; workspace entry ids require that workspace open).",
      detail: {
        availableThemeIds: [
          ...THEMES.map((stock) => stock.id),
          ...Object.keys(workspace?.themes ?? {}),
        ],
      },
    })
  }

  return redactValue({ theme })
}
