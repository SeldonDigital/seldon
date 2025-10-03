import { Properties } from "../properties"
import { ComponentIcon, ComponentId, ComponentLevel } from "./constants"

/**
 * SCHEMA TYPES
 *
 * Schemas are like blueprints. They describe the available properties (and their default values) component and its children.
 * They are used to generate instances called nodes.
 */

// Base interface with common properties that is shared between primitive and complex components
interface BaseComponentSchema {
  id: ComponentId
  name: string
  intent: string
  icon: ComponentIcon
  properties: Properties
  tags: string[]
}

// A primitive component is a component that cannot contain other components
export interface PrimitiveComponentSchema extends BaseComponentSchema {
  level: ComponentLevel.PRIMITIVE
  restrictions?: never
}

// A complex component is a component that can contain other components
export interface ComplexComponentSchema extends BaseComponentSchema {
  level: Exclude<ComponentLevel, "primitive">
  restrictions?: {
    addChildren?: boolean // Disable the addition of child components
    reorderChildren?: boolean // Disable the reordering of child components
  }
  children?: Component[]
}

export type ComponentSchema = PrimitiveComponentSchema | ComplexComponentSchema

/**
 * COMPONENT INSTANCE TYPES
 *
 * These types represent actual component instances (nodes) that are created from schemas.
 */

/**
 * NestedOverrides value types that can be passed from parent to child components
 */
export type NestedOverridesValue =
  | string // Simple strings, theme values (@fontSize.large), icon IDs
  | number // Simple numbers
  | boolean // Simple booleans
  | { unit: string; value: number } // Complex values with units (e.g., { unit: "rem", value: 2 })
  | NestedOverridesObject // Nested objects for nested property overrides

/**
 * NestedOverrides object structure for nested property overrides
 */
export type NestedOverridesObject = {
  [key: string]: NestedOverridesValue
}

/**
 * NestedOverrides props that can be passed from parent to child components
 * Maps component IDs to their property overrides
 */
export type NestedOverrides = {
  [componentId: string]: NestedOverridesObject
}

export interface Component {
  component: ComponentId
  properties?: Properties
  overrides?: Properties
  nestedOverrides?: NestedOverrides
  children?: Component[]
}

/**
 * REACT EXPORT TYPES
 *
 * These types define how components are exported to React.
 */

export type NativeReactPrimitive =
  | "HTMLAnchor"
  | "HTMLArticle"
  | "HTMLAside"
  | "HTMLBlockquote"
  | "HTMLButton"
  | "HTMLCite"
  | "HTMLDd"
  | "HTMLDiv"
  | "HTMLDl"
  | "HTMLDt"
  | "HTMLFieldset"
  | "HTMLFigure"
  | "HTMLFooter"
  | "HTMLForm"
  | "HTMLHeader"
  | "HTMLHeading1"
  | "HTMLHeading2"
  | "HTMLHeading3"
  | "HTMLHeading4"
  | "HTMLHeading5"
  | "HTMLHeading6"
  | "HTMLHr"
  | "HTMLImg"
  | "HTMLInput"
  | "HTMLLabel"
  | "HTMLLegend"
  | "HTMLLi"
  | "HTMLMain"
  | "HTMLMenu"
  | "HTMLNav"
  | "HTMLOl"
  | "HTMLOptgroup"
  | "HTMLOption"
  | "HTMLParagraph"
  | "HTMLSection"
  | "HTMLSelect"
  | "HTMLSource"
  | "HTMLSpan"
  | "HTMLSvg"
  | "HTMLTable"
  | "HTMLTbody"
  | "HTMLTd"
  | "HTMLTextarea"
  | "HTMLTfoot"
  | "HTMLTh"
  | "HTMLThead"
  | "HTMLTr"
  | "HTMLTrack"
  | "HTMLUl"
  | "HTMLVideo"

export interface ComponentExport {
  react: {
    returns: NativeReactPrimitive | "htmlElement" | "iconMap" | "Frame"
  }
}
