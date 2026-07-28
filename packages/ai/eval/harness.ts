/**
 * Model-selection eval harness. Runs every authored case through the real
 * classifier (and, for property cases, the real property-name resolver)
 * against each candidate model, and prints a per-model accuracy table.
 *
 * Driven through vitest (whose transform pipeline handles core's CJS-interop
 * imports; plain tsx does not), gated by an env var so normal runs skip it:
 *
 *   SELDON_AI_EVAL_MODELS="qwen3:4b,qwen3:8b" npx vitest run --project ai eval/
 *
 * Requires a running Ollama with the named models pulled. This is a
 * measurement tool for picking the shipping default model -- a weak model's
 * misses are data, not failures, so the run never fails on accuracy.
 */
import { ComponentId } from "@seldon/core/components/constants"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { getNodeCatalogId } from "@seldon/core/workspace/helpers/nodes/get-node-catalog-id"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

import { resolveContext } from "../local/editor-context"
import { isOllamaReachable } from "../local/ollama-client"
import { classifyAction } from "../local/resolvers/classify-action"
import { resolvePropertyNames } from "../local/resolvers/resolve-property-name"
import type { TurnContext } from "../local/turn-context"
import { createTurnState } from "../local/turn-state"
import { EVAL_CASES } from "./cases"

function findTextChild(workspace: Workspace): string | undefined {
  const board = workspace.boards[ComponentId.BUTTON]
  if (!board || !isComponentBoard(board)) return undefined
  let found: string | undefined
  walkBoardTreeRefs([board.variants[0]!], (ref) => {
    const node = workspace.nodes[ref.id]
    if (node && getNodeCatalogId(node, workspace) === "text") {
      found = ref.id
      return true
    }
  })
  return found
}

export interface CaseResult {
  id: string
  intentOk: boolean
  keysOk: boolean | undefined
  ms: number
}

export async function runModel(model: string): Promise<CaseResult[]> {
  const results: CaseResult[] = []
  for (const evalCase of EVAL_CASES) {
    const workspace = addComponent(
      { boardKey: ComponentId.BUTTON } as never,
      createEmptyWorkspace(),
    )
    const selectedNodeId = evalCase.selectText
      ? findTextChild(workspace)
      : undefined
    const started = Date.now()

    const classification = await classifyAction({
      message: evalCase.message,
      scope: evalCase.scope,
      hasSelectedNode: selectedNodeId !== undefined,
      model,
    })
    const picked =
      classification.kind === "classified"
        ? classification.intent.intent
        : "none"
    const intentOk = picked === evalCase.expected.intent

    // Property-name resolution only measures when both the case expects keys
    // and the intent landed, so the two judgments stay separable.
    let keysOk: boolean | undefined
    if (intentOk && evalCase.expected.propertyKeys && selectedNodeId) {
      const context: TurnContext = {
        state: createTurnState(workspace),
        resolved: resolveContext({
          workspace,
          activeBoardKey: ComponentId.BUTTON,
          selectedNodeId,
          scope: evalCase.scope,
        }),
        message: evalCase.message,
        model,
        calls: [],
        steps: [],
      }
      const names = await resolvePropertyNames(context, "text")
      keysOk =
        names.kind === "resolved" &&
        evalCase.expected.propertyKeys.every((key) => names.keys.includes(key))
    }

    const ms = Date.now() - started
    results.push({ id: evalCase.id, intentOk, keysOk, ms })
    const keysNote =
      keysOk === undefined ? "" : keysOk ? " keys:ok" : " keys:MISS"
    console.log(
      `  ${intentOk ? "PASS" : "MISS"} ${evalCase.id} (${ms}ms)${keysNote}${
        intentOk ? "" : ` -> got ${picked}`
      }`,
    )
  }
  return results
}

/** Runs every named model and prints the per-model accuracy summary table. */
export async function runEval(models: string[]): Promise<void> {
  if (!(await isOllamaReachable())) {
    console.error("No Ollama server reachable at localhost:11434.")
    return
  }

  const summary: Record<
    string,
    { intent: string; keys: string; avgMs: number }
  > = {}
  for (const model of models) {
    console.log(`\n=== ${model} ===`)
    const results = await runModel(model)
    const intentPassed = results.filter((r) => r.intentOk).length
    const keyCases = results.filter((r) => r.keysOk !== undefined)
    const keysPassed = keyCases.filter((r) => r.keysOk).length
    summary[model] = {
      intent: `${intentPassed}/${results.length}`,
      keys: keyCases.length > 0 ? `${keysPassed}/${keyCases.length}` : "n/a",
      avgMs: Math.round(
        results.reduce((sum, r) => sum + r.ms, 0) / results.length,
      ),
    }
  }

  console.log("\n=== SUMMARY ===")
  for (const [model, stats] of Object.entries(summary)) {
    console.log(
      `${model.padEnd(14)} intent ${stats.intent.padEnd(7)} property-keys ${stats.keys.padEnd(7)} avg ${stats.avgMs}ms/case`,
    )
  }
}
