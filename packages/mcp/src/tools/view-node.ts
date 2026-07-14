import { z } from "zod"

import { redactValue } from "../redact"
import type { ViewNodeFormat, ViewNodeResult } from "../render/render-target"
import { renderTarget } from "../render/render-target"
import type { ToolContext } from "./context"

// The pipeline itself lives in render/render-target so apply_actions' render
// parameter runs the identical code path without importing a sibling tool.
// Re-exported here because this module is the render surface's public face.
export type { ViewNodeFormat, ViewNodeResult } from "../render/render-target"

export const viewNodeInputSchema = {
  target: z
    .string()
    .min(1)
    .describe(
      "A variant or instance node id (one component on a neutral stage), or " +
        "a component board key (all of that board's variants as one " +
        "side-by-side sheet).",
    ),
  format: z
    .enum(["css", "html", "image"])
    .default("css")
    .describe(
      '"css" (default, cheap): the target\'s fully resolved values in CSS ' +
        'vocabulary. "html": the rendered production markup as a full HTML ' +
        "document — real Factory output, bundled and server-rendered. " +
        '"image": a PNG screenshot of that document (~10× the cost; needs ' +
        "the optional Playwright dependency, else falls back to html).",
    ),
  theme: z
    .string()
    .optional()
    .describe(
      "Workspace theme id to render under, without mutating the workspace " +
        "(the on-disk file is untouched).",
    ),
  width: z
    .number()
    .int()
    .min(200)
    .max(3840)
    .optional()
    .describe(
      "Viewport width in CSS pixels for image screenshots (default 800). " +
        "Use for responsive checks.",
    ),
}

/**
 * Visual verification. The preview IS production output — the same Factory
 * export, bundled and server-rendered.
 */
export async function viewNode(
  ctx: ToolContext,
  input: {
    target: string
    format?: ViewNodeFormat
    theme?: string
    width?: number
  },
): Promise<ViewNodeResult> {
  return redactValue(await renderTarget(ctx, input))
}
