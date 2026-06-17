import { CSSProperties, FocusEventHandler, ReactNode } from "react"

interface ControlFieldWrapperProps {
  onBlur?: FocusEventHandler<HTMLDivElement>
  style?: CSSProperties
  children: ReactNode
}

/** Field wrapper for inline text and number controls. */
export function ControlFieldWrapper({
  onBlur,
  style,
  children,
}: ControlFieldWrapperProps) {
  return (
    <div onBlur={onBlur} style={style}>
      {children}
    </div>
  )
}
