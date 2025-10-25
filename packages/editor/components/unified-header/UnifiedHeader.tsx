"use client"

import { Menu, useMenuConfig } from "@components/menu"
import { ToolbarButton } from "@components/toolbar/ToolbarButton"
import { UserIcon } from "@components/unified-header/UserIcon"
import { DEVICE_VIEWS } from "@lib/devices/constants"
import { DeviceId } from "@lib/devices/types"
import { useAppState } from "@lib/hooks/use-app-state"
import { useChat } from "@lib/hooks/use-chat"
import { usePreview } from "@lib/hooks/use-preview"

import { AGENT_NAME } from "@seldon/core/constants"

import { HEADER_HEIGHT } from "../constants"
import { DeviceButton } from "./DeviceButton"
import { Toolbar } from "./Toolbar"

/**
 * Single row header with all nav elements grouped according to:
 * Group 1 (Left): Logo, Menu
 * Group 2 (Center): Tools or Device Bar (depending on mode)
 * Group 3 (Right): Chat, User
 */
export function UnifiedHeader() {
  const { appState } = useAppState()
  const { menuConfig, dialogs } = useMenuConfig()

  // Get tools state for center group
  const { isInPreviewMode, togglePreviewMode } = usePreview()
  const { showChat, setShowChat } = useChat()

  // Get device bar state for preview mode
  const { deviceId: currentDevice, setDevice } = usePreview()

  return (
    <header
      className="relative z-10 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-neutral-900 bg-background px-5 tracking-tight"
      style={{ height: HEADER_HEIGHT }}
    >
      {/* GROUP 1: Left-aligned - Logo and Menu */}
      <div className="flex items-center space-x-4">
        {/* Logo and project name */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="Logo"
            width={20}
            height={20}
            style={{ height: "auto" }}
          />
          <img
            src="/word-mark.svg"
            alt="Logo"
            width={120}
            height={22}
            style={{ height: "auto" }}
          />
        </div>

        {/* Menu Bar */}
        {appState === "edit" && !isInPreviewMode && (
          <div>
            <Menu menus={menuConfig} className="flex" />
          </div>
        )}
      </div>

      {/* GROUP 2: Center-aligned - Tools in edit mode, Device Bar in preview mode */}
      <div className="flex flex-1 justify-center">
        {/* Edit mode tools */}
        {appState === "edit" && !isInPreviewMode && (
          <div className="flex items-center gap-4 border-l border-r border-neutral-800 ">
            {/* Main tools */}
            <Toolbar />
          </div>
        )}

        {/* Preview mode - Device Bar */}
        {isInPreviewMode && (
          <div className="flex items-center gap-4 border-l border-r border-neutral-800 px-4 py-2">
            {Object.entries(DEVICE_VIEWS).map(
              ([device, { name, width, height }]) => {
                return (
                  <DeviceButton
                    key={device}
                    isSelected={device === currentDevice}
                    title={`${name} (${width}x${height})`}
                    device={device as DeviceId}
                    onClick={() => {
                      setDevice(device as DeviceId)
                    }}
                  />
                )
              },
            )}
          </div>
        )}
      </div>

      {/* GROUP 3: Right-aligned - Chat and User */}
      <div className="flex items-center justify-end space-x-6">
        {/* Chat button (only in edit mode) */}
        {appState === "edit" && !isInPreviewMode && (
          <ToolbarButton
            icon="spark"
            title={`Talk to ${AGENT_NAME}`}
            label="What do you want to do?"
            onClick={() => setShowChat(!showChat)}
            isSelected={showChat}
            testId="ai-chat-panel-button"
          />
        )}

        {/* Preview exit button */}
        {isInPreviewMode && (
          <ToolbarButton
            icon="preview"
            title="Exit Preview"
            onClick={togglePreviewMode}
            isSelected={true}
          />
        )}

        {/* User menu */}
        <UserIcon />
      </div>

      {/* Rainbow border */}
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
