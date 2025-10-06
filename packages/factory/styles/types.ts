import { Properties, Theme } from "@seldon/core"

export type StyleGenerationContext = {
  properties: Properties
  parentContext: StyleGenerationContext | null
  theme: Theme
}
