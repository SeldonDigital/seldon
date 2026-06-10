import { Fragment } from "react"
import { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import { FramerExpandable } from "../shared/FramerExpandable"
import { CssBlock } from "./CssBlock"
import { RowCategory } from "./RowCategory"
import { RowProperty } from "./RowProperty"
import {
  FontCollectionEditingContext,
  IconSetEditingContext,
  ThemeEditingContext,
} from "./helpers/editing-contexts"
import { PropertySection } from "./helpers/get-property-sections"
import { ThemePropertySection } from "./helpers/get-theme-property-sections"
import { getIconRowCategory } from "./helpers/icon-set-properties-data"
import { FlatProperty } from "./helpers/properties-data"

interface PropertyTreeSectionProps {
  section: PropertySection | ThemePropertySection
  isExpanded: boolean
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
  cssStrings: string[]
  allProperties: FlatProperty[]
  familyProperties?: FlatProperty[]
  iconProperties?: FlatProperty[]
  themeEditingContext?: ThemeEditingContext | null
  fontCollectionEditingContext?: FontCollectionEditingContext | null
  iconSetEditingContext?: IconSetEditingContext | null
}

/**
 * Renders one property section: its category header and the expandable body.
 * Resolves the row-level `allProperties` and editing contexts once for the
 * section so the row map stays a plain iteration.
 */
export function PropertyTreeSection({
  section,
  isExpanded,
  workspace,
  node,
  theme,
  cssStrings,
  allProperties,
  familyProperties,
  iconProperties,
  themeEditingContext,
  fontCollectionEditingContext,
  iconSetEditingContext,
}: PropertyTreeSectionProps) {
  const isFamilies = section.category === "families"
  const isIconCategory =
    !!iconProperties && getIconRowCategory(`icon.${section.category}`) !== null

  const rowAllProperties =
    isFamilies && familyProperties
      ? familyProperties
      : isIconCategory && iconProperties
        ? iconProperties
        : allProperties
  const rowFontCollectionContext = isFamilies
    ? fontCollectionEditingContext
    : null
  const rowIconSetContext = isIconCategory ? iconSetEditingContext : null

  const content =
    section.category === "css" ? (
      <CssBlock cssProperties={cssStrings} />
    ) : (
      section.properties.map((property) => (
        <RowProperty
          key={property.key}
          property={property}
          workspace={workspace}
          node={node}
          theme={theme}
          allProperties={rowAllProperties}
          themeEditingContext={themeEditingContext}
          fontCollectionEditingContext={rowFontCollectionContext}
          iconSetEditingContext={rowIconSetContext}
        />
      ))
    )

  return (
    <Fragment>
      <RowCategory section={section} />
      <FramerExpandable isExpanded={isExpanded}>{content}</FramerExpandable>
    </Fragment>
  )
}
