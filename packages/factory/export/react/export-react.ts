import { Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ORDERED_COMPONENT_LEVELS } from "@seldon/core/components/constants"
import { getWorkspaceEnabledIcons } from "@seldon/core/icon-sets/helpers"

import { buildExportContext } from "../../helpers/build-export-context"
import { buildStyleRegistry } from "../css/discovery/get-style-registry"
import { generateComponentStylesheet } from "../css/generation/generate-css-stylesheet"
import { generateThemeStylesheetFiles } from "../css/generation/insert-theme-variables"
import { ExportOptions, FileToExport } from "../types"
import { generateIconIndex } from "./assets/generate-icon-index"
import { generateRefsRegistry } from "./assets/generate-refs-registry"
import { getFilesToExportFromImagesToExport } from "./assets/get-files-to-export-from-images-to-export"
import { getFontsComponent } from "./assets/get-fonts-component"
import { getIcons } from "./assets/get-icons"
import { getImagesToExport } from "./assets/get-images-to-export"
import { replaceImagesWithRelativePaths } from "./assets/transform-image-paths"
import { getComponentsToExport } from "./discovery/get-components-to-export"
import { getUsedIconIds } from "./discovery/get-used-icon-ids"
import { generateComponentFiles } from "./generation/helpers/generate-component-files"
import { generateFrameComponent } from "./generation/helpers/generate-frame-component"
import { generateReadmeFile } from "./generation/helpers/generate-readme-file"
import { getNativeComponentFiles } from "./generation/helpers/get-native-component-files"
import { insertLicense } from "./generation/inserts/insert-license"
import { getUtilityFileContents } from "./utils/generate-utility-file-contents"

export async function exportReact(
  input: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]> {
  const filesToExport: FileToExport[] = []
  let workspace = input

  const { parentIndex } = buildExportContext(workspace)

  const {
    nodeIdToClass,
    classes,
    stateClasses,
    classNameToNodeId,
    nodeTreeDepths,
  } = buildStyleRegistry(workspace, options.publishAll, parentIndex)

  let componentsToExport = getComponentsToExport(
    workspace,
    options,
    nodeIdToClass,
  )

  const levelOrder = ORDERED_COMPONENT_LEVELS.slice().reverse()
  componentsToExport = componentsToExport.sort((a, b) => {
    const aSchema = getComponentSchema(a.componentId)
    const bSchema = getComponentSchema(b.componentId)
    const aLevelIndex = levelOrder.indexOf(aSchema.level)
    const bLevelIndex = levelOrder.indexOf(bSchema.level)

    if (aLevelIndex === bLevelIndex) {
      return 0
    }

    return aLevelIndex - bLevelIndex
  })

  // Every icon turned on in the workspace's icon sets exports, even when no
  // component references it, so users can ship complete icon sets.
  const usedIconIds = getUsedIconIds(workspace)
  for (const iconId of getWorkspaceEnabledIcons(workspace)) {
    usedIconIds.add(iconId)
  }

  filesToExport.push({
    path: `${options.output.componentsFolder}/styles.css`,
    content: await generateComponentStylesheet(
      classes,
      workspace,
      classNameToNodeId,
      nodeTreeDepths,
      stateClasses,
    ),
  })

  const themeStylesheets = await generateThemeStylesheetFiles(
    workspace,
    options.output.componentsFolder,
  )
  filesToExport.push(
    ...themeStylesheets.map((file) => ({
      path: file.path,
      content: file.content,
    })),
  )

  const imagesToExport = await getImagesToExport(workspace, options)
  workspace = replaceImagesWithRelativePaths(workspace, imagesToExport)

  try {
    const componentFiles = await generateComponentFiles(
      componentsToExport,
      workspace,
      nodeIdToClass,
      usedIconIds,
      options,
    )
    filesToExport.push(...componentFiles)
  } catch (error) {
    console.warn("Failed to generate component files:", error)
  }

  try {
    const primitives = getNativeComponentFiles(
      workspace,
      componentsToExport,
      options,
    )
    filesToExport.push(...primitives)
  } catch {
    // Failed to generate native component files
  }

  try {
    const frameComponent = await generateFrameComponent(options)
    filesToExport.push(frameComponent)
  } catch {
    // Failed to generate frame component
  }

  try {
    const iconComponents = getIcons(usedIconIds, options)
    filesToExport.push(...iconComponents)
  } catch {
    // Failed to generate icon components
  }

  try {
    const iconIndexFile = generateIconIndex(usedIconIds, options)
    filesToExport.push(iconIndexFile)
  } catch {
    // Failed to generate icon index
  }

  try {
    const refsRegistryFile = generateRefsRegistry(
      componentsToExport,
      nodeIdToClass,
      options,
    )
    if (refsRegistryFile) {
      filesToExport.push(refsRegistryFile)
    }
  } catch {
    // Failed to generate refs registry
  }

  try {
    const fontsComponent = await getFontsComponent(workspace, options)
    filesToExport.push(fontsComponent)
  } catch {
    // Failed to generate fonts component
  }

  try {
    const readmeFile = generateReadmeFile(options)
    filesToExport.push(readmeFile)
  } catch {
    // Failed to generate README
  }

  try {
    const utilityFiles = getUtilityFileContents(options)
    filesToExport.push(...utilityFiles)
  } catch {
    // Failed to generate utility files
  }

  try {
    const images = await getFilesToExportFromImagesToExport(
      imagesToExport,
      options,
    )
    filesToExport.push(...images)
  } catch {
    // Failed to export images
  }

  filesToExport.forEach((file) => {
    if (typeof file.content === "string") {
      file.content = insertLicense(file.content)
    }
  })

  return filesToExport
}
