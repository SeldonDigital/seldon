"use client"

import { removeNewLines } from "@lib/helpers/new-lines"
import { getCssFromProperties } from "@seldon/factory/styles/css-properties/get-css-from-properties"
import React, { CSSProperties, RefObject, useMemo } from "react"
import {
  Display,
  InstanceId,
  Properties,
  VariantId,
  invariant,
} from "@seldon/core"
import { getComponentExportConfig } from "@seldon/core/components/catalog"
import {
  ComponentId,
  NATIVE_REACT_PRIMITIVES,
} from "@seldon/core/components/constants"
import { HTMLAnchor } from "@seldon/core/components/native-react/HTML.Anchor"
import { HTMLArticle } from "@seldon/core/components/native-react/HTML.Article"
import { HTMLAside } from "@seldon/core/components/native-react/HTML.Aside"
import { HTMLBlockquote } from "@seldon/core/components/native-react/HTML.Blockquote"
import { HTMLButton } from "@seldon/core/components/native-react/HTML.Button"
import { HTMLCite } from "@seldon/core/components/native-react/HTML.Cite"
import { HTMLCode } from "@seldon/core/components/native-react/HTML.Code"
import { HTMLDd } from "@seldon/core/components/native-react/HTML.Dd"
import { HTMLDiv } from "@seldon/core/components/native-react/HTML.Div"
import { HTMLDl } from "@seldon/core/components/native-react/HTML.Dl"
import { HTMLDt } from "@seldon/core/components/native-react/HTML.Dt"
import { HTMLFieldset } from "@seldon/core/components/native-react/HTML.Fieldset"
import { HTMLFigure } from "@seldon/core/components/native-react/HTML.Figure"
import { HTMLFooter } from "@seldon/core/components/native-react/HTML.Footer"
import { HTMLForm } from "@seldon/core/components/native-react/HTML.Form"
import { HTMLHeader } from "@seldon/core/components/native-react/HTML.Header"
import { HTMLHeading1 } from "@seldon/core/components/native-react/HTML.Heading1"
import { HTMLHeading2 } from "@seldon/core/components/native-react/HTML.Heading2"
import { HTMLHeading3 } from "@seldon/core/components/native-react/HTML.Heading3"
import { HTMLHeading4 } from "@seldon/core/components/native-react/HTML.Heading4"
import { HTMLHeading5 } from "@seldon/core/components/native-react/HTML.Heading5"
import { HTMLHeading6 } from "@seldon/core/components/native-react/HTML.Heading6"
import { HTMLHr } from "@seldon/core/components/native-react/HTML.Hr"
import { HTMLImg } from "@seldon/core/components/native-react/HTML.Img"
import { HTMLInput } from "@seldon/core/components/native-react/HTML.Input"
import { HTMLLabel } from "@seldon/core/components/native-react/HTML.Label"
import { HTMLLegend } from "@seldon/core/components/native-react/HTML.Legend"
import { HTMLLi } from "@seldon/core/components/native-react/HTML.Li"
import { HTMLMain } from "@seldon/core/components/native-react/HTML.Main"
import { HTMLMenu } from "@seldon/core/components/native-react/HTML.Menu"
import { HTMLNav } from "@seldon/core/components/native-react/HTML.Nav"
import { HTMLOl } from "@seldon/core/components/native-react/HTML.Ol"
import { HTMLOptgroup } from "@seldon/core/components/native-react/HTML.Optgroup"
import { HTMLOption } from "@seldon/core/components/native-react/HTML.Option"
import { HTMLParagraph } from "@seldon/core/components/native-react/HTML.Paragraph"
import { HTMLPre } from "@seldon/core/components/native-react/HTML.Pre"
import { HTMLSection } from "@seldon/core/components/native-react/HTML.Section"
import { HTMLSelect } from "@seldon/core/components/native-react/HTML.Select"
import { HTMLSource } from "@seldon/core/components/native-react/HTML.Source"
import { HTMLSpan } from "@seldon/core/components/native-react/HTML.Span"
import { HTMLSvg } from "@seldon/core/components/native-react/HTML.Svg"
import { HTMLTable } from "@seldon/core/components/native-react/HTML.Table"
import { HTMLTbody } from "@seldon/core/components/native-react/HTML.Tbody"
import { HTMLTd } from "@seldon/core/components/native-react/HTML.Td"
import { HTMLTextarea } from "@seldon/core/components/native-react/HTML.Textarea"
import { HTMLTfoot } from "@seldon/core/components/native-react/HTML.Tfoot"
import { HTMLTh } from "@seldon/core/components/native-react/HTML.Th"
import { HTMLThead } from "@seldon/core/components/native-react/HTML.Thead"
import { HTMLTr } from "@seldon/core/components/native-react/HTML.Tr"
import { HTMLTrack } from "@seldon/core/components/native-react/HTML.Track"
import { HTMLUl } from "@seldon/core/components/native-react/HTML.Ul"
import { HTMLVideo } from "@seldon/core/components/native-react/HTML.Video"
import { NativeReactPrimitive } from "@seldon/core/components/types"
import { IconId } from "@seldon/core/icon-sets"
import { WrapperElement } from "@seldon/core/properties"
import type { ComputeContext } from "@seldon/core/properties/compute"
import { LoadEditorIcons } from "@app/LoadEditorIcons"
import { CssPortal } from "./CssPortal"

export type CanvasHtmlAttributes = Record<string, string | boolean>

type TemplateProps = {
  componentId: ComponentId
  nodeId: VariantId | InstanceId | ComponentId
  children?: React.ReactNode
  ref?: RefObject<HTMLElement | null>
  htmlAttributes?: CanvasHtmlAttributes
  computeContext: ComputeContext
  styleOverrides?: CSSProperties
  /** Avoid invalid `<button>` inside `<button>` when a button groups other buttons. */
  renderAsDiv?: boolean
  /** For Icon components: the symbol's set is added but the icon is turned off. */
  iconUnavailable?: boolean
}

/**
 * Renders a component with the given properties and theme
 *
 * ** WARNING: Do not use nodes inside this component or any of its helpers, hooks or child components.
 *
 */
export const ComponentRenderer = ({
  componentId,
  children,
  htmlAttributes,
  computeContext,
  nodeId,
  styleOverrides,
  renderAsDiv = false,
  iconUnavailable = false,
}: TemplateProps) => {
  const { properties, parentContext: _parentContext } = computeContext // eslint-disable-line @typescript-eslint/no-unused-vars
  const className = `node-${nodeId}`
  const css = useMemo(() => {
    try {
      return getCssFromProperties(properties, computeContext, className)
    } catch (error) {
      // Log the error for debugging but don't crash the component
      console.error("CSS generation error:", error)

      // Return empty CSS to prevent component crash
      // Note: We cannot call addToast here as it would cause a state update during render
      // Toast notifications should be handled at the input level instead
      return ""
    }
  }, [computeContext, properties, className])

  if (properties.display && properties.display.value === Display.EXCLUDE) {
    return null
  }

  /**
   * If this is an Icon component, we want to lazy load the icon (to prevent all icons loaded on init)
   * We still wrap this in the icon component template to ensure any changes there are reflected
   * on the canvas
   */
  if (componentId === ComponentId.ICON) {
    return (
      <>
        <CssPortal>
          <style data-seldon-style-for={className}>{css}</style>
        </CssPortal>
        <LoadEditorIcons
          iconId={properties.symbol?.value as IconId | undefined}
          unavailable={iconUnavailable}
          className={className}
          {...htmlAttributes}
        />
      </>
    )
  }

  const Component = getComponent(componentId, properties, renderAsDiv)
  const isVoidPrimitive = isVoidComponent(componentId, renderAsDiv)

  return (
    <>
      <CssPortal>
        <style data-seldon-style-for={className}>{css}</style>
      </CssPortal>
      {isVoidPrimitive ? (
        /* @ts-expect-error - Component can be any valid component */
        <Component
          className={className}
          {...htmlAttributes}
          style={Object.assign({}, htmlAttributes?.style, styleOverrides)}
        />
      ) : (
        /* @ts-expect-error - Component can be any valid component */
        <Component
          className={className}
          {...htmlAttributes}
          style={Object.assign({}, htmlAttributes?.style, styleOverrides)}
        >
          {renderChildren()}
        </Component>
      )}
    </>
  )

  function renderChildren() {
    /**
     * If this is a text component, we want to render the text value
     */
    if (properties.content?.value) {
      return removeNewLines(properties.content.value)
    }

    /**
     * If there are child nodes, render them instead
     */
    if (children) {
      return children
    }

    return null
  }
}

function getComponent(
  componentId: ComponentId,
  properties: Properties,
  renderAsDiv = false,
) {
  if (renderAsDiv) {
    return PRIMITIVES.HTMLDiv
  }

  // Get the export config
  const config = getComponentExportConfig(componentId)

  if (config.react.returns === "Frame") {
    return PRIMITIVES.HTMLDiv
  }

  if (config.react.returns === "wrapperElement") {
    const raw = properties.wrapperElement?.value
    const tag =
      typeof raw === "string" && raw.length > 0 ? raw : WrapperElement.DIV
    const item = Object.entries(NATIVE_REACT_PRIMITIVES).find(
      ([_, entry]) =>
        entry.wrapperElementOption === tag || entry.htmlElementOption === tag,
    )
    invariant(
      item,
      `Could not find a native primitive for component ${componentId} with wrapper element ${tag}`,
    )
    const key = item[0] as NativeReactPrimitive
    return PRIMITIVES[key]
  }

  // If this is a htmlElement component, we need to find the correct native primitive
  if (config.react.returns === "htmlElement") {
    const item = Object.entries(NATIVE_REACT_PRIMITIVES).find(
      ([_, item]) => item.htmlElementOption === properties.htmlElement?.value,
    )
    invariant(
      item,
      `Could not find a native primitive for component ${componentId} with html element ${properties.htmlElement?.value}`,
    )
    const key = item[0] as NativeReactPrimitive
    return PRIMITIVES[key]
  }

  if (config.react.returns === "iconMap") {
    return null
  }

  const primitive = PRIMITIVES[config.react.returns]
  invariant(
    primitive,
    `Could not find a native primitive for component ${componentId}`,
  )
  return primitive
}

const VOID_NATIVE_REACT_PRIMITIVES = new Set<NativeReactPrimitive>([
  "HTMLHr",
  "HTMLImg",
  "HTMLInput",
  "HTMLSource",
  "HTMLTrack",
])

function isVoidComponent(
  componentId: ComponentId,
  renderAsDiv = false,
): boolean {
  if (renderAsDiv) {
    return false
  }

  const config = getComponentExportConfig(componentId)

  return (
    config.react.returns !== "Frame" &&
    config.react.returns !== "wrapperElement" &&
    config.react.returns !== "htmlElement" &&
    config.react.returns !== "iconMap" &&
    VOID_NATIVE_REACT_PRIMITIVES.has(config.react.returns)
  )
}

export const PRIMITIVES: Record<
  NativeReactPrimitive,
  // Primitives accept varying prop shapes, so the map is typed loosely.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  React.ComponentType<any>
> = {
  HTMLAnchor: HTMLAnchor,
  HTMLArticle: HTMLArticle,
  HTMLAside: HTMLAside,
  HTMLBlockquote: HTMLBlockquote,
  HTMLButton: HTMLButton,
  HTMLCite: HTMLCite,
  HTMLCode: HTMLCode,
  HTMLDd: HTMLDd,
  HTMLDiv: HTMLDiv,
  HTMLDl: HTMLDl,
  HTMLDt: HTMLDt,
  HTMLFieldset: HTMLFieldset,
  HTMLFigure: HTMLFigure,
  HTMLFooter: HTMLFooter,
  HTMLForm: HTMLForm,
  HTMLHeader: HTMLHeader,
  HTMLHeading1: HTMLHeading1,
  HTMLHeading2: HTMLHeading2,
  HTMLHeading3: HTMLHeading3,
  HTMLHeading4: HTMLHeading4,
  HTMLHeading5: HTMLHeading5,
  HTMLHeading6: HTMLHeading6,
  HTMLHr: HTMLHr,
  HTMLImg: HTMLImg,
  HTMLInput: HTMLInput,
  HTMLLabel: HTMLLabel,
  HTMLLegend: HTMLLegend,
  HTMLLi: HTMLLi,
  HTMLMain: HTMLMain,
  HTMLMenu: HTMLMenu,
  HTMLNav: HTMLNav,
  HTMLOl: HTMLOl,
  HTMLOptgroup: HTMLOptgroup,
  HTMLOption: HTMLOption,
  HTMLParagraph: HTMLParagraph,
  HTMLPre: HTMLPre,
  HTMLSection: HTMLSection,
  HTMLSelect: HTMLSelect,
  HTMLSource: HTMLSource,
  HTMLSpan: HTMLSpan,
  HTMLSvg: HTMLSvg,
  HTMLTable: HTMLTable,
  HTMLTbody: HTMLTbody,
  HTMLTd: HTMLTd,
  HTMLTextarea: HTMLTextarea,
  HTMLTfoot: HTMLTfoot,
  HTMLTh: HTMLTh,
  HTMLThead: HTMLThead,
  HTMLTr: HTMLTr,
  HTMLTrack: HTMLTrack,
  HTMLUl: HTMLUl,
  HTMLVideo: HTMLVideo,
}
