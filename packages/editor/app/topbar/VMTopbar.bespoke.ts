// BESPOKE: the rainbow strip has no generated View yet. Remove this once a
// workspace component provides the topbar gradient.
import { CSSProperties } from "react"

export const seldonGradientStyle: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "1px",
  width: "100%",
  backgroundImage:
    "linear-gradient(90deg, var(--sdn-swatch-seldon-red) 0%, var(--sdn-swatch-seldon-yellow) 20%, var(--sdn-swatch-seldon-green) 40%, var(--sdn-swatch-seldon-blue) 70%, var(--sdn-swatch-seldon-red) 100%)",
}
