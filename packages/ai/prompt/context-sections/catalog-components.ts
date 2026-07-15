import { catalog } from "@seldon/core/components/catalog"

import { section } from "./section"

const TITLE =
  "Component catalog ids for add_component and insert_component. Copy an id exactly; do not change its casing or add hyphens:"

/**
 * Context section: Component catalog ids.
 *
 * Adding a component means naming a catalog id, and the model cannot create one
 * it has not seen. This flattens the per-level catalog into the full set of ids
 * the agent may pass to add_component and insert_component, so creation is
 * grounded in the real catalog rather than invented names.
 */
export function catalogComponentsSection(): string[] {
  const ids = [
    ...catalog.frames,
    ...catalog.primitives,
    ...catalog.elements,
    ...catalog.parts,
    ...catalog.modules,
    ...catalog.screens,
  ].map((schema) => schema.id)
  return section(TITLE, [ids.join(", ")])
}
