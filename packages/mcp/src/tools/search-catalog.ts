import { z } from "zod"

import { isComponentId } from "@seldon/core/components/constants/index"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/helpers/validation"

import type { SearchResult } from "../catalog-search"
import { searchCatalogIndex, selectTopResults } from "../catalog-search"
import { ToolError } from "../errors"
import { logEvent } from "../observability"
import { redactValue } from "../redact"
import type { ToolContext } from "./context"

export const searchCatalogInputSchema = {
  query: z
    .string()
    .min(1)
    .describe("Free-text query: component/theme/font names, icon concepts, …"),
  kind: z
    .enum(["component", "icon", "theme", "fontCollection"])
    .optional()
    .describe("Restrict results to one catalog kind."),
  target: z
    .string()
    .optional()
    .describe(
      "A node id. Restricts results to components legally insertable into " +
        "that node (level rules) — implies kind 'component'. Requires an " +
        "open workspace.",
    ),
  limit: z.number().int().min(1).max(20).default(8).describe("Max results."),
}

export interface SearchCatalogResult {
  results: SearchResult[]
  /** Matches above threshold before the limit cut (kept out of the response). */
  totalMatches: number
}

/**
 * Hybrid semantic+keyword ranking over the
 * full catalog with the insertability filter. The semantic provider is
 * optional — absent or broken, this is exactly the plain keyword search.
 * Zero-result searches feed the synonym-curation log.
 * Retrieve-then-choose: the agent picks from the ranked list; the server
 * never chooses for it.
 */
export async function searchCatalog(
  ctx: ToolContext,
  input: {
    query: string
    kind?: SearchResult["kind"]
    target?: string
    limit?: number
  },
): Promise<SearchCatalogResult> {
  const limit = input.limit ?? 8
  const effectiveKind = input.target ? "component" : input.kind

  const semanticScores =
    (await ctx.semantic?.scoreQuery(input.query, effectiveKind)) ?? undefined

  let results = searchCatalogIndex(input.query, effectiveKind, semanticScores)
  const matchesBeforeTargetFilter = results.length

  if (input.target) {
    const { workspace } = ctx.session.requireOpen()
    if (!workspace.nodes[input.target]) {
      throw new ToolError({
        code: "node_not_found",
        message: `Target node "${input.target}" does not exist in this workspace.`,
        recovery:
          "Pass a variant or instance node id from get_workspace_outline, " +
          "find_nodes, or an apply_actions receipt — or search without target.",
      })
    }
    results = results.filter(
      (result) =>
        isComponentId(result.id) &&
        validateComponentInsertionForUI(result.id, input.target!, workspace)
          .isValid,
    )
  }

  if (results.length === 0) {
    logEvent(ctx, {
      event: "search_zero_results",
      query: input.query,
      ...(input.kind ? { kind: input.kind } : {}),
      ...(input.target ? { target: input.target } : {}),
      matchesBeforeTargetFilter,
      semantic: semanticScores !== undefined,
    })
  }

  return redactValue({
    // Kind-unfiltered searches keep each kind's best match on the page so
    // the agent's choice spans kinds the icon count would otherwise bury.
    results: selectTopResults(results, limit, !input.kind && !input.target),
    totalMatches: results.length,
  })
}
