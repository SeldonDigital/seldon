"use client"

import { CSSProperties, PropsWithChildren } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { UnifiedHeader } from "./unified-header/UnifiedHeader"

export function Layout({
  children,
  testId,
}: PropsWithChildren<{ testId?: string }>) {
  const { showPanels } = useEditorConfig()
  const { appState } = useAppState()

  // In project view, we always show the header
  const shouldShowHeader = appState === "project" || showPanels

  return (
    <div style={styles.layout} data-testid={testId}>
      {/* Header is always visible in project view, or when panels are shown in other views */}
      {shouldShowHeader && <UnifiedHeader />}

      {/* Main content area */}
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
    color: "white",
    backgroundColor: "black",
  },
}
