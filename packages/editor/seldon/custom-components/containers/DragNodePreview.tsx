import { CSSProperties } from "react"
import { ItemNodeRow } from "@seldon/components/elements/ItemNodeRow"
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
    <ItemNodeRow
      buttonIconic={null}
      icon={null}
      icon2={{ icon }}
      textLabel={{ children: label }}
      buttonIconic2={null}
      icon3={null}
      buttonIconic3={null}
      icon4={null}
      style={previewStyle}
    />
  )
}
