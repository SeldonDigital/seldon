import fs from "node:fs"
import fsp from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { build } from "esbuild"

/**
 * Runs the factory Vue export on `seldon-editor.json` and writes the generated
 * `.vue` chrome into `packages/editor-vue/seldon/`.
 *
 * Mirrors the React editor's export-seldon script but targets the Vue platform,
 * so each editor regenerates its own chrome from the same canonical file.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const editorRoot = path.dirname(scriptDir)
const repoRoot = path.join(editorRoot, "../..")
const coreRoot = path.join(editorRoot, "../core")
const factoryRoot = path.join(editorRoot, "../factory")
const handlerEntry = path.join(editorRoot, "../editor/vite/export-handler.ts")
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

  const outputFile = path.join(
    os.tmpdir(),
    `seldon-vue-export-${process.pid}.mjs`,
  )
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
      // The shared handler defaults to React; target Vue explicitly so this
      // editor regenerates its own `.vue` chrome.
      target: { framework: "vue", styles: "css-properties" },
      output: {
        // Asset paths default to nest under this folder (`seldon/assets`),
        // keeping the generated library self-contained.
        componentsFolder: "seldon",
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
