import { catalog } from "@seldon/core/components/catalog"

import { section } from "./section"

const TITLE =
  "Component catalog ids (use as boardKey for add_component_and_insert_default_instance):"

/**
 * Context section: Component catalog ids.
 *
 * Adding a component means naming a catalog id, and the model cannot create one
 * it has not seen. This flattens the per-level catalog into the full set of ids
 * the agent may pass as `boardKey` to add_component_and_insert_default_instance,
 * so creation is grounded in the real catalog rather than invented names.
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
