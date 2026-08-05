import fs from "node:fs"
import fsp from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

import { build } from "esbuild"

/**
 * Runs the factory Vue export on this editor's own workspace copy and writes the
 * generated `.vue` chrome into `packages/editor/apps/vue/seldon/`.
 *
 * Mirrors the React editor's export-seldon script but targets the Vue platform.
 * Each editor reads the copy beside its own components, so exporting one editor
 * never regenerates the other from a workspace it did not load. Both copies come
 * from the same workspace, so export both after changing it.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const editorRoot = path.dirname(scriptDir)
const coreRoot = path.join(editorRoot, "../../../core")
const factoryRoot = path.join(editorRoot, "../../../factory")
const handlerEntry = path.join(editorRoot, "../../shared/vite/export-handler.ts")
const workspaceFile = path.join(editorRoot, "seldon/seldon-editor.json")

async function loadHandler() {
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

  const outputFile = path.join(os.tmpdir(), `seldon-vue-export-${process.pid}.mjs`)
  await fsp.writeFile(outputFile, result.outputFiles[0].text)
  try {
    return await import(pathToFileURL(outputFile).href)
  } finally {
    await fsp.rm(outputFile, { force: true })
  }
}

async function main() {
  const { runExport, loadWorkspace } = await loadHandler()
  // Read through Core so the file is migrated and verified before it is exported.
  const workspace = loadWorkspace(fs.readFileSync(workspaceFile, "utf8"))

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

      // This editor is its own consumer, so it keeps the bindings scanner it
      // hands to any other project. `npm run bindings` runs it to write
      // `seldon/refs/bindings.json`, which the connections overlay reads.
      includeScripts: true,
    },
  })

  // Clear the generated icon folder so a pruned or renamed icon leaves no stale
  // file behind, matching the React export script.
  fs.rmSync(path.join(editorRoot, "seldon/icons"), { recursive: true, force: true })

  for (const file of files) {
    const target = path.join(editorRoot, file.path)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(
      target,
      file.encoding === "base64" ? Buffer.from(file.content, "base64") : file.content,
    )
  }

  console.log(`Exported ${files.length} files into ${path.join(editorRoot, "seldon")}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
