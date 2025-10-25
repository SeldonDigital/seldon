import { CSSProperties } from "react"
import { Instance, Variant } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useTool } from "@lib/hooks/use-tool"
import { Frame } from "../seldon/frames/Frame"
import { Clickzone } from "./Clickzone"
import { Dropzone } from "./Dropzone"

interface OverlayProps {
  node: Variant | Instance
  isExpanded: boolean
}

// Inserting a component can be done before, inside, or after an instance
// Inserting a component can be done inside a variant only, not before or after
// Inserting a sketch can be done before or after a variant, not inside

export function Overlay({ node, isExpanded }: OverlayProps) {
  const { activeTool } = useTool()

  if (activeTool === "component") {
    if (workspaceService.isInstance(node)) {
      return (
        <Frame style={styles.container}>
          <Clickzone placement="before" target={node} />
          {node.children && <Clickzone placement="inside" target={node} />}
          {!isExpanded && <Clickzone placement="after" target={node} />}
        </Frame>
      )
    }

    return (
      <Frame style={styles.container}>
        <Clickzone placement="inside" target={node} />
      </Frame>
    )
  }

  if (activeTool === "sketch") {
    if (workspaceService.isInstance(node)) {
      return null
    }

    return (
      <Frame style={styles.container}>
        <Clickzone placement="before" target={node} />
        {!isExpanded && <Clickzone placement="after" target={node} />}
      </Frame>
    )
  }

  return (
    <Frame style={styles.container}>
      <Dropzone placement="before" target={node} />
      {node.children && <Dropzone placement="inside" target={node} />}
      {!isExpanded && <Dropzone placement="after" target={node} />}
    </Frame>
  )
}

// TODO: Fix and convert into a Seldon component
const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: 0,
    right: 0,
    top: -2,
    bottom: -2,
  },
}
