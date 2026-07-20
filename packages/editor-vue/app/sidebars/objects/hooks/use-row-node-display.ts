import type { ComboboxOptionItem } from "@app/menus/types"
import { useDispatch } from "@app/workspace/use-dispatch"
import { type CSSProperties, type ComputedRef, computed } from "vue"

import { Display, Properties, Value, ValueType, VariantId } from "@seldon/core"
import {
  PROPERTY_ICONS,
  PROPERTY_OPTION_ICONS,
} from "@seldon/core/properties/schemas/data/property-icons"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import {
  nodeTraversalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"

import { resolveRowDisplayDecoration } from "./row-display-style"

/** Neutral Display glyph for the picker trigger and the Default/Inherit options. */
const DISPLAY_NEUTRAL_ICON: string = PROPERTY_ICONS.display

interface RowNodeDisplayInput {
  node: () => EntryNode
  workspace: () => Workspace
  properties: () => Properties
  nodeExistsInWorkspace: () => boolean
  isEcho: boolean
}

/**
 * Row Display model for a node: the picker option groups and selection handler,
 * the trigger glyph, and the row's dim/italic decoration composed across the
 * node's instance-ancestor chain. The picker mirrors the properties Display
 * control, so both surfaces read and write the same `display` override. Mirrors
 * the React `useRowNodeDisplay`.
 */
export function useRowNodeDisplay(input: RowNodeDisplayInput) {
  const dispatch = useDispatch()

  const currentDisplayKey = computed<string>(() => {
    const ownDisplayValue = input.properties()?.display
    const ownDisplayType: string | undefined = ownDisplayValue?.type
    if (!ownDisplayValue || ownDisplayType === ValueType.EMPTY) return "default"
    if (ownDisplayType === ValueType.INHERIT) return "inherit"
    return String(ownDisplayValue.value)
  })

  function setDisplay(value: Value): void {
    dispatch({
      type: "set_node_properties",
      payload: {
        nodeId: input.node().id as VariantId,
        properties: { display: value } as Properties,
      },
    })
  }

  function resetDisplay(): void {
    dispatch({
      type: "reset_node_property",
      payload: { nodeId: input.node().id as VariantId, propertyKey: "display" },
    })
  }

  // "default" clears the override, "inherit" stores an inherit value, and every
  // other value stores the matching option. Mirrors the Display control.
  function selectDisplay(value: string): void {
    if (value === "default") {
      resetDisplay()
    } else if (value === "inherit") {
      setDisplay({ type: ValueType.INHERIT, value: null })
    } else {
      setDisplay({ type: ValueType.OPTION, value: value as Display })
    }
  }

  const displayOptionGroups = computed<ComboboxOptionItem[][]>(() =>
    input.isEcho
      ? []
      : [
          [
            { value: "default", name: "Default" },
            { value: "inherit", name: "Inherit" },
          ],
          [
            { value: Display.SHOW, name: "Show" },
            { value: Display.HIDE, name: "Hide" },
            { value: Display.STUB, name: "Stub" },
            { value: Display.MOCK, name: "Mock" },
            { value: Display.EXCLUDE, name: "Exclude" },
          ],
        ],
  )

  function resolveDisplayGlyph(key: string): string {
    if (key === "default" || key === "inherit") return DISPLAY_NEUTRAL_ICON
    return PROPERTY_OPTION_ICONS.display[key] ?? DISPLAY_NEUTRAL_ICON
  }

  function resolveDisplayOptionIcon(value: string): string {
    return resolveDisplayGlyph(value)
  }

  const displayIcon = computed<string>(() =>
    resolveDisplayGlyph(currentDisplayKey.value),
  )

  // The node's own display plus every display inherited from its instance-
  // ancestor chain. Climbs while each parent is an instance and includes the
  // first non-instance parent, so a variant root's state still reaches its
  // instance children.
  function collectDisplayChainStates(): Display[] {
    if (!input.nodeExistsInWorkspace()) return []

    const node = input.node()
    const workspace = input.workspace()
    const states: Display[] = []
    const ownDisplay = input.properties()?.display?.value
    if (ownDisplay) states.push(ownDisplay)

    if (!typeCheckingService.isInstance(node)) return states

    let currentParent = nodeTraversalService.findParentNode(node.id, workspace)
    while (currentParent) {
      const parentDisplay = getNodeProperties(
        currentParent as EntryNode,
        workspace,
      )?.display?.value
      if (parentDisplay) states.push(parentDisplay)
      if (typeCheckingService.isInstance(currentParent)) {
        currentParent = nodeTraversalService.findParentNode(
          currentParent.id,
          workspace,
        )
      } else {
        break
      }
    }

    return states
  }

  const decoration = computed(() =>
    resolveRowDisplayDecoration(collectDisplayChainStates()),
  )

  const isDimmed = computed<boolean>(() => decoration.value.isDimmed)
  const dimStyle = computed<CSSProperties | undefined>(
    () => decoration.value.dimStyle,
  )
  const labelDecorationStyle = computed<CSSProperties | undefined>(
    () => decoration.value.labelStyle,
  )

  return {
    displayOptionGroups,
    displayValue: currentDisplayKey as ComputedRef<string>,
    selectDisplay,
    resolveDisplayOptionIcon,
    displayIcon,
    isDimmed,
    dimStyle,
    labelDecorationStyle,
  }
}
