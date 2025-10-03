import { invariant } from "../helpers/utils/invariant"
import { ComponentId } from "./constants"
import {
  elements,
  frames,
  modules,
  parts,
  primitives,
  screens,
} from "./generated"
import { ComponentSchema } from "./types"

export type Catalog = {
  frames: ComponentSchema[]
  primitives: ComponentSchema[]
  elements: ComponentSchema[]
  parts: ComponentSchema[]
  modules: ComponentSchema[]
  screens: ComponentSchema[]
}

export const catalog: Catalog = {
  frames,
  primitives,
  elements,
  parts,
  modules,
  screens,
}

const schemasById = Object.fromEntries(
  Object.values(catalog)
    .flat()
    .map((schema) => [schema.id, schema]),
)

export function getComponentSchema(id: ComponentId): ComponentSchema {
  const match = schemasById[id]

  invariant(match, `Schema ${id} not found`)

  return match
}
