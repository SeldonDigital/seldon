import { Workspace } from "@seldon/core"
import { computeWorkspace } from "../../helpers/compute-workspace"
import { buildStyleRegistry } from "../css/discovery/get-style-registry"
import { generateStylesheet } from "../css/generation/generate-css-stylesheet"
import { ExportOptions, FileToExport } from "../types"
import { getFilesToExportFromImagesToExport } from "./assets/get-files-to-export-from-images-to-export"
import { getFontsComponent } from "./assets/get-fonts-component"
import { getIcons } from "./assets/get-icons"
import { getImagesToExport } from "./assets/get-images-to-export"
import { replaceImagesWithRelativePaths } from "./assets/transform-image-paths"
import { getComponentsToExport } from "./discovery/get-components-to-export"
import { getUsedIconIds } from "./discovery/get-used-icon-ids"
import { format } from "./format"
import { generateFrameComponent } from "./generation/generate-frame-component"
import { generateReadmeFile } from "./generation/generate-readme-file"
import { getNativeComponentFiles } from "./generation/get-native-component-files"
import { insertComponentFunction } from "./generation/insert-component-function"
import { insertDefaultProps } from "./generation/insert-default-props"
import { insertIconMap } from "./generation/insert-icon-map"
import { insertImports } from "./generation/insert-imports"
import { insertInterface } from "./generation/insert-interface"
import { insertLicense } from "./generation/insert-license"
import { getUtilityFileContents } from "./utils/generate-utility-file-contents"

/**
 * Exports a workspace to a list of react compatible files that can then be written to disk, pushed to a git branch, etc.
 *
 * @param workspace - Workspace to export
 * @param options - Options for the export
 * @returns A list of files to save or publish
 */
export async function exportReact(
  input: Workspace,
  options: ExportOptions,
): Promise<FileToExport[]> {
  const filesToExport: FileToExport[] = []

  try {
    /**
     * This computes each property in the workspace and merges properties with parent(s) properties
     */
    let workspace = computeWorkspace(input)

    /**
     * Get a list of components to export based on a workspace
     * This is basically like a todo list
     */
    const { nodeIdToClass, classes, classNameToNodeId, nodeTreeDepths } =
      buildStyleRegistry(workspace)

    const componentsToExport = getComponentsToExport(
      workspace,
      options,
      nodeIdToClass,
    )

    /**
     * Collect all icon IDs used in the workspace for tree shaking and inserting in the Icon component
     */
    const usedIconIds = getUsedIconIds(workspace)

    filesToExport.push({
      path: `${options.output.componentsFolder}/styles.css`,
      content: await generateStylesheet(
        classes,
        workspace,
        classNameToNodeId,
        nodeTreeDepths,
      ),
    })

    /**
     * Get all images used in the workspace to include in the export and
     * replace absolute paths with relative paths based on the export options.
     */
    const imagesToExport = await getImagesToExport(workspace, options)
    workspace = replaceImagesWithRelativePaths(workspace, imagesToExport)

    for (const component of componentsToExport) {
      try {
        let source: string = ""

        // Build up the component source in several steps
        source = insertInterface(source, component)
        source = insertComponentFunction(source, component, nodeIdToClass)
        source = insertDefaultProps(source, component, nodeIdToClass)
        source = insertImports(source, component)

        // If this components config is set to map-icon, we need to insert the icon map
        if (component.config.react.returns === "iconMap") {
          source = insertIconMap(source, usedIconIds)
        }

        // Format the source
        source = await format(source)

        // Add the file to the list of files to export
        filesToExport.push({
          path: component.output.path,
          content: source,
        })
      } catch (componentError) {
        console.error(
          `Error exporting component ${component.name}:`,
          componentError,
        )
        // Continue with other components instead of failing completely
      }
    }

    try {
      const primitives = getNativeComponentFiles(options)
      filesToExport.push(...primitives)
    } catch (primitivesError) {
      // Continue with other exports
      console.error("Error getting native primitives:", primitivesError)
    }

    try {
      const frameComponent = await generateFrameComponent(options)
      filesToExport.push(frameComponent)
    } catch (frameError) {
      // Continue without frame component
      console.error("Error generating frame component:", frameError)
    }

    try {
      // Only export icons that are actually used
      const iconComponents = getIcons(usedIconIds, options)

      filesToExport.push(...iconComponents)
    } catch (iconError) {
      // Continue without icon component
      console.error("Error generating icon component:", iconError)
    }

    try {
      const fontsComponent = await getFontsComponent(workspace, options)
      filesToExport.push(fontsComponent)
    } catch (fontsError) {
      // Continue without fonts component
      console.error("Error generating fonts component:", fontsError)
    }

    try {
      const readmeFile = generateReadmeFile(options)
      filesToExport.push(readmeFile)
    } catch (readmeError) {
      // Continue without README file
      console.error("Error generating README file:", readmeError)
    }

    try {
      const utilityFiles = getUtilityFileContents(options)
      filesToExport.push(...utilityFiles)
    } catch (utilityError) {
      // Continue without utility files
      console.error("Error generating utility files:", utilityError)
    }

    try {
      const images = await getFilesToExportFromImagesToExport(
        imagesToExport,
        options,
      )
      filesToExport.push(...images)
    } catch (imageError) {
      // Continue without image exports
      console.error("Error generating image exports:", imageError)
    }

    // Add license to any file content that is a string
    filesToExport.forEach((file) => {
      if (typeof file.content === "string") {
        file.content = insertLicense(file.content)
      }
    })

    return filesToExport
  } catch (error) {
    console.error("Fatal error during export:", error)
    throw error
  }
}
