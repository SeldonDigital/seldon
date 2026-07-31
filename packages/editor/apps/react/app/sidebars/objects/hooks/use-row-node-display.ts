import { Display, ValueType } from "@seldon/core"
import {
  PROPERTY_ICONS,
  PROPERTY_OPTION_ICONS,
} from "@seldon/core/properties/schemas/data/property-icons"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { nodeTraversalService, typeCheckingService } from "@seldon/core/workspace/services"

import { resolveRowDisplayDecoration } from "./row-display-style"

import type { ComboboxOptionItem, OptionIconRender } from "@app/menus"
import type { useWorkspace } from "@app/workspace/hooks/use-workspace"
import type { IconProps } from "@seldon/components/primitives/Icon"
import type { Properties, Value, VariantId } from "@seldon/core"
import type { EntryNode } from "@seldon/core/workspace/types"
import type { CSSProperties } from "react"

type Workspace = ReturnType<typeof useWorkspace>["workspace"]
type Dispatch = ReturnType<typeof useWorkspace>["dispatch"]

// Neutral Display glyph for the row picker trigger and the Default/Inherit
// options, matching the properties Display control's property icon.
const DISPLAY_NEUTRAL_ICON: string = PROPERTY_ICONS.display

/**
 * Ancestor states that take the Display control off every row beneath them. Display
 * has no meaning inside a parent that is mocked or excluded, and those rows keep
 * their own stored value for when the parent leaves the state.
 */
const STATES_HIDING_CHILD_DISPLAY: ReadonlySet<Display> = new Set([Display.MOCK, Display.EXCLUDE])

interface RowNodeDisplayInput {
  node: EntryNode
  workspace: Workspace
  dispatch: Dispatch
  properties: Properties
  nodeExistsInWorkspace: boolean
  isEcho: boolean
}

interface RowNodeDisplay {
  /** Option groups for the row's `ComboboxListbox` Display picker. */
  displayOptionGroups: ComboboxOptionItem[][]
  /** Current picker value key: "default", "inherit", or a `Display` state. */
  displayValue: string
  /** Applies a picker value, clearing or storing the `display` override. */
  selectDisplay: (value: string) => void
  /** Resolves the Material glyph for a picker option. */
  resolveDisplayOptionIcon: (option?: { value: string; name: string }) => OptionIconRender
  /** Trigger glyph for the row's Display button. */
  displayIcon: IconProps
  /** A mocked or excluded ancestor takes this row's Display control away. */
  isDisplayControlHidden: boolean
  /** Row reads as disabled/gray (hide/stub/mock/exclude in the ancestor chain). */
  isDimmed: boolean
  /** Faded appearance for mock/exclude rows, applied to icon and label leaves. */
  dimStyle?: CSSProperties
  /** Italic label decoration for stub/exclude rows. */
  labelDecorationStyle?: CSSProperties
}

/**
 * Row Display model for a node: the picker options and selection handler, the
 * trigger glyph, and the row's dim/italic decoration composed across the node's
 * instance-ancestor chain. The picker mirrors the properties Display control, so
 * both surfaces read and write the same `display` override.
 */
export function useRowNodeDisplay({
  node,
  workspace,
  dispatch,
  properties,
  nodeExistsInWorkspace,
  isEcho,
}: RowNodeDisplayInput): RowNodeDisplay {
  const ownDisplayValue = properties?.display
  // `display` also stores an inherit value at runtime, which its narrow
  // `DisplayValue` type does not model, so read the tag as a plain string.
  const ownDisplayType: string | undefined = ownDisplayValue?.type
  const currentDisplayKey =
    !ownDisplayValue || ownDisplayType === ValueType.EMPTY
      ? "default"
      : ownDisplayType === ValueType.INHERIT
        ? "inherit"
        : String(ownDisplayValue.value)

  function setDisplay(value: Value) {
    dispatch({
      type: "set_node_properties",
      payload: {
        nodeId: node.id as VariantId,
        properties: { display: value } as Properties,
      },
    })
  }

  function resetDisplay() {
    dispatch({
      type: "reset_node_property",
      payload: { nodeId: node.id as VariantId, propertyKey: "display" },
    })
  }

  // Selecting a display value from the row's picker. "default" clears the
  // override, "inherit" stores an inherit value, and every other value stores
  // the matching option. Mirrors the Display control in the properties sidebar.
  function selectDisplay(value: string) {
    if (value === "default") {
      resetDisplay()
    } else if (value === "inherit") {
      setDisplay({ type: ValueType.INHERIT, value: null })
    } else {
      setDisplay({ type: ValueType.OPTION, value: value as Display })
    }
  }

  // The row Display picker reuses the same floating `ComboboxListbox` as the
  // properties Display control. Two sections: Default/Inherit, then the concrete
  // states. Option values match `currentDisplayKey`.
  const displayOptionGroups: ComboboxOptionItem[][] = isEcho
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
      ]

  // Trigger glyph and every option glyph resolve to a Material icon from the
  // shared property-icon catalog. Default and Inherit use the neutral display
  // icon, so the trigger never swaps icon families (and apparent size) between
  // states, matching the properties Display control.
  function resolveDisplayGlyph(key: string): string {
    if (key === "default" || key === "inherit") {
      return DISPLAY_NEUTRAL_ICON
    }

    return PROPERTY_OPTION_ICONS.display[key] ?? DISPLAY_NEUTRAL_ICON
  }

  function resolveDisplayOptionIcon(option?: { value: string; name: string }): OptionIconRender {
    return {
      kind: "iconId",
      icon: resolveDisplayGlyph(option?.value ?? "default"),
    }
  }

  const displayIcon: IconProps = {
    icon: resolveDisplayGlyph(currentDisplayKey) as IconProps["icon"],
  }

  // Every display the node inherits from its instance-ancestor chain. The walk
  // climbs while each parent is an instance and includes the first non-instance
  // parent, so a variant root's state still reaches its instance children. A
  // non-instance row inherits nothing.
  function collectAncestorDisplayStates(): Display[] {
    if (!nodeExistsInWorkspace || !typeCheckingService.isInstance(node)) {
      return []
    }

    const states: Display[] = []
    let currentParent = nodeTraversalService.findParentNode(node.id, workspace)

    while (currentParent) {
      const parentDisplay = getNodeProperties(currentParent as EntryNode, workspace)?.display?.value

      if (parentDisplay) states.push(parentDisplay)

      if (typeCheckingService.isInstance(currentParent)) {
        currentParent = nodeTraversalService.findParentNode(currentParent.id, workspace)
      } else {
        break
      }
    }

    return states
  }

  const ancestorDisplayStates = collectAncestorDisplayStates()
  const ownDisplayState = nodeExistsInWorkspace ? properties?.display?.value : undefined

  // Row notation for the node's display, composed across its own state and its
  // ancestor chain: dimmed for hide/stub/mock/exclude, italic for stub/exclude.
  // Faded rows drop the gray to a lower opacity. See `resolveRowDisplayDecoration`.
  const {
    isDimmed,
    dimStyle,
    labelStyle: labelDecorationStyle,
  } = resolveRowDisplayDecoration(
    ownDisplayState ? [ownDisplayState, ...ancestorDisplayStates] : ancestorDisplayStates,
  )

  // The row's own state still decides its own control, so a mocked row keeps the
  // picker it takes to leave the state. Only what sits beneath one loses it.
  const isDisplayControlHidden = ancestorDisplayStates.some((state) =>
    STATES_HIDING_CHILD_DISPLAY.has(state),
  )

  return {
    displayOptionGroups,
    displayValue: currentDisplayKey,
    selectDisplay,
    resolveDisplayOptionIcon,
    displayIcon,
    isDisplayControlHidden,
    isDimmed,
    dimStyle,
    labelDecorationStyle,
  }
}
