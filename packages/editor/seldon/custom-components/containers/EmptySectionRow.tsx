import { CSSProperties } from "react"
import { ItemNodeRow } from "@seldon/components/elements/ItemNodeRow"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
  position: "relative",
}

const emptyLabelStyle: CSSProperties = {
  fontFamily: "var(--sdn-seldon-font-family-primary)",
  fontSize: "var(--sdn-font-size-xsmall)",
  color: "color-mix(in srgb, var(--sdn-seldon-swatch-white) 60%, transparent)",
  paddingInlineStart: "0.5rem",
}

interface EmptySectionRowProps {
  label: string
}

export function EmptySectionRow({ label }: EmptySectionRowProps) {
  return (
    <div style={rowWrapperStyle}>
      <ItemNodeRow
        buttonIconic={null}
        icon={null}
        icon2={null}
        textLabel={{ children: label, style: emptyLabelStyle }}
        buttonIconic2={null}
        icon3={null}
        buttonIconic3={null}
        icon4={null}
        aria-disabled
        data-testid="objects-sidebar-empty-section"
      />
    </div>
  )
}
