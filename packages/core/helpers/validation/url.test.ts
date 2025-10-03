import { describe, expect, it } from "bun:test"
import { isValidURL } from "./url"

describe("isValidURL", () => {
  it("should return true for valid URLs", () => {
    expect(isValidURL("http://example.com")).toBe(true)
    expect(isValidURL("https://example.com")).toBe(true)
    expect(isValidURL("https://www.example.com")).toBe(true)
    expect(isValidURL("https://example.com/path")).toBe(true)
  })

  it("should return false for invalid URLs", () => {
    expect(isValidURL("htp://example.com")).toBe(false)
    expect(isValidURL("http:/example.com")).toBe(false)
    expect(isValidURL("http//example.com")).toBe(false)
    expect(isValidURL("https://")).toBe(false)
    expect(isValidURL("https://example.com ")).toBe(false)
    expect(isValidURL('https://example.com"')).toBe(false)
    expect(isValidURL("./image-default")).toBe(false)
  })
})
