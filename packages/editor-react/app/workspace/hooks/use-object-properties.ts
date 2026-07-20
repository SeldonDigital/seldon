import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
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

import { useDispatch } from "./use-dispatch"
import {
  INSTANCE_STATE_EDIT_MESSAGE,
  getActiveStateForNode,
} from "./use-node-active-state"
import { getCurrentSelection } from "./use-selection"

/**
 * Property mutation commands for the selected node or board. The commands read
 * the live selection and active state through non-subscribing snapshots at call
 * time, so consumers (property rows) get stable callbacks and do not re-render
 * on every workspace edit.
 */
export function useObjectProperties() {
  const dispatch = useDispatch()
  const addToast = useAddToast()

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

  const applyBoardPropertiesToAllBoards = useCallback(
    (input: ExtractPayload<"apply_component_properties_to_all_boards">) => {
      dispatch({
        type: "apply_component_properties_to_all_boards",
        payload: input,
      })
    },
    [dispatch],
  )

  const resetComponentBoard = useCallback(
    (input: ExtractPayload<"reset_component_board">) => {
      dispatch({
        type: "reset_component_board",
        payload: input,
      })
    },
    [dispatch],
  )

  const setProperties = useCallback(
    (properties: Properties, options?: { mergeSubProperties?: boolean }) => {
      const selection = getCurrentSelection()
      invariant(selection, "Nothing selected")
      const activeState = getActiveStateForNode(selection)
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
    [addToast, setBoardProperties, setNodeProperties, setNodeStateProperties],
  )

  const addNodeLayer = useCallback(
    (property: LayeredPaintKey, seed?: Record<string, unknown>) => {
      const selection = getCurrentSelection()
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) return
      dispatch({
        type: "add_node_layer",
        payload: { nodeId: selection.id, property, seed },
      })
    },
    [dispatch],
  )

  const removeNodeLayer = useCallback(
    (property: LayeredPaintKey, index: number) => {
      const selection = getCurrentSelection()
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) return
      dispatch({
        type: "remove_node_layer",
        payload: { nodeId: selection.id, property, index },
      })
    },
    [dispatch],
  )

  const reorderNodeLayer = useCallback(
    (property: LayeredPaintKey, fromIndex: number, toIndex: number) => {
      const selection = getCurrentSelection()
      invariant(selection, "Nothing selected")
      if (isBoard(selection)) return
      dispatch({
        type: "reorder_node_layer",
        payload: { nodeId: selection.id, property, fromIndex, toIndex },
      })
    },
    [dispatch],
  )

  const resetProperty = useCallback(
    (
      propertyKey: PropertyKey,
      subpropertyKey?: SubPropertyKey,
      layerIndex?: number,
    ) => {
      const selection = getCurrentSelection()
      invariant(selection, "Nothing selected")
      const activeState = getActiveStateForNode(selection)

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
    [addToast, resetNodeProperty, resetBoardProperty, resetNodeStateProperty],
  )

  return {
    setNodeProperties,
    setBoardProperties,
    applyBoardPropertiesToAllBoards,
    resetComponentBoard,
    setProperties,
    addNodeLayer,
    removeNodeLayer,
    reorderNodeLayer,
    resetProperty,
  }
}
