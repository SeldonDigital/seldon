import { describe, expect, it } from "vitest"

import { V1_INTENT_KEYS } from "../../schema/v1-vocabulary"
import {
  buildClassifierPrompt,
  buildClassifyActionStage,
  buildIntentCatalog,
} from "./classify-action"

describe("buildIntentCatalog", () => {
  it("lists every intent with its description", () => {
    const catalog = buildIntentCatalog()
    expect(catalog).toContain("- set_node_properties:")
    expect(catalog).toContain("- translate:")
    expect(catalog).toContain("- none:")
  })
})

describe("buildClassifierPrompt", () => {
  it("carries the message and the selection hint, but no workspace tree", () => {
    const prompt = buildClassifierPrompt("make it red", "instance", true)
    expect(prompt).toContain('"make it red"')
    expect(prompt).toContain("has a node selected")
    expect(prompt).toContain("scope: instance")
  })

  it("hints when nothing is selected", () => {
    const prompt = buildClassifierPrompt("add a button", undefined, false)
    expect(prompt).toContain("Nothing specific is selected")
  })
})

describe("buildClassifyActionStage", () => {
  it("constrains the schema to the vocabulary's intent keys", () => {
    const { prompt, schema } = buildClassifyActionStage({
      message: "make it red",
    })
    expect(prompt).toContain('"make it red"')
    expect(schema).toMatchObject({
      properties: { intent: { enum: [...V1_INTENT_KEYS] } },
    })
  })
})
