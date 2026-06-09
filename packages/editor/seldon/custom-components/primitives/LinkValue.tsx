import { CSSProperties, MouseEvent, ReactNode } from "react"

interface LinkValueProps {
  href: string
  children: ReactNode
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
}

const linkStyle: CSSProperties = {
  color: "inherit",
  textDecoration: "underline",
}

/** External link rendered as a property value (opens in a new tab). */
export function LinkValue({ href, children, onClick }: LinkValueProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
      style={linkStyle}
    >
      {children}
    </a>
  )
}
