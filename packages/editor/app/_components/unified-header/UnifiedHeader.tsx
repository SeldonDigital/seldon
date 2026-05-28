"use client"

import { DEVICE_VIEWS } from "@lib/devices/constants"
import { DeviceId } from "@lib/devices/types"
import { useAppState } from "@lib/hooks/use-app-state"
import { usePreview } from "@lib/hooks/use-preview"
import { Menu, useMenuConfig } from "@components/menu"
import { HEADER_HEIGHT } from "../constants"
import { DeviceButton } from "./DeviceButton"
import { Toolbar } from "./Toolbar"

export function UnifiedHeader() {
  const { appState } = useAppState()
  const { menuConfig } = useMenuConfig()
  const { isInPreviewMode, togglePreviewMode } = usePreview()
  const { deviceId: currentDevice, setDevice } = usePreview()

  return (
    <header
      className="relative z-10 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-neutral-900 bg-background px-5 tracking-tight"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Seldon" className="h-5 w-5 shrink-0" />
          <img
            src="/word-mark.svg"
            alt="Seldon"
            className="h-[22px] w-auto shrink-0"
          />
        </div>
        {appState === "edit" && !isInPreviewMode && (
          <Menu menus={menuConfig} className="flex" />
        )}
      </div>

      <div className="flex flex-1 justify-center">
        {appState === "edit" && !isInPreviewMode && (
          <div
            className="flex items-center gap-4 border-l border-r border-neutral-800"
            style={{ display: "none" }}
          >
            <Toolbar />
          </div>
        )}
        {isInPreviewMode && (
          <div className="flex items-center gap-4 border-l border-r border-neutral-800 px-4 py-2">
            {Object.entries(DEVICE_VIEWS).map(([device, { name, width, height }]) => (
              <DeviceButton
                key={device}
                isSelected={device === currentDevice}
                title={`${name} (${width}x${height})`}
                device={device as DeviceId}
                onClick={() => setDevice(device as DeviceId)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        {isInPreviewMode && (
          <button
            type="button"
            className="text-sm text-white/80 hover:text-white"
            onClick={togglePreviewMode}
          >
            Exit preview
          </button>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 h-[1px] w-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #FF4F4F 0%, #EBEB00 20%, #45E66D 40%, #3FB5FF 70%, #FF4F4F 100%)",
        }}
      />
    </header>
  )
}
