import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties/constants"
import type { ExtractPayload } from "../../../../index"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import { addComponent } from "../add/add-component"
import { addCustomState } from "../add/add-custom-state"
import { setNodeStateProperties } from "../set/set-node-state-properties"
import { removeCustomState } from "./remove-custom-state"

describe("removeCustomState", () => {
  it("drops the registry entry and strips the state from nodes", () => {
    const withButton = addComponent(
      { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
      createEmptyWorkspace(),
    )
    const nodeId = withButton.boards[ComponentId.BUTTON]!.variants[0]!.id

    const registered = addCustomState(
      { key: "warning", label: "Warning" } as ExtractPayload<"add_custom_state">,
      withButton,
    )
    const withState = setNodeStateProperties(
      {
        nodeId,
        state: "warning",
        properties: { opacity: { type: ValueType.EXACT, value: 0.5 } },
      } as ExtractPayload<"set_node_state_properties">,
      registered,
    )
    expect(withState.nodes[nodeId]!.states?.warning).toBeDefined()

    const removed = removeCustomState(
      { key: "warning" } as ExtractPayload<"remove_custom_state">,
      withState,
    )

    expect(
      (removed.metadata.customStates ?? []).some((s) => s.key === "warning"),
    ).toBe(false)
    expect(removed.nodes[nodeId]!.states?.warning).toBeUndefined()
  })
})
