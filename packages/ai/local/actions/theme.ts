import { STOCK_THEMES_BY_ID } from "@seldon/core/themes/catalog"
import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { commit } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import { resolveTargetWithHint } from "../resolvers/resolve-target-with-hint"
import {
  type FamilyOutcome,
  type TurnContext,
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
  const ids = themeIds(context)
  if (ids.length === 0) {
    return {
      kind: "message",
      text: "This workspace has no themes yet. Add a theme first.",
    }
  }
  if (ids.length === 1) {
    recordStep(context, "resolve_theme", true)
    return { kind: "resolved", themeId: ids[0]! }
  }
  const { value, metrics } = await callOllamaFormat<{ themeId: string }>({
    model: context.model,
    host: context.host,
    prompt: [
      `Pick the theme the user means, for: ${purpose}.`,
      `Message: ${JSON.stringify(context.message)}`,
      "Available theme ids:",
      ids.map((id) => `- ${id}`).join("\n"),
    ].join("\n"),
    schema: {
      type: "object",
      properties: { themeId: { type: "string", enum: ids } },
      required: ["themeId"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_theme", true)
  return { kind: "resolved", themeId: value.themeId }
}

/** Handles the `set_node_theme` intent: target -> theme -> commit. */
export async function executeSetNodeTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = await resolveTargetWithHint(context)
  if (target.kind === "message") return { kind: "message", text: target.text }

  const theme = await resolveThemeId(context, "applying a theme to a node")
  if (theme.kind === "message") return { kind: "message", text: theme.text }

  try {
    commit(context.state, {
      type: "set_node_theme",
      payload: { nodeId: target.nodeId, theme: theme.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Applying the theme was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Applied theme ${theme.themeId} to ${target.nodeId}.`,
  }
}

/** Handles the `set_component_theme` intent: active board + theme -> commit. */
export async function executeSetComponentTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const boardKey = context.resolved.resolvedKey
  if (boardKey === undefined) {
    return {
      kind: "message",
      text: "No board is active. Open the component you want to theme.",
    }
  }
  const theme = await resolveThemeId(context, "applying a theme to a component")
  if (theme.kind === "message") return { kind: "message", text: theme.text }

  try {
    commit(context.state, {
      type: "set_component_theme",
      payload: { boardKey, theme: theme.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Applying the theme was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Applied theme ${theme.themeId} to the ${boardKey} board.`,
  }
}

/** Handles the `add_theme` intent: pick a stock theme, commit its board. */
export async function executeAddTheme(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const stockIds = Object.keys(STOCK_THEMES_BY_ID)
  const available = stockIds.filter((id) => !context.state.workspace.boards[id])
  if (available.length === 0) {
    return {
      kind: "message",
      text: "Every stock theme is already in the workspace.",
    }
  }

  const { value, metrics } = await callOllamaFormat<{ themeId: string }>({
    model: context.model,
    host: context.host,
    prompt: [
      "Pick the stock theme the user wants to add.",
      `Message: ${JSON.stringify(context.message)}`,
      "Available stock themes:",
      available
        .map(
          (id) =>
            `- ${id}: ${STOCK_THEMES_BY_ID[id as keyof typeof STOCK_THEMES_BY_ID]?.metadata?.name ?? id}`,
        )
        .join("\n"),
    ].join("\n"),
    schema: {
      type: "object",
      properties: { themeId: { type: "string", enum: available } },
      required: ["themeId"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_theme", true)

  try {
    commit(context.state, {
      type: "add_theme",
      payload: { boardKey: value.themeId },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Adding the theme was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return { kind: "applied", reply: `Added the ${value.themeId} theme.` }
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
    (await (async () => {
      const theme = await resolveThemeId(context, "changing a theme token")
      return theme.kind === "resolved" ? theme.themeId : undefined
    })())
  if (!themeId) {
    return {
      kind: "message",
      text: "I couldn't tell which theme to change. Select it, or name it.",
    }
  }

  const { value, metrics } = await callOllamaFormat<{
    path: string
    value: string
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to change one token value on a theme.",
      `Message: ${JSON.stringify(context.message)}`,
      "",
      'Extract the token path (like "swatch.primary", "fontSize.medium", "gap.compact") and the new value (a color as hsl(h, s%, l%) or hex, a size, or a token-appropriate value).',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        path: { type: "string", minLength: 1 },
        value: { type: "string", minLength: 1 },
      },
      required: ["path", "value"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_token", true)

  try {
    commit(context.state, {
      type: "set_theme_override",
      payload: { themeId, path: value.path, value: value.value },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Changing ${value.path} was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Set ${value.path} to ${value.value} on ${themeId}.`,
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
  const theme = await resolveThemeId(context, "adding a custom token")
  if (theme.kind === "message") return { kind: "message", text: theme.text }

  const { value, metrics } = await callOllamaFormat<{
    kind: "swatch" | "other"
    name: string
    h: number
    s: number
    l: number
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to add a custom token to a theme.",
      `Message: ${JSON.stringify(context.message)}`,
      "",
      'If it is a custom COLOR (swatch), answer kind "swatch" with a short name and the color as HSL numbers (h 0-360, s 0-100, l 0-100). For any other token kind (font, shadow, spacing, ...), answer kind "other" with empty name and zeros.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        kind: { type: "string", enum: ["swatch", "other"] },
        name: { type: "string" },
        h: { type: "number" },
        s: { type: "number" },
        l: { type: "number" },
      },
      required: ["kind", "name", "h", "s", "l"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_custom_token", true)

  if (value.kind !== "swatch") {
    return {
      kind: "message",
      text: "Only custom color swatches can be added from chat so far. Other custom tokens (fonts, shadows, spacing) are coming.",
    }
  }

  try {
    commit(context.state, {
      type: "add_theme_custom_swatch",
      payload: {
        themeId: theme.themeId,
        name: value.name,
        parameters: {
          colorspace: "hsl",
          value: { hue: value.h, saturation: value.s, lightness: value.l },
        },
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Adding the swatch was rejected: ${caught instanceof Error ? caught.message : "invalid action"}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Added custom swatch "${value.name}" (hsl ${value.h}, ${value.s}%, ${value.l}%) to ${theme.themeId}.`,
  }
}
