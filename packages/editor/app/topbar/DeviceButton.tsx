"use client"

import { DeviceId } from "@lib/devices/types"
import { Selectable } from "@app/ui/Selectable"
import { IconDesktop } from "@seldon/components/custom-icons/Desktop"
import { IconSeldonFullScreen } from "@seldon/components/icons/IconSeldonFullScreen"
import { IconLaptop } from "@seldon/components/custom-icons/Laptop"
import { IconPhone } from "@seldon/components/custom-icons/Phone"
import { IconTablet } from "@seldon/components/custom-icons/Tablet"
import { IconTV } from "@seldon/components/custom-icons/Tv"
import { IconWatch } from "@seldon/components/custom-icons/Watch"

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
      {device === "custom" && <IconSeldonFullScreen />}
      {device === "desktop" && <IconDesktop />}
      {device === "laptop" && <IconLaptop />}
      {device === "phone" && <IconPhone />}
      {device === "tablet" && <IconTablet />}
      {device === "tv" && <IconTV />}
      {device === "watch" && <IconWatch />}
    </Selectable>
  )
}
