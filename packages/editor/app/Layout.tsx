"use client"

import { CSSProperties, PropsWithChildren } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"
import { VMTopbar } from "./topbar/VMTopbar"

export function Layout({
  children,
  testId,
}: PropsWithChildren<{ testId?: string }>) {
  const { showPanels, chromeTheme } = useEditorConfig()
  const { appState } = useAppState()
  const resolvedMode = useResolvedInterfaceMode()

  const shouldShowHeader = appState === "project" || showPanels

  // The chrome theme and mode scope the editor interface only. The canvas pins
  // itself back to the default theme so it never follows these attributes.
  return (
    <div
      style={styles.layout}
      data-testid={testId}
      data-theme={chromeTheme}
      data-mode={resolvedMode}
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
