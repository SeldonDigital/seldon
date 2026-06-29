import { describe, expect, it } from "vitest"

import { getCssStringFromCssObject } from "./get-css-string-from-css-object"

describe("getCssStringFromCssObject", () => {
  it("renders a single declaration scoped to the class", () => {
    expect(getCssStringFromCssObject({ color: "red" }, "my-class")).toBe(
      ".my-class {color: red;}",
    )
  })

  it("kebab-cases camelCase property keys", () => {
    expect(
      getCssStringFromCssObject({ backgroundColor: "blue" }, "x"),
    ).toBe(".x {background-color: blue;}")
  })

  it("joins multiple declarations with newlines", () => {
    expect(
      getCssStringFromCssObject({ color: "red", margin: "0" }, "x"),
    ).toBe(".x {color: red;\nmargin: 0;}")
  })

  it("filters out undefined, null, and empty string values", () => {
    expect(
      getCssStringFromCssObject(
        {
          color: "red",
          margin: undefined,
          // null and "" are filtered as invalid CSS values
          padding: null as unknown as string,
          border: "",
        },
        "x",
      ),
    ).toBe(".x {color: red;}")
  })

  it("emits an empty rule when no valid values remain", () => {
    expect(getCssStringFromCssObject({}, "x")).toBe(".x {}")
    expect(
      getCssStringFromCssObject({ color: undefined }, "x"),
    ).toBe(".x {}")
  })

  it("uses a provided full selector instead of the class", () => {
    expect(
      getCssStringFromCssObject({ color: "red" }, "x", ".x:hover"),
    ).toBe(".x:hover {color: red;}")
  })

  it("uses the provided selector even for an empty rule", () => {
    expect(getCssStringFromCssObject({}, "x", ".x:hover")).toBe(".x:hover {}")
  })
})
