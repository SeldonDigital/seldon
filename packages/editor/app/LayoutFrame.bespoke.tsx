// BESPOKE-VIEW: editor chrome shell. Scopes the interface to the chrome theme
// and mode via data-theme/data-mode; the canvas pins itself back to default.
import { CSSProperties, ReactNode } from "react"

interface LayoutFrameProps {
  style?: CSSProperties
  dataTestId?: string
  dataTheme: string
  dataMode: string
  children: ReactNode
}

/** Full-height chrome shell that scopes theme and mode for the editor interface. */
export function LayoutFrame({
  style,
  dataTestId,
  dataTheme,
  dataMode,
  children,
}: LayoutFrameProps) {
  return (
    <div
      style={style}
      data-testid={dataTestId}
      data-theme={dataTheme}
      data-mode={dataMode}
    >
      {children}
    </div>
  )
}
