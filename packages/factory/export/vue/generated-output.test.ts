import path from "node:path"
import { fileURLToPath } from "node:url"

import { beforeAll, describe, expect, it } from "vitest"

import type { ExtractPayload, Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"

import { exportWorkspace } from "../export-workspace"
import { ExportOptions, FileToExport } from "../types"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "../../../..")

const workspace: Workspace = addComponent(
  { boardKey: ComponentId.BUTTON } as ExtractPayload<"add_component">,
  createEmptyWorkspace(),
)

const options: ExportOptions = {
  rootDirectory: repoRoot,
  target: { framework: "vue", styles: "css-properties" },
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

describe("generated Button SFC", () => {
  it("emits a .vue single-file component", () => {
    const file = files.find((f) => /\/Button\.vue$/.test(f.path))
    expect(file).toBeDefined()
  })

  it("uses script setup with typed defineProps", () => {
    const source = content((f) => /\/Button\.vue$/.test(f.path))
    expect(source).toContain('<script setup lang="ts">')
    expect(source).toContain("defineProps<{")
    expect(source).toContain("className?: string")
  })

  it("wires the className through combineClassNames with the variant class", () => {
    const source = content((f) => /\/Button\.vue$/.test(f.path))
    expect(source).toContain('combineClassNames("sdn-button", props.className)')
  })

  it("renders a template block", () => {
    const source = content((f) => /\/Button\.vue$/.test(f.path))
    expect(source).toContain("<template>")
    expect(source).toContain(':class="rootClassName"')
  })

  it("emits the shared class-names utility", () => {
    const source = content((f) => /\/utils\/class-names\.ts$/.test(f.path))
    expect(source).toContain("export function combineClassNames")
    expect(source).toContain("export function mergeSlot")
  })
})

describe("generated stylesheet", () => {
  it("emits a base rule for the default Button variant", () => {
    const css = content((f) => f.path === "/src/components/styles.css")
    expect(css).toContain(".sdn-button")
  })
})
