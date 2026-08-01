/**
 * Pins the issue 07 fix: "the <property> of the <element>" phrasings used to
 * come back with an empty match, or with the property word standing in for
 * the element, and the turn died at no-target. Asking for the noun and its
 * describing words separately removed the slot they competed for; these
 * assert the element survives extraction for the shapes that used to lose it.
 *
 * Hard assertions on purpose -- the eval harness measures and never fails, so
 * it cannot catch this rotting. Env-gated on SELDON_AI_LIVE since it calls a
 * live model.
 *
 * Runs against the shipping default (qwen3:8b). qwen3:4b still answers
 * plural:true for "the last chip" -- see issue 10 for that divergence.
 */
import { describe, expect, it } from "vitest"

import { resolveContext } from "../local/editor-context"
import { extractTargetHint } from "../local/resolvers/extract-target"
import type { TurnContext } from "../local/turn-context"
import { createTurnState } from "../local/turn-state"
import { seedChipRowWorkspace } from "./seed"

const MODEL = process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b"

const CASES: {
  message: string
  /** The noun the phrase must keep hold of. */
  element: string
  /** The property word that must NOT be mistaken for the element. */
  property: string
  plural: boolean
}[] = [
  {
    message: "set the width of all the chips to 100 pixels",
    element: "chip",
    property: "width",
    plural: true,
  },
  {
    message: "set the display property of all the chips to none",
    element: "chip",
    property: "display",
    plural: true,
  },
  {
    message: "change the color of the chip to red",
    element: "chip",
    property: "color",
    plural: false,
  },
  {
    message: "increase the opacity of the last chip",
    element: "chip",
    property: "opacity",
    plural: false,
  },
]

describe.skipIf(!process.env.SELDON_AI_LIVE)(
  "live extract-target: the <property> of the <element>",
  () => {
    it(
      "keeps the element and never answers the property word",
      async () => {
        for (const testCase of CASES) {
          const { workspace } = seedChipRowWorkspace()
          const context: TurnContext = {
            state: createTurnState(workspace),
            resolved: resolveContext({ workspace, scope: "board" }),
            message: testCase.message,
            model: MODEL,
            calls: [],
            steps: [],
          }

          const hint = await extractTargetHint(context)
          const failureDetail = `"${testCase.message}" -> ${JSON.stringify(hint)}`

          // Singular or plural surface form is the model's choice; the
          // resolver matches this phrase by embedding, not by exact string.
          expect(hint.match, failureDetail).toBeDefined()
          expect(hint.match?.toLowerCase(), failureDetail).toContain(
            testCase.element,
          )
          expect(hint.match?.toLowerCase(), failureDetail).not.toContain(
            testCase.property,
          )
          expect(hint.plural, failureDetail).toBe(testCase.plural)
        }
      },
      10 * 60 * 1000,
    )
  },
)
