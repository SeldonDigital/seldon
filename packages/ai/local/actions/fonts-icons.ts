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
  forwardClarification,
  isClarification,
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
  resourceName: string,
): { kind: "resolved"; id: string } | { kind: "message"; text: string } {
  const resourceTargetId = context.resolved.resourceTargetId
  const noResourceIsSelected = !resourceTargetId
  if (noResourceIsSelected) {
    return {
      kind: "message",
      text: `No ${resourceName} is selected. Select the ${resourceName} you want to change first.`,
    }
  }
  return { kind: "resolved", id: resourceTargetId }
}

/** Handles `set_font_collection_family_preset`: slot + all/none -> commit. */
export async function executeFontFamilyPreset(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = requireResourceTarget(context, "font collection")
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const { prompt, schema } = buildFontFamilyPresetStage({
    message: context.message,
  })
  const { value: fontPresetAnswer, metrics } = await callOllamaFormat<{
    slot: string
    preset: "all" | "none"
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_font_slot", {
    ok: true,
    prompt,
    output: JSON.stringify(fontPresetAnswer, null, 2),
  })

  try {
    commit(context.state, {
      type: "set_font_collection_family_preset",
      payload: {
        fontCollectionId: resolvedTarget.id,
        slot: fontPresetAnswer.slot,
        preset: fontPresetAnswer.preset,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't change the family: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  const presetEnablesEveryWeight = fontPresetAnswer.preset === "all"
  return {
    kind: "applied",
    reply: `Turned ${fontPresetAnswer.slot} ${presetEnablesEveryWeight ? "on (all weights)" : "off"} in ${resolvedTarget.id}.`,
  }
}

/** Handles `set_font_collection_family_variant`: slot + weight + on/off -> commit. */
export async function executeFontFamilyVariant(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = requireResourceTarget(context, "font collection")
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const { prompt, schema } = buildFontFamilyVariantStage({
    message: context.message,
  })
  const { value: fontVariantAnswer, metrics } = await callOllamaFormat<{
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
  recordStep(context, "resolve_font_variant", {
    ok: true,
    prompt,
    output: JSON.stringify(fontVariantAnswer, null, 2),
  })

  try {
    commit(context.state, {
      type: "set_font_collection_family_variant",
      payload: {
        fontCollectionId: resolvedTarget.id,
        slot: fontVariantAnswer.slot,
        variant: fontVariantAnswer.variant,
        enabled: fontVariantAnswer.enabled,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't toggle the weight: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  const variantWasEnabled = fontVariantAnswer.enabled
  return {
    kind: "applied",
    reply: `${variantWasEnabled ? "Enabled" : "Disabled"} ${fontVariantAnswer.slot} ${fontVariantAnswer.variant} in ${resolvedTarget.id}.`,
  }
}

/** Handles `set_icon_set_subcategory_preset`: subcategory + all/none -> commit. */
export async function executeIconSubcategoryPreset(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = requireResourceTarget(context, "icon set")
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const { prompt, schema } = buildIconSubcategoryPresetStage({
    message: context.message,
  })
  const { value: iconSubcategoryAnswer, metrics } = await callOllamaFormat<{
    subcategory: string
    preset: "all" | "none"
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_icon_subcategory", {
    ok: true,
    prompt,
    output: JSON.stringify(iconSubcategoryAnswer, null, 2),
  })

  try {
    commit(context.state, {
      type: "set_icon_set_subcategory_preset",
      payload: {
        iconSetId: resolvedTarget.id,
        subcategory: iconSubcategoryAnswer.subcategory,
        preset: iconSubcategoryAnswer.preset,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't change the subcategory: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  const presetIncludesEveryIcon = iconSubcategoryAnswer.preset === "all"
  return {
    kind: "applied",
    reply: `Turned the ${iconSubcategoryAnswer.subcategory} icons ${presetIncludesEveryIcon ? "on" : "off"} in ${resolvedTarget.id}.`,
  }
}

/** Handles `set_icon_set_override`: one icon on/off -> commit. */
export async function executeIconOverride(
  context: TurnContext,
): Promise<FamilyOutcome> {
  const resolvedTarget = requireResourceTarget(context, "icon set")
  if (isClarification(resolvedTarget))
    return forwardClarification(resolvedTarget)

  const { prompt, schema } = buildIconOverrideStage({
    message: context.message,
  })
  const { value: iconOverrideAnswer, metrics } = await callOllamaFormat<{
    iconId: string
    enabled: boolean
  }>({
    model: context.model,
    host: context.host,
    prompt,
    schema,
  })
  context.calls.push(metrics)
  recordStep(context, "resolve_icon", {
    ok: true,
    prompt,
    output: JSON.stringify(iconOverrideAnswer, null, 2),
  })

  try {
    commit(context.state, {
      type: "set_icon_set_override",
      payload: {
        iconSetId: resolvedTarget.id,
        path: `includedIcons.${iconOverrideAnswer.iconId}`,
        value: iconOverrideAnswer.enabled,
      },
    } as unknown as WorkspaceAction)
  } catch (caught) {
    return {
      kind: "message",
      text: `Couldn't toggle the icon: ${commitFailureReason(caught)}`,
    }
  }
  recordStep(context, "commit", { ok: true })
  const iconWasIncluded = iconOverrideAnswer.enabled
  return {
    kind: "applied",
    reply: `${iconWasIncluded ? "Included" : "Excluded"} ${iconOverrideAnswer.iconId} in ${resolvedTarget.id}.`,
  }
}
