import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * True while a local export is running. Drives the topbar export animation.
 * Mirrors the React `export-status-store`.
 */
export const useExportStatusStore = defineStore("export-status", () => {
  const isExporting = ref(false)

  function setExporting(value: boolean): void {
    isExporting.value = value
  }

  return { isExporting, setExporting }
})
