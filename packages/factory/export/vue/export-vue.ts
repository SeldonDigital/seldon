import { getComponentSchema } from "@seldon/core/components/catalog"
import { ORDERED_COMPONENT_LEVELS } from "@seldon/core/components/constants"
import { getWorkspaceEnabledIcons } from "@seldon/core/icon-sets/helpers"

import { buildExportContext } from "../../helpers/build-export-context"
import { buildStyleRegistry } from "../css/discovery/get-style-registry"
import { generateComponentStylesheet } from "../css/generation/generate-css-stylesheet"
import { generateThemeStylesheetFiles } from "../css/generation/insert-theme-variables"
import { getFilesToExportFromImagesToExport } from "../react/assets/get-files-to-export-from-images-to-export"
import { getImagesToExport } from "../react/assets/get-images-to-export"
import { replaceImagesWithRelativePaths } from "../react/assets/transform-image-paths"
import { assertUniqueVariantNames } from "../react/discovery/assert-unique-variant-names"
import { getUsedIconIds } from "../react/discovery/get-used-icon-ids"
import { format } from "../react/format"
import {
  insertLicense,
  insertVueLicense,
  isIconExportPath,
} from "../react/generation/inserts/insert-license"
import { generateRefsRegistry } from "../shared/generate-refs-registry"
import { generateFrameComponent } from "./assets/generate-frame"
import { getVueIcons } from "./assets/get-vue-icons"
import { getVueUtilityFiles } from "./assets/get-vue-utility-files"
import { getComponentsToExport } from "./discovery/get-components-to-export"
import { formatVue } from "./format-vue"
import { generateComponentFiles } from "./generation/generate-component-files"

import type { RefViewSource } from "../shared/generate-refs-registry"
import type { ExportOptions, FileToExport } from "../types"
import type { Workspace } from "@seldon/core"

/**
 * Exports a workspace to a Vue project. This is the Vue analog of
 * {@link exportReact}: it reuses the shared CSS pipeline, theme stylesheets,
 * discovery IR, style registry, and refs registry verbatim, and emits `.vue`
 * single-file components in place of `.tsx`.
 */
export async function exportVue(input: Workspace, options: ExportOptions): Promise<FileToExport[]> {
  const filesToExport: FileToExport[] = []
  let workspace = input

  const { parentIndex } = buildExportContext(workspace)

  // Resolve image sources to their exported asset files before building the
  // style registry and component trees, so the emitted CSS `background-image`
  // and component `src` reference the written files instead of inlining the
  // original data URL. Sources that fail to resolve are dropped, so they keep
  // their original value and one unreachable image never discards the rest.
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

  // Block export when two emitted variants share a name, which would collide on
  // one output path. Scoped to the emitted set so a pruned mock or exclude
  // variant never blocks.
  assertUniqueVariantNames(workspace, new Set(componentsToExport.map((item) => item.variantId)))

  const levelOrder = ORDERED_COMPONENT_LEVELS.slice().reverse()

  componentsToExport = componentsToExport.sort((a, b) => {
    const aLevelIndex = levelOrder.indexOf(getComponentSchema(a.componentId).level)
    const bLevelIndex = levelOrder.indexOf(getComponentSchema(b.componentId).level)

    return aLevelIndex - bLevelIndex
  })

  const usedIconIds = getUsedIconIds(workspace)

  if (options.exportAllIconSetIcons !== false) {
    for (const iconId of getWorkspaceEnabledIcons(workspace)) {
      usedIconIds.add(iconId)
    }
  }

  filesToExport.push({
    path: `${options.output.componentsFolder}/styles.css`,
    content: await generateComponentStylesheet(
      classes,
      workspace,
      classNameToNodeId,
      nodeTreeDepths,
      stateClasses,
      descendantStateClasses,
    ),
  })

  const themeStylesheets = await generateThemeStylesheetFiles(
    workspace,
    options.output.componentsFolder,
    options.exportAllThemes !== false,
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
    console.warn("Failed to generate Vue component files:", error)
  }

  try {
    filesToExport.push(generateFrameComponent(options))
  } catch {
    // Failed to generate Frame component
  }

  try {
    filesToExport.push(...getVueUtilityFiles(options))
  } catch {
    // Failed to generate utility files
  }

  try {
    filesToExport.push(...getVueIcons(usedIconIds, options))
  } catch (error) {
    console.warn("Failed to generate Vue icons:", error)
  }

  try {
    filesToExport.push(...(await generateRefsRegistry(refSources, nodeIdToClass, options)))
  } catch {
    // Failed to generate refs registry
  }

  filesToExport.push(...imageFiles)

  // License and format every source file, each through the parser its extension
  // calls for. Single-file components go through Prettier's `vue` parser, which
  // reprints the template and the script block together.
  await Promise.all(
    filesToExport.map(async (file) => {
      if (typeof file.content !== "string") return

      if (isSingleFileComponent(file.path)) {
        const licensed = isIconExportPath(file.path) ? file.content : insertVueLicense(file.content)

        file.content = await formatVue(licensed, options)

        return
      }

      if (isFormattableSource(file.path)) {
        if (!isIconExportPath(file.path)) file.content = insertLicense(file.content)
        if (!options.skipFormat) file.content = await format(file.content, options)
      }
    }),
  )

  return filesToExport
}

const FORMATTABLE_SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]

function isSingleFileComponent(path: string): boolean {
  return path.endsWith(".vue")
}

function isFormattableSource(path: string): boolean {
  return FORMATTABLE_SOURCE_EXTENSIONS.some((ext) => path.endsWith(ext))
}
