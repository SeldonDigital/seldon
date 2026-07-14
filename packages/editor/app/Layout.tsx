"use client"

import { CSSProperties, PropsWithChildren } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"
import { Frame } from "@seldon/components/frames/Frame"
import { TopbarController } from "./topbar/TopbarController"

export function Layout({
  children,
  testId,
}: PropsWithChildren<{ testId?: string }>) {
  const { showPanels, chromeTheme } = useEditorConfig()
  const { appState } = useAppState()
  const resolvedMode = useResolvedInterfaceMode()

  const shouldShowHeader = appState === "project" || showPanels
  const header = shouldShowHeader ? <TopbarController /> : null

  // Chrome shell for the editor interface. The chrome theme and mode scope the
  // interface only via data-theme/data-mode. The canvas pins itself back to the
  // default theme so it never follows these attributes.
  return (
    <Frame
      style={styles.layout}
      data-testid={testId}
      data-theme={chromeTheme}
      data-mode={resolvedMode}
    >
      {header}
      {children}
    </Frame>
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
