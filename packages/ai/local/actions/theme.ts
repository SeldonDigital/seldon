import { STOCK_THEMES_BY_ID } from "@seldon/core/themes/catalog"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import {
  buildAddCustomTokenStage,
  buildAddThemeStage,
  buildResolveThemeIdStage,
  buildSetThemeOverrideStage,
} from "../../prompt/stages/theme"
import { commit, commitFailureReason } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
  forwardClarification,
  isClarification,
  recordStep,
} from "../turn-context"

/** The workspace's theme entry ids, the valid targets for theme application. */
function themeIds(context: TurnContext): string[] {
  return Object.keys(context.state.workspace.themes)
}

/** One enum-constrained pick of a theme id from the workspace's real entries. */
async function resolveThemeId(
  context: TurnContext,
  purpose: string,
): Promise<
  { kind: "resolved"; themeId: string } | { kind: "message"; text: string }
> {
  const workspaceThemeIds = themeIds(context)
  const workspaceHasNoThemes = workspaceThemeIds.length === 0
  if (workspaceHasNoThemes) {
    return {
      kind: "message",
      text: "This workspace has no themes yet. Add a theme first.",
    }
  }
  const workspaceHasExactlyOneTheme = workspaceThemeIds.length === 1
  if (workspaceHasExactlyOneTheme) {
    recordStep(context, "resolve_theme", {
      ok: true,
      output: `Only one theme in the workspace: ${workspaceThemeIds[0]!} (deterministic, no model call).`,
    })
    return { kind: "resolved", themeId: workspaceThemeIds[0]! }
  }
  const { prompt, schema } = buildResolveThemeIdStage({
    message: context.message,
    purpose,
    ids: workspaceThemeIds,
  })
  const { value: themePickAnswer, metrics } = await callOllamaFormat<{
    themeId: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_theme", {
    ok: true,
    prompt,
    output: themePickAnswer.themeId,
  })
  return { kind: "resolved", themeId: themePickAnswer.themeId }
}

/** Handles the `set_node_theme` intent: target -> theme -> commit. */
export async function executeSetNodeTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = await resolveTargetWithHint(context)
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const themeResolution = await resolveThemeId(
    context,
    "applying a theme to a node",
  )
  if (isClarification(themeResolution))
    return forwardClarification(themeResolution)

  try {
    commit(context.state, {
      type: "set_node_theme",
      payload: {
        nodeId: resolvedTarget.nodeId,
        theme: themeResolution.themeId,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't apply the theme: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Applied theme ${themeResolution.themeId} to ${resolvedTarget.nodeId}.`,
  }
}

/** Handles the `set_component_theme` intent: active board + theme -> commit. */
export async function executeSetComponentTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const boardKey = context.resolved.resolvedKey
  const noBoardIsActive = boardKey === undefined
  if (noBoardIsActive) {
    return {
      kind: "message",
      text: "No board is active. Open the component you want to theme.",
    }
  }
  const themeResolution = await resolveThemeId(
    context,
    "applying a theme to a component",
  )
  if (isClarification(themeResolution))
    return forwardClarification(themeResolution)

  try {
    commit(context.state, {
      type: "set_component_theme",
      payload: { boardKey, theme: themeResolution.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't apply the theme: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Applied theme ${themeResolution.themeId} to the ${boardKey} board.`,
  }
}

/** Handles the `add_theme` intent: pick a stock theme, commit its board. */
export async function executeAddTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const stockThemeIds = Object.keys(STOCK_THEMES_BY_ID)
  const uninstalledStockThemeIds = stockThemeIds.filter(
    (stockThemeId) => !context.state.workspace.boards[stockThemeId],
  )
  const everyStockThemeIsInstalled = uninstalledStockThemeIds.length === 0
  if (everyStockThemeIsInstalled) {
    return {
      kind: "message",
      text: "Every stock theme is already in the workspace.",
    }
  }

  const { prompt, schema } = buildAddThemeStage({
    message: context.message,
    themes: uninstalledStockThemeIds.map((stockThemeId) => ({
      id: stockThemeId,
      name:
        STOCK_THEMES_BY_ID[stockThemeId as keyof typeof STOCK_THEMES_BY_ID]
          ?.metadata?.name ?? stockThemeId,
    })),
  })
  const { value: themePickAnswer, metrics } = await callOllamaFormat<{
    themeId: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_theme", {
    ok: true,
    prompt,
    output: themePickAnswer.themeId,
  })

  try {
    commit(context.state, {
      type: "add_theme",
      payload: { boardKey: themePickAnswer.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't add the theme: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Added the ${themePickAnswer.themeId} theme.`,
  }
}

/**
 * The theme id for a token edit when none is selected: a fresh pick, or
 * undefined when that pick needs clarification. Separated out so the caller
 * reads as one `??` fallback instead of an inline async IIFE.
 */
async function pickThemeIdForTokenEdit(
  context: TurnContext,
): Promise<string | undefined> {
  const themeResolution = await resolveThemeId(
    context,
    "changing a theme token",
  )
  return isClarification(themeResolution) ? undefined : themeResolution.themeId
}

/**
 * Handles the `set_theme_override` intent: theme id -> token path -> value.
 * The path is a free string guided by examples; the reducer rejects an
 * unknown path with a precise reason, which terminates the turn honestly.
 */
export async function executeSetThemeOverride(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const themeId =
    context.resolved.resourceTargetId ??
    (await pickThemeIdForTokenEdit(context))
  const noThemeCouldBeIdentified = !themeId
  if (noThemeCouldBeIdentified) {
    return {
      kind: "message",
      text: "I couldn't tell which theme to change. Select it, or name it.",
    }
  }

  const { prompt, schema } = buildSetThemeOverrideStage({
    message: context.message,
  })
  const { value: tokenAnswer, metrics } = await callOllamaFormat<{
    path: string
    value: string
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_token", {
    ok: true,
    prompt,
    output: JSON.stringify(tokenAnswer, null, 2),
  })

  try {
    commit(context.state, {
      type: "set_theme_override",
      payload: {
        themeId,
        path: tokenAnswer.path,
        value: tokenAnswer.value,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't change ${tokenAnswer.path}: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Set ${tokenAnswer.path} to ${tokenAnswer.value} on ${themeId}.`,
  }
}

/**
 * Handles the `add_theme_custom_token` intent. v1 supports the custom swatch
 * (the overwhelmingly common case); the 17 other token kinds terminate with a
 * clear message until their parameter shapes are wired.
 */
export async function executeAddCustomToken(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const themeResolution = await resolveThemeId(context, "adding a custom token")
  if (isClarification(themeResolution))
    return forwardClarification(themeResolution)

  const { prompt, schema } = buildAddCustomTokenStage({
    message: context.message,
  })
  const { value: customTokenAnswer, metrics } = await callOllamaFormat<{
    kind: "swatch" | "other"
    name: string
    h: number
    s: number
    l: number
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_custom_token", {
    ok: true,
    prompt,
    output: JSON.stringify(customTokenAnswer, null, 2),
  })

  const tokenIsNotAColorSwatch = customTokenAnswer.kind !== "swatch"
  if (tokenIsNotAColorSwatch) {
    return {
      kind: "message",
      text: "Only custom color swatches can be added from chat so far. Other custom tokens (fonts, shadows, spacing) are coming.",
    }
  }

  try {
    commit(context.state, {
      type: "add_theme_custom_swatch",
      payload: {
        themeId: themeResolution.themeId,
        name: customTokenAnswer.name,
        parameters: {
          colorspace: "hsl",
          value: {
            hue: customTokenAnswer.h,
            saturation: customTokenAnswer.s,
            lightness: customTokenAnswer.l,
          },
        },
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't add the swatch: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  return {
    kind: "applied",
    reply: `Added custom swatch "${customTokenAnswer.name}" (hsl ${customTokenAnswer.h}, ${customTokenAnswer.s}%, ${customTokenAnswer.l}%) to ${themeResolution.themeId}.`,
  }
}
