import { describe, expect, it } from "vitest"

import { Workspace } from "@seldon/core"
import { HtmlElement, WrapperElement } from "@seldon/core/properties"

import { ExportAssetReader } from "../../../asset-reader"
import { ComponentToExport, ExportOptions } from "../../../types"
import { getNativeComponentFiles } from "./get-native-component-files"

const emptyWorkspace = (): Workspace =>
  ({ nodes: {}, playgrounds: {} }) as unknown as Workspace

const reader: ExportAssetReader = {
  readNativeComponent: (fileStem: string) => `// ${fileStem}`,
  readIconFile: () => undefined,
  listNativeComponentFileStems: () => [],
}

const options = {
  output: { componentsFolder: "seldon" },
  assetReader: reader,
} as unknown as ExportOptions

const wrapperComponent = (options: WrapperElement[]): ComponentToExport =>
  ({
    name: "Container",
    config: { react: { returns: "wrapperElement" } },
    tree: { dataBinding: { props: { wrapperElement: { options } } } },
  }) as unknown as ComponentToExport

const htmlElementComponent = (options: HtmlElement[]): ComponentToExport =>
  ({
    name: "List",
    config: { react: { returns: "htmlElement" } },
    tree: { dataBinding: { props: { htmlElement: { options } } } },
  }) as unknown as ComponentToExport

const stems = (component: ComponentToExport): string[] =>
  getNativeComponentFiles(emptyWorkspace(), [component], options).map((file) =>
    file.path.replace(/^.*\//, "").replace(/\.tsx$/, ""),
  )

describe("getNativeComponentFiles", () => {
  it("always writes HTML.Div", () => {
    expect(stems(wrapperComponent([WrapperElement.SECTION]))).toContain(
      "HTML.Div",
    )
  })

  it("writes a native wrapper for every wrapperElement switch option", () => {
    const written = stems(
      wrapperComponent([
        WrapperElement.ARTICLE,
        WrapperElement.SECTION,
        WrapperElement.BLOCKQUOTE,
        WrapperElement.FIELDSET,
      ]),
    )
    expect(written).toEqual(
      expect.arrayContaining([
        "HTML.Article",
        "HTML.Section",
        "HTML.Blockquote",
        "HTML.Fieldset",
      ]),
    )
  })

  it("writes a native wrapper for every htmlElement switch option", () => {
    const written = stems(
      htmlElementComponent([HtmlElement.UL, HtmlElement.OL]),
    )
    expect(written).toEqual(
      expect.arrayContaining(["HTML.Ul", "HTML.Ol"]),
    )
  })
})
