import { describe, expect, it } from "bun:test"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../types"
import { insertLicense } from "./insert-license"

describe("insertLicense", () => {
  it("should insert license header for component", () => {
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

    const result = insertLicense("")

    expect(result).toContain("/*****")
    expect(result).toContain(" * This code was generated using Seldon")
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Licensed under the Terms of Use: https://seldon.digital/terms-of-service",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Do not redistribute or sublicense without permission.",
    )
    expect(result).toContain(
      " * You may not use this software, or any derivative works of it,",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * in whole or in part, for the purposes of training, fine-tuning,",
    )
    expect(result).toContain(
      " * or otherwise improving (directly or indirectly) any machine learning",
    )
    expect(result).toContain(" *****/")
  })

  it("should append license to existing content", () => {
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

    const result = insertLicense(existingContent)

    expect(result).toContain("/*****")
    expect(result).toContain(" * This code was generated using Seldon")
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Licensed under the Terms of Use: https://seldon.digital/terms-of-service",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Do not redistribute or sublicense without permission.",
    )
    expect(result).toContain(
      " * You may not use this software, or any derivative works of it,",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * in whole or in part, for the purposes of training, fine-tuning,",
    )
    expect(result).toContain(
      " * or otherwise improving (directly or indirectly) any machine learning",
    )
    expect(result).toContain(" *****/")
    expect(result).toContain("export function Button(props: ButtonProps) {")
    expect(result).toContain("return <HTMLButton />")
  })

  it("should insert license for component with special characters in name", () => {
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

    const result = insertLicense("")

    expect(result).toContain("/*****")
    expect(result).toContain(" * This code was generated using Seldon")
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Licensed under the Terms of Use: https://seldon.digital/terms-of-service",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Do not redistribute or sublicense without permission.",
    )
    expect(result).toContain(
      " * You may not use this software, or any derivative works of it,",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * in whole or in part, for the purposes of training, fine-tuning,",
    )
    expect(result).toContain(
      " * or otherwise improving (directly or indirectly) any machine learning",
    )
    expect(result).toContain(" *****/")
  })

  it("should insert license for component with complex name", () => {
    const mockComponent: ComponentToExport = {
      componentId: ComponentId.CARD_PRODUCT,
      variantId: "variant-cardProduct-featured",
      defaultVariantId: "variant-cardProduct-default",
      name: "CardProductFeatured",
      config: {
        react: {
          returns: "HTMLDiv",
        },
      },
      output: {
        path: "components/seldon/parts/CardProductFeatured.tsx",
      },
      tree: {
        name: "CardProductFeatured",
        nodeId: "variant-cardProduct-featured",
        level: ComponentLevel.PART,
        dataBinding: {
          interfaceName: "CardProductFeaturedProps",
          path: "root",
          props: {},
        },
        children: [],
      },
    }

    const result = insertLicense("")

    expect(result).toContain("/*****")
    expect(result).toContain(" * This code was generated using Seldon")
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Licensed under the Terms of Use: https://seldon.digital/terms-of-service",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Do not redistribute or sublicense without permission.",
    )
    expect(result).toContain(
      " * You may not use this software, or any derivative works of it,",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * in whole or in part, for the purposes of training, fine-tuning,",
    )
    expect(result).toContain(
      " * or otherwise improving (directly or indirectly) any machine learning",
    )
    expect(result).toContain(" *****/")
  })

  it("should insert license for component with different levels", () => {
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

    const result = insertLicense("")

    expect(result).toContain("/*****")
    expect(result).toContain(" * This code was generated using Seldon")
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Licensed under the Terms of Use: https://seldon.digital/terms-of-service",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Do not redistribute or sublicense without permission.",
    )
    expect(result).toContain(
      " * You may not use this software, or any derivative works of it,",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * in whole or in part, for the purposes of training, fine-tuning,",
    )
    expect(result).toContain(
      " * or otherwise improving (directly or indirectly) any machine learning",
    )
    expect(result).toContain(" *****/")
  })

  it("should insert license for component with different output paths", () => {
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

    const result = insertLicense("")

    expect(result).toContain("/*****")
    expect(result).toContain(" * This code was generated using Seldon")
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Licensed under the Terms of Use: https://seldon.digital/terms-of-service",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Do not redistribute or sublicense without permission.",
    )
    expect(result).toContain(
      " * You may not use this software, or any derivative works of it,",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * in whole or in part, for the purposes of training, fine-tuning,",
    )
    expect(result).toContain(
      " * or otherwise improving (directly or indirectly) any machine learning",
    )
    expect(result).toContain(" *****/")
  })

  it("should handle empty content", () => {
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

    const result = insertLicense("")

    expect(result).toContain("/*****")
    expect(result).toContain(" * This code was generated using Seldon")
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Licensed under the Terms of Use: https://seldon.digital/terms-of-service",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * Do not redistribute or sublicense without permission.",
    )
    expect(result).toContain(
      " * You may not use this software, or any derivative works of it,",
    )
    expect(result).toContain(" *")
    expect(result).toContain(
      " * in whole or in part, for the purposes of training, fine-tuning,",
    )
    expect(result).toContain(
      " * or otherwise improving (directly or indirectly) any machine learning",
    )
    expect(result).toContain(" *****/")
  })
})
