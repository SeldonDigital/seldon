/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/
import { HTMLAttributes } from "react"

import { HTMLArticle } from "../native-react/HTML.Article"
import { HTMLAside } from "../native-react/HTML.Aside"
import { HTMLBlockquote } from "../native-react/HTML.Blockquote"
import { HTMLDiv } from "../native-react/HTML.Div"
import { HTMLFieldset } from "../native-react/HTML.Fieldset"
import { HTMLFigure } from "../native-react/HTML.Figure"
import { HTMLFooter } from "../native-react/HTML.Footer"
import { HTMLForm } from "../native-react/HTML.Form"
import { HTMLHeader } from "../native-react/HTML.Header"
import { HTMLLi } from "../native-react/HTML.Li"
import { HTMLMain } from "../native-react/HTML.Main"
import { HTMLMenu } from "../native-react/HTML.Menu"
import { HTMLNav } from "../native-react/HTML.Nav"
import { HTMLOl } from "../native-react/HTML.Ol"
import { HTMLSection } from "../native-react/HTML.Section"
import { HTMLTable } from "../native-react/HTML.Table"
import { HTMLTbody } from "../native-react/HTML.Tbody"
import { HTMLTfoot } from "../native-react/HTML.Tfoot"
import { HTMLThead } from "../native-react/HTML.Thead"
import { HTMLTr } from "../native-react/HTML.Tr"
import { HTMLUl } from "../native-react/HTML.Ul"
import { combineClassNames } from "../utils/class-name"

export interface ContainerProps extends HTMLAttributes<
  | HTMLElement
  | HTMLElement
  | HTMLQuoteElement
  | HTMLElement
  | HTMLFieldSetElement
  | HTMLElement
  | HTMLElement
  | HTMLFormElement
  | HTMLElement
  | HTMLLIElement
  | HTMLElement
  | HTMLMenuElement
  | HTMLElement
  | HTMLOListElement
  | HTMLElement
  | HTMLTableElement
  | HTMLTableSectionElement
  | HTMLTableSectionElement
  | HTMLTableSectionElement
  | HTMLTableRowElement
  | HTMLUListElement
> {
  className?: string
  "data-seldon-ref"?: string
  wrapperElement?:
    | "div"
    | "section"
    | "article"
    | "aside"
    | "main"
    | "nav"
    | "header"
    | "footer"
    | "ul"
    | "ol"
    | "li"
    | "form"
    | "fieldset"
    | "figure"
    | "menu"
    | "blockquote"
    | "table"
    | "thead"
    | "tbody"
    | "tfoot"
    | "tr"
}

/*****
 * Container: Container
 * Level: Frame
 * Intent: Grid container schema used to arrange children in a CSS grid with a configurable number of columns and rows. Use it instead of Frame when children should align to a shared grid; Frame remains the flexbox container.
 * Tags: container, layout, grid, ui, box, content, sizing
 * Type: Default
 *
 * @example
 * ```tsx
 * <Container
 *   wrapperElement="div"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Container({
  className = "",
  wrapperElement = sdn.wrapperElement,
  ...props
}: ContainerProps) {
  const containerClassName = combineClassNames("sdn-container", className)

  switch (wrapperElement) {
    case "section":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLSection
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "article":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLArticle
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "aside":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLAside
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "main":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLMain
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "nav":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLNav
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "header":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeader
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "footer":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLFooter
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "ul":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLUl
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "ol":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLOl
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "li":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLi
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "form":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLForm
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "fieldset":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLFieldset
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "figure":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLFigure
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "menu":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLMenu
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "blockquote":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLBlockquote
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "table":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLTable
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "thead":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLThead
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "tbody":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLTbody
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "tfoot":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLTfoot
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    case "tr":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLTr
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLDiv
          className={containerClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
  }
}

//
// Default property values
//
const sdn: ContainerProps = {
  wrapperElement: "div",
  "aria-hidden": "false",
  className: "sdn-container",
}
