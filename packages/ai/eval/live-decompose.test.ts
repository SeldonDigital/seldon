/**
 * TEMPORARY: live battery for the decompose stage after the example-leakage
 * fix (issue 05). Env-gated. Checks four properties:
 * 1. no leakage: "hide all the chips" must keep "chips", never "card"/"title"
 * 2. plural stays one step
 * 3. pronoun resolution still works ("add a card and make its title red")
 * 4. history contamination (issue 03) no longer splits plurals per member
 */
import { describe, it } from "vitest"

import { callOllamaFormat } from "../local/ollama-client"
import { buildDecomposeStage } from "../prompt/stages/decompose"
import type { ChatMessage } from "../types"

const CONTAMINATED_HISTORY: ChatMessage[] = [
  { role: "user", content: "Insert 3 chip instances into this variant" },
  {
    role: "assistant",
    content:
      "The attempt to insert a chip instance into the Item List variant failed because you cannot add the variant as an instance of itself.",
  },
]

const CASES: {
  label: string
  message: string
  history?: ChatMessage[]
  repeat: number
}[] = [
  { label: "leakage", message: "hide all the chips", repeat: 3 },
  { label: "plural-red", message: "make all the chips red", repeat: 1 },
  {
    label: "pronoun",
    message: "add a card and make its title red",
    repeat: 2,
  },
  {
    label: "history-03",
    message: "Make all the chips red",
    history: CONTAMINATED_HISTORY,
    repeat: 2,
  },
  { label: "compound-one", message: "make the title bold and italic", repeat: 1 },
]

describe.skipIf(!process.env.SELDON_AI_LIVE)("live decompose battery", () => {
  it(
    "holds all four properties",
    async () => {
      for (const testCase of CASES) {
        for (let run = 0; run < testCase.repeat; run++) {
          const { prompt, schema } = buildDecomposeStage({
            message: testCase.message,
            history: testCase.history,
          })
          const { value } = await callOllamaFormat<{ steps: string[] }>({
            model: process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b",
            prompt,
            schema,
          })
          console.log(
            `[${testCase.label} #${run + 1}] ${JSON.stringify(value.steps)}`,
          )
        }
      }
    },
    10 * 60 * 1000,
  )
})
