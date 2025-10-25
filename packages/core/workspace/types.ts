import { ComponentId, ComponentLevel } from "../components/constants"
import { Properties } from "../properties/types/properties"
import { Theme, ThemeId } from "../themes/types"
import { AIAction } from "./reducers/ai/types"
import { CoreAction } from "./reducers/core/types"

// Middleware type definition
export type Middleware = (
  next: (workspace: Workspace, action: Action) => Workspace,
) => (workspace: Workspace, action: Action) => Workspace

/**
 * NODE TYPES
 *
 * Nodes are instances of schemas. They are the JSON that represent the current state of a workspace and its components.
 */

// The Workspace is the state of editor. It is the first level of the workspace tree hierarchy.
// It contains one board for every component and 1 or more variants for each board.
export type Workspace = {
  version: number
  customTheme: Theme
  boards: Partial<Record<ComponentId, Board>>
  byId: Record<string, Variant | Instance>
}

// A component board is a collection of component variants. Each component on the canvas has 1 board.
// It is the second level of the tree.
export interface Board {
  id: ComponentId
  component: ComponentId
  label: string
  order: number
  theme: ThemeId
  properties: Properties
  __editor?: { initialOverrides?: Properties }
  variants: VariantId[]
}

// Base interface with common properties that is shared between variant and child nodes
export interface BaseComponent {
  level: ComponentLevel
  label: string
  theme: ThemeId | null
  component: ComponentId
  properties: Properties
  override?: Record<string, any>
  __editor?: { initialOverrides?: Properties }
  children?: InstanceId[]
}

// A variant consists of a variant node with optional nested child nodes
export type VariantId = `variant-${ComponentId}-${string}`

export const isVariantId = (id: string): id is VariantId => {
  return id.startsWith("variant-")
}

export interface DefaultVariant extends BaseComponent {
  id: VariantId
  isChild: false
  type: "defaultVariant"
  fromSchema: true
}

export interface UserVariant extends BaseComponent {
  id: VariantId
  isChild: false
  instanceOf: VariantId // All variant that are not the default variant are instances of the default variant
  type: "userVariant"
  fromSchema: false
}

export type Variant = DefaultVariant | UserVariant

// All child nodes extend variant nodes.
export type InstanceId = `child-${ComponentId}-${string}`

export const isInstanceId = (id: string): id is InstanceId => {
  return id.startsWith("child-")
}

export interface Instance extends BaseComponent {
  id: InstanceId
  isChild: true
  variant: VariantId
  instanceOf: VariantId | InstanceId
  fromSchema: boolean
}

export type ReferenceId = `$${string}`
export type Action = CoreAction | AIAction
export type Operation = Action["type"]

export type ExtractPayload<T extends Operation> = Extract<
  Action,
  { type: T }
>["payload"]

export interface NodePathSegment {
  componentId: ComponentId
  index: number
}

export type Node = Variant | Instance
export type NodePath = NodePathSegment[]
