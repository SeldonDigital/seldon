import { build } from "esbuild"
import fs from "node:fs"
import fsp from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

/**
 * Runs the factory export on `seldon-editor.json` and writes the generated
 * components into `packages/editor/seldon/`.
 *
 * The export handler (`vite/export-handler.ts`) imports `@seldon/core` and
 * `@seldon/factory` through workspace aliases, so it is bundled with esbuild
 * the same way the dev server's export plugin does, then imported and run.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const editorRoot = path.dirname(scriptDir)
const repoRoot = path.join(editorRoot, "../..")
const coreRoot = path.join(editorRoot, "../core")
const factoryRoot = path.join(editorRoot, "../factory")
const handlerEntry = path.join(editorRoot, "vite/export-handler.ts")
const workspaceFile = path.join(repoRoot, "seldon-editor.json")

async function loadRunExport() {
  const result = await build({
    entryPoints: [handlerEntry],
    bundle: true,
    platform: "node",
    format: "esm",
    target: "node22",
    write: false,
    logLevel: "silent",
    alias: {
      "@seldon/core": coreRoot,
      "@seldon/factory": factoryRoot,
    },
  })

  const outputFile = path.join(os.tmpdir(), `seldon-export-${process.pid}.mjs`)
  await fsp.writeFile(outputFile, result.outputFiles[0].text)
  try {
    const mod = await import(pathToFileURL(outputFile).href)
    return mod.runExport
  } finally {
    await fsp.rm(outputFile, { force: true })
  }
}

async function main() {
  const runExport = await loadRunExport()
  const workspace = JSON.parse(fs.readFileSync(workspaceFile, "utf8"))

  const { files } = await runExport({
    workspace,
    options: {
      output: {
        componentsFolder: "seldon",
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

  console.log(
    `Exported ${files.length} files into ${path.join(editorRoot, "seldon")}`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
