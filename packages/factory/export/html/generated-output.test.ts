import path from "node:path"
import { fileURLToPath } from "node:url"

import { beforeAll, describe, expect, it } from "vitest"

import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { exportWorkspace } from "../export-workspace"

import type { ExportOptions, FileToExport } from "../types"
import type { ExtractPayload, Workspace } from "@seldon/core"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "../../../..")

const workspace: Workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)

const options: ExportOptions = {
  rootDirectory: repoRoot,
  target: { framework: "html", styles: "css-properties" },
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

describe("generated Button fragment", () => {
  it("emits a .html fragment", () => {
    const file = files.find((f) => /\/Button\.html$/.test(f.path))

    expect(file).toBeDefined()
  })

  it("renders a native button with the variant class", () => {
    const source = content((f) => /\/Button\.html$/.test(f.path))

    expect(source).toContain("<button")
    expect(source).toContain('class="sdn-button"')
  })

  it("does not emit a component API", () => {
    const source = content((f) => /\/Button\.html$/.test(f.path))

    expect(source).not.toContain("defineProps")
    expect(source).not.toContain("seldonRefs")
    expect(source).not.toContain("mergeSlot")
  })
})

describe("generated stylesheet", () => {
  it("emits a base rule for the default Button variant", () => {
    const css = content((f) => f.path === "/src/components/styles.css")

    expect(css).toContain(".sdn-button")
  })
})
