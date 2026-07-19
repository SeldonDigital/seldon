import { DEVICE_VIEWS } from "@lib/devices/constants"
import { DeviceId } from "@lib/devices/types"
import { create } from "zustand"

interface PreviewState {
  isInPreviewMode: boolean
  device: DeviceId
  togglePreviewMode: (isInPreviewMode?: boolean) => void
  setDevice: (device: DeviceId) => void
}

const useStore = create<PreviewState>((set) => ({
  isInPreviewMode: false,
  device: "phone",
  togglePreviewMode: (enable?: boolean) =>
    set((state) => {
      if (typeof enable === "boolean") {
        return { isInPreviewMode: enable }
      } else {
        return { isInPreviewMode: !state.isInPreviewMode }
      }
    }),
  setDevice: (device) => set(() => ({ device })),
}))

export function usePreview() {
  const { isInPreviewMode, device, togglePreviewMode, setDevice } = useStore()

  return {
    isInPreviewMode,
    deviceId: device,
    device: DEVICE_VIEWS[device],
    togglePreviewMode,
    setDevice,
  }
}
