import { describe, expect, it } from "bun:test"
import { Alignment, BorderCollapse, Properties, ValueType } from "@seldon/core"
import testTheme from "@seldon/core/themes/test/test-theme"
import { getTableStyles } from "./get-table-styles"

describe("getTableStyles", () => {
  it("should return empty object for empty properties", () => {
    const properties: Properties = {}

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should return empty object when no table properties are defined", () => {
    const properties: Properties = {
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should generate verticalAlign inherit for INHERIT cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.INHERIT,
        value: null,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("verticalAlign", "inherit")
  })

  it("should generate alignment styles for TOP_LEFT cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.TOP_LEFT,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "left")
    expect(result).toHaveProperty("verticalAlign", "top")
  })

  it("should generate alignment styles for TOP_CENTER cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.TOP_CENTER,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "center")
    expect(result).toHaveProperty("verticalAlign", "top")
  })

  it("should generate alignment styles for TOP_RIGHT cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.TOP_RIGHT,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "right")
    expect(result).toHaveProperty("verticalAlign", "top")
  })

  it("should generate alignment styles for CENTER_LEFT cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER_LEFT,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "left")
    expect(result).toHaveProperty("verticalAlign", "middle")
  })

  it("should generate alignment styles for CENTER cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "center")
    expect(result).toHaveProperty("verticalAlign", "middle")
  })

  it("should generate alignment styles for CENTER_RIGHT cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER_RIGHT,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "right")
    expect(result).toHaveProperty("verticalAlign", "middle")
  })

  it("should generate alignment styles for BOTTOM_LEFT cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.BOTTOM_LEFT,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "left")
    expect(result).toHaveProperty("verticalAlign", "bottom")
  })

  it("should generate alignment styles for BOTTOM_CENTER cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.BOTTOM_CENTER,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "center")
    expect(result).toHaveProperty("verticalAlign", "bottom")
  })

  it("should generate alignment styles for BOTTOM_RIGHT cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.BOTTOM_RIGHT,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "right")
    expect(result).toHaveProperty("verticalAlign", "bottom")
  })

  it("should not generate alignment styles for AUTO cellAlign", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.AUTO,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).not.toHaveProperty("textAlign")
    expect(result).not.toHaveProperty("verticalAlign")
  })

  it("should generate borderCollapse style for preset values", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.COLLAPSE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("borderCollapse", "collapse")
  })

  it("should generate borderCollapse style for separate value", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.SEPARATE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("borderCollapse", "separate")
  })

  it("should handle both cellAlign and borderCollapse", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER,
      },
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.COLLAPSE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "center")
    expect(result).toHaveProperty("verticalAlign", "middle")
    expect(result).toHaveProperty("borderCollapse", "collapse")
  })

  it("should handle empty cellAlign value", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should handle empty borderCollapse value", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should handle cellAlign with other value types", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.TOP_LEFT,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "left")
    expect(result).toHaveProperty("verticalAlign", "top")
  })

  it("should handle cellAlign with preset value type", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "center")
    expect(result).toHaveProperty("verticalAlign", "middle")
  })

  it("should handle cellAlign with preset value type", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "center")
    expect(result).toHaveProperty("verticalAlign", "middle")
  })

  it("should handle cellAlign with preset value type", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "center")
    expect(result).toHaveProperty("verticalAlign", "middle")
  })

  it("should handle borderCollapse with other value types", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.COLLAPSE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("borderCollapse", "collapse")
  })

  it("should handle borderCollapse with preset value type", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.COLLAPSE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("borderCollapse", "collapse")
  })

  it("should handle borderCollapse with preset value type", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.SEPARATE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("borderCollapse", "separate")
  })

  it("should handle borderCollapse with preset value type", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.COLLAPSE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("borderCollapse", "collapse")
  })

  it("should handle table styles with other properties", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.TOP_LEFT,
      },
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.COLLAPSE,
      },
      color: {
        type: ValueType.EXACT,
        value: "#ff0000",
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toHaveProperty("textAlign", "left")
    expect(result).toHaveProperty("verticalAlign", "top")
    expect(result).toHaveProperty("borderCollapse", "collapse")
    expect(result).not.toHaveProperty("color")
    expect(result).not.toHaveProperty("fontSize")
  })

  it("should handle table styles with only table properties", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.CENTER,
      },
      borderCollapse: {
        type: ValueType.PRESET,
        value: BorderCollapse.SEPARATE,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({
      textAlign: "center",
      verticalAlign: "middle",
      borderCollapse: "separate",
    })
  })

  it("should handle all alignment values", () => {
    const alignments = [
      Alignment.TOP_LEFT,
      Alignment.TOP_CENTER,
      Alignment.TOP_RIGHT,
      Alignment.CENTER_LEFT,
      Alignment.CENTER,
      Alignment.CENTER_RIGHT,
      Alignment.BOTTOM_LEFT,
      Alignment.BOTTOM_CENTER,
      Alignment.BOTTOM_RIGHT,
    ]

    alignments.forEach((alignment) => {
      const properties: Properties = {
        cellAlign: {
          type: ValueType.PRESET,
          value: alignment,
        },
      }

      const result = getTableStyles({ properties, theme: testTheme })

      expect(result).toHaveProperty("textAlign")
      expect(result).toHaveProperty("verticalAlign")
    })
  })

  it("should handle borderCollapse with different values", () => {
    const borderCollapseValues = [
      BorderCollapse.COLLAPSE,
      BorderCollapse.SEPARATE,
    ]

    borderCollapseValues.forEach((borderCollapse) => {
      const properties: Properties = {
        borderCollapse: {
          type: ValueType.PRESET,
          value: borderCollapse,
        },
      }

      const result = getTableStyles({ properties, theme: testTheme })

      expect(result).toHaveProperty("borderCollapse", borderCollapse)
    })
  })

  it("should handle invalid cellAlign values gracefully", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should handle invalid borderCollapse values gracefully", () => {
    const properties: Properties = {
      borderCollapse: {
        type: ValueType.EMPTY,
        value: null,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should handle undefined properties gracefully", () => {
    const properties: Properties = {
      cellAlign: undefined,
      borderCollapse: undefined,
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })

  it("should handle AUTO alignment value", () => {
    const properties: Properties = {
      cellAlign: {
        type: ValueType.PRESET,
        value: Alignment.AUTO,
      },
    }

    const result = getTableStyles({ properties, theme: testTheme })

    expect(result).toEqual({})
  })
})
