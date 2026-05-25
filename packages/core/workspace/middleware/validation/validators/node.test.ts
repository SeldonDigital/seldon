import { describe, expect, it } from "bun:test"
import { ComponentId } from "@seldon/core/components/constants"
import { rules } from "@seldon/core/rules/config/rules.config"
import {
  assertInsertTargetAllowed,
  validateComponentCanBeInserted,
} from "./node"
import { WorkspaceValidationError } from "../workspace-validation-error"
import type { EntryNode, Workspace } from "../../../types"

describe("assertInsertTargetAllowed", () => {
  it("blocks insert into default variant nodes", () => {
    const parent: EntryNode = {
      id: "variant-default",
      type: "default",
      level: "element",
      label: "Default",
      theme: null,
      template: "catalog:button",
      overrides: {},
    }

    expect(() =>
      assertInsertTargetAllowed(parent, {
        type: "insert_default_instance",
        payload: {
          parentId: parent.id,
          componentKey: ComponentId.LABEL,
        },
      }),
    ).toThrow(WorkspaceValidationError)
  })

  it("allows insert into user variant nodes", () => {
    const parent: EntryNode = {
      id: "variant-user",
      type: "variant",
      level: "element",
      label: "Custom",
      theme: null,
      template: "catalog:button",
      overrides: {},
    }

    expect(rules.mutations.insertInto.userVariant.allowed).toBe(true)
    expect(() =>
      assertInsertTargetAllowed(parent, {
        type: "insert_default_instance",
        payload: {
          parentId: parent.id,
          componentKey: ComponentId.LABEL,
        },
      }),
    ).not.toThrow()
  })
})

describe("validateComponentCanBeInserted", () => {
  it("reports parent-child level violations for UI filtering", () => {
    const workspace = {
      nodes: {
        "label-instance": {
          id: "label-instance",
          type: "instance",
          level: "primitive",
          label: "Label",
          theme: null,
          template: "catalog:label",
          overrides: {},
        },
      },
    } as Workspace

    const result = validateComponentCanBeInserted(
      ComponentId.BUTTON,
      "label-instance",
      workspace,
    )

    expect(result.isValid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })
})
