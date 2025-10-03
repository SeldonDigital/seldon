import { expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "../../../../components/constants"
import customTheme from "../../../../themes/custom"
import { Workspace } from "../../../types"
import { handleRemoveBoard } from "./handle-remove-board"

it("should remove a board and all its variants while preserving other boards", () => {
  const workspace: Workspace = {
    version: 1,
    boards: {
      button: {
        id: ComponentId.BUTTON,
        label: "Button",
        order: 0,
        theme: "default",
        variants: ["variant-button-default"],
        properties: {},
      },
      icon: {
        id: ComponentId.ICON,
        label: "Icon",
        order: 1,
        theme: "default",
        variants: ["variant-icon-default"],
        properties: {},
      },
    },
    byId: {
      "variant-button-default": {
        id: "variant-button-default",
        component: ComponentId.BUTTON,
        children: [],
        isChild: false,
        fromSchema: true,
        level: ComponentLevel.ELEMENT,
        theme: null,
        type: "defaultVariant",
        properties: {},
        label: "Default",
      },
      "variant-icon-default": {
        id: "variant-icon-default",
        component: ComponentId.ICON,
        children: [],
        isChild: false,
        fromSchema: true,
        level: ComponentLevel.PRIMITIVE,
        theme: null,
        type: "defaultVariant",
        properties: {},
        label: "Default",
      },
    },
    customTheme,
  }

  const result = handleRemoveBoard(
    {
      componentId: ComponentId.BUTTON,
    },
    workspace,
  )

  // Button board should be removed
  expect(result.boards.button).toBeUndefined()
  // Icon board should remain
  const iconBoard = result.boards.icon
  expect(iconBoard).toBeDefined()
  // Icon board order remains unchanged
  expect(iconBoard!.order).toBe(1)
  // Button variant should be removed
  expect(result.byId["variant-button-default"]).toBeUndefined()
  // Icon variant should remain
  expect(result.byId["variant-icon-default"]).toBeDefined()
})

it("should remove a board and all its variants including user-created variants", () => {
  const workspace: Workspace = {
    version: 1,
    boards: {
      button: {
        id: ComponentId.BUTTON,
        label: "Button",
        order: 0,
        theme: "default",
        variants: ["variant-button-default", "variant-button-secondary"],
        properties: {},
      },
    },
    byId: {
      "variant-button-default": {
        id: "variant-button-default",
        component: ComponentId.BUTTON,
        children: [],
        isChild: false,
        fromSchema: true,
        level: ComponentLevel.ELEMENT,
        theme: null,
        type: "defaultVariant",
        properties: {},
        label: "Default",
      },
      "variant-button-secondary": {
        id: "variant-button-secondary",
        component: ComponentId.BUTTON,
        children: [],
        isChild: false,
        fromSchema: false,
        level: ComponentLevel.ELEMENT,
        theme: null,
        type: "userVariant",
        label: "Secondary Button",
        instanceOf: "variant-button-default",
        properties: {},
      },
    },
    customTheme,
  }

  const result = handleRemoveBoard(
    {
      componentId: ComponentId.BUTTON,
    },
    workspace,
  )

  // Button board should be removed
  expect(result.boards.button).toBeUndefined()
  // Both button variants should be removed
  expect(result.byId["variant-button-default"]).toBeUndefined()
  expect(result.byId["variant-button-secondary"]).toBeUndefined()
})

it("should not modify the workspace when attempting to remove a non-existent board", () => {
  const workspace: Workspace = {
    version: 1,
    boards: {
      button: {
        id: ComponentId.BUTTON,
        label: "Button",
        order: 0,
        theme: "default",
        variants: ["variant-button-default"],
        properties: {},
      },
    },
    byId: {
      "variant-button-default": {
        id: "variant-button-default",
        component: ComponentId.BUTTON,
        children: [],
        isChild: false,
        fromSchema: true,
        level: ComponentLevel.ELEMENT,
        theme: null,
        type: "defaultVariant",
        properties: {},
        label: "Default",
      },
    },
    customTheme,
  }

  const result = handleRemoveBoard(
    {
      componentId: ComponentId.ICON,
    },
    workspace,
  )

  // Workspace should remain unchanged
  expect(result).toEqual(workspace)
})
