import { CSSProperties } from "react"
import { ListItemTreeNode as SeldonNode } from "../../../seldon/elements/ListItemTreeNode"
import {
  relativeFullWidthStyle,
  sidebarNoSelectionTextStyle,
} from "../helpers/sidebar-styles"

const rowWrapperStyle: CSSProperties = {
  width: "100%",
  minWidth: 0,
}

const emptyLabelStyle: CSSProperties = {
  ...sidebarNoSelectionTextStyle,
  paddingInlineStart: "0.5rem",
}

/**
 * Placeholder row shown inside an empty section, reading "No {section}".
 */
export function RowSectionEmpty({ label }: { label: string }) {
  return (
    <div style={rowWrapperStyle}>
      <div style={relativeFullWidthStyle}>
        <SeldonNode
          label={{ children: label, style: emptyLabelStyle }}
          aria-disabled
          data-testid="objects-sidebar-empty-section"
        />
      </div>
    </div>
  )
}
