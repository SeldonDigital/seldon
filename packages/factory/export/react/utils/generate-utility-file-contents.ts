import { ExportOptions, FileToExport } from "../../types"

/**
 * Generates utility files needed by the exported components
 * This includes the class name utilities that components import
 *
 * @param options - Export options to determine output paths
 * @returns Array of utility files to export
 */
export function getUtilityFileContents(options: ExportOptions): FileToExport[] {
  const utilityFiles: FileToExport[] = []

  // Generate the class-name file
  const classNameUtilsContent = `/**
 * Utility function to combine default and custom classNames while removing duplicates
 * 
 * @param defaultClassName - The base className(s)
 * @param customClassName - Optional additional className(s) to append
 * @returns A clean, deduplicated className string
 * 
 * @example
 * \`\`\`ts
 * combineClassNames("btn primary", "primary large") // "btn primary large"
 * combineClassNames("btn", undefined) // "btn"
 * combineClassNames("btn", "") // "btn"
 * \`\`\`
 */
export function combineClassNames(defaultClassName?: string, customClassName?: string): string {
  if (!defaultClassName) return customClassName || ""
  if (!customClassName) return defaultClassName
  
  const defaultClasses = defaultClassName.split(' ').filter(Boolean)
  const customClasses = customClassName.split(' ').filter(Boolean)
  const allClasses = [...defaultClasses, ...customClasses]
  
  // Remove duplicates using Set
  const uniqueClasses = Array.from(new Set(allClasses))
  return uniqueClasses.join(' ')
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/class-name.ts`,
    content: classNameUtilsContent,
  })

  return utilityFiles
}
