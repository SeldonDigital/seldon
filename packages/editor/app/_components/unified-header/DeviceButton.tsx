"use client"

import { DeviceId } from "@lib/devices/types"
import { cn } from "@lib/utils/cn"
import { Selectable } from "@components/ui/Selectable"
import { IconDesktop } from "../icons/Desktop"
import { IconFullScreen } from "../icons/FullScreen"
import { IconLaptop } from "../icons/Laptop"
import { IconPhone } from "../icons/Phone"
import { IconTablet } from "../icons/Tablet"
import { IconTV } from "../icons/Tv"
import { IconWatch } from "../icons/Watch"

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
      className={cn(
        `flex h-8 w-8 items-center justify-center text-lg`,
        isSelected === false && "text-white/40",
      )}
    >
      {device === "custom" && <IconFullScreen />}
      {device === "desktop" && <IconDesktop />}
      {device === "laptop" && <IconLaptop />}
      {device === "phone" && <IconPhone />}
      {device === "tablet" && <IconTablet />}
      {device === "tv" && <IconTV />}
      {device === "watch" && <IconWatch />}
    </Selectable>
  )
}
