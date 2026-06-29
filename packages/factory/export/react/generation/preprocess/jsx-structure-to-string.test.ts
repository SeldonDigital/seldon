import { describe, expect, it } from "vitest"

import { ComponentToExport } from "../../../types"
import { jsxStructureToString } from "./jsx-structure-to-string"
import { JSXNode } from "./types"

const component = (returns: string): ComponentToExport =>
  ({
    name: "Demo",
    config: { react: { returns } },
    tree: { dataBinding: { props: {} } },
  }) as unknown as ComponentToExport

const rootNode = (children?: JSXNode[]): JSXNode => ({
  type: "component",
  name: "Demo",
  path: "",
  propVarName: "demoProps",
  children,
})

describe("jsxStructureToString", () => {
  it("emits a return statement wrapping the configured element", () => {
    const out = jsxStructureToString(rootNode(), component("HTML.Div"), "cls")
    expect(out).toContain("return (")
    expect(out).toContain("<HTML.Div className={cls} {...props}>")
    expect(out).toContain("</HTML.Div>")
  })

  it("forwards a ref when requested", () => {
    const out = jsxStructureToString(
      rootNode(),
      component("HTML.Div"),
      "cls",
      true,
    )
    expect(out).toContain("ref={ref}")
  })

  it("omits the ref binding by default", () => {
    const out = jsxStructureToString(rootNode(), component("HTML.Div"), "cls")
    expect(out).not.toContain("ref={ref}")
  })

  it("wraps slot children in a caller-children guard", () => {
    const child: JSXNode = {
      type: "component",
      name: "Button",
      path: "button",
      propVarName: "buttonProps",
    }
    const out = jsxStructureToString(
      rootNode([child]),
      component("HTML.Div"),
      "cls",
    )
    expect(out).toContain("children !== undefined ?")
    expect(out).toContain("<Button {...buttonProps} />")
  })

  it("renders grandchildren passed as props", () => {
    const child: JSXNode = {
      type: "component",
      name: "Button",
      path: "button",
      propVarName: "buttonProps",
      grandchildProps: [
        { propKeyName: "icon", propVarName: "buttonIconProps" },
      ],
    }
    const out = jsxStructureToString(
      rootNode([child]),
      component("HTML.Div"),
      "cls",
    )
    expect(out).toContain("<Button {...buttonProps} icon={buttonIconProps} />")
  })

  it("throws when a conditional node lacks its condition", () => {
    const child: JSXNode = {
      type: "conditional",
      name: "Extra",
      path: "extra",
      propVarName: "extraProps",
    }
    expect(() =>
      jsxStructureToString(rootNode([child]), component("HTML.Div"), "cls"),
    ).toThrow(/missing condition/)
  })
})
