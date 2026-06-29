import path from "node:path"
import { fileURLToPath } from "node:url"

import type { ExtractPayload, Workspace } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import { describe, expect, it } from "vitest"

import { ExportOptions } from "./types"
import { exportWorkspace } from "./export-workspace"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "../../..")

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
  // Tree-shake icons so the export stays small and fast.
  exportAllIconSetIcons: false,
}

describe("exportWorkspace", () => {
  it("throws for an unsupported framework", async () => {
    await expect(
      exportWorkspace(workspace, {
        ...options,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target: { framework: "vue" } as any,
        assetReader: {
          readNativeComponent: () => undefined,
          readIconFile: () => undefined,
          listNativeComponentFileStems: () => [],
        },
      }),
    ).rejects.toThrow(/Unsupported target\.framework/)
  })

  it("returns a non-empty list of files", async () => {
    const files = await exportWorkspace(workspace, options)
    expect(files.length).toBeGreaterThan(0)
  })

  it("emits the shared stylesheet, README, and class-name utility", async () => {
    const files = await exportWorkspace(workspace, options)
    const paths = files.map((f) => f.path)
    expect(paths).toContain("/src/components/styles.css")
    expect(paths).toContain("/src/components/README.md")
    expect(paths).toContain("/src/components/utils/class-name.ts")
  })

  it("emits a Button component file", async () => {
    const files = await exportWorkspace(workspace, options)
    const buttonFile = files.find((f) => /\/Button\.tsx$/.test(f.path))
    expect(buttonFile).toBeDefined()
  })

  it("prepends the license header into generated text files", async () => {
    const files = await exportWorkspace(workspace, options)
    const stylesheet = files.find(
      (f) => f.path === "/src/components/styles.css",
    )
    expect(typeof stylesheet?.content).toBe("string")
    expect(stylesheet?.content).toContain("generated using Seldon")
  })

  it("normalizes trailing slashes in output folders", async () => {
    const files = await exportWorkspace(workspace, {
      ...options,
      output: {
        componentsFolder: "/src/components/",
        assetsFolder: "/public/assets/",
        assetPublicPath: "/assets",
      },
    })
    expect(files.map((f) => f.path)).toContain("/src/components/styles.css")
  })
})
