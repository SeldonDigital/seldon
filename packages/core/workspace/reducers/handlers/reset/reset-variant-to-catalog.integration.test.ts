import { describe, expect, it } from "vitest"

import { ComponentId } from "../../../../components/constants"
import { ValueType } from "../../../../properties/constants"
import { createEmptyWorkspace } from "../../../helpers/create-empty-workspace"
import type { EntryNode, ExtractPayload, Workspace } from "../../../types"
import { addComponent } from "../add/add-component"
import { setNodeProperties } from "../set/set-node-properties"
import { resetVariantToCatalog } from "./reset-variant-to-catalog"

const workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)
const board = workspace.boards[ComponentId.BUTTON]!
const defaultRootId = board.variants[0]!.id
const userVariantId = board.variants[1]!.id

const overridesOf = (ws: Workspace, id: string) =>
  (ws.nodes[id] as EntryNode).overrides as Record<string, unknown>

describe("resetVariantToCatalog", () => {
  it("rebuilds a user variant, dropping ad-hoc overrides", () => {
    const withOverride = setNodeProperties(
      {
        nodeId: userVariantId,
        properties: { opacity: { type: ValueType.EXACT, value: 25 } },
      } as ExtractPayload<"set_node_properties">,
      workspace,
    )
    expect(overridesOf(withOverride, userVariantId).opacity).toBeDefined()

    const reset = resetVariantToCatalog(
      {
        variantRootId: userVariantId,
      } as ExtractPayload<"reset_variant_to_catalog">,
      withOverride,
    )
    expect(overridesOf(reset, userVariantId).opacity).toBeUndefined()
  })

  it("is a no-op for a default variant root", () => {
    expect(
      resetVariantToCatalog(
        {
          variantRootId: defaultRootId,
        } as ExtractPayload<"reset_variant_to_catalog">,
        workspace,
      ),
    ).toBe(workspace)
  })
})
