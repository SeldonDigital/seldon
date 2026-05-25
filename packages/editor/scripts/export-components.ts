import { createEmptyWorkspace } from "@seldon/core"
import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import { FileToExport } from "@seldon/factory/export/types"
import { rm } from "fs/promises"
import * as path from "path"

async function run() {
  const rootDirectory = path.join(__dirname, "../../..")
  const workspace = createEmptyWorkspace()

  console.info(
    "Exporting empty workspace (legacy test-workspace fixture removed).",
  )

  const files = await exportWorkspace(workspace, {
    rootDirectory,
    target: { framework: "react", styles: "css-properties" },
    output: {
      assetsFolder: "public",
      componentsFolder: "_components",
      assetPublicPath: "/",
    },
  })

  await rm(path.join(rootDirectory, "services/editor/app/_components/seldon"), {
    recursive: true,
  })

  for (const file of files) {
    await writeToFile(file, path.join(rootDirectory, "services/editor/app"))
  }
}

async function writeToFile(file: FileToExport, basePath: string) {
  const destination = path.join(basePath, file.path)
  await Bun.write(destination, file.content, {
    createPath: true,
  })
  console.info("Exported " + destination.split("/").pop() + " ✅")
}

run()
  .catch((e) => console.error(e))
  .then(() => console.info("Done ✅"))
  .finally(() => process.exit(0))
