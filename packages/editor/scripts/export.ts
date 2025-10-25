import { exportWorkspace } from "@seldon/factory/export/export-workspace"
import { FileToExport } from "@seldon/factory/export/types"
import { rm } from "fs/promises"
import * as path from "path"

async function run() {
  const TEST_WORKSPACE = await import("./test-workspace").then(
    (m) => m.TEST_WORKSPACE,
  )
  const rootDirectory = path.join(__dirname, "../../..")

  const files = await exportWorkspace(TEST_WORKSPACE, {
    rootDirectory,
    target: { framework: "react", styles: "css-properties" },
    output: {
      assetsFolder: "public",
      componentsFolder: "_components",
      assetPublicPath: "/",
    },
  })

  // Clean up directory
  await rm(path.join(rootDirectory, "services/editor/app/_components/seldon"), {
    recursive: true,
  })

  // Write config files
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
