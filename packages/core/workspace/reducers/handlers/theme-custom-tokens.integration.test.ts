import { produce } from "immer"
import { describe, expect, it } from "vitest"

import type { ExtractPayload, Workspace } from "../../../index"
import { createEmptyWorkspace } from "../../helpers/create-empty-workspace"
import { addThemeCustomBlur } from "./add/add-theme-custom-blur"
import { addThemeCustomBorder } from "./add/add-theme-custom-border"
import { addThemeCustomBorderWidth } from "./add/add-theme-custom-border-width"
import { addThemeCustomCorners } from "./add/add-theme-custom-corners"
import { addThemeCustomDimension } from "./add/add-theme-custom-dimension"
import { addThemeCustomFont } from "./add/add-theme-custom-font"
import { addThemeCustomFontSize } from "./add/add-theme-custom-font-size"
import { addThemeCustomFontWeight } from "./add/add-theme-custom-font-weight"
import { addThemeCustomGap } from "./add/add-theme-custom-gap"
import { addThemeCustomGradient } from "./add/add-theme-custom-gradient"
import { addThemeCustomLineHeight } from "./add/add-theme-custom-line-height"
import { addThemeCustomMargin } from "./add/add-theme-custom-margin"
import { addThemeCustomPadding } from "./add/add-theme-custom-padding"
import { addThemeCustomScrollbar } from "./add/add-theme-custom-scrollbar"
import { addThemeCustomShadow } from "./add/add-theme-custom-shadow"
import { addThemeCustomSize } from "./add/add-theme-custom-size"
import { addThemeCustomSpread } from "./add/add-theme-custom-spread"
import { duplicateTheme } from "./duplicate/duplicate-theme"
import { removeThemeCustomBackground } from "./remove/remove-theme-custom-background"
import { removeThemeCustomBlur } from "./remove/remove-theme-custom-blur"
import { removeThemeCustomBorder } from "./remove/remove-theme-custom-border"
import { removeThemeCustomBorderWidth } from "./remove/remove-theme-custom-border-width"
import { removeThemeCustomCorners } from "./remove/remove-theme-custom-corners"
import { removeThemeCustomDimension } from "./remove/remove-theme-custom-dimension"
import { removeThemeCustomFont } from "./remove/remove-theme-custom-font"
import { removeThemeCustomFontSize } from "./remove/remove-theme-custom-font-size"
import { removeThemeCustomFontWeight } from "./remove/remove-theme-custom-font-weight"
import { removeThemeCustomGap } from "./remove/remove-theme-custom-gap"
import { removeThemeCustomGradient } from "./remove/remove-theme-custom-gradient"
import { removeThemeCustomLineHeight } from "./remove/remove-theme-custom-line-height"
import { removeThemeCustomMargin } from "./remove/remove-theme-custom-margin"
import { removeThemeCustomPadding } from "./remove/remove-theme-custom-padding"
import { removeThemeCustomScrollbar } from "./remove/remove-theme-custom-scrollbar"
import { removeThemeCustomShadow } from "./remove/remove-theme-custom-shadow"
import { removeThemeCustomSize } from "./remove/remove-theme-custom-size"
import { removeThemeCustomSpread } from "./remove/remove-theme-custom-spread"

const defaultThemeId = "theme-seldon-default"
const variantThemeId = "theme-seldon-copy"

type Handler = (payload: never, workspace: Workspace) => Workspace

const variantWorkspace = () =>
  duplicateTheme(
    {
      themeId: defaultThemeId,
      newThemeId: variantThemeId,
    } as ExtractPayload<"duplicate_theme">,
    createEmptyWorkspace(),
  )

const addPayload = (themeId: string) =>
  ({
    themeId,
    name: "Custom Token",
    intent: "test",
    kind: "exact",
    parameters: {},
  }) as never

const removePayload = (themeId: string) =>
  ({ themeId, key: "custom1" }) as never

const section = (ws: Workspace, key: string) =>
  ((ws.themes[variantThemeId]!.overrides as Record<string, unknown>)[key] ??
    {}) as Record<string, unknown>

const ADD_CASES: Array<[string, Handler]> = [
  ["font", addThemeCustomFont as Handler],
  ["border", addThemeCustomBorder as Handler],
  ["gradient", addThemeCustomGradient as Handler],
  ["shadow", addThemeCustomShadow as Handler],
  ["scrollbar", addThemeCustomScrollbar as Handler],
  ["size", addThemeCustomSize as Handler],
  ["dimension", addThemeCustomDimension as Handler],
  ["margin", addThemeCustomMargin as Handler],
  ["padding", addThemeCustomPadding as Handler],
  ["gap", addThemeCustomGap as Handler],
  ["corners", addThemeCustomCorners as Handler],
  ["borderWidth", addThemeCustomBorderWidth as Handler],
  ["blur", addThemeCustomBlur as Handler],
  ["spread", addThemeCustomSpread as Handler],
  ["fontSize", addThemeCustomFontSize as Handler],
  ["fontWeight", addThemeCustomFontWeight as Handler],
  ["lineHeight", addThemeCustomLineHeight as Handler],
]

const REMOVE_CASES: Array<[string, Handler]> = [
  ["font", removeThemeCustomFont as Handler],
  ["border", removeThemeCustomBorder as Handler],
  ["background", removeThemeCustomBackground as Handler],
  ["gradient", removeThemeCustomGradient as Handler],
  ["shadow", removeThemeCustomShadow as Handler],
  ["scrollbar", removeThemeCustomScrollbar as Handler],
  ["size", removeThemeCustomSize as Handler],
  ["dimension", removeThemeCustomDimension as Handler],
  ["margin", removeThemeCustomMargin as Handler],
  ["padding", removeThemeCustomPadding as Handler],
  ["gap", removeThemeCustomGap as Handler],
  ["corners", removeThemeCustomCorners as Handler],
  ["borderWidth", removeThemeCustomBorderWidth as Handler],
  ["blur", removeThemeCustomBlur as Handler],
  ["spread", removeThemeCustomSpread as Handler],
  ["fontSize", removeThemeCustomFontSize as Handler],
  ["fontWeight", removeThemeCustomFontWeight as Handler],
  ["lineHeight", removeThemeCustomLineHeight as Handler],
]

describe("add_theme_custom_* handlers", () => {
  it.each(ADD_CASES)(
    "%s appends a custom slot to a variant theme",
    (key, handler) => {
      const next = handler(addPayload(variantThemeId), variantWorkspace())
      expect(section(next, key).custom1).toBeDefined()
    },
  )

  it.each(ADD_CASES)(
    "%s is a no-op for a default theme entry",
    (_key, handler) => {
      const workspace = variantWorkspace()
      expect(handler(addPayload(defaultThemeId), workspace)).toBe(workspace)
    },
  )
})

describe("remove_theme_custom_* handlers", () => {
  it.each(REMOVE_CASES)(
    "%s drops a custom slot from a variant theme",
    (key, handler) => {
      const seeded = produce(variantWorkspace(), (draft) => {
        ;(draft.themes[variantThemeId]!.overrides as Record<string, unknown>)[
          key
        ] = {
          custom1: { name: "seed" },
        }
      })
      const removed = handler(removePayload(variantThemeId), seeded)
      expect(section(removed, key).custom1).toBeUndefined()
    },
  )

  it.each(REMOVE_CASES)(
    "%s is a no-op for a default theme entry",
    (_key, handler) => {
      const workspace = variantWorkspace()
      expect(handler(removePayload(defaultThemeId), workspace)).toBe(workspace)
    },
  )
})
