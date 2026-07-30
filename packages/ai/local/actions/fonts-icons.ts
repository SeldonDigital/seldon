import type { WorkspaceAction } from "@seldon/core/workspace/types"

import {
  buildFontFamilyPresetStage,
  buildFontFamilyVariantStage,
  buildIconOverrideStage,
  buildIconSubcategoryPresetStage,
} from "../../prompt/stages/fonts-icons"
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

  const { prompt, schema } = buildFontFamilyPresetStage({
    message: context.message,
  })
  const { value, metrics } = await callOllamaFormat<{
    slot: string
    preset: "all" | "none"
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_font_slot", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

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

  const { prompt, schema } = buildFontFamilyVariantStage({
    message: context.message,
  })
  const { value, metrics } = await callOllamaFormat<{
    slot: string
    variant: string
    enabled: boolean
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_font_variant", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

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

  const { prompt, schema } = buildIconSubcategoryPresetStage({
    message: context.message,
  })
  const { value, metrics } = await callOllamaFormat<{
    subcategory: string
    preset: "all" | "none"
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_icon_subcategory", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

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

  const { prompt, schema } = buildIconOverrideStage({
    message: context.message,
  })
  const { value, metrics } = await callOllamaFormat<{
    iconId: string
    enabled: boolean
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_icon", true, {
    prompt,
    output: JSON.stringify(value, null, 2),
  })

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
