import { Properties } from "@seldon/core"
import { ComponentId } from "@seldon/core/components/constants"
import { Theme } from "@seldon/core/themes/types"

export interface TemplateProps {
  nodeId?: string
  // componentId is used to identify a component (like checkbox) or a nested component (like checkbox__icon) in the DOM
  componentId: ComponentId | `${ComponentId}__${ComponentId}`
  properties: Properties
  children?: React.ReactNode | React.ReactNode[]
  parentProperties: Properties
  theme: Theme
}
