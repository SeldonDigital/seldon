"use client"

import { useExportStatusStore } from "@lib/export/export-status-store"
import { type CSSProperties, useEffect } from "react"
import { createPortal } from "react-dom"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useResolvedInterfaceMode } from "@lib/hooks/use-system-color-scheme"
import { MessageError } from "@seldon/components/elements/MessageError"
import { MessageOutcome } from "@seldon/components/elements/MessageOutcome"
import { MessageStatus } from "@seldon/components/elements/MessageStatus"
import { Frame } from "@seldon/components/frames/Frame"

const statusIcon = { icon: "material-download" } as const
const successIcon = { icon: "material-checkCircle" } as const
const errorIcon = { icon: "material-error" } as const

/** Export-specific notice that survives topbar/header visibility changes. */
export function ExportCompletionNotice() {
  const completion = useExportStatusStore((state) => state.completion)
  const clearCompletion = useExportStatusStore((state) => state.clearCompletion)
  const { chromeTheme } = useEditorConfig()
  const resolvedMode = useResolvedInterfaceMode()

  useEffect(() => {
    if (!completion) return
    const remaining = completion.createdAt + completion.durationMs - Date.now()
    if (remaining <= 0) {
      clearCompletion()
      return
    }
    const timer = window.setTimeout(clearCompletion, remaining)
    return () => window.clearTimeout(timer)
  }, [clearCompletion, completion])

  if (!completion) return null

  return createPortal(
    <Frame
      data-theme={chromeTheme}
      data-mode={resolvedMode}
      style={styles.scope}
    >
      <Frame data-testid="export-completion-notice" style={styles.notice}>
        {completion.intent === "success" ? (
          <MessageOutcome
            aria-live="polite"
            icon={successIcon}
            role="status"
            style={styles.successMessage}
            textLabel={{ children: completion.message, style: styles.text }}
          />
        ) : completion.intent === "error" ? (
          <MessageError
            aria-live="assertive"
            buttonSimple={null}
            icon={errorIcon}
            role="alert"
            style={styles.errorMessage}
            textDescription={{
              children: completion.message,
              style: styles.text,
            }}
          />
        ) : (
          <MessageStatus
            aria-live="polite"
            icon={statusIcon}
            role="status"
            style={styles.statusMessage}
            textLabel={{ children: completion.message, style: styles.text }}
          />
        )}
      </Frame>
    </Frame>,
    document.body,
  )
}

const styles: Record<string, CSSProperties> = {
  // The wrapper scopes theme/mode for generated components without creating a
  // containing block that could trap the fixed notice.
  scope: {
    display: "contents",
  },
  notice: {
    position: "fixed",
    top: "4rem",
    left: "50%",
    zIndex: 2147483001,
    width: "min(44rem, calc(100vw - 2rem))",
    filter: "drop-shadow(0 14px 28px rgb(0 0 0 / 0.24))",
    pointerEvents: "none",
    transform: "translateX(-50%)",
  },
  successMessage: {
    alignSelf: "stretch",
    minHeight: "3rem",
    padding: "var(--sdn-paddings-cozy)",
    backgroundColor: "var(--sdn-swatch-offWhite)",
    borderTopColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderRightColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderBottomColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderLeftColor: "var(--sdn-swatch-positive)",
    borderWidth: "var(--hairline)",
    borderLeftWidth: "0.25rem",
    borderStyle: "solid",
    color: "var(--sdn-swatch-offBlack)",
  },
  errorMessage: {
    alignSelf: "stretch",
    minHeight: "3rem",
    padding: "var(--sdn-paddings-cozy)",
    backgroundColor: "var(--sdn-swatch-offWhite)",
    borderTopColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderRightColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderBottomColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderLeftWidth: "0.25rem",
    color: "var(--sdn-swatch-offBlack)",
  },
  statusMessage: {
    alignSelf: "stretch",
    minHeight: "3rem",
    padding: "var(--sdn-paddings-cozy)",
    backgroundColor: "var(--sdn-swatch-offWhite)",
    borderTopColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderRightColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderBottomColor:
      "color-mix(in srgb, var(--sdn-swatch-offBlack) 20%, transparent)",
    borderLeftColor: "var(--sdn-swatch-primary)",
    borderWidth: "var(--hairline)",
    borderLeftWidth: "0.25rem",
    borderStyle: "solid",
    color: "var(--sdn-swatch-offBlack)",
  },
  text: {
    color: "var(--sdn-swatch-offBlack)",
    fontSize: "var(--sdn-font-size-small)",
    fontWeight: "var(--sdn-font-weight-medium)",
    lineHeight: "var(--sdn-line-height-cozy)",
  },
}
