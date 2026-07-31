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
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"

import { resolveContext } from "../local/editor-context"
import { isOllamaReachable } from "../local/ollama-client"
import { classifyAction } from "../local/resolvers/classify-action"
import { resolvePropertyNames } from "../local/resolvers/resolve-property-name"
import type { MessageReason } from "../local/resolvers/resolve-target"
import { resolveTargetWithHint } from "../local/resolvers/resolve-target-with-hint"
import type { TurnContext } from "../local/turn-context"
import { createTurnState } from "../local/turn-state"
import { EVAL_CASES, type EvalCase } from "./cases"
import { probeReferenceIntent } from "./reference-intent-probe"
import {
  CHIP_ROW_BOARD,
  findTextChild,
  seedButtonWorkspace,
  seedChipRowWorkspace,
} from "./seed"

/** The workspace and active board a case runs against. */
function seedFor(evalCase: EvalCase): {
  workspace: Workspace
  boardKey: BoardKey
} {
  const caseNeedsSiblings = evalCase.seed === "chipRow"
  if (caseNeedsSiblings) {
    const { workspace } = seedChipRowWorkspace()
    return { workspace, boardKey: CHIP_ROW_BOARD as BoardKey }
  }
  return {
    workspace: seedButtonWorkspace(),
    boardKey: ComponentId.BUTTON as BoardKey,
  }
}

export interface CaseResult {
  id: string
  intentOk: boolean
  keysOk: boolean | undefined
  /** Whether the probe read single-vs-class reference intent correctly. */
  referenceOk: boolean | undefined
  /** Whether target resolution landed on the expected node count. */
  resolutionOk: boolean | undefined
  /** What resolution actually produced, for the miss line. */
  resolutionGot: string | undefined
  /** Set when the case documents a gap that is not built yet. */
  known: string | undefined
  elapsedMs: number
}

export async function runModel(model: string): Promise<CaseResult[]> {
  const caseResults: CaseResult[] = []
  for (const evalCase of EVAL_CASES) {
    const { workspace, boardKey } = seedFor(evalCase)
    const selectedNodeId = evalCase.selectText
      ? findTextChild(workspace)
      : undefined
    const caseStartedMs = Date.now()

    const classification = await classifyAction({
      message: evalCase.message,
      scope: evalCase.scope,
      hasSelectedNode: selectedNodeId !== undefined,
      model,
    })
    // A non-classified outcome is not automatically "none": the classifier
    // returns the same terminal message whether the model deliberately chose
    // none or answered a key outside the vocabulary. Only the first is a
    // legitimate answer, so they are scored apart.
    const pickedIntent =
      classification.kind === "classified"
        ? classification.intent.intent
        : classification.rawIntent === "none"
          ? "none"
          : `unknown:${classification.rawIntent}`
    const intentOk = pickedIntent === evalCase.expected.intent

    // Property-name resolution only measures when both the case expects keys
    // and the intent landed, so the two judgments stay separable.
    let keysOk: boolean | undefined
    const caseAlsoChecksPropertyKeys =
      intentOk &&
      evalCase.expected.propertyKeys !== undefined &&
      selectedNodeId !== undefined
    const buildContext = (): TurnContext => ({
      state: createTurnState(workspace),
      resolved: resolveContext({
        workspace,
        activeBoardKey: boardKey,
        selectedNodeId,
        scope: evalCase.scope,
      }),
      message: evalCase.message,
      model,
      calls: [],
      steps: [],
    })

    if (caseAlsoChecksPropertyKeys) {
      const catalogId = evalCase.seed === "chipRow" ? "chip" : "text"
      const nameResolution = await resolvePropertyNames(
        buildContext(),
        catalogId,
      )
      keysOk =
        nameResolution.kind === "resolved" &&
        evalCase.expected.propertyKeys!.every((expectedKey) =>
          nameResolution.keys.includes(expectedKey),
        )
    }

    // Reference intent: measured by the standalone probe, because no pipeline
    // stage emits it yet. This is the number that decides whether the
    // single/class split is worth building on.
    let referenceOk: boolean | undefined
    if (evalCase.expected.referenceIntent !== undefined) {
      const probed = await probeReferenceIntent(evalCase.message, model)
      referenceOk = probed === evalCase.expected.referenceIntent
    }

    // Resolution: what the CURRENT pipeline lands on. Class cases are expected
    // to miss -- TargetResolution cannot carry more than one node id, so the
    // gap shows up as a count of 1 against an expectation of many.
    let resolutionOk: boolean | undefined
    let resolutionGot: string | undefined
    if (evalCase.expected.resolution !== undefined) {
      const target = await resolveTargetWithHint(buildContext())
      const expected = evalCase.expected.resolution
      if (target.kind === "resolved") {
        resolutionGot = "1 node"
        resolutionOk = expected === 1
      } else if (target.kind === "resolved-many") {
        resolutionGot = `${target.nodeIds.length} nodes`
        resolutionOk = expected === target.nodeIds.length
      } else {
        // The reason tag is the whole point: "several" is Hari working, while
        // "no-target" means it never had a phrase to search with. Scoring
        // them alike is what made a broken outcome read as a working one.
        resolutionGot = target.reason
        resolutionOk = expected === target.reason
      }
    }

    const elapsedMs = Date.now() - caseStartedMs
    caseResults.push({
      id: evalCase.id,
      intentOk,
      keysOk,
      referenceOk,
      resolutionOk,
      resolutionGot,
      known: evalCase.known,
      elapsedMs,
    })
    const keysNote =
      keysOk === undefined ? "" : keysOk ? " keys:ok" : " keys:MISS"
    const referenceNote =
      referenceOk === undefined ? "" : referenceOk ? " ref:ok" : " ref:MISS"
    const resolutionNote =
      resolutionOk === undefined
        ? ""
        : resolutionOk
          ? " resolve:ok"
          : ` resolve:MISS (want ${evalCase.expected.resolution}, got ${resolutionGot})`
    const knownNote = evalCase.known ? ` [known: ${evalCase.known}]` : ""
    console.log(
      `  ${intentOk ? "PASS" : "MISS"} ${evalCase.id} (${elapsedMs}ms)${keysNote}${referenceNote}${resolutionNote}${knownNote}${
        intentOk ? "" : ` -> got ${pickedIntent}`
      }`,
    )
  }
  return caseResults
}

/** Runs every named model and prints the per-model accuracy summary table. */
export async function runEval(models: string[]): Promise<void> {
  const ollamaIsUnreachable = !(await isOllamaReachable())
  if (ollamaIsUnreachable) {
    console.error("No Ollama server reachable at localhost:11434.")
    return
  }

  /** `passed/total` over the cases that scored a given axis at all. */
  const ratio = (
    caseResults: CaseResult[],
    read: (caseResult: CaseResult) => boolean | undefined,
  ): string => {
    const scored = caseResults.filter(
      (caseResult) => read(caseResult) !== undefined,
    )
    if (scored.length === 0) return "n/a"
    return `${scored.filter((caseResult) => read(caseResult)).length}/${scored.length}`
  }

  const summary: Record<
    string,
    {
      intent: string
      keys: string
      reference: string
      resolution: string
      avgMs: number
    }
  > = {}
  for (const model of models) {
    console.log(`\n=== ${model} ===`)
    const caseResults = await runModel(model)
    const intentPassedCount = caseResults.filter(
      (caseResult) => caseResult.intentOk,
    ).length
    const casesExpectingKeys = caseResults.filter(
      (caseResult) => caseResult.keysOk !== undefined,
    )
    const keysPassedCount = casesExpectingKeys.filter(
      (caseResult) => caseResult.keysOk,
    ).length
    const anyCaseExpectedKeys = casesExpectingKeys.length > 0
    summary[model] = {
      intent: `${intentPassedCount}/${caseResults.length}`,
      keys: anyCaseExpectedKeys
        ? `${keysPassedCount}/${casesExpectingKeys.length}`
        : "n/a",
      reference: ratio(caseResults, (caseResult) => caseResult.referenceOk),
      resolution: ratio(caseResults, (caseResult) => caseResult.resolutionOk),
      avgMs: Math.round(
        caseResults.reduce(
          (totalMs, caseResult) => totalMs + caseResult.elapsedMs,
          0,
        ) / caseResults.length,
      ),
    }
  }

  console.log("\n=== SUMMARY ===")
  for (const [model, stats] of Object.entries(summary)) {
    console.log(
      `${model.padEnd(14)} intent ${stats.intent.padEnd(7)} property-keys ${stats.keys.padEnd(7)} reference ${stats.reference.padEnd(7)} resolution ${stats.resolution.padEnd(7)} avg ${stats.avgMs}ms/case`,
    )
  }
}
