// BESPOKE-VIEW: hand-authored drag image for object/layer drag-and-drop.
import { CSSProperties } from "react"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { IconProps } from "@seldon/components/primitives/Icon"

const previewStyle: CSSProperties = {
  backgroundColor:
    "color-mix(in srgb, var(--sdn-swatch-black) 80%, transparent)",
  color: "var(--sdn-swatch-white)",
  padding: "0.5rem",
  borderRadius: "4px",
  minWidth: "200px",
}

interface DragNodePreviewProps {
  label: string
  icon: IconProps["icon"]
}

export function DragNodePreview({ label, icon }: DragNodePreviewProps) {
  const icon2 = { icon }
  const input = { value: label, readOnly: true }

  return (
    <ItemNode
      buttonIconic={null}
      comboboxField={{}}
      icon2={icon2}
      input={input}
      buttonIconic2={null}
      style={previewStyle}
    />
  )
}
