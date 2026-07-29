import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Whether a local export is running, and how to stop it. Drives the topbar export
 * animation and the dialog's dismissal. Mirrors the React `export-status-store`.
 */
export const useExportStatusStore = defineStore("export-status", () => {
  const isExporting = ref(false)
  /** Stops the running export. Null when nothing cancellable is in flight. */
  const cancelExport = ref<(() => void) | null>(null)

  function setExporting(value: boolean): void {
    isExporting.value = value
  }

  function setCancelExport(cancel: (() => void) | null): void {
    cancelExport.value = cancel
  }

  return { isExporting, cancelExport, setExporting, setCancelExport }
})
