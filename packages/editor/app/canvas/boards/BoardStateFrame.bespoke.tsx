// BESPOKE-VIEW: chrome wrapper for the on-canvas board-state switcher. Scopes
// the switcher to the live chrome theme and mode via data-theme/data-mode.
import { CSSProperties, MouseEventHandler, ReactNode } from "react"

interface BoardStateFrameProps {
  style?: CSSProperties
  dataTheme: string
  dataMode: string
  onClick?: MouseEventHandler<HTMLDivElement>
  children: ReactNode
}

/** Positioned chrome wrapper that re-scopes the state switcher's theme and mode. */
export function BoardStateFrame({
  style,
  dataTheme,
  dataMode,
  onClick,
  children,
}: BoardStateFrameProps) {
  return (
    <div
      style={style}
      onClick={onClick}
      data-theme={dataTheme}
      data-mode={dataMode}
    >
      {children}
    </div>
  )
}
