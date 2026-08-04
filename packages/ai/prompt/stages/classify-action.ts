import {
  type V1Family,
  type V1Intent,
  V1_FAMILY_DESCRIPTIONS,
  V1_FAMILY_KEYS,
  V1_INTENTS_BY_FAMILY,
} from "../../schema/v1-vocabulary"
import type { SelectionScope } from "../../types"
import type { PromptStage } from "./shared"

/** The family block of the first pick, one line per family. */
export function buildFamilyCatalog(): string {
  return V1_FAMILY_KEYS.map(
    (family) => `- ${family}: ${V1_FAMILY_DESCRIPTIONS[family]}`,
  ).join("\n")
}

/** The intent block of the second pick, one line per member of one family. */
export function buildIntentCatalog(intents: readonly V1Intent[]): string {
  return intents
    .map((entry) => `- ${entry.intent}: ${entry.description}`)
    .join("\n")
}

/**
 * One line about what is selected. "Make it red" reads differently against a
 * selected node than against nothing, and both picks benefit from knowing.
 */
function selectionHint(
  scope: SelectionScope | undefined,
  hasSelectedNode: boolean | undefined,
): string {
  return hasSelectedNode
    ? `The user has a node selected (scope: ${scope ?? "instance"}).`
    : `Nothing specific is selected (scope: ${scope ?? "board"}).`
}

/**
 * The rule both picks are built around. Four sibling-steals in a row were
 * caused by a structural noun outweighing the verb in one 24-way choice, and
 * three of them were "fixed" by tuning the loser's description until a fourth
 * appeared somewhere else -- vocabulary descriptions cross-talk, so tuning one
 * moves the failure rather than removing it. Stating the rule once, at the
 * level where the answer actually differs, replaces every per-word patch.
 */
const CHOOSE_BY_THE_VERB =
  "Choose by what the message asks you to DO -- the verb. The kind of thing it mentions never decides this: renaming a variant, deleting a variant and adding a variant are three different answers about the same kind of thing."

/**
 * The first of two picks: which family of edits the message asks for. Nine
 * choices instead of twenty-four, each described by the action it performs, so
 * the verb has nothing to compete with. No workspace tree is serialized --
 * classification decides WHAT kind of edit this is; resolving WHERE happens in
 * later, narrower calls.
 */
export function buildPickFamilyStage(inputs: {
  message: string
  scope?: SelectionScope
  hasSelectedNode?: boolean
}): PromptStage {
  const prompt = [
    "You sort one design-editor chat message into exactly one family of edits from this list:",
    "",
    buildFamilyCatalog(),
    "",
    selectionHint(inputs.scope, inputs.hasSelectedNode),
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    CHOOSE_BY_THE_VERB,
    'If the message is not a design edit at all, pick "none".',
    'One edit applied to several elements ("hide all the chips", "make every card wider") is still that edit\'s family, never "none".',
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: { family: { type: "string", enum: [...V1_FAMILY_KEYS] } },
      required: ["family"],
    },
  }
}

/**
 * The second of two picks: which member of the already-chosen family. The enum
 * carries only that family's intents -- two to five of them -- so the sibling
 * a structural noun used to steal is no longer even on the list.
 */
export function buildPickIntentStage(inputs: {
  message: string
  family: V1Family
  scope?: SelectionScope
  hasSelectedNode?: boolean
}): PromptStage {
  const members = V1_INTENTS_BY_FAMILY.get(inputs.family) ?? []
  const prompt = [
    `This message is already known to be a "${inputs.family}" request: ${V1_FAMILY_DESCRIPTIONS[inputs.family]}`,
    "",
    "Pick which one of these it is:",
    "",
    buildIntentCatalog(members),
    "",
    selectionHint(inputs.scope, inputs.hasSelectedNode),
    "",
    `Message: ${JSON.stringify(inputs.message)}`,
    "",
    CHOOSE_BY_THE_VERB,
  ].join("\n")
  return {
    prompt,
    schema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          enum: members.map((entry) => entry.intent),
        },
      },
      required: ["intent"],
    },
  }
}
