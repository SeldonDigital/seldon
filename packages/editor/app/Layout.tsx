"use client"

import { useInterfaceModeAttribute } from "@lib/chrome/use-interface-mode-attribute"
import { CSSProperties, PropsWithChildren, useRef } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { VMTopbar } from "./topbar/VMTopbar"

export function Layout({
  children,
  testId,
}: PropsWithChildren<{ testId?: string }>) {
  const { showPanels, chromeTheme } = useEditorConfig()
  const { appState } = useAppState()
  const layoutRef = useRef<HTMLDivElement>(null)
  useInterfaceModeAttribute(layoutRef)

  const shouldShowHeader = appState === "project" || showPanels

  // The chrome theme scopes the editor interface only. The canvas pins itself
  // back to the default theme so it never follows this attribute.
  return (
    <div
      ref={layoutRef}
      style={styles.layout}
      data-testid={testId}
      data-theme={chromeTheme}
    >
      {shouldShowHeader && <VMTopbar />}
      {children}
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  layout: {
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    overflowY: "auto",
    color: "var(--sdn-swatch-white)",
    backgroundColor: "var(--sdn-swatch-black)",
  },
}
