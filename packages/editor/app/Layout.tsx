"use client"

import { CSSProperties, PropsWithChildren } from "react"
import { useAppState } from "@lib/hooks/use-app-state"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { VMTopbar } from "./topbar/VMTopbar"

export function Layout({
  children,
  testId,
}: PropsWithChildren<{ testId?: string }>) {
  const { showPanels } = useEditorConfig()
  const { appState } = useAppState()

  const shouldShowHeader = appState === "project" || showPanels

  return (
    <div style={styles.layout} data-testid={testId}>
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
    color: "white",
    backgroundColor: "black",
  },
}
