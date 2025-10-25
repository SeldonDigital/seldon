import { useCallback } from "react"
import {
  ExtractPayload,
  Properties,
  PropertyKey,
  SubPropertyKey,
  invariant,
} from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export function useObjectProperties() {
  const { dispatch } = useWorkspace()
  const { selection } = useSelection()

  const setNodeProperties = useCallback(
    (input: ExtractPayload<"set_node_properties">) => {
      dispatch({
        type: "set_node_properties",
        payload: input,
      })
    },
    [dispatch],
  )

  const resetNodeProperty = useCallback(
    (input: ExtractPayload<"reset_node_property">) => {
      dispatch({
        type: "reset_node_property",
        payload: input,
      })
    },
    [dispatch],
  )

  const resetBoardProperty = useCallback(
    (input: ExtractPayload<"reset_board_property">) => {
      dispatch({
        type: "reset_board_property",
        payload: input,
      })
    },
    [dispatch],
  )

  const setBoardProperties = useCallback(
    (input: ExtractPayload<"set_board_properties">) => {
      dispatch({
        type: "set_board_properties",
        payload: input,
      })
    },
    [dispatch],
  )

  const setProperties = useCallback(
    (properties: Properties, options?: { mergeSubProperties?: boolean }) => {
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) {
        setBoardProperties({
          componentId: selection.id,
          properties: properties,
        })
      } else {
        setNodeProperties({
          nodeId: selection.id,
          properties: properties,
          options,
        })
      }
    },
    [selection, setBoardProperties, setNodeProperties],
  )

  const resetProperty = useCallback(
    (propertyKey: PropertyKey, subpropertyKey?: SubPropertyKey) => {
      invariant(selection, "Nothing selected")

      if (isBoard(selection)) {
        resetBoardProperty({
          componentId: selection.id,
          propertyKey,
          subpropertyKey,
        })
      } else {
        resetNodeProperty({
          nodeId: selection.id,
          propertyKey,
          subpropertyKey,
        })
      }
    },
    [selection, resetNodeProperty, resetBoardProperty],
  )

  return {
    setNodeProperties,
    setBoardProperties,
    setProperties,
    resetProperty,
  }
}
