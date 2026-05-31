import * as path from "path"

import type { Workspace } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

import { getWorkspaceNodeList } from "../../../helpers/workspace-nodes"
import type { ExportOptions, ImageToExportMap } from "../../types"

export async function getImagesToExport(
  workspace: Workspace,
  options: ExportOptions,
) {
  const images: ImageToExportMap = {}
  const usedFilenames = new Set<string>()

  for (const node of getWorkspaceNodeList(workspace)) {
    const properties = getNodeProperties(node, workspace)
    const backgroundImage = properties?.background?.[0]?.image?.value
    if (backgroundImage) {
      await addIfNotExist(backgroundImage)
    }

    if (properties.source?.value) {
      await addIfNotExist(properties.source.value)
    }
  }

  async function addIfNotExist(value: string) {
    if (images[value]) {
      return
    }

    const filename = getUniqueFilename(
      getSafeImageFilename(value),
      usedFilenames,
    )

    const relativePath = path.posix.join(
      options.output.assetPublicPath,
      filename,
    )

    images[value] = {
      relativePath,
      uploadPath: path.posix.join(options.output.assetsFolder, filename),
    }
  }

  return images
}

function getSafeImageFilename(value: string): string {
  const rawFilename = getImageFilename(value)
  const withoutQuery = rawFilename.split("?")[0]?.split("#")[0] ?? ""

  let decoded = withoutQuery
  try {
    decoded = decodeURIComponent(withoutQuery)
  } catch {
    decoded = withoutQuery
  }

  const sanitized = decoded
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/^\.+/, "")
    .slice(0, 120)

  if (!sanitized) return "image.png"
  if (!sanitized.includes(".")) return `${sanitized}.png`
  return sanitized
}

function getImageFilename(value: string): string {
  try {
    const url = new URL(value)
    return path.posix.basename(url.pathname)
  } catch {
    return value.split("/").pop() ?? "image.png"
  }
}

function getUniqueFilename(
  filename: string,
  usedFilenames: Set<string>,
): string {
  if (!usedFilenames.has(filename)) {
    usedFilenames.add(filename)
    return filename
  }

  const extension = path.posix.extname(filename)
  const basename = extension ? filename.slice(0, -extension.length) : filename
  let index = 2
  let uniqueFilename = `${basename}-${index}${extension}`

  while (usedFilenames.has(uniqueFilename)) {
    index += 1
    uniqueFilename = `${basename}-${index}${extension}`
  }

  usedFilenames.add(uniqueFilename)
  return uniqueFilename
}
