import { useDebugStore } from "@lib/hooks/use-debug-mode"

const EXPORT_TAG = "%c[seldon/export]%c"
const EXPORT_TAG_STYLE = "color:#0284c7;font-weight:bold"

export function isExportLoggingEnabled(): boolean {
  return useDebugStore.getState().exportLogging
}

export function logExportGroup(title: string, ...args: unknown[]): void {
  if (!isExportLoggingEnabled()) return
  console.groupCollapsed(
    `${EXPORT_TAG} ${title}`,
    EXPORT_TAG_STYLE,
    "",
    ...args,
  )
}

export function logExportGroupEnd(): void {
  if (!isExportLoggingEnabled()) return
  console.groupEnd()
}

export function logExport(message: string, ...args: unknown[]): void {
  if (!isExportLoggingEnabled()) return
  console.info(`${EXPORT_TAG} ${message}`, EXPORT_TAG_STYLE, "", ...args)
}

export function logExportWarn(message: string, ...args: unknown[]): void {
  if (!isExportLoggingEnabled()) return
  console.warn(`${EXPORT_TAG} ${message}`, EXPORT_TAG_STYLE, "", ...args)
}

export function logExportError(message: string, ...args: unknown[]): void {
  if (!isExportLoggingEnabled()) return
  console.error(`${EXPORT_TAG} ${message}`, EXPORT_TAG_STYLE, "", ...args)
}

export function logExportRows(rows: Record<string, unknown>[]): void {
  if (!isExportLoggingEnabled() || rows.length === 0) return
  console.dir(rows)
}
