import { Workspace } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ORDERED_COMPONENT_LEVELS } from "@seldon/core/components/constants"
import { getWorkspaceEnabledIcons } from "@seldon/core/icon-sets/helpers"

import { buildExportContext } from "../../helpers/build-export-context"
import { buildStyleRegistry } from "../css/discovery/get-style-registry"
import { generateComponentStylesheet } from "../css/generation/generate-css-stylesheet"
import { generateThemeStylesheetFiles } from "../css/generation/insert-theme-variables"
import { generateRefsRegistry } from "../react/assets/generate-refs-registry"
import { getFilesToExportFromImagesToExport } from "../react/assets/get-files-to-export-from-images-to-export"
import { getImagesToExport } from "../react/assets/get-images-to-export"
import { replaceImagesWithRelativePaths } from "../react/assets/transform-image-paths"
import { assertUniqueVariantNames } from "../react/discovery/assert-unique-variant-names"
import { getUsedIconIds } from "../react/discovery/get-used-icon-ids"
import { format } from "../react/format"
import { insertLicense } from "../react/generation/inserts/insert-license"
import { ExportOptions, FileToExport } from "../types"
import { generateFrameComponent } from "./assets/generate-frame"
import { getVueIcons } from "./assets/get-vue-icons"
import { getVueUtilityFiles } from "./assets/get-vue-utility-files"
import { getComponentsToExport } from "./discovery/get-components-to-export"
import { generateComponentFiles } from "./generation/generate-component-files"

/**
 * Exports a workspace to a Vue project. This is the Vue analog of
 * {@link exportReact}: it reuses the shared CSS pipeline, theme stylesheets,
 * discovery IR, style registry, and refs registry verbatim, and emits `.vue`
 * single-file components in place of `.tsx`.
 */
export async function exportVue(
  input: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]> {
  const filesToExport: FileToExport[] = []
  let workspace = input

  assertUniqueVariantNames(workspace)

  const { parentIndex } = buildExportContext(workspace)

  const {
    nodeIdToClass,
    classes,
    stateClasses,
    descendantStateClasses,
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

  const imagesToExport = await getImagesToExport(workspace, options)
  workspace = replaceImagesWithRelativePaths(workspace, imagesToExport)

  try {
    filesToExport.push(
      ...generateComponentFiles(
        componentsToExport,
        workspace,
        nodeIdToClass,
        options,
      ),
    )
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
    const refsRegistryFile = generateRefsRegistry(
      componentsToExport,
      nodeIdToClass,
      options,
    )
    if (refsRegistryFile) filesToExport.push(refsRegistryFile)
  } catch {
    // Failed to generate refs registry
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

  // License and format only source files Prettier understands here. The `.vue`
  // SFCs are emitted pre-formatted; the export Prettier config has no Vue
  // parser, so formatting them would throw.
  await Promise.all(
    filesToExport.map(async (file) => {
      if (typeof file.content !== "string") return
      if (isFormattableSource(file.path)) {
        file.content = insertLicense(file.content)
        if (!options.skipFormat) file.content = await format(file.content)
      }
    }),
  )

  return filesToExport
}

const FORMATTABLE_SOURCE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]

function isFormattableSource(path: string): boolean {
  return FORMATTABLE_SOURCE_EXTENSIONS.some((ext) => path.endsWith(ext))
}
