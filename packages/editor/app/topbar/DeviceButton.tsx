"use client"

import { DeviceId } from "@lib/devices/types"
import { Selectable } from "@seldon/components/custom-components"
import {
  IconMaterialComputer,
  IconMaterialFullscreen,
  IconMaterialLaptop,
  IconMaterialSmartphone,
  IconMaterialTablet,
  IconMaterialTv,
  IconMaterialWatch,
} from "@seldon/components/icons"

export type Icon =
  | "custom"
  | "desktop"
  | "laptop"
  | "phone"
  | "tablet"
  | "tv"
  | "watch"

interface IconButtonProps {
  title: string
  isSelected?: boolean
  device: DeviceId | "custom"
  onClick: () => void
}

export function DeviceButton({
  title,
  isSelected = false,
  device,
  onClick,
}: IconButtonProps) {
  return (
    <Selectable
      title={title}
      onClick={onClick}
      as="button"
      state={isSelected ? "selected" : "default"}
      style={{
        display: "flex",
        height: "2rem",
        width: "2rem",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        color: isSelected ? undefined : "rgba(255, 255, 255, 0.4)",
      }}
    >
      {device === "custom" && <IconMaterialFullscreen />}
      {device === "desktop" && <IconMaterialComputer />}
      {device === "laptop" && <IconMaterialLaptop />}
      {device === "phone" && <IconMaterialSmartphone />}
      {device === "tablet" && <IconMaterialTablet />}
      {device === "tv" && <IconMaterialTv />}
      {device === "watch" && <IconMaterialWatch />}
    </Selectable>
  )
}
