import { Properties } from "../properties"
import { ComponentIcon, ComponentId, ComponentLevel } from "./constants"

/**
 * SCHEMA TYPES
 *
 * Schemas are like blueprints. They describe the available properties (and their default values) of a component, its
 * default composition tree, and any alternate variant trees the component ships with.
 *
 * Composition trees are fully flattened: every parent declares the entire descendant tree it owns. Variants mirror the
 * workspace concept of `default` and `variant` entries on a board (see `workspace/model/entry-node.ts`).
 */

// Base fields shared by every schema regardless of level.
interface BaseComponentSchema {
  id: ComponentId
  name: string
  intent: string
  icon: ComponentIcon
  properties: Properties
  tags: string[]
}

// A child entry inside a SchemaTree. `overrides` is the only authoring surface for child-level differences against the
// child component's schema defaults. `children` carries inner-tree composition without the default/variant tagging that
// only applies at the top level.
export interface SchemaChild {
  component: ComponentId
  overrides?: Properties
  children?: SchemaChild[]
}

// A composition tree (the default tree of a complex schema or any of its variant trees).
export interface SchemaTree {
  children?: SchemaChild[]
}

// An alternate variant of a complex schema. Carries its own complete child tree plus identity metadata used to address
// it (`id` is unique within the parent, e.g. "social" on `Button`).
export interface SchemaVariant extends SchemaTree {
  id: string
  label: string
  intent: string
  /** Root property overrides for this catalog variant (for example width and height). */
  overrides?: Properties
}

// Primitives are leaves: no default tree, no variants, no children.
export interface PrimitiveComponentSchema extends BaseComponentSchema {
  level: ComponentLevel.PRIMITIVE
}

// Complex schemas always declare a `default` tree and may declare alternate `variants` of the same component.
export interface ComplexComponentSchema extends BaseComponentSchema {
  level: Exclude<ComponentLevel, "primitive">
  default: SchemaTree
  variants?: SchemaVariant[]
}

export type ComponentSchema = PrimitiveComponentSchema | ComplexComponentSchema

export function isComplexSchema(
  schema: ComponentSchema,
): schema is ComplexComponentSchema {
  return schema.level !== ComponentLevel.PRIMITIVE
}

export function hasVariants(
  schema: ComponentSchema,
): schema is ComplexComponentSchema & { variants: SchemaVariant[] } {
  return (
    isComplexSchema(schema) &&
    Array.isArray(schema.variants) &&
    schema.variants.length > 0
  )
}

export function isVariantTree(
  tree: SchemaTree | SchemaVariant,
): tree is SchemaVariant {
  return "id" in tree && "label" in tree && "intent" in tree
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
    returns:
      | NativeReactPrimitive
      | "htmlElement"
      | "wrapperElement"
      | "iconMap"
      | "Frame"
  }
}
