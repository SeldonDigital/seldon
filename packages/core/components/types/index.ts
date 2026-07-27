import { ComponentLevel } from "../constants"

import type { Properties } from "../../properties"
import type { ComponentIcon, ComponentLayout } from "../constants"
import type { ComponentId } from "./component-id"

export { ComponentId, isComponentId } from "./component-id"

/**
 * SCHEMA TYPES
 *
 * Schemas are like blueprints. They describe the available properties (and their default values) of a component, its
 * default composition tree, and any alternate variant trees the component ships with.
 *
 * Composition trees are fully flattened: every parent declares the entire descendant tree it owns. Variants mirror the
 * workspace concept of `default` and `variant` entries on a board (see `workspace/model/entry-node.ts`).
 */

/**
 * Base fields shared by every schema regardless of level. `icon` is optional and falls back to
 * `seldon-component` in the icon registry when absent. `layout` is the layout model the component
 * arranges its children with. Absent means `ComponentLayout.FLEXBOX`, and `ComponentLayout.GRID`
 * selects a CSS grid container.
 */
interface BaseComponentSchema {
  id: ComponentId
  name: string
  intent: string
  properties: Properties
  tags: string[]
  icon?: ComponentIcon
  layout?: ComponentLayout
}

/**
 * A child entry inside a SchemaTree. `variant` selects a named child schema variant when present.
 * `overrides` and nested `children` layer on top of the selected child baseline. `children` carries
 * inner-tree composition without the default/variant tagging that only applies at the top level.
 */
export interface SchemaChild {
  component: ComponentId
  variant?: string
  overrides?: Properties
  children?: SchemaChild[]
}

/** A composition tree, either the default tree of a complex schema or one of its variant trees. */
export interface SchemaTree {
  children?: SchemaChild[]
}

/**
 * An alternate variant of a complex schema. Carries its own complete child tree plus identity
 * metadata used to address it, where `id` is unique within the parent, such as "social" on
 * `Button`. `overrides` are the root property overrides for this catalog variant, such as width and
 * height.
 */
export interface SchemaVariant extends SchemaTree {
  id: string
  label: string
  intent: string
  overrides?: Properties
}

/**
 * Primitives are leaves: no default tree and no composition children. They may declare leaf
 * `variants` that carry only root property overrides, never child trees.
 */
export interface PrimitiveComponentSchema extends BaseComponentSchema {
  level: ComponentLevel.PRIMITIVE
  variants?: SchemaVariant[]
}

/** Complex schemas always declare a `default` tree and may declare alternate `variants` of the same component. */
export interface ComplexComponentSchema extends BaseComponentSchema {
  level: Exclude<ComponentLevel, "primitive">
  default: SchemaTree
  variants?: SchemaVariant[]
}

export type ComponentSchema = PrimitiveComponentSchema | ComplexComponentSchema

export function isComplexSchema(schema: ComponentSchema): schema is ComplexComponentSchema {
  return schema.level !== ComponentLevel.PRIMITIVE
}

export function hasVariants(
  schema: ComponentSchema,
): schema is ComponentSchema & { variants: SchemaVariant[] } {
  return Array.isArray(schema.variants) && schema.variants.length > 0
}

/**
 * COMPONENT INSTANCE TYPES
 *
 * These types represent actual component instances (nodes) that are created from schemas.
 */

export interface Component {
  component: ComponentId
  properties?: Properties
  overrides?: Properties
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
  | "HTMLCode"
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
  | "HTMLPre"
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

/**
 * Identifies a bespoke, hand-authored React template that cannot be derived from
 * a schema (composite markup with custom `:checked`/state CSS). The template
 * lives in `components/catalog/custom/` and is shared by the canvas and factory.
 */
export type CustomReactTemplate = "toggleSwitch"

/**
 * Identifies a bespoke, hand-authored Vue template, mirroring
 * {@link CustomReactTemplate}. The Vue factory renders these SFCs for components
 * whose markup cannot be derived from a schema.
 */
export type CustomVueTemplate = "toggleSwitch"

/**
 * Type-only export descriptors for future Swift and Android factories. These
 * carry the platform-native control name a factory would render for the
 * component. No factory consumes them yet.
 */
export interface SwiftComponentExport {
  returns: string
  tintFrom?: string
}

export interface AndroidComponentExport {
  returns: string
  tintFrom?: string
}

/**
 * Per-framework export descriptors for a component.
 *
 * In `react`, `custom` applies when `returns` is `"custom"` and names the bespoke template to
 * render plus the native primitive its props interface extends. `forwardRef` generates the
 * component with `React.forwardRef` targeting the given element type, such as "HTMLButtonElement",
 * so callers can attach a ref to the rendered root. It is supported for slot-tree and simple-return
 * components, but not for `htmlElement`, `wrapperElement`, or `iconMap`.
 *
 * `vue` is optional and mirrors `react`. The Vue factory defaults every field from `react` when this
 * block is absent, so schemas only author it to diverge from the React shape. The `returns`
 * semantics are framework-neutral and shared with React, and `expose` is the root element the SFC
 * exposes via `defineExpose` for caller refs. `swift` and `android` are type-only descriptors for
 * future factories.
 */
export interface ComponentExport {
  react: {
    returns:
      | NativeReactPrimitive
      | "htmlElement"
      | "wrapperElement"
      | "iconMap"
      | "Frame"
      | "custom"
    custom?: {
      base: NativeReactPrimitive
      template: CustomReactTemplate
    }
    forwardRef?: string
  }
  vue?: {
    returns:
      | NativeReactPrimitive
      | "htmlElement"
      | "wrapperElement"
      | "iconMap"
      | "Frame"
      | "custom"
    custom?: {
      base: NativeReactPrimitive
      template: CustomVueTemplate
    }
    expose?: string
  }
  swift?: SwiftComponentExport
  android?: AndroidComponentExport
}
