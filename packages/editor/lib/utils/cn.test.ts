import { describe, expect, it } from "bun:test"
import { cn, cnMerge } from "./cn"

describe("cn", () => {
  it("should join class names", () => {
    expect(cn("text-red-500", "bg-blue-100")).toBe("text-red-500 bg-blue-100")
  })

  it("should handle empty strings", () => {
    expect(cn("", "text-red-500")).toBe("text-red-500")
  })

  it("should handle undefined and null values", () => {
    expect(cn("text-red-500", undefined, null)).toBe("text-red-500")
  })

  it("should handle conditional classes", () => {
    expect(cn("base-class", true && "conditional-class")).toBe(
      "base-class conditional-class",
    )
    expect(cn("base-class", false && "conditional-class")).toBe("base-class")
  })
})

describe("cnMerge", () => {
  it("should merge conflicting Tailwind classes", () => {
    expect(cnMerge("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("should preserve non-conflicting classes", () => {
    expect(cnMerge("text-red-500", "bg-blue-100")).toBe(
      "text-red-500 bg-blue-100",
    )
  })

  it("should handle empty strings", () => {
    expect(cnMerge("", "text-red-500")).toBe("text-red-500")
  })

  it("should handle undefined and null values", () => {
    expect(cnMerge("text-red-500", undefined, null)).toBe("text-red-500")
  })
})
