import { CSSProperties } from "react"
import { ItemNode } from "@seldon/components/elements/ItemNode"
import { IconProps } from "@seldon/components/primitives/Icon"

const previewStyle: CSSProperties = {
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  color: "white",
  padding: "0.5rem",
  borderRadius: "4px",
  minWidth: "200px",
}

interface DragNodePreviewProps {
  label: string
  icon: IconProps["icon"]
}

export function DragNodePreview({ label, icon }: DragNodePreviewProps) {
  return (
    <ItemNode
      buttonIconic={null}
      comboboxField={{}}
      icon2={{ icon }}
      input={{ value: label, readOnly: true }}
      buttonIconic2={null}
      style={previewStyle}
    />
  )
}
