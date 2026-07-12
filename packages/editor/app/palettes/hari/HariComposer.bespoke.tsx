// BESPOKE-VIEW: autofocusing composer input for the AI chat panel. Submit
// handling arrives via onKeyDown; styling is self-contained.
import { CSSProperties, KeyboardEvent } from "react"

interface HariComposerProps {
  placeholder: string
  disabled: boolean
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

/** Autofocusing composer input. Submit handling arrives via onKeyDown. */
export function HariComposer({
  placeholder,
  disabled,
  onKeyDown,
}: HariComposerProps) {
  return (
    <textarea
      autoFocus
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      style={composerStyle}
    />
  )
}

const composerStyle: CSSProperties = {
  flex: 1,
  minHeight: 0,
  width: "100%",
  boxSizing: "border-box",
  resize: "none",
  border: "none",
  outline: "none",
  padding: 0,
  color: "var(--sdn-swatch-offBlack)",
  background: "transparent",
  fontFamily: "inherit",
  fontSize: 14,
}
