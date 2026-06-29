import path from "node:path"
import { fileURLToPath } from "node:url"

import type { ExtractPayload, Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import { beforeAll, describe, expect, it } from "vitest"

import { ExportOptions, FileToExport } from "../types"
import { exportWorkspace } from "../export-workspace"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "../../../..")

const workspace: Workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)

const options: ExportOptions = {
  rootDirectory: repoRoot,
  target: { framework: "react", styles: "css-properties" },
  output: {
    componentsFolder: "/src/components",
    assetsFolder: "/public/assets",
    assetPublicPath: "/assets",
  },
  skipFormat: true,
  exportAllIconSetIcons: false,
}

let files: FileToExport[]
const content = (predicate: (f: FileToExport) => boolean): string => {
  const file = files.find(predicate)
  if (!file || typeof file.content !== "string") {
    throw new Error("expected file content not found")
  }
  return file.content
}

beforeAll(async () => {
  files = await exportWorkspace(workspace, options)
})

describe("generated Button component", () => {
  it("declares the props interface", () => {
    const source = content((f) => /\/Button\.tsx$/.test(f.path))
    expect(source).toContain("export interface ButtonProps")
    expect(source).toContain("className?: string")
  })

  it("declares the component function", () => {
    const source = content((f) => /\/Button\.tsx$/.test(f.path))
    expect(source).toMatch(/export (function Button\(|const Button = forwardRef)/)
  })

  it("wires the className through combineClassNames with the variant class", () => {
    const source = content((f) => /\/Button\.tsx$/.test(f.path))
    expect(source).toContain('combineClassNames("sdn-button", className)')
  })

  it("includes a JSDoc intent block", () => {
    const source = content((f) => /\/Button\.tsx$/.test(f.path))
    expect(source).toContain("Intent:")
  })

  it("carries the license header", () => {
    const source = content((f) => /\/Button\.tsx$/.test(f.path))
    expect(source).toContain("generated using Seldon")
  })
})

describe("generated stylesheet", () => {
  it("emits a base rule for the default Button variant", () => {
    const css = content((f) => f.path === "/src/components/styles.css")
    expect(css).toContain(".sdn-button")
  })

  it("includes the component styles banner", () => {
    const css = content((f) => f.path === "/src/components/styles.css")
    expect(css).toContain("Component styles")
  })
})
