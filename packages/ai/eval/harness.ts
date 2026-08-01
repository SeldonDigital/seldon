/**
 * Model-selection eval harness. Threads one TurnContext through every real
 * pipeline stage a turn goes through -- route, decompose, classify, target
 * resolution, and (for property cases) property-name resolution -- against
 * each candidate model, and prints a per-model, per-stage accuracy table.
 *
 * Threading through route+decompose (rather than calling resolvers directly
 * on the raw case message) is deliberate: it is what lets decompose's
 * rewritten step text reach target resolution, which is what surfaced
 * .scratch/find-node-cardinality/issues/03-decompose-preempts-class-resolution.md
 * as a scored miss instead of an invisible gap.
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
import { decompose } from "../local/resolvers/decompose"
import { resolvePropertyNames } from "../local/resolvers/resolve-property-name"
import type { MessageReason } from "../local/resolvers/resolve-target"
import { resolveTargetWithHint } from "../local/resolvers/resolve-target-with-hint"
import { route } from "../local/resolvers/route"
import type { TurnContext } from "../local/turn-context"
import { createTurnState } from "../local/turn-state"
import { EVAL_CASES, type EvalCase } from "./cases"
import {
  CHIP_ROW_BOARD,
  TEXT_LIST_BOARD,
  findTextChild,
  seedButtonWorkspace,
  seedChipRowWorkspace,
  seedTextListWorkspace,
} from "./seed"

/** The workspace and active board a case runs against. */
function seedFor(evalCase: EvalCase): {
  workspace: Workspace
  boardKey: BoardKey
} {
  if (evalCase.seed === "chipRow") {
    const { workspace } = seedChipRowWorkspace()
    return { workspace, boardKey: CHIP_ROW_BOARD as BoardKey }
  }
  if (evalCase.seed === "textList") {
    const { workspace } = seedTextListWorkspace()
    return { workspace, boardKey: TEXT_LIST_BOARD as BoardKey }
  }
  return {
    workspace: seedButtonWorkspace(),
    boardKey: ComponentId.BUTTON as BoardKey,
  }
}

/** The catalog id of the nodes a case's cases target, for property-name resolution. */
function catalogIdFor(evalCase: EvalCase): string {
  return evalCase.seed === "chipRow" ? "chip" : "text"
}

/** Pass/fail for one decomposed step's classify+resolve+property pass. */
export interface StepCaseResult {
  pickedIntent: string
  intentOk: boolean
  keysOk: boolean | undefined
  resolutionOk: boolean | undefined
  resolutionGot: string | undefined
}

export interface CaseResult {
  id: string
  /** Whether route() landed on the case's expected reply/process decision. */
  routeOk: boolean
  /** Whether decompose() produced the expected step count, when scored. */
  decomposeOk: boolean | undefined
  /** Whether the real extract_target stage read single-vs-class correctly. */
  referenceOk: boolean | undefined
  /** One entry per decomposed step actually scored. */
  stepResults: StepCaseResult[]
  /** Set when the case documents a gap that is not built yet. */
  known: string | undefined
  elapsedMs: number
}

/** The single/class reading the real extract_target stage produced, if it ran. */
function readReferenceIntent(context: TurnContext): "single" | "class" | undefined {
  const extractTargetStep = context.steps.find(
    (step) => step.name === "extract_target",
  )
  if (extractTargetStep?.output === undefined) return undefined
  try {
    const rawHint = JSON.parse(extractTargetStep.output) as { plural: boolean }
    return rawHint.plural ? "class" : "single"
  } catch {
    return undefined
  }
}

export async function runModel(model: string): Promise<CaseResult[]> {
  const caseResults: CaseResult[] = []
  for (const evalCase of EVAL_CASES) {
    const { workspace, boardKey } = seedFor(evalCase)
    const selectedNodeId = evalCase.selectText
      ? findTextChild(workspace)
      : undefined
    const caseStartedMs = Date.now()

    const context: TurnContext = {
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
    }

    const expectedRoute = evalCase.expected.route ?? "process"
    const routeDecision = await route(context, evalCase.history)
    const routeOk = routeDecision.kind === expectedRoute

    if (routeDecision.kind === "reply") {
      const elapsedMs = Date.now() - caseStartedMs
      caseResults.push({
        id: evalCase.id,
        routeOk,
        decomposeOk: undefined,
        referenceOk: undefined,
        stepResults: [],
        known: evalCase.known,
        elapsedMs,
      })
      console.log(
        `  ${routeOk ? "PASS" : "MISS"} ${evalCase.id} (${elapsedMs}ms) route:${routeDecision.kind}`,
      )
      continue
    }

    const plannedSteps = await decompose(context, evalCase.history)
    const decomposeOk =
      evalCase.expected.decomposedStepCount !== undefined
        ? plannedSteps.length === evalCase.expected.decomposedStepCount
        : undefined

    const stepResults: StepCaseResult[] = []
    for (
      let stepIndex = 0;
      stepIndex < evalCase.expected.steps.length;
      stepIndex++
    ) {
      const expectedStep = evalCase.expected.steps[stepIndex]!
      const stepText = plannedSteps[stepIndex]
      // decompose under-produced steps relative to what the case expects --
      // no real step text exists to score, so no more steps can be scored.
      if (stepText === undefined) break

      context.message = stepText
      const classification = await classifyAction({
        message: stepText,
        scope: evalCase.scope,
        hasSelectedNode: selectedNodeId !== undefined,
        model,
      })
      // A non-classified outcome is not automatically "none": the classifier
      // returns the same terminal message whether the model deliberately
      // chose none or answered a key outside the vocabulary. Only the first
      // is a legitimate answer, so they are scored apart.
      const pickedIntent =
        classification.kind === "classified"
          ? classification.intent.intent
          : classification.rawIntent === "none"
            ? "none"
            : `unknown:${classification.rawIntent}`
      const intentOk = pickedIntent === expectedStep.intent

      const needsTargetResolution =
        expectedStep.resolution !== undefined ||
        (stepIndex === 0 && evalCase.expected.referenceIntent !== undefined)
      let resolutionOk: boolean | undefined
      let resolutionGot: string | undefined
      if (needsTargetResolution) {
        const target = await resolveTargetWithHint(context)
        if (expectedStep.resolution !== undefined) {
          const expectedResolution = expectedStep.resolution
          if (target.kind === "resolved") {
            resolutionGot = "1 node"
            resolutionOk = expectedResolution === 1
          } else if (target.kind === "resolved-many") {
            resolutionGot = `${target.nodeIds.length} nodes`
            resolutionOk = expectedResolution === target.nodeIds.length
          } else {
            // The reason tag is the whole point: "several" is Hari working,
            // while "no-target" means it never had a phrase to search with.
            // Scoring them alike is what made a broken outcome read as a
            // working one.
            resolutionGot = target.reason as MessageReason
            resolutionOk = expectedResolution === target.reason
          }
        }
      }

      let keysOk: boolean | undefined
      const caseAlsoChecksPropertyKeys =
        intentOk &&
        expectedStep.propertyKeys !== undefined &&
        selectedNodeId !== undefined
      if (caseAlsoChecksPropertyKeys) {
        const nameResolution = await resolvePropertyNames(
          context,
          catalogIdFor(evalCase),
        )
        keysOk =
          nameResolution.kind === "resolved" &&
          expectedStep.propertyKeys!.every((expectedKey) =>
            nameResolution.keys.includes(expectedKey),
          )
      }

      stepResults.push({
        pickedIntent,
        intentOk,
        keysOk,
        resolutionOk,
        resolutionGot,
      })
    }

    const referenceOk =
      evalCase.expected.referenceIntent !== undefined
        ? readReferenceIntent(context) === evalCase.expected.referenceIntent
        : undefined

    const elapsedMs = Date.now() - caseStartedMs
    caseResults.push({
      id: evalCase.id,
      routeOk,
      decomposeOk,
      referenceOk,
      stepResults,
      known: evalCase.known,
      elapsedMs,
    })

    const allStepsIntentOk = stepResults.every((step) => step.intentOk)
    const decomposeNote =
      decomposeOk === undefined ? "" : decomposeOk ? " decompose:ok" : " decompose:MISS"
    const referenceNote =
      referenceOk === undefined ? "" : referenceOk ? " ref:ok" : " ref:MISS"
    const stepNotes = stepResults
      .map((step, index) => {
        const keysNote =
          step.keysOk === undefined ? "" : step.keysOk ? " keys:ok" : " keys:MISS"
        const resolutionNote =
          step.resolutionOk === undefined
            ? ""
            : step.resolutionOk
              ? " resolve:ok"
              : ` resolve:MISS (want ${evalCase.expected.steps[index]!.resolution}, got ${step.resolutionGot})`
        return `${step.intentOk ? "" : `step${index} -> got ${step.pickedIntent} `}${keysNote}${resolutionNote}`
      })
      .join("")
    const knownNote = evalCase.known ? ` [known: ${evalCase.known}]` : ""
    console.log(
      `  ${allStepsIntentOk ? "PASS" : "MISS"} ${evalCase.id} (${elapsedMs}ms)${decomposeNote}${referenceNote}${stepNotes}${knownNote}`,
    )
  }
  return caseResults
}

/** Runs every named model and prints the per-model, per-stage accuracy summary table. */
export async function runEval(models: string[]): Promise<void> {
  const ollamaIsUnreachable = !(await isOllamaReachable())
  if (ollamaIsUnreachable) {
    console.error("No Ollama server reachable at localhost:11434.")
    return
  }

  /** `passed/total` over the values that scored at all (`undefined` excluded). */
  const ratio = (values: (boolean | undefined)[]): string => {
    const scored = values.filter((value) => value !== undefined)
    if (scored.length === 0) return "n/a"
    return `${scored.filter(Boolean).length}/${scored.length}`
  }

  const summary: Record<
    string,
    {
      route: string
      decompose: string
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
    const allStepResults = caseResults.flatMap(
      (caseResult) => caseResult.stepResults,
    )
    summary[model] = {
      route: ratio(caseResults.map((caseResult) => caseResult.routeOk)),
      decompose: ratio(caseResults.map((caseResult) => caseResult.decomposeOk)),
      intent: ratio(allStepResults.map((step) => step.intentOk)),
      keys: ratio(allStepResults.map((step) => step.keysOk)),
      reference: ratio(caseResults.map((caseResult) => caseResult.referenceOk)),
      resolution: ratio(allStepResults.map((step) => step.resolutionOk)),
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
      `${model.padEnd(14)} route ${stats.route.padEnd(7)} decompose ${stats.decompose.padEnd(7)} intent ${stats.intent.padEnd(7)} property-keys ${stats.keys.padEnd(7)} reference ${stats.reference.padEnd(7)} resolution ${stats.resolution.padEnd(7)} avg ${stats.avgMs}ms/case`,
    )
  }
}
