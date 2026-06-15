import { useCallback } from "react"
import {
  ExtractPayload,
  LayeredPaintKey,
  Properties,
  PropertyKey,
  SubPropertyKey,
  invariant,
} from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
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
    (input: ExtractPayload<"reset_component_property">) => {
      dispatch({
        type: "reset_component_property",
        payload: input,
      })
    },
    [dispatch],
  )

  const setBoardProperties = useCallback(
    (input: ExtractPayload<"set_component_properties">) => {
      dispatch({
        type: "set_component_properties",
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
          boardKey: getComponentKey(selection),
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

  const addNodeLayer = useCallback(
    (property: LayeredPaintKey) => {
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) return
      dispatch({
        type: "add_node_layer",
        payload: { nodeId: selection.id, property },
      })
    },
    [selection, dispatch],
  )

  const removeNodeLayer = useCallback(
    (property: LayeredPaintKey, index: number) => {
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) return
      dispatch({
        type: "remove_node_layer",
        payload: { nodeId: selection.id, property, index },
      })
    },
    [selection, dispatch],
  )

  const resetProperty = useCallback(
    (
      propertyKey: PropertyKey,
      subpropertyKey?: SubPropertyKey,
      layerIndex?: number,
    ) => {
      invariant(selection, "Nothing selected")

      if (isBoard(selection)) {
        resetBoardProperty({
          boardKey: getComponentKey(selection),
          propertyKey,
          subpropertyKey,
          layerIndex,
        })
      } else {
        resetNodeProperty({
          nodeId: selection.id,
          propertyKey,
          subpropertyKey,
          layerIndex,
        })
      }
    },
    [selection, resetNodeProperty, resetBoardProperty],
  )

  return {
    setNodeProperties,
    setBoardProperties,
    setProperties,
    addNodeLayer,
    removeNodeLayer,
    resetProperty,
  }
}
