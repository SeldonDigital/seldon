import { catalog } from "@seldon/core/components/catalog"
import { describe, expect, it } from "vitest"

import { defaultColorKeyFor } from "./bare-color"

/**
 * The bare-color convention contract: for every catalog component, pin which
 * bucket a bare color command lands in and which key it writes. A new
 * component reports the bucket it joined; a component whose schema shifts
 * shows up as a snapshot diff in CI instead of as a user's chip not changing
 * color. (The convention itself is one function -- changing it is one edit
 * plus reviewing this diff.)
 */

/** Every catalog component that has settable properties. */
const componentsUnderTest = [
  ...catalog.frames,
  ...catalog.primitives,
  ...catalog.elements,
  ...catalog.parts,
  ...catalog.modules,
  ...catalog.screens,
].filter((schema) => Object.keys(schema.properties ?? {}).length > 0)

/** One line per component: the bucket, and the key or candidates it implies. */
function describeResolution(catalogId: string): string {
  const resolution = defaultColorKeyFor(catalogId)
  if ("key" in resolution) return `${resolution.bucket} -> ${resolution.key}`
  if (resolution.bucket === "ask")
    return `ask -> ${resolution.candidateKeys.join(", ")}`
  return "none"
}

describe("bare-color convention contract", () => {
  it("covers the whole catalog", () => {
    expect(componentsUnderTest.length).toBeGreaterThan(0)
  })

  it("pins every component's bare-color bucket and key", () => {
    const bucketByComponent: Record<string, string> = {}
    for (const schema of componentsUnderTest) {
      bucketByComponent[schema.id] = describeResolution(schema.id)
    }
    expect(bucketByComponent).toMatchSnapshot()
  })
})
