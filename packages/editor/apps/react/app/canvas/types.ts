import type { Properties } from "@seldon/core"
import type { ComponentId } from "@seldon/core/components/constants"
import type { Theme } from "@seldon/core/themes/types"

export interface TemplateProps {
  // componentId is used to identify a component (like checkbox) or a nested component (like checkbox__icon) in the DOM
  componentId: ComponentId | `${ComponentId}__${ComponentId}`
  properties: Properties
  parentProperties: Properties
  theme: Theme
  nodeId?: string
  children?: React.ReactNode | React.ReactNode[]
}
