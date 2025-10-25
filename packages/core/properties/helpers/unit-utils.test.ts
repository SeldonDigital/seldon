import { describe, expect, it } from "bun:test"
import { Unit } from "../constants"
import {
  getDefaultUnitForProperty,
  getNumberValidation,
  getUnitsForProperty,
} from "./unit-utils"

describe("unit-utils", () => {
  describe("getUnitsForProperty", () => {
    it("should return percentage for opacity", () => {
      expect(getUnitsForProperty("opacity")).toEqual(["%"])
    })

    it("should return percentage for brightness", () => {
      expect(getUnitsForProperty("brightness")).toEqual(["%"])
    })

    it("should return degrees for rotation", () => {
      expect(getUnitsForProperty("rotation")).toEqual(["deg"])
    })

    it("should return px and rem for width", () => {
      expect(getUnitsForProperty("width")).toEqual(["px", "rem"])
    })

    it("should return px and rem for height", () => {
      expect(getUnitsForProperty("height")).toEqual(["px", "rem"])
    })

    it("should return px and rem for margin", () => {
      expect(getUnitsForProperty("margin")).toEqual(["px", "rem"])
    })

    it("should return px and rem for padding", () => {
      expect(getUnitsForProperty("padding")).toEqual(["px", "rem"])
    })

    it("should return px and rem for gap", () => {
      expect(getUnitsForProperty("gap")).toEqual(["px", "rem"])
    })

    it("should return rem and px for fontSize", () => {
      expect(getUnitsForProperty("fontSize")).toEqual(["rem", "px"])
    })

    it("should return empty array for columns", () => {
      expect(getUnitsForProperty("columns")).toEqual([])
    })

    it("should handle compound properties", () => {
      // Compound properties like margin.top should fall back to default units
      expect(getUnitsForProperty("margin.top")).toEqual(["px", "rem", "%"])
      expect(getUnitsForProperty("padding.left")).toEqual(["px", "rem", "%"])
    })

    it("should return default units for unknown properties", () => {
      expect(getUnitsForProperty("unknownProperty")).toEqual(["px", "rem", "%"])
    })
  })

  describe("getDefaultUnitForProperty", () => {
    it("should return PERCENT for opacity", () => {
      expect(getDefaultUnitForProperty("opacity")).toBe(Unit.PERCENT)
    })

    it("should return PERCENT for brightness", () => {
      expect(getDefaultUnitForProperty("brightness")).toBe(Unit.PERCENT)
    })

    it("should return DEGREES for rotation", () => {
      expect(getDefaultUnitForProperty("rotation")).toBe(Unit.DEGREES)
    })

    it("should return PX for width", () => {
      expect(getDefaultUnitForProperty("width")).toBe(Unit.PX)
    })

    it("should return PX for height", () => {
      expect(getDefaultUnitForProperty("height")).toBe(Unit.PX)
    })

    it("should return PX for margin", () => {
      expect(getDefaultUnitForProperty("margin")).toBe(Unit.PX)
    })

    it("should return PX for padding", () => {
      expect(getDefaultUnitForProperty("padding")).toBe(Unit.PX)
    })

    it("should return PX for gap", () => {
      expect(getDefaultUnitForProperty("gap")).toBe(Unit.PX)
    })

    it("should return REM for fontSize", () => {
      expect(getDefaultUnitForProperty("fontSize")).toBe(Unit.REM)
    })

    it("should return NUMBER for columns", () => {
      expect(getDefaultUnitForProperty("columns")).toBe(Unit.NUMBER)
    })

    it("should handle compound properties", () => {
      expect(getDefaultUnitForProperty("margin.top")).toBe(Unit.PX)
      expect(getDefaultUnitForProperty("padding.left")).toBe(Unit.PX)
    })

    it("should return PX for unknown properties", () => {
      expect(getDefaultUnitForProperty("unknownProperty")).toBe(Unit.PX)
    })
  })

  describe("getNumberValidation", () => {
    it("should return percentage for opacity", () => {
      expect(getNumberValidation("opacity")).toBe("percentage")
    })

    it("should return percentage for brightness", () => {
      expect(getNumberValidation("brightness")).toBe("percentage")
    })

    it("should return number for rotation", () => {
      expect(getNumberValidation("rotation")).toBe("number")
    })

    it("should return number for columns", () => {
      expect(getNumberValidation("columns")).toBe("number")
    })

    it("should return both for width", () => {
      expect(getNumberValidation("width")).toBe("both")
    })

    it("should return both for height", () => {
      expect(getNumberValidation("height")).toBe("both")
    })

    it("should return both for margin", () => {
      expect(getNumberValidation("margin")).toBe("both")
    })

    it("should return both for padding", () => {
      expect(getNumberValidation("padding")).toBe("both")
    })

    it("should return both for gap", () => {
      expect(getNumberValidation("gap")).toBe("both")
    })

    it("should return both for fontSize", () => {
      expect(getNumberValidation("fontSize")).toBe("both")
    })

    it("should handle compound properties", () => {
      expect(getNumberValidation("margin.top")).toBe("both")
      expect(getNumberValidation("padding.left")).toBe("both")
    })

    it("should return both for unknown properties", () => {
      expect(getNumberValidation("unknownProperty")).toBe("both")
    })
  })
})
