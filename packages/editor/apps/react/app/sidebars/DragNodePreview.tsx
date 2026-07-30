// View-model for the drag image shown while reordering object/layer rows. Binds
// the dragged row's label and icon to the generated ItemNode and applies the
// floating drag-chip chrome from Seldon tokens. The imperative mount into the
// native drag preview lives in the drag hook that renders this.
import { ItemNode } from "@seldon/components/elements/ItemNode"

import type { IconProps } from "@seldon/components/primitives/Icon"
import type { CSSProperties } from "react"

const previewStyle: CSSProperties = {
  backgroundColor: "color-mix(in srgb, var(--sdn-swatch-offBlack) 80%, transparent)",
  color: "var(--sdn-swatch-offWhite)",
  padding: "var(--sdn-paddings-compact)",
  borderRadius: "var(--sdn-corners-tight)",
}

interface DragNodePreviewProps {
  label: string
  icon: IconProps["icon"]
}

export function DragNodePreview({ label, icon }: DragNodePreviewProps) {
  const seldonRefs = {
    nodeIcon: { icon },
    nodeLabel: { value: label, readOnly: true },
  }

  return (
    <ItemNode
      buttonIconic={null}
      comboboxField={{}}
      buttonIconic2={null}
      seldonRefs={seldonRefs}
      style={previewStyle}
    />
  )
}
