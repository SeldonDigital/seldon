import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { DEVICE_VIEWS } from "@seldon/editor/lib/devices/constants"
import type { DeviceId } from "@seldon/editor/lib/devices/types"

/**
 * Device-preview mode: whether the canvas renders a device frame and which
 * device. Mirrors the React `use-preview` store. Distinct from the transient
 * preview-workspace overlay in `preview-store`.
 */
export const usePreviewModeStore = defineStore("preview-mode", () => {
  const isInPreviewMode = ref(false)
  const deviceId = ref<DeviceId>("phone")

  const device = computed(() => DEVICE_VIEWS[deviceId.value])

  function togglePreviewMode(enable?: boolean): void {
    isInPreviewMode.value =
      typeof enable === "boolean" ? enable : !isInPreviewMode.value
  }

  function setDevice(next: DeviceId): void {
    deviceId.value = next
  }

  return { isInPreviewMode, deviceId, device, togglePreviewMode, setDevice }
})
