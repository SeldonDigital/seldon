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
import { isEntryNodeInstance } from "@seldon/core/workspace/model/entry-node"
import { NORMAL_STATE } from "@seldon/core/workspace/model/node-state"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import {
  INSTANCE_STATE_EDIT_MESSAGE,
  useNodeActiveState,
} from "./use-node-active-state"
import { useSelection } from "./use-selection"
import { useWorkspace } from "./use-workspace"

export function useObjectProperties() {
  const { dispatch } = useWorkspace()
  const { selection } = useSelection()
  const addToast = useAddToast()

  // Active interaction state for the selection's board. Board selections and the
  // Normal state fall back to the regular property path.
  const activeState = useNodeActiveState(selection ?? null)

  const setNodeStateProperties = useCallback(
    (input: ExtractPayload<"set_node_state_properties">) => {
      dispatch({
        type: "set_node_state_properties",
        payload: input,
      })
    },
    [dispatch],
  )

  const resetNodeStateProperty = useCallback(
    (input: ExtractPayload<"reset_node_state_property">) => {
      dispatch({
        type: "reset_node_state_property",
        payload: input,
      })
    },
    [dispatch],
  )

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
        return
      }

      // In a non-Normal state, node edits write the state override bag. Instances
      // cannot author states, so block the edit and explain where to make it.
      if (activeState !== NORMAL_STATE) {
        if (isEntryNodeInstance(selection)) {
          addToast(INSTANCE_STATE_EDIT_MESSAGE)
          return
        }
        setNodeStateProperties({
          nodeId: selection.id,
          state: activeState,
          properties,
          options,
        })
        return
      }

      setNodeProperties({
        nodeId: selection.id,
        properties: properties,
        options,
      })
    },
    [
      selection,
      activeState,
      addToast,
      setBoardProperties,
      setNodeProperties,
      setNodeStateProperties,
    ],
  )

  const addNodeLayer = useCallback(
    (property: LayeredPaintKey, seed?: Record<string, unknown>) => {
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) return
      dispatch({
        type: "add_node_layer",
        payload: { nodeId: selection.id, property, seed },
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

  const reorderNodeLayer = useCallback(
    (property: LayeredPaintKey, fromIndex: number, toIndex: number) => {
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) return
      dispatch({
        type: "reorder_node_layer",
        payload: { nodeId: selection.id, property, fromIndex, toIndex },
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
        return
      }

      if (activeState !== NORMAL_STATE) {
        if (isEntryNodeInstance(selection)) {
          addToast(INSTANCE_STATE_EDIT_MESSAGE)
          return
        }
        resetNodeStateProperty({
          nodeId: selection.id,
          state: activeState,
          propertyKey,
          subpropertyKey,
          layerIndex,
        })
        return
      }

      resetNodeProperty({
        nodeId: selection.id,
        propertyKey,
        subpropertyKey,
        layerIndex,
      })
    },
    [
      selection,
      activeState,
      addToast,
      resetNodeProperty,
      resetBoardProperty,
      resetNodeStateProperty,
    ],
  )

  return {
    setNodeProperties,
    setBoardProperties,
    setProperties,
    addNodeLayer,
    removeNodeLayer,
    reorderNodeLayer,
    resetProperty,
  }
}
