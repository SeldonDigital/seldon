import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { expect, it } from "vitest"
import type { Workspace } from "@seldon/core/workspace/types"
import { runExport } from "../vite/export-handler"

const editorRoot = path.dirname(
  path.dirname(fileURLToPath(import.meta.url)),
)
const repoRoot = path.join(editorRoot, "../..")

it("exports the workspace to seldon-NEW", async () => {
  const workspace = JSON.parse(
    fs.readFileSync(path.join(repoRoot, "seldon-editor.json"), "utf8"),
  ) as Workspace

  const { files } = await runExport({
    workspace,
    options: {
      output: {
        componentsFolder: "seldon-NEW",
        assetsFolder: "assets",
        assetPublicPath: "/assets",
      },
    },
  })

  for (const file of files) {
    const target = path.join(editorRoot, file.path)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(
      target,
      file.encoding === "base64"
        ? Buffer.from(file.content, "base64")
        : file.content,
    )
  }

  expect(files.length).toBeGreaterThan(0)
}, 120000)
