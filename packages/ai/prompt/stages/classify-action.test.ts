import { describe, expect, it } from "vitest"

import {
  V1_FAMILY_KEYS,
  V1_INTENTS_BY_FAMILY,
} from "../../schema/v1-vocabulary"
import {
  buildFamilyCatalog,
  buildIntentCatalog,
  buildPickFamilyStage,
  buildPickIntentStage,
} from "./classify-action"

describe("buildFamilyCatalog", () => {
  it("lists every family with its description", () => {
    const catalog = buildFamilyCatalog()
    for (const family of V1_FAMILY_KEYS) {
      expect(catalog).toContain(`- ${family}:`)
    }
  })
})

describe("buildIntentCatalog", () => {
  it("lists only the intents it is given", () => {
    const propertyIntents = V1_INTENTS_BY_FAMILY.get("properties") ?? []
    const catalog = buildIntentCatalog(propertyIntents)
    expect(catalog).toContain("- set_node_label:")
    expect(catalog).not.toContain("- add_variant:")
  })
})

describe("buildPickFamilyStage", () => {
  it("constrains the schema to the family keys and carries the selection hint", () => {
    const { prompt, schema } = buildPickFamilyStage({
      message: "make it red",
      scope: "instance",
      hasSelectedNode: true,
    })
    expect(prompt).toContain('"make it red"')
    expect(prompt).toContain("has a node selected")
    expect(prompt).toContain("scope: instance")
    expect(schema).toMatchObject({
      properties: { family: { enum: [...V1_FAMILY_KEYS] } },
    })
  })

  it("hints when nothing is selected", () => {
    const { prompt } = buildPickFamilyStage({
      message: "add a button",
      hasSelectedNode: false,
    })
    expect(prompt).toContain("Nothing specific is selected")
  })

  it("tells the model the verb decides, not the kind of thing mentioned", () => {
    const { prompt } = buildPickFamilyStage({ message: "rename the variant" })
    expect(prompt).toContain("the verb")
  })

  it("serializes no workspace tree", () => {
    const { prompt } = buildPickFamilyStage({ message: "make it red" })
    expect(prompt).not.toContain("component-")
  })
})

describe("buildPickIntentStage", () => {
  it("offers only the chosen family's members, so a sibling elsewhere cannot be picked", () => {
    const { prompt, schema } = buildPickIntentStage({
      message: "rename the second variant to Compact",
      family: "properties",
    })
    expect(prompt).toContain("set_node_label")
    // The intent that stole this message in the fourth sibling-steal lives in
    // the add family, so it is absent from both the prompt and the enum.
    expect(prompt).not.toContain("add_variant")
    expect(schema).toMatchObject({
      properties: {
        intent: { enum: ["set_node_properties", "reset_node_property", "set_node_label"] },
      },
    })
  })

  it("names the family it is picking within", () => {
    const { prompt } = buildPickIntentStage({
      message: "delete this",
      family: "mutations",
    })
    expect(prompt).toContain('"mutations"')
  })
})
