import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

import { catalog } from "@seldon/core/components/catalog"
import { addComponent, createEmptyWorkspace } from "@seldon/core/workspace"

import { captureHeadlessWorkspace } from "../packages/ai/mcp/capture-headless"
import { createNodeExportAssetReader } from "../packages/factory"

import type { ComponentId } from "@seldon/core/components/constants"

const ROOT_DIRECTORY = process.cwd()
const PREVIEWS_DIRECTORY = path.join(ROOT_DIRECTORY, "packages/core/components/previews")
const PREVIEW_MAX_SIZE = 2048
const PREVIEW_QUALITY = 1

const componentIds = [
  ...catalog.screens,
  ...catalog.modules,
  ...catalog.parts,
  ...catalog.elements,
  ...catalog.primitives,
  ...catalog.frames,
].map((schema) => schema.id)
const requestedComponentIds = process.argv.slice(2)
const previewComponentIds =
  requestedComponentIds.length > 0
    ? componentIds.filter((componentId) => requestedComponentIds.includes(componentId))
    : componentIds

async function main(): Promise<void> {
  await rm(PREVIEWS_DIRECTORY, { force: true, recursive: true })
  await mkdir(PREVIEWS_DIRECTORY, { recursive: true })

  const previews: Partial<Record<ComponentId, string>> = {}
  const skipped: ComponentId[] = []
  const assetReader = createNodeExportAssetReader(ROOT_DIRECTORY)

  for (const componentId of previewComponentIds) {
    try {
      const workspace = addComponent({ boardKey: componentId }, createEmptyWorkspace())
      const image = await captureHeadlessWorkspace({
        workspace,
        capture: {
          boardKey: componentId,
          maxSize: PREVIEW_MAX_SIZE,
          quality: PREVIEW_QUALITY,
        },
        exportOptions: {
          assetReader,
          rootDirectory: ROOT_DIRECTORY,
          target: {
            framework: "html",
            styles: "css-properties",
          },
        },
      })
      const filename = `${componentId}.jpg`

      await writeFile(path.join(PREVIEWS_DIRECTORY, filename), Buffer.from(image.data, "base64"))
      previews[componentId] = filename
    } catch {
      skipped.push(componentId)
    }
  }

  const manifest = [
    'import type { ComponentId } from "../constants"',
    "",
    "export const COMPONENT_PREVIEW_FILES = {",
    ...Object.entries(previews).map(
      ([componentId, filename]) => `  ${componentId}: "${filename}",`,
    ),
    "} as const satisfies Partial<Record<ComponentId, string>>",
    "",
    `export const COMPONENT_PREVIEW_SKIPPED = ${JSON.stringify(skipped)} as const`,
    "",
  ].join("\n")

  await writeFile(path.join(PREVIEWS_DIRECTORY, "index.ts"), manifest)
}

void main()
