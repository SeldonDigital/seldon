/**
 * Gating measurement for the structured target parse ("build 2"), not a
 * shipped stage. Question: can a local model reliably split a message into a
 * structured node reference -- base noun, spatial/other descriptors, count,
 * and one relation? Measured 2026-08-02 at 38/39 fields on qwen3:8b (see
 * .scratch/find-node-cardinality/issues/08); the descriptor/count half
 * shipped as extract-target's split, the `relation` half stays parked until
 * a real request needs it -- this probe is the baseline to re-run first.
 *
 * Schema is deliberately ONE LEVEL of relation, not terminus's fully
 * recursive NodeRef (descriptor/baseNode/relations: NodeRef[]) --
 * ollama-client.ts's own doc comment warns deep/recursive schemas are
 * unvalidated for qwen3 0.6b-8b, so this measures the flat shape actually
 * expected to hold, per the same caution that shaped extract-target's design.
 *
 * Includes the two exact issue-07 failures ("set the width of all the chips
 * to 100 pixels", "...display property of all the chips to none") to check
 * whether separating "property" language from "baseNode" fixes the
 * empty-match regression a flat single-phrase extraction hits today.
 *
 * Not a pass/fail gate by itself -- prints actual vs. expected per case so a
 * human judges whether the hit rate justifies building build 2 for real.
 */
import { describe, it } from "vitest"

import { callOllamaFormat } from "../local/ollama-client"

const QUERY_PARSE_SCHEMA = {
  type: "object",
  properties: {
    baseNode: { type: "string" },
    spatial: { type: "string" },
    other: { type: "string" },
    count: { type: "string" },
    relation: {
      type: "string",
      enum: ["none", "in", "before", "after", "above", "below"],
    },
    relationTarget: { type: "string" },
  },
  required: ["baseNode", "spatial", "other", "count", "relation", "relationTarget"],
}

function buildQueryParseProbePrompt(message: string): string {
  return [
    "Parse the TARGET node reference out of this design-editor message. Ignore any property name or new value being set -- only describe the element being acted on.",
    "",
    "Fields:",
    "baseNode: the core noun naming the element, e.g. 'chip', 'card', 'button'. Never a property name (color, width, display, opacity).",
    "spatial: positional/ordering words ('first', 'last', 'second', 'left'), or '' if none.",
    "other: descriptive words about the element's current state ('red', 'with round corners'), or '' if none. Never a commanded NEW value.",
    "count: '1' for a single element, a number for a bounded plural ('the two chips' -> '2'), or 'all' for an unbounded plural ('all the chips', 'every chip', 'each chip').",
    "relation: 'none', or one of in/before/after/above/below when the target is described relative to another node ('the button below the title' -> relation 'below').",
    "relationTarget: the noun phrase the relation points at ('the title' -> 'title'), or '' when relation is 'none'.",
    "",
    `Message: ${JSON.stringify(message)}`,
  ].join("\n")
}

const CASES: {
  label: string
  message: string
  expected: Partial<{
    baseNode: string
    spatial: string
    other: string
    count: string
    relation: string
    relationTarget: string
  }>
  repeat?: number
}[] = [
  {
    label: "ordinal-descriptor",
    message: "make the second card blue",
    expected: { baseNode: "card", spatial: "second", count: "1" },
  },
  {
    label: "spatial-last",
    message: "make the last button green",
    expected: { baseNode: "button", spatial: "last", count: "1" },
  },
  {
    label: "relation-below",
    message: "hide the button below the title",
    expected: { baseNode: "button", relation: "below", relationTarget: "title" },
  },
  {
    label: "relation-in",
    message: "make the chip in the main panel red",
    expected: { baseNode: "chip", relation: "in", count: "1" },
  },
  {
    label: "quality-descriptor",
    message: "duplicate the red chip with round corners",
    expected: { baseNode: "chip", count: "1" },
  },
  {
    label: "plural-relation",
    message: "hide all the buttons in the header",
    expected: { baseNode: "buttons", count: "all", relation: "in", relationTarget: "header" },
  },
  {
    label: "spatial-from-left",
    message: "remove the second chip from the left",
    expected: { baseNode: "chip", spatial: "second", count: "1" },
  },
  {
    label: "bounded-count-relation",
    message: "hide the two buttons after the divider",
    expected: { baseNode: "buttons", count: "2", relation: "after", relationTarget: "divider" },
  },
  {
    label: "issue07-width",
    message: "set the width of all the chips to 100 pixels",
    expected: { baseNode: "chips", count: "all" },
    repeat: 3,
  },
  {
    label: "issue07-display",
    message: "set the display property of all the chips to none",
    expected: { baseNode: "chips", count: "all" },
    repeat: 3,
  },
  {
    label: "issue01-each",
    message: "hide each of the chips",
    expected: { baseNode: "chips", count: "all" },
  },
]

describe.skipIf(!process.env.SELDON_AI_LIVE)("live query-parse probe (build 2 gate)", () => {
  it(
    "measures structured target extraction against flat baseline failures",
    async () => {
      let fieldsChecked = 0
      let fieldsMatched = 0

      for (const testCase of CASES) {
        const runs = testCase.repeat ?? 1
        for (let run = 0; run < runs; run++) {
          const { value } = await callOllamaFormat<Record<string, string>>({
            model: process.env.SELDON_AI_TEST_MODEL ?? "qwen3:8b",
            prompt: buildQueryParseProbePrompt(testCase.message),
            schema: QUERY_PARSE_SCHEMA,
          })

          const mismatches: string[] = []
          for (const [field, expectedValue] of Object.entries(testCase.expected)) {
            fieldsChecked++
            const actualValue = value[field]
            const fieldMatches =
              actualValue?.toLowerCase().trim() === String(expectedValue).toLowerCase().trim()
            if (fieldMatches) {
              fieldsMatched++
            } else {
              mismatches.push(`${field}: expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actualValue)}`)
            }
          }

          const runLabel = runs > 1 ? `${testCase.label} #${run + 1}` : testCase.label
          if (mismatches.length === 0) {
            console.log(`[PASS] ${runLabel}: ${JSON.stringify(value)}`)
          } else {
            console.log(`[MISS] ${runLabel}: ${JSON.stringify(value)} -- ${mismatches.join("; ")}`)
          }
        }
      }

      console.log(`\nField accuracy: ${fieldsMatched}/${fieldsChecked} (${Math.round((100 * fieldsMatched) / fieldsChecked)}%)`)
    },
    10 * 60 * 1000,
  )
})
