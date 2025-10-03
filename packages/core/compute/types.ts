import { Properties, SubPropertyKey, Theme } from "../index"

export type ComputeContext = {
  properties: Properties
  parentContext: ComputeContext | null
  theme: Theme
}

export type ComputeKeys = {
  propertyKey: PropertyKey
  subPropertyKey?: SubPropertyKey
}
