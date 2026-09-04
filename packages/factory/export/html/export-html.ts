import { getComponentSchema } from "@seldon/core/components/catalog"
import { ORDERED_COMPONENT_LEVELS } from "@seldon/core/components/constants"

import { buildExportContext } from "../../helpers/build-export-context"
import { buildStyleRegistry } from "../css/discovery/get-style-registry"
import { generateComponentStylesheet } from "../css/generation/generate-css-stylesheet"
import { generateThemeStylesheetFiles } from "../css/generation/insert-theme-variables"
import { getFilesToExportFromImagesToExport } from "../react/assets/get-files-to-export-from-images-to-export"
import { getImagesToExport } from "../react/assets/get-images-to-export"
import { replaceImagesWithRelativePaths } from "../react/assets/transform-image-paths"
import { assertUniqueVariantNames } from "../react/discovery/assert-unique-variant-names"
import { format } from "../react/format"
import { insertHtmlLicense, insertLicense } from "../react/generation/inserts/insert-license"
import { generateRefsRegistry } from "../shared/generate-refs-registry"
import { getFontsSnippet } from "./assets/get-fonts-snippet"
import { getComponentsToExport } from "./discovery/get-components-to-export"
import { formatHtml } from "./format-html"
import { generateComponentFiles } from "./generation/generate-component-files"
import { generateReadmeFile } from "./generation/generate-readme-file"

import type { RefViewSource } from "../shared/generate-refs-registry"
import type { ExportOptions, FileToExport } from "../types"
import type { Workspace } from "@seldon/core"

/**
 * Exports a workspace as flattened HTML fragments plus shared CSS. This is the
 * HTML analog of {@link exportVue}: it reuses the shared CSS pipeline, theme
 * stylesheets, discovery IR, style registry, and refs registry, and emits one
 * `.html` file per variant with no includes and no component API.
 */
export async function exportHtml(
  input: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]> {
  const filesToExport: FileToExport[] = []
  let workspace = input

  const { parentIndex } = buildExportContext(workspace)

  const imagesToExport = await getImagesToExport(workspace, options)
  const imageFiles = await getFilesToExportFromImagesToExport(imagesToExport, options)

  workspace = replaceImagesWithRelativePaths(workspace, imagesToExport)

  const {
    nodeIdToClass,
    classes,
    stateClasses,
    descendantStateClasses,
    classNameToNodeId,
    nodeTreeDepths,
  } = buildStyleRegistry(workspace, options.publishAll, parentIndex)

  let componentsToExport = getComponentsToExport(workspace, options, nodeIdToClass)

  assertUniqueVariantNames(workspace, new Set(componentsToExport.map((item) => item.variantId)))

  const levelOrder = ORDERED_COMPONENT_LEVELS.slice().reverse()

  componentsToExport = componentsToExport.sort((a, b) => {
    const aLevelIndex = levelOrder.indexOf(getComponentSchema(a.componentId).level)
    const bLevelIndex = levelOrder.indexOf(getComponentSchema(b.componentId).level)

    return aLevelIndex - bLevelIndex
  })

  filesToExport.push({
    path: `${options.output.componentsFolder}/styles.css`,
    content: await generateComponentStylesheet(
      classes,
      workspace,
      classNameToNodeId,
      nodeTreeDepths,
      stateClasses,
      descendantStateClasses,
      options.formatConfigRoot,
    ),
  })

  const themeStylesheets = await generateThemeStylesheetFiles(
    workspace,
    options.output.componentsFolder,
    options.exportAllThemes !== false,
    options.formatConfigRoot,
  )

  filesToExport.push(...themeStylesheets)

  let refSources: RefViewSource[] = []

  try {
    const componentFiles = generateComponentFiles(
      componentsToExport,
      workspace,
      nodeIdToClass,
      options,
    )

    filesToExport.push(...componentFiles.files)
    refSources = componentFiles.refSources
  } catch (error) {
    console.warn("Failed to generate HTML fragments:", error)
  }

  try {
    filesToExport.push(...(await generateRefsRegistry(refSources, nodeIdToClass, options)))
  } catch {
    // Failed to generate refs registry
  }

  try {
    filesToExport.push(getFontsSnippet(workspace, options))
  } catch {
    // Failed to generate fonts snippet
  }

  try {
    filesToExport.push(generateReadmeFile(options))
  } catch {
    // Failed to generate README
  }

  filesToExport.push(...imageFiles)

  await Promise.all(
    filesToExport.map(async (file) => {
      if (typeof file.content !== "string") return

      if (isHtmlFragment(file.path)) {
        file.content = await formatHtml(insertHtmlLicense(file.content), options)

        return
      }

      if (isFormattableSource(file.path)) {
        file.content = insertLicense(file.content)
        if (!options.skipFormat) file.content = await format(file.content, options)
      }
    }),
  )

  return filesToExport
}

const FORMATTABLE_SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]

function isHtmlFragment(path: string): boolean {
  return path.endsWith(".html")
}

function isFormattableSource(path: string): boolean {
  return FORMATTABLE_SOURCE_EXTENSIONS.some((ext) => path.endsWith(ext))
}
