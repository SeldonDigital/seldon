import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { IconId } from "@seldon/core/components/icons"
import { ComponentToExport } from "../../types"
import { insertIconMap } from "./insert-icon-map"

describe("insertIconMap", () => {
  it("should insert icon map for component with icons", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button.tsx",
      },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {
            icon: {
              type: "string",
              value: "material-add",
              defaultValue: "material-add",
            },
          },
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = [
      "material-add",
      "material-home",
      "material-search",
    ]
    const result = insertIconMap("", usedIconIds)

    expect(result).toContain("const iconMap = {")
    expect(result).toContain('"material-add": IconMaterialAdd')
    expect(result).toContain('"material-home": IconMaterialHome')
    expect(result).toContain('"material-search": IconMaterialSearch')
    expect(result).toContain("}")
  })

  it("should insert icon map for component without icons", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button.tsx",
      },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = []
    const result = insertIconMap("", usedIconIds)

    expect(result).toContain("const iconMap = {")
    expect(result).toContain("}")
    expect(result).not.toContain("material-add:")
    expect(result).not.toContain("material-home:")
  })

  it("should insert icon map for component with __default__ icon", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.ICON,
      variantId: "variant-icon-default",
      defaultVariantId: "variant-icon-default",
      name: "Icon",
      config: {
        react: {
          returns: "HTMLSvg",
        },
      },
      output: {
        path: "components/seldon/primitives/Icon.tsx",
      },
      tree: {
        name: "Icon",
        nodeId: "variant-icon-default",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "IconProps",
          path: "root",
          props: {
            icon: {
              type: "string",
              value: "__default__",
              defaultValue: "__default__",
            },
          },
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = [
      "__default__",
      "material-add",
      "material-home",
    ]
    const result = insertIconMap("", usedIconIds)

    expect(result).toContain("const iconMap = {")
    expect(result).toContain('"__default__": IconDefault')
    expect(result).toContain('"material-add": IconMaterialAdd')
    expect(result).toContain('"material-home": IconMaterialHome')
    expect(result).toContain("}")
  })

  it("should insert icon map for component with complex icon names", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.ICON,
      variantId: "variant-icon-default",
      defaultVariantId: "variant-icon-default",
      name: "Icon",
      config: {
        react: {
          returns: "HTMLSvg",
        },
      },
      output: {
        path: "components/seldon/primitives/Icon.tsx",
      },
      tree: {
        name: "Icon",
        nodeId: "variant-icon-default",
        level: ComponentLevel.PRIMITIVE,
        dataBinding: {
          interfaceName: "IconProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = [
      "material-add",
      "material-accountCircle",
      "material-addBox",
      "material-addBusiness",
      "material-addChart",
      "material-addCircle",
    ]
    const result = insertIconMap("", usedIconIds)

    expect(result).toContain("const iconMap = {")
    expect(result).toContain('"material-add": IconMaterialAdd')
    expect(result).toContain(
      '"material-accountCircle": IconMaterialAccountCircle',
    )
    expect(result).toContain('"material-addBox": IconMaterialAddBox')
    expect(result).toContain('"material-addBusiness": IconMaterialAddBusiness')
    expect(result).toContain('"material-addChart": IconMaterialAddChart')
    expect(result).toContain('"material-addCircle": IconMaterialAddCircle')
    expect(result).toContain("}")
  })

  it("should insert icon map for component with duplicate icons", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button.tsx",
      },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = [
      "material-add",
      "material-add",
      "material-home",
      "material-home",
      "material-search",
    ]
    const result = insertIconMap("", usedIconIds)

    expect(result).toContain("const iconMap = {")
    expect(result).toContain('"material-add": IconMaterialAdd')
    expect(result).toContain('"material-home": IconMaterialHome')
    expect(result).toContain('"material-search": IconMaterialSearch')
    expect(result).toContain("}")

    // Should not have duplicates
    const addCount = (result.match(/"material-add":/g) || []).length
    const homeCount = (result.match(/"material-home":/g) || []).length
    expect(addCount).toBe(1)
    expect(homeCount).toBe(1)
  })

  it("should append icon map to existing content", () => {
    const existingContent =
      "export function Button(props: ButtonProps) {\n  return <HTMLButton />\n}"
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button.tsx",
      },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = ["material-add", "material-home"]
    const result = insertIconMap(existingContent, usedIconIds)

    expect(result).toContain("export function Button(props: ButtonProps) {")
    expect(result).toContain("return <HTMLButton />")
    expect(result).toContain("const iconMap = {")
    expect(result).toContain('"material-add": IconMaterialAdd')
    expect(result).toContain('"material-home": IconMaterialHome')
    expect(result).toContain("}")
  })

  it("should handle component with special characters in name", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button-V2",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button-V2.tsx",
      },
      tree: {
        name: "Button-V2",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "Button-V2Props",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = ["material-add", "material-home"]
    const result = insertIconMap("", usedIconIds)

    expect(result).toContain("const iconMap = {")
    expect(result).toContain('"material-add": IconMaterialAdd')
    expect(result).toContain('"material-home": IconMaterialHome')
    expect(result).toContain("}")
  })

  it("should handle empty usedIconIds array", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.BUTTON,
      variantId: "variant-button-default",
      defaultVariantId: "variant-button-default",
      name: "Button",
      config: {
        react: {
          returns: "HTMLButton",
        },
      },
      output: {
        path: "components/seldon/elements/Button.tsx",
      },
      tree: {
        name: "Button",
        nodeId: "variant-button-default",
        level: ComponentLevel.ELEMENT,
        dataBinding: {
          interfaceName: "ButtonProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const usedIconIds: IconId[] = []
    const result = insertIconMap("", usedIconIds)

    expect(result).toContain("const iconMap = {")
    expect(result).toContain("}")
    expect(result).not.toContain("material-add:")
    expect(result).not.toContain("material-home:")
  })
})
