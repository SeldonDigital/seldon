import { DeviceConfig, DeviceId } from "./types"

export const DEVICE_VIEWS: Record<DeviceId, DeviceConfig> = {
  desktop: {
    name: "Desktop",
    width: 1440,
    height: 1024,
  },
  laptop: {
    name: "Laptop",
    width: 1280,
    height: 800,
  },
  tablet: {
    name: "Tablet",
    width: 768,
    height: 1024,
  },
  phone: {
    name: "Mobile",
    width: 375,
    height: 812,
  },
  watch: {
    name: "Watch",
    width: 198,
    height: 242,
  },
  tv: {
    name: "Television",
    width: 3840,
    height: 2160,
  },
}
