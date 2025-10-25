"use client"

import { COLORS, hsla } from "@lib/ui/colors"
import { CSSProperties } from "react"
import { useNodeRect } from "./hooks/use-node-rect"
import { VisibleNode } from "./hooks/use-visible-nodes"

export function Wireframes({ nodes }: { nodes: VisibleNode[] }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
      }}
    >
      {nodes.map((node) => (
        <Wireframe node={node} key={node.id} />
      ))}
    </div>
  )
}

function Wireframe({ node }: { node: VisibleNode }) {
  const rect = useNodeRect(node.id)

  if (!rect) return null

  const style: CSSProperties = {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    position: "absolute",
    zIndex: node.depth,
    outlineStyle: "dashed",
    outlineColor: COLORS.blue[500],
    outlineWidth: 1,
    backgroundColor: hsla(COLORS.blue[500], 0.1),
  }

  return <div style={style} />
}
