import { describe, it } from "vitest"

import { runEval } from "./harness"

/**
 * Env-gated driver for the model-selection eval. Skipped in normal test runs;
 * opt in with:
 *
 *   SELDON_AI_EVAL_MODELS="qwen3:4b,qwen3:8b" npx vitest run --project ai eval/
 *
 * The run reports accuracy but never fails on it -- misses are the data the
 * model choice is made from.
 */
const models = (process.env.SELDON_AI_EVAL_MODELS ?? "")
  .split(",")
  .map((model) => model.trim())
  .filter((model) => model !== "")

describe.skipIf(models.length === 0)("model-selection eval", () => {
  it(
    "runs every case against every named model",
    async () => {
      await runEval(models)
    },
    // Many models x many cases x several calls each: generous budget.
    60 * 60 * 1000,
  )
})
