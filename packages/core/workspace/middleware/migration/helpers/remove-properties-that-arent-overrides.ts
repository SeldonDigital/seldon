import { produce } from "immer"
import isEqual from "lodash.isequal"
import { getComponentSchema } from "../../../../components/catalog"
import { isCompoundProperty } from "../../../../helpers/type-guards/compound/is-compound-property"
import { DEFAULT_BOARD_PROPERTIES } from "../../../../properties/constants/default-board-properties"
import { Workspace } from "../../../types"

/**
 * Removes properties that match their default values from all nodes and boards.
 * This migration cleans up properties that aren't actual overrides.
 * @param workspace - The workspace to update
 * @returns The updated workspace with default properties removed
 */
export function removePropertiesThatArentOverrides(workspace: Workspace) {
  return produce(workspace, (draft) => {
    for (const board of Object.values(draft.boards)) {
      for (const [key, value] of Object.entries(board.properties)) {
        const propertyKey = key as keyof typeof DEFAULT_BOARD_PROPERTIES
        if (
          !DEFAULT_BOARD_PROPERTIES[propertyKey] ||
          isEqual(value, DEFAULT_BOARD_PROPERTIES[propertyKey])
        ) {
          delete board.properties[propertyKey]
        } else if (isCompoundProperty(propertyKey)) {
          for (const subProperty of Object.keys(value)) {
            if (
              // @ts-expect-error - TODO: fix this
              !DEFAULT_BOARD_PROPERTIES[propertyKey][subProperty] ||
              isEqual(
                // @ts-expect-error - TODO: fix this
                value[subProperty],
                // @ts-expect-error - TODO: fix this
                DEFAULT_BOARD_PROPERTIES[propertyKey][subProperty],
              )
            ) {
              // @ts-expect-error - TODO: fix this
              delete value[subProperty]
            }
          }
        }
      }
    }

    for (const node of Object.values(draft.byId)) {
      let schema
      try {
        schema = getComponentSchema(node.component)
      } catch (error) {
        console.warn(
          `Skipping node ${node.id} with invalid component ID: ${node.component}`,
        )
        continue
      }

      for (const [key, value] of Object.entries(node.properties)) {
        const propertyKey = key as keyof typeof schema.properties
        if (
          !schema.properties[propertyKey] ||
          isEqual(value, schema.properties[propertyKey])
        ) {
          delete node.properties[propertyKey]
        } else if (isCompoundProperty(propertyKey)) {
          for (const subProperty of Object.keys(value)) {
            if (
              // @ts-expect-error - TODO: fix this
              !schema.properties[propertyKey][subProperty] ||
              isEqual(
                // @ts-expect-error - TODO: fix this
                value[subProperty],
                // @ts-expect-error - TODO: fix this
                schema.properties[propertyKey][subProperty],
              )
            ) {
              // @ts-expect-error - TODO: fix this
              delete value[subProperty]
            }
          }
        }
      }
    }
  })
}
