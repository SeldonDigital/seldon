import { expect, test } from "bun:test"
import theme from "@seldon/core/themes/default"
import { generateThemeValues } from "./generate-theme-values"

test("generateThemeValues", () => {
  const generated = generateThemeValues(theme)
  expect(generated.size.small.value).toBeTypeOf("number")
  expect(generated.dimension.medium.value).toBeTypeOf("number")
  expect(generated.margin.comfortable.value).toBeTypeOf("number")
  expect(generated.padding.comfortable.value).toBeTypeOf("number")
  expect(generated.gap.comfortable.value).toBeTypeOf("number")
  expect(generated.corners.cozy.value).toBeTypeOf("number")
  expect(generated.borderWidth.medium.value).toBeTypeOf("number")
})
