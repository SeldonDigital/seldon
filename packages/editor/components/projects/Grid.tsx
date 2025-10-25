import { type ReactNode } from "react"

export const Grid = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="grid gap-x-8 gap-y-10"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
      }}
    >
      {children}
    </div>
  )
}
