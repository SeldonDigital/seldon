import type { PromptStage } from "./shared"

const FONT_FAMILY_PRESET_SCHEMA = {
  type: "object",
  properties: {
    slot: { type: "string", minLength: 1 },
    preset: { type: "string", enum: ["all", "none"] },
  },
  required: ["slot", "preset"],
}

/** Turns a whole font family (slot) on or off in a font collection. */
export function buildFontFamilyPresetStage(inputs: {
  message: string
}): PromptStage {
  const prompt = [
    "A user wants to turn a whole font family (slot) on or off in a font collection.",
    `Message: ${JSON.stringify(inputs.message)}`,
    'Extract the family slot name (like "primary" or "secondary") and whether to enable ("all") or disable ("none") it.',
  ].join("\n")
  return { prompt, schema: FONT_FAMILY_PRESET_SCHEMA }
}

const FONT_FAMILY_VARIANT_SCHEMA = {
  type: "object",
  properties: {
    slot: { type: "string", minLength: 1 },
    variant: { type: "string", minLength: 1 },
    enabled: { type: "boolean" },
  },
  required: ["slot", "variant", "enabled"],
}

/** Toggles one weight of a font family in a font collection. */
export function buildFontFamilyVariantStage(inputs: {
  message: string
}): PromptStage {
  const prompt = [
    "A user wants to toggle one weight of a font family in a font collection.",
    `Message: ${JSON.stringify(inputs.message)}`,
    'Extract the family slot (like "primary"), the weight/variant (like "700" or "italic"), and whether to enable it.',
  ].join("\n")
  return { prompt, schema: FONT_FAMILY_VARIANT_SCHEMA }
}

const ICON_SUBCATEGORY_PRESET_SCHEMA = {
  type: "object",
  properties: {
    subcategory: { type: "string", minLength: 1 },
    preset: { type: "string", enum: ["all", "none"] },
  },
  required: ["subcategory", "preset"],
}

/** Turns a whole icon subcategory on or off in an icon set. */
export function buildIconSubcategoryPresetStage(inputs: {
  message: string
}): PromptStage {
  const prompt = [
    "A user wants to turn a whole icon subcategory on or off in an icon set.",
    `Message: ${JSON.stringify(inputs.message)}`,
    'Extract the subcategory (like "communication" or "arrows") and whether to include ("all") or exclude ("none") it.',
  ].join("\n")
  return { prompt, schema: ICON_SUBCATEGORY_PRESET_SCHEMA }
}

const ICON_OVERRIDE_SCHEMA = {
  type: "object",
  properties: {
    iconId: { type: "string", minLength: 1 },
    enabled: { type: "boolean" },
  },
  required: ["iconId", "enabled"],
}

/** Toggles a single icon in an icon set. */
export function buildIconOverrideStage(inputs: {
  message: string
}): PromptStage {
  const prompt = [
    "A user wants to toggle a single icon in an icon set.",
    `Message: ${JSON.stringify(inputs.message)}`,
    'Extract the icon id or name (like "seldon-plus" or "email") and whether to include it.',
  ].join("\n")
  return { prompt, schema: ICON_OVERRIDE_SCHEMA }
}
