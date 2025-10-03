import { describe, expect, it } from "bun:test"
import { ValueType } from "../../index"
import {
  background,
  border,
  corners,
  font,
  gradient,
  margin,
  padding,
  shadow,
} from "./compound-properties"

describe("compound-properties", () => {
  it("should export font with theme preset", () => {
    expect(font.preset).toEqual({
      type: ValueType.THEME_CATEGORICAL,
      value: "@font.body",
    })
    expect(font.family).toEqual({ type: ValueType.EMPTY, value: null })
    expect(font.size).toEqual({ type: ValueType.EMPTY, value: null })
    expect(font.weight).toEqual({ type: ValueType.EMPTY, value: null })
    expect(font.lineHeight).toEqual({ type: ValueType.EMPTY, value: null })
  })

  it("should export background with empty values", () => {
    expect(background.preset).toEqual({ type: ValueType.EMPTY, value: null })
    expect(background.image).toEqual({ type: ValueType.EMPTY, value: null })
    expect(background.size).toEqual({ type: ValueType.EMPTY, value: null })
    expect(background.position).toEqual({ type: ValueType.EMPTY, value: null })
    expect(background.repeat).toEqual({ type: ValueType.EMPTY, value: null })
    expect(background.color).toEqual({ type: ValueType.EMPTY, value: null })
    expect(background.opacity).toEqual({ type: ValueType.EMPTY, value: null })
  })

  it("should export shadow with empty values", () => {
    expect(shadow.preset).toEqual({ type: ValueType.EMPTY, value: null })
    expect(shadow.offsetX).toEqual({ type: ValueType.EMPTY, value: null })
    expect(shadow.offsetY).toEqual({ type: ValueType.EMPTY, value: null })
    expect(shadow.blur).toEqual({ type: ValueType.EMPTY, value: null })
    expect(shadow.color).toEqual({ type: ValueType.EMPTY, value: null })
    expect(shadow.opacity).toEqual({ type: ValueType.EMPTY, value: null })
  })

  it("should export border with empty values for all sides", () => {
    expect(border.preset).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.topStyle).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.topColor).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.topWidth).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.topOpacity).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.rightStyle).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.rightColor).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.rightWidth).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.rightOpacity).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.bottomStyle).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.bottomColor).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.bottomWidth).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.bottomOpacity).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.leftStyle).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.leftColor).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.leftWidth).toEqual({ type: ValueType.EMPTY, value: null })
    expect(border.leftOpacity).toEqual({ type: ValueType.EMPTY, value: null })
  })

  it("should export gradient with empty values", () => {
    expect(gradient.preset).toEqual({ type: ValueType.EMPTY, value: null })
    expect(gradient.gradientType).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
    expect(gradient.angle).toEqual({ type: ValueType.EMPTY, value: null })
    expect(gradient.startColor).toEqual({ type: ValueType.EMPTY, value: null })
    expect(gradient.startOpacity).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
    expect(gradient.startPosition).toEqual({
      type: ValueType.EMPTY,
      value: null,
    })
    expect(gradient.endColor).toEqual({ type: ValueType.EMPTY, value: null })
    expect(gradient.endOpacity).toEqual({ type: ValueType.EMPTY, value: null })
    expect(gradient.endPosition).toEqual({ type: ValueType.EMPTY, value: null })
  })

  it("should export margin with empty values for all sides", () => {
    expect(margin.top).toEqual({ type: ValueType.EMPTY, value: null })
    expect(margin.right).toEqual({ type: ValueType.EMPTY, value: null })
    expect(margin.bottom).toEqual({ type: ValueType.EMPTY, value: null })
    expect(margin.left).toEqual({ type: ValueType.EMPTY, value: null })
  })

  it("should export padding with empty values for all sides", () => {
    expect(padding.top).toEqual({ type: ValueType.EMPTY, value: null })
    expect(padding.right).toEqual({ type: ValueType.EMPTY, value: null })
    expect(padding.bottom).toEqual({ type: ValueType.EMPTY, value: null })
    expect(padding.left).toEqual({ type: ValueType.EMPTY, value: null })
  })

  it("should export corners with empty values for all corners", () => {
    expect(corners.topRight).toEqual({ type: ValueType.EMPTY, value: null })
    expect(corners.bottomRight).toEqual({ type: ValueType.EMPTY, value: null })
    expect(corners.bottomLeft).toEqual({ type: ValueType.EMPTY, value: null })
    expect(corners.topLeft).toEqual({ type: ValueType.EMPTY, value: null })
  })
})
