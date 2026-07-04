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

  // Generate the ref-override file
  const applyRefUtilsContent = `import { combineClassNames } from "./class-name"

/**
 * Layers a caller-supplied override onto a slot's merged props, keyed by the
 * slot's \`data-seldon-ref\` name. This is the ref override channel: a view model
 * passes \`seldonRefs\` to a component, and each slot whose ref matches receives
 * the override last. \`className\` is merged with the slot's existing classes so
 * generated styles are preserved while extra classes are added.
 *
 * @param seldonRefs - Map of ref name to override props, or undefined
 * @param props - The slot's merged props (carries its \`data-seldon-ref\`), or null
 * @returns The props with the matching override applied, or the input unchanged
 */
export function applyRef<T extends Record<string, unknown> | null>(
  seldonRefs: Record<string, Record<string, unknown>> | undefined,
  props: T,
): T {
  if (!seldonRefs || props === null) return props

  const ref = (props as Record<string, unknown>)["data-seldon-ref"]
  if (typeof ref !== "string") return props

  const override = seldonRefs[ref]
  if (!override) return props

  const merged: Record<string, unknown> = { ...(props as Record<string, unknown>), ...override }

  const baseClassName = (props as Record<string, unknown>)["className"]
  const overrideClassName = override["className"]
  if (typeof baseClassName === "string" || typeof overrideClassName === "string") {
    merged["className"] = combineClassNames(
      typeof baseClassName === "string" ? baseClassName : undefined,
      typeof overrideClassName === "string" ? overrideClassName : undefined,
    )
  }

  return merged as T
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/apply-ref.ts`,
    content: applyRefUtilsContent,
  })

  // Generate the icon-registry file. The generated `Icon` renders static catalog
  // ids from its `iconMap`. A consumer can register extra ids at runtime that map
  // to arbitrary React components (dynamic, prop-driven icons the factory cannot
  // emit as static SVGs). `Icon` consults this registry for any id absent from
  // `iconMap` before falling back to the default icon.
  const iconRegistryUtilsContent = `import type { ComponentType } from "react"

/** Props any registered icon may receive; the generated \`Icon\` spreads its own props through. */
export type RegisteredIconProps = Record<string, unknown>

const registry = new Map<string, ComponentType<RegisteredIconProps>>()

/**
 * Registers a React component under an icon id. Call this at startup for each
 * dynamic icon the generated \`Icon\` should render but that has no catalog SVG.
 */
export function registerIcon(
  id: string,
  component: ComponentType<RegisteredIconProps>,
): void {
  registry.set(id, component)
}

/** Returns the component registered for an icon id, or undefined when none is. */
export function getRegisteredIcon(
  id: string | undefined,
): ComponentType<RegisteredIconProps> | undefined {
  if (!id) return undefined
  return registry.get(id)
}
`

  utilityFiles.push({
    path: `${options.output.componentsFolder}/utils/icon-registry.ts`,
    content: iconRegistryUtilsContent,
  })

  return utilityFiles
}
