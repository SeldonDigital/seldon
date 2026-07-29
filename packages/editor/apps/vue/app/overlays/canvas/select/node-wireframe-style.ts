import type { OverlayBox } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { CSSProperties } from "vue"

/**
 * The dashed box drawn around a node in wireframe mode.
 *
 * The box arrives measured, so these take one rather than read it, and each state is its
 * own function, so the caller picks the state and the style has nothing to work out.
 * Mirrors the React `node-wireframe-style`.
 */
export function nodeWireframeStyle(box: OverlayBox): CSSProperties {
  return {
    position: "absolute",
    pointerEvents: "none",
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    boxSizing: box.boxSizing,
    borderStyle: "dashed",
    borderColor: "var(--sdn-swatch-primary)",
    borderWidth: `${box.borderWidth}px`,
    zIndex: 1,
  }
}

/**
 * A node a connector meets, drawn in the connector's own color so the box and the line
 * pointing at it read as one thing. Only ever seen with reference badges shown, since
 * nothing anchors a connector otherwise.
 */
export function nodeWireframeAnchoredStyle(box: OverlayBox): CSSProperties {
  return {
    position: "absolute",
    pointerEvents: "none",
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
    boxSizing: box.boxSizing,
    borderStyle: "dashed",
    borderColor: "var(--sdn-swatch-accent)",
    borderWidth: `${box.borderWidth}px`,
    zIndex: 1,
  }
}
