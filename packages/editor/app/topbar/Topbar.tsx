"use client"

import { CSSProperties, useState } from "react"
import { DEVICE_VIEWS } from "@lib/devices/constants"
import { DeviceId } from "@lib/devices/types"
import { useAppState } from "@lib/hooks/use-app-state"
import { usePreview } from "@lib/hooks/use-preview"
import { Menu, useMenuConfig } from "@components/topbar/menus"
import { HEADER_HEIGHT } from "../constants"
import { DeviceButton } from "./DeviceButton"
import { Toolbar } from "./tools/Toolbar"

const headerStyle: CSSProperties = {
  position: "relative",
  zIndex: 10,
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  flexShrink: 0,
  borderBottom: "1px solid var(--sdn-seldon-swatch-black)",
  backgroundColor: "var(--sdn-seldon-swatch-charcoal)",
  paddingLeft: "var(--sdn-padding-cozy)",
  paddingRight: "var(--sdn-padding-cozy)",
  letterSpacing: "-0.025em",
  height: HEADER_HEIGHT,
}

const leftGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sdn-gap-comfortable)",
}

const centerGroupStyle: CSSProperties = {
  display: "flex",
  flex: 1,
  justifyContent: "center",
}

const deviceBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sdn-gap-cozy)",
  borderLeft: "1px solid var(--sdn-seldon-swatch-charcoal)",
  borderRight: "1px solid var(--sdn-seldon-swatch-charcoal)",
  paddingLeft: "var(--sdn-padding-cozy)",
  paddingRight: "var(--sdn-padding-cozy)",
  paddingTop: "var(--sdn-padding-compact)",
  paddingBottom: "var(--sdn-padding-compact)",
}

const rightGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "var(--sdn-gap-cozy)",
}

const logoGroupStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--sdn-gap-compact)",
}

const logoIconStyle: CSSProperties = {
  height: "1.25rem",
  width: "1.25rem",
  flexShrink: 0,
}

const wordMarkStyle: CSSProperties = {
  height: "22px",
  width: "auto",
  flexShrink: 0,
}

const gradientStripStyle: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "1px",
  width: "100%",
  backgroundImage:
    "linear-gradient(90deg, var(--sdn-swatch-seldon-red) 0%, var(--sdn-swatch-seldon-yellow) 20%, var(--sdn-swatch-seldon-green) 40%, var(--sdn-swatch-seldon-blue) 70%, var(--sdn-swatch-seldon-red) 100%)",
}

const exitButtonStyle: CSSProperties = {
  fontSize: "var(--sdn-font-size-small)",
  background: "none",
  border: "none",
  cursor: "pointer",
}

export function Topbar() {
  const { appState } = useAppState()
  const { menuConfig } = useMenuConfig()
  const { isInPreviewMode, togglePreviewMode } = usePreview()
  const { deviceId: currentDevice, setDevice } = usePreview()
  const [exitHovered, setExitHovered] = useState(false)

  return (
    <header style={headerStyle}>
      <div style={leftGroupStyle}>
        <div style={logoGroupStyle}>
          <img src="/logo.svg" alt="Seldon" style={logoIconStyle} />
          <img src="/word-mark.svg" alt="Seldon" style={wordMarkStyle} />
        </div>
        {appState === "edit" && !isInPreviewMode && (
          <Menu menus={menuConfig} />
        )}
      </div>

      <div style={centerGroupStyle}>
        {appState === "edit" && !isInPreviewMode && (
          <div style={{ ...deviceBarStyle, display: "none" }}>
            <Toolbar />
          </div>
        )}
        {isInPreviewMode && (
          <div style={deviceBarStyle}>
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

      <div style={rightGroupStyle}>
        {isInPreviewMode && (
          <button
            type="button"
            style={{
              ...exitButtonStyle,
              color: exitHovered
                ? "hsl(0deg 0% 100%)"
                : "hsl(0deg 0% 100% / 0.8)",
            }}
            onMouseEnter={() => setExitHovered(true)}
            onMouseLeave={() => setExitHovered(false)}
            onClick={() => togglePreviewMode()}
          >
            Exit preview
          </button>
        )}
      </div>

      <div style={gradientStripStyle} />
    </header>
  )
}
