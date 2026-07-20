import { ExportOptions, FileToExport } from "../../types"

/**
 * Emits the small runtime helpers the generated Vue components import: class
 * name joining and per-slot prop merging. These are framework-neutral utilities
 * that mirror the React target's `combineClassNames`, adapted for the Vue
 * merged-slot model.
 */
export function getVueUtilityFiles(options: ExportOptions): FileToExport[] {
  const folder = options.output.componentsFolder

  const classNames = `export function combineClassNames(
  ...names: Array<string | null | undefined>
): string {
  return names.filter(Boolean).join(" ")
}

type SlotProps = Record<string, unknown> | null | undefined

/**
 * Layers a caller's slot override over the component's baked default props.
 * Returning \`null\` when the caller explicitly passes \`null\` lets a component
 * suppress a default child, matching the export's slot semantics.
 */
export function mergeSlot(base: SlotProps, override: SlotProps): Record<string, unknown> | null {
  if (override === null) return null
  const merged: Record<string, unknown> = { ...(base ?? {}), ...(override ?? {}) }
  const baseClass = (base as { className?: string } | null | undefined)?.className
  const overrideClass = (override as { className?: string } | null | undefined)?.className
  const className = combineClassNames(baseClass, overrideClass)
  if (className) merged.className = className
  return merged
}
`

  return [
    {
      path: `${folder}/utils/class-names.ts`.replaceAll("//", "/"),
      content: classNames,
    },
  ]
}
