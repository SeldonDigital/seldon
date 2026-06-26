import { describe, expect, it } from "vitest"

import { ValueType } from "../../properties/constants"
import { defaultTheme } from "../index"
import {
  getBuiltInLookId,
  getBuiltInLookSectionForPropertyKey,
  getBuiltInLookToken,
  isBuiltInLookSection,
} from "./built-in-looks"
import {
  getThemeLookPickerToken,
  getThemeLookSection,
  isBuiltInClearedLookToken,
  isThemeLookPreset,
  isThemeLookPresetSchemaName,
  listThemeLookIds,
  parseThemeLookRef,
  readPresetThemeLookRef,
  resolveBuiltInLookApplyName,
  resolveThemeLook,
  themeLookRefIsValid,
  validateThemeLookPresetRef,
} from "./resolve-theme-look"

describe("isThemeLookPreset", () => {
  it("matches objects with a string name", () => {
    expect(isThemeLookPreset({ name: "Hairline" })).toBe(true)
    expect(isThemeLookPreset({})).toBe(false)
    expect(isThemeLookPreset(null)).toBe(false)
    expect(isThemeLookPreset("x")).toBe(false)
  })
})

describe("parseThemeLookRef", () => {
  it("splits a valid look ref into section and id", () => {
    expect(parseThemeLookRef("@border.hairline")).toEqual({
      section: "border",
      id: "hairline",
    })
    expect(parseThemeLookRef("@shadow.none")).toEqual({
      section: "shadow",
      id: "none",
    })
  })

  it("returns null for non-refs and unknown sections", () => {
    expect(parseThemeLookRef("hairline")).toBeNull()
    expect(parseThemeLookRef("@border")).toBeNull()
    expect(parseThemeLookRef("@bogus.x")).toBeNull()
  })
})

describe("built-in look section mapping", () => {
  it("identifies look sections and maps property keys", () => {
    expect(isBuiltInLookSection("border")).toBe(true)
    expect(isBuiltInLookSection("margin")).toBe(false)
    expect(getBuiltInLookSectionForPropertyKey("border")).toBe("border")
    expect(getBuiltInLookSectionForPropertyKey("borderTop")).toBe("border")
    expect(getBuiltInLookSectionForPropertyKey("background")).toBe("gradient")
    expect(getBuiltInLookSectionForPropertyKey("color")).toBeNull()
  })

  it("exposes cleared-look ids and tokens", () => {
    expect(getBuiltInLookId("border")).toBe("none")
    expect(getBuiltInLookToken("border")).toBe("@border.none")
    expect(getBuiltInLookId("gradient")).toBeNull()
    expect(getBuiltInLookToken("gradient")).toBeNull()
  })
})

describe("theme look validation", () => {
  it("validates refs against a theme", () => {
    expect(themeLookRefIsValid("@border.none", defaultTheme)).toBe(true)
    expect(themeLookRefIsValid("@border.none")).toBe(false)
    expect(themeLookRefIsValid("@border.none", defaultTheme, "shadow")).toBe(false)
    expect(validateThemeLookPresetRef("border", "@border.none", defaultTheme)).toBe(
      true,
    )
  })
})

describe("theme look lookup", () => {
  it("lists ids with the built-in first", () => {
    const ids = listThemeLookIds(defaultTheme, "border")
    expect(ids[0]).toBe("none")
    expect(ids).toContain("hairline")
  })

  it("reads a look section by property key", () => {
    expect(getThemeLookSection(defaultTheme, "border")).toBeTypeOf("object")
    expect(getThemeLookSection(defaultTheme, "color")).toBeNull()
  })

  it("resolves a look by token and by name", () => {
    expect(resolveThemeLook(defaultTheme, "border", "@border.none")?.name).toBe(
      "None",
    )
    expect(resolveThemeLook(defaultTheme, "border", "None")?.name).toBe("None")
    expect(resolveThemeLook(defaultTheme, "border", "no-such-look")).toBeNull()
  })
})

describe("picker token and cleared-look detection", () => {
  it("builds picker tokens from the resolved section", () => {
    expect(getThemeLookPickerToken("border", "hairline")).toBe("@border.hairline")
    expect(getThemeLookPickerToken("background", "primary")).toBe(
      "@gradient.primary",
    )
    expect(getThemeLookPickerToken("color", "x")).toBe("@color.x")
  })

  it("detects the cleared built-in look token", () => {
    expect(isBuiltInClearedLookToken("border", "@border.none")).toBe(true)
    expect(isBuiltInClearedLookToken("border", "@border.hairline")).toBe(false)
    expect(isBuiltInClearedLookToken("color", "@border.none")).toBe(false)
  })
})

describe("preset schema name and apply name", () => {
  it("recognizes look preset schema names", () => {
    expect(isThemeLookPresetSchemaName("borderPreset")).toBe(true)
    expect(isThemeLookPresetSchemaName("widthPreset")).toBe(false)
  })

  it("resolves the apply name for cleared looks", () => {
    expect(resolveBuiltInLookApplyName("border", "None")).toBe("None")
    expect(resolveBuiltInLookApplyName("border", "")).toBeNull()
    expect(resolveBuiltInLookApplyName("font", "Normal")).toBe("Normal")
    expect(resolveBuiltInLookApplyName("color", "None")).toBeNull()
    expect(resolveBuiltInLookApplyName("gradient", "None")).toBeNull()
  })
})

describe("readPresetThemeLookRef", () => {
  it("reads a categorical preset ref off a layer", () => {
    expect(
      readPresetThemeLookRef({
        preset: { type: ValueType.THEME_CATEGORICAL, value: "@border.none" },
      }),
    ).toBe("@border.none")
    expect(readPresetThemeLookRef({})).toBeNull()
  })
})
