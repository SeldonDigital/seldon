import type { PromptStage } from "./shared"

/** One enum-constrained pick of a theme id from the workspace's real entries. */
export function buildResolveThemeIdStage(inputs: {
  message: string
  purpose: string
  ids: string[]
}): PromptStage {
  const prompt = [
    `Pick the theme the user means, for: ${inputs.purpose}.`,
    `Message: ${JSON.stringify(inputs.message)}`,
    "Available theme ids:",
    inputs.ids.map((id) => `- ${id}`).join("\n"),
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: { themeId: { type: "string", enum: inputs.ids } },
      required: ["themeId"],
    },
  }
}

/** Picks which stock theme to add, from the ones not already in the workspace. */
export function buildAddThemeStage(inputs: {
  message: string
  themes: Array<{ id: string; name: string }>
}): PromptStage {
  const prompt = [
    "Pick the stock theme the user wants to add.",
    `Message: ${JSON.stringify(inputs.message)}`,
    "Available stock themes:",
    inputs.themes.map((entry) => `- ${entry.id}: ${entry.name}`).join("\n"),
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        themeId: {
          type: "string",
          enum: inputs.themes.map((entry) => entry.id),
        },
      },
      required: ["themeId"],
    },
  }
}

const SET_THEME_OVERRIDE_SCHEMA = {
  type: "object",
  properties: {
    path: { type: "string", minLength: 1 },
    value: { type: "string", minLength: 1 },
  },
  required: ["path", "value"],
}

/**
 * Extracts a token path and value. The path is a free string guided by
 * examples; the reducer rejects an unknown path with a precise reason.
 */
export function buildSetThemeOverrideStage(inputs: {
  message: string
}): PromptStage {
  const prompt = [
    "A user wants to change one token value on a theme.",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    'Extract the token path (like "swatch.primary", "fontSize.medium", "gap.compact") and the new value (a color as hsl(h, s%, l%) or hex, a size, or a token-appropriate value).',
  ].join("\n")
  return { prompt, schema: SET_THEME_OVERRIDE_SCHEMA }
}

const ADD_CUSTOM_TOKEN_SCHEMA = {
  type: "object",
  properties: {
    kind: { type: "string", enum: ["swatch", "other"] },
    name: { type: "string" },
    h: { type: "number" },
    s: { type: "number" },
    l: { type: "number" },
  },
  required: ["kind", "name", "h", "s", "l"],
}

/** Extracts a custom swatch definition; "other" covers unsupported kinds. */
export function buildAddCustomTokenStage(inputs: {
  message: string
}): PromptStage {
  const prompt = [
    "A user wants to add a custom token to a theme.",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    'If it is a custom COLOR (swatch), answer kind "swatch" with a short name and the color as HSL numbers (h 0-360, s 0-100, l 0-100). For any other token kind (font, shadow, spacing, ...), answer kind "other" with empty name and zeros.',
  ].join("\n")
  return { prompt, schema: ADD_CUSTOM_TOKEN_SCHEMA }
}
