/**
 * The reducer-purity pre-flight gate for batch atomicity.
 *
 * `apply_actions` promises all-or-nothing batches by folding actions through
 * Core's `workspaceReducer` and discarding the result on any failure. That
 * only holds if the reducer (handlers + middleware) never mutates the input
 * workspace object. Core's handler tests assert outputs, not input
 * immutability, so this suite closes exactly that gap:
 *
 * 1. every whitelist-exposed action type, dispatched with an accepted payload,
 *    leaves the input workspace deep-equal to its pre-dispatch snapshot;
 * 2. rejected actions (validation throws) leave the input untouched;
 * 3. a batch through `applyActions` that fails at any position leaves the
 *    input untouched — the batch-atomicity property itself;
 * 4. randomized (seeded) batches of exposed actions never corrupt the input,
 *    whether they succeed or throw mid-batch.
 *
 * Failures here are Core bug reports, not MCP bugs (coordinate with the Core
 * owner).
 */
import { describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { ValueType } from "@seldon/core/properties/constants"
import { Unit } from "@seldon/core/properties/constants/shared/units"
import { Colorspace } from "@seldon/core/themes/constants/colorspace"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type { Workspace, WorkspaceAction } from "@seldon/core/workspace/types"

import { EXPOSED_ACTION_TYPES } from "../action-whitelist"

type TreeRef = { id: string; children?: TreeRef[] }

/**
 * Payloads are authored as plain objects and cast at the dispatch site, the
 * same pragmatism Core's own handler tests use (`as ExtractPayload<…>`); the
 * coverage test below keeps the case table honest against the whitelist.
 */
type CaseAction = { type: string; payload: unknown }

const PLAYGROUND_KEY = "playground-purity"
const VARIANT_THEME_ID = "theme-seldon-copy"

/**
 * One workspace with enough structure to feed every exposed action a payload
 * Core accepts: the Button board (ships catalog variants with icon/text
 * children), a playground with one sandbox, a variant-type theme entry
 * (custom tokens are no-ops on default entries), and seeded node overrides so
 * the reset actions have something to reset.
 */
function buildFixture() {
  let ws: Workspace = createEmptyWorkspace()
  const dispatch = (action: CaseAction) => {
    ws = workspaceReducer(ws, action as WorkspaceAction)
  }

  dispatch({ type: "add_component", payload: { boardKey: ComponentId.BUTTON } })
  dispatch({ type: "add_playground", payload: { boardKey: PLAYGROUND_KEY } })
  dispatch({
    type: "duplicate_theme",
    payload: {
      themeId: "theme-seldon-default",
      newThemeId: VARIANT_THEME_ID,
    },
  })

  const board = ws.boards[ComponentId.BUTTON] as unknown as {
    variants: TreeRef[]
  }
  const variant = (id: string): TreeRef => {
    const ref = board.variants.find((v) => v.id === id)
    if (!ref) throw new Error(`fixture: missing catalog variant ${id}`)
    return ref
  }
  const labelVariant = variant("component-button-label")
  const iconicVariant = variant("component-button-iconic")
  const toolsVariant = variant("component-button-tools")
  const labelChild = labelVariant.children![0]!.id
  const toolsChild = toolsVariant.children![0]!.id
  const sandboxId = (
    ws.playgrounds[PLAYGROUND_KEY] as unknown as { variants: TreeRef[] }
  ).variants[0]!.id

  // Seed overrides so reset_node / reset_instance_to_source /
  // reset_node_property observably change something.
  dispatch({
    type: "set_node_properties",
    payload: {
      nodeId: labelVariant.id,
      properties: { opacity: { type: ValueType.EXACT, value: 55 } },
    },
  })
  dispatch({
    type: "set_node_properties",
    payload: {
      nodeId: labelChild,
      properties: { opacity: { type: ValueType.EXACT, value: 45 } },
    },
  })

  return {
    ws,
    labelVariantId: labelVariant.id,
    iconicVariantId: iconicVariant.id,
    toolsVariantId: toolsVariant.id,
    labelChild,
    toolsChild,
    sandboxId,
  }
}

type Fixture = ReturnType<typeof buildFixture>

/** One accepted payload per exposed concrete action type (verified to change the workspace). */
function exposedActionCases(fixture: Fixture): CaseAction[] {
  const {
    labelVariantId,
    iconicVariantId,
    toolsVariantId,
    labelChild,
    toolsChild,
    sandboxId,
  } = fixture

  const customTokenBase = {
    themeId: VARIANT_THEME_ID,
    name: "Purity Probe",
    intent: "purity probe token",
  }
  const exactLength = { unit: Unit.PX, value: 12 }

  return [
    // Structure (10)
    { type: "add_component", payload: { boardKey: ComponentId.CHIP } },
    {
      type: "add_component_and_insert_default_instance",
      payload: {
        boardKey: ComponentId.CARD_STACKED,
        target: { parentId: sandboxId, index: 0 },
      },
    },
    { type: "remove_component", payload: { boardKey: ComponentId.BUTTON } },
    { type: "add_variant", payload: { boardKey: ComponentId.BUTTON } },
    {
      type: "insert_default_instance",
      payload: {
        parentId: labelVariantId,
        boardKey: ComponentId.ICON,
        index: 0,
      },
    },
    {
      type: "insert_variant_instance",
      payload: {
        variantId: iconicVariantId,
        target: { parentId: sandboxId, index: 0 },
      },
    },
    { type: "remove_instance", payload: { instanceId: labelChild } },
    {
      // Moves are only legal within the same variant tree; a cross-variant
      // move is rejected ("cannot be moved to a different variant or board").
      type: "move_instance",
      payload: {
        instanceId: toolsChild,
        target: { parentId: toolsVariantId, index: 2 },
      },
    },
    {
      type: "reorder_instance_in_parent",
      payload: { instanceId: toolsChild, newIndex: 2 },
    },
    { type: "duplicate_node", payload: { nodeId: iconicVariantId } },

    // Styling (5)
    {
      type: "set_node_properties",
      payload: {
        nodeId: iconicVariantId,
        properties: { opacity: { type: ValueType.EXACT, value: 40 } },
      },
    },
    {
      type: "reset_node_property",
      payload: { nodeId: labelVariantId, propertyKey: "opacity" },
    },
    {
      type: "set_node_label",
      payload: { nodeId: labelVariantId, label: "Purity Probe" },
    },
    {
      type: "add_node_layer",
      payload: { nodeId: labelVariantId, property: "background" },
    },
    {
      type: "set_node_state_properties",
      payload: {
        nodeId: labelVariantId,
        state: "hover",
        properties: { opacity: { type: ValueType.EXACT, value: 80 } },
      },
    },

    // Theming (4 + the 18 custom-token variants)
    { type: "add_theme", payload: { boardKey: "earth" } },
    {
      type: "set_theme_override",
      payload: {
        themeId: VARIANT_THEME_ID,
        path: "color.primary.value",
        value: "#123456",
      },
    },
    {
      type: "set_component_theme",
      payload: {
        boardKey: ComponentId.BUTTON,
        theme: "theme-googleMaterial-default",
      },
    },
    {
      type: "set_node_theme",
      payload: {
        nodeId: labelVariantId,
        theme: "theme-googleMaterial-default",
      },
    },
    {
      type: "add_theme_custom_swatch",
      payload: {
        ...customTokenBase,
        parameters: { colorspace: Colorspace.HEX, value: "#112233" },
      },
    },
    {
      type: "add_theme_custom_font",
      payload: { ...customTokenBase, parameters: {} },
    },
    {
      type: "add_theme_custom_border",
      payload: { ...customTokenBase, parameters: {} },
    },
    {
      type: "add_theme_custom_gradient",
      payload: { ...customTokenBase, parameters: {} },
    },
    {
      type: "add_theme_custom_shadow",
      payload: { ...customTokenBase, parameters: {} },
    },
    {
      type: "add_theme_custom_scrollbar",
      payload: { ...customTokenBase, parameters: {} },
    },
    {
      type: "add_theme_custom_size",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_dimension",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_margin",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_padding",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_gap",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_corners",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_borderWidth",
      payload: { ...customTokenBase, parameters: { factor: 1 } },
    },
    {
      type: "add_theme_custom_blur",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_spread",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_fontSize",
      payload: { ...customTokenBase, kind: "exact", parameters: exactLength },
    },
    {
      type: "add_theme_custom_fontWeight",
      payload: {
        ...customTokenBase,
        parameters: { unit: Unit.NUMBER, value: 600 },
      },
    },
    {
      type: "add_theme_custom_lineHeight",
      payload: {
        ...customTokenBase,
        parameters: { unit: Unit.NUMBER, value: 1.4 },
      },
    },

    // Recovery (3)
    { type: "reset_node", payload: { nodeId: labelVariantId } },
    { type: "reset_instance_to_source", payload: { instanceId: labelChild } },
    {
      type: "reset_component_to_catalog",
      payload: { boardKey: ComponentId.BUTTON },
    },

    // Workflow (1)
    { type: "add_sandbox", payload: { playgroundKey: PLAYGROUND_KEY } },
  ]
}

/** Payloads Core's validation middleware rejects with a thrown error. */
function rejectedActionCases(fixture: Fixture): Array<[string, CaseAction]> {
  return [
    [
      "unknown node id",
      {
        type: "set_node_properties",
        payload: {
          nodeId: "component-button-Ghost000",
          properties: { opacity: { type: ValueType.EXACT, value: 40 } },
        },
      },
    ],
    [
      "insert into the default catalog variant",
      {
        type: "insert_default_instance",
        payload: {
          parentId: "component-button-default",
          boardKey: ComponentId.ICON,
          index: 0,
        },
      },
    ],
    [
      "remove an unknown instance",
      {
        type: "remove_instance",
        payload: { instanceId: "component-icon-Ghost000" },
      },
    ],
    [
      "custom token on a default theme entry",
      {
        type: "add_theme_custom_swatch",
        payload: {
          themeId: "theme-seldon-default",
          name: "X",
          parameters: { colorspace: Colorspace.HEX, value: "#112233" },
        },
      },
    ],
    [
      "move across variant trees",
      {
        type: "move_instance",
        payload: {
          instanceId: fixture.toolsChild,
          target: { parentId: fixture.labelVariantId, index: 0 },
        },
      },
    ],
  ]
}

/** Deterministic PRNG (mulberry32) so the randomized rounds are reproducible. */
function mulberry32(seed: number) {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const fixture = buildFixture()
const pristine = structuredClone(fixture.ws)
const validCases = exposedActionCases(fixture)

describe("exposed-action coverage", () => {
  it("has exactly one accepted payload per exposed concrete action type", () => {
    const covered = validCases.map((c) => c.type)
    expect(new Set(covered)).toEqual(new Set(EXPOSED_ACTION_TYPES))
    expect(covered).toHaveLength(EXPOSED_ACTION_TYPES.length)
  })
})

describe("workspaceReducer purity — accepted actions", () => {
  it.each(validCases.map((c) => [c.type, c] as const))(
    "%s returns a new workspace and leaves the input untouched",
    (_type, action) => {
      const result = workspaceReducer(fixture.ws, action as WorkspaceAction)

      // Purity: the input object is byte-for-byte what it was before dispatch.
      expect(fixture.ws).toEqual(pristine)
      // Guard against fixture rot: the payload must actually be accepted and
      // change something, otherwise this case stops exercising the write path.
      expect(result).not.toBe(fixture.ws)
      expect(result).not.toEqual(pristine)
    },
  )
})

describe("workspaceReducer purity — rejected actions", () => {
  it.each(rejectedActionCases(fixture))(
    "%s throws and leaves the input untouched",
    (_name, action) => {
      expect(() =>
        workspaceReducer(fixture.ws, action as WorkspaceAction),
      ).toThrow()
      expect(fixture.ws).toEqual(pristine)
    },
  )
})

describe("applyActions batch atomicity", () => {
  const failing: CaseAction = {
    type: "set_node_properties",
    payload: {
      nodeId: "component-button-Ghost000",
      properties: { opacity: { type: ValueType.EXACT, value: 40 } },
    },
  }
  const valid = (index: number): CaseAction => validCases[index]!

  it.each([
    ["first", [failing, valid(0), valid(3)]],
    ["middle", [valid(0), failing, valid(3)]],
    ["last", [valid(0), valid(3), failing]],
  ])(
    "a batch failing at the %s action leaves the input untouched",
    (_position, batch) => {
      expect(() =>
        applyActions(fixture.ws, batch as WorkspaceAction[]),
      ).toThrow()
      expect(fixture.ws).toEqual(pristine)
    },
  )

  it("a fully valid batch returns a new workspace and leaves the input untouched", () => {
    const result = applyActions(fixture.ws, [
      valid(3),
      valid(10),
      valid(12),
    ] as WorkspaceAction[])
    expect(result).not.toBe(fixture.ws)
    expect(fixture.ws).toEqual(pristine)
  })
})

describe("randomized batches never corrupt the input workspace", () => {
  const random = mulberry32(0x5e1d0e)
  const rounds = Array.from({ length: 30 }, (_, i) => i)

  it.each(rounds)("seeded round %i", () => {
    const size = 1 + Math.floor(random() * 6)
    const batch = Array.from(
      { length: size },
      () => validCases[Math.floor(random() * validCases.length)]!,
    )

    // Random combinations may fail validation mid-batch (e.g. adding the same
    // board twice); success is not the property under test — input purity is.
    try {
      applyActions(fixture.ws, batch as WorkspaceAction[])
    } catch {
      // expected for some sequences
    }

    expect(fixture.ws).toEqual(pristine)
  })
})
