import { getComponentSchema } from "../../../components/catalog"
import { isComponentId } from "../../../components/constants"
import type { ComponentSchema } from "../../../components/types"
import { invariant } from "../../../index"
import type { Board } from "../../types"

export interface ComponentCatalogAndSchema {
  catalogId: string
  schema: ComponentSchema
}

/**
 * Reads this board's catalog id and the component schema for that id from the component catalog.
 *
 * Component, font collection, icon set, media, and theme boards each follow the same resolution rules.
 *
 * Throws for playground boards. Playgrounds omit catalog id in the file format.
 * Throws when the catalog id is not a registered component id.
 *
 * @param board Board to read.
 */
export function getBoardCatalogAndSchema(board: Board): ComponentCatalogAndSchema {
  if (board.type === "playground") {
    invariant(false, "Playground boards do not declare a catalog id.")
  }

  const catalogId = board.catalogId

  if (board.type === "component") {
    invariant(
      isComponentId(catalogId),
      `No component schema for catalog id ${catalogId}.`,
    )
    return { catalogId, schema: getComponentSchema(catalogId) }
  }

  if (board.type === "theme") {
    invariant(
      isComponentId(catalogId),
      `No component schema for catalog id ${catalogId}.`,
    )
    return { catalogId, schema: getComponentSchema(catalogId) }
  }

  if (board.type === "font-collection") {
    invariant(
      isComponentId(catalogId),
      `No component schema for catalog id ${catalogId}.`,
    )
    return { catalogId, schema: getComponentSchema(catalogId) }
  }

  if (board.type === "icon-set") {
    invariant(
      isComponentId(catalogId),
      `No component schema for catalog id ${catalogId}.`,
    )
    return { catalogId, schema: getComponentSchema(catalogId) }
  }

  if (board.type === "media") {
    invariant(
      isComponentId(catalogId),
      `No component schema for catalog id ${catalogId}.`,
    )
    return { catalogId, schema: getComponentSchema(catalogId) }
  }

  const exhaustive: never = board
  return exhaustive
}
