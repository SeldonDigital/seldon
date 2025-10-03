import { describe, expect, it } from "bun:test"
import { round } from "./round"

describe("round", () => {
  it("should round to 2 decimal places", () => {
    const result = round(3.14159, 2)
    expect(result).toBe(3.14)
  })

  it("should round to 3 decimal places", () => {
    const result = round(2.71828, 3)
    expect(result).toBe(2.718)
  })

  it("should round to whole number when precision is 0", () => {
    const result = round(1.99999, 0)
    expect(result).toBe(2)
  })

  it("should round up when next digit is 5 or greater", () => {
    const result = round(0.123456, 4)
    expect(result).toBe(0.1235)
  })

  it("should round down when next digit is less than 5", () => {
    const result = round(0.1234, 4)
    expect(result).toBe(0.1234)
  })

  it("should handle trailing zeros correctly", () => {
    const result = round(100.001, 1)
    expect(result).toBe(100)
  })

  it("should handle floating point precision issues", () => {
    const result = round(6.000000000000001, 3)
    expect(result).toBe(6)
  })

  it("should handle floating point precision issues with decimals", () => {
    const result = round(6.100000000000001, 3)
    expect(result).toBe(6.1)
  })

  it("should use default precision of 3 when not specified", () => {
    const result = round(3.14159)
    expect(result).toBe(3.142)
  })

  it("should handle negative numbers", () => {
    const result = round(-3.14159, 2)
    expect(result).toBe(-3.14)
  })

  it("should handle zero", () => {
    const result = round(0, 2)
    expect(result).toBe(0)
  })

  it("should handle large numbers", () => {
    const result = round(123456.789, 1)
    expect(result).toBe(123456.8)
  })

  it("should handle very small numbers", () => {
    const result = round(0.000123, 6)
    expect(result).toBe(0.000123)
  })

  it("should handle high precision", () => {
    const result = round(1.23456789, 7)
    expect(result).toBe(1.2345679)
  })
})
