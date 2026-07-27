export type DeviceId =
  | "desktop"
  | "laptop"
  | "tablet"
  | "phone"
  | "watch"
  | "tv"

export interface DeviceConfig {
  name: string
  width: number
  height: number
}
