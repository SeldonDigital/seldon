import type { WorkspaceAction } from "@seldon/core/workspace/types"

import { commit, commitFailureReason } from "../commit"
import { callOllamaFormat } from "../ollama-client"
import {
  type FamilyOutcome,
  type TurnContext,
  recordStep,
} from "../turn-context"

/**
 * The selected resource entry id, required by every handler here. Font and
 * icon edits are resource-scoped: the editor passes resourceTargetId when the
 * user has a collection or set selected, and without one there is no safe
 * default to write to.
 */
function requireResourceTarget(
  context: TurnContext,
  what: string,
): { kind: "resolved"; id: string } | { kind: "message"; text: string } {
  const id = context.resolved.resourceTargetId
  if (!id) {
    return {
      kind: "message",
      text: `No ${what} is selected. Select the ${what} you want to change first.`,
    }
  }
  return { kind: "resolved", id }
}

/** Handles `set_font_collection_family_preset`: slot + all/none -> commit. */
export async function executeFontFamilyPreset(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = requireResourceTarget(context, "font collection")
  if (target.kind === "message") return { kind: "message", text: target.text }

  const { value, metrics } = await callOllamaFormat<{
    slot: string
    preset: "all" | "none"
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to turn a whole font family (slot) on or off in a font collection.",
      `Message: ${JSON.stringify(context.message)}`,
      'Extract the family slot name (like "primary" or "secondary") and whether to enable ("all") or disable ("none") it.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        slot: { type: "string", minLength: 1 },
        preset: { type: "string", enum: ["all", "none"] },
      },
      required: ["slot", "preset"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_font_slot", true)

  try {
    commit(context.state, {
      type: "set_font_collection_family_preset",
      payload: {
        fontCollectionId: target.id,
        slot: value.slot,
        preset: value.preset,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't change the family: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Turned ${value.slot} ${value.preset === "all" ? "on (all weights)" : "off"} in ${target.id}.`,
  }
}

/** Handles `set_font_collection_family_variant`: slot + weight + on/off -> commit. */
export async function executeFontFamilyVariant(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = requireResourceTarget(context, "font collection")
  if (target.kind === "message") return { kind: "message", text: target.text }

  const { value, metrics } = await callOllamaFormat<{
    slot: string
    variant: string
    enabled: boolean
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to toggle one weight of a font family in a font collection.",
      `Message: ${JSON.stringify(context.message)}`,
      'Extract the family slot (like "primary"), the weight/variant (like "700" or "italic"), and whether to enable it.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        slot: { type: "string", minLength: 1 },
        variant: { type: "string", minLength: 1 },
        enabled: { type: "boolean" },
      },
      required: ["slot", "variant", "enabled"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_font_variant", true)

  try {
    commit(context.state, {
      type: "set_font_collection_family_variant",
      payload: {
        fontCollectionId: target.id,
        slot: value.slot,
        variant: value.variant,
        enabled: value.enabled,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't toggle the weight: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `${value.enabled ? "Enabled" : "Disabled"} ${value.slot} ${value.variant} in ${target.id}.`,
  }
}

/** Handles `set_icon_set_subcategory_preset`: subcategory + all/none -> commit. */
export async function executeIconSubcategoryPreset(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = requireResourceTarget(context, "icon set")
  if (target.kind === "message") return { kind: "message", text: target.text }

  const { value, metrics } = await callOllamaFormat<{
    subcategory: string
    preset: "all" | "none"
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to turn a whole icon subcategory on or off in an icon set.",
      `Message: ${JSON.stringify(context.message)}`,
      'Extract the subcategory (like "communication" or "arrows") and whether to include ("all") or exclude ("none") it.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        subcategory: { type: "string", minLength: 1 },
        preset: { type: "string", enum: ["all", "none"] },
      },
      required: ["subcategory", "preset"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_icon_subcategory", true)

  try {
    commit(context.state, {
      type: "set_icon_set_subcategory_preset",
      payload: {
        iconSetId: target.id,
        subcategory: value.subcategory,
        preset: value.preset,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't change the subcategory: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `Turned the ${value.subcategory} icons ${value.preset === "all" ? "on" : "off"} in ${target.id}.`,
  }
}

/** Handles `set_icon_set_override`: one icon on/off -> commit. */
export async function executeIconOverride(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const target = requireResourceTarget(context, "icon set")
  if (target.kind === "message") return { kind: "message", text: target.text }

  const { value, metrics } = await callOllamaFormat<{
    iconId: string
    enabled: boolean
  }>({
    model: context.model,
    host: context.host,
    prompt: [
      "A user wants to toggle a single icon in an icon set.",
      `Message: ${JSON.stringify(context.message)}`,
      'Extract the icon id or name (like "seldon-plus" or "email") and whether to include it.',
    ].join("\n"),
    schema: {
      type: "object",
      properties: {
        iconId: { type: "string", minLength: 1 },
        enabled: { type: "boolean" },
      },
      required: ["iconId", "enabled"],
    },
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_icon", true)

  try {
    commit(context.state, {
      type: "set_icon_set_override",
      payload: {
        iconSetId: target.id,
        path: `includedIcons.${value.iconId}`,
        value: value.enabled,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't toggle the icon: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", true)
  return {
    kind: "applied",
    reply: `${value.enabled ? "Included" : "Excluded"} ${value.iconId} in ${target.id}.`,
  }
}
