import { createPortal } from "react-dom"

export const CssPortal = ({ children }: { children: React.ReactNode }) => {
  return createPortal(children, document.body)
}
