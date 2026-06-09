import { CSSProperties, ReactNode, Ref } from "react"

interface ScrollerShellProps {
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
  children: ReactNode
}

/** Scroll container shell. The scroll styling arrives via `style`. */
export function ScrollerShell({ style, ref, children }: ScrollerShellProps) {
  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}
