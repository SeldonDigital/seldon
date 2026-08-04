import { catalog } from "@seldon/core/components/catalog"
import { describe, expect, it } from "vitest"

import { nounIsPlural } from "./extract-target"

/**
 * The plurality contract over the whole catalog: extracting a component's own
 * singular name must never read as plural, or a single-element edit routes
 * down the class path and overwrites every match on the board (issue 10,
 * reproduced through the dependency instead of the model).
 *
 * `pluralize.isPlural` alone cannot honour this -- verified against
 * pluralize@8.0.0, it answers `true` for "Table Data" ("data" as the plural
 * of "datum") and for every "... Specimen" name ("-men" as a plural suffix) --
 * so `nounIsPlural` overrides it for nouns that ARE catalog names, which are
 * singular by definition. This walks every catalog component so the component
 * list itself is the test surface: a new component whose name trips a NEW
 * misfire fails here the day it lands.
 */
const componentsUnderTest = [
  ...catalog.frames,
  ...catalog.primitives,
  ...catalog.elements,
  ...catalog.parts,
  ...catalog.modules,
  ...catalog.screens,
]

describe("plurality catalog contract", () => {
  it("covers the whole catalog", () => {
    expect(componentsUnderTest.length).toBeGreaterThan(0)
  })

  for (const schema of componentsUnderTest) {
    const spokenName = schema.name.toLowerCase()
    it(`reads "the last ${spokenName}" as singular`, () => {
      const messageNamingOneElement = `change the last ${spokenName}`
      expect(nounIsPlural(messageNamingOneElement, spokenName)).toBe(false)
    })
  }
})
