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

import { HTMLDd } from "../native-react/HTML.Dd"
import { HTMLDt } from "../native-react/HTML.Dt"
import { HTMLLi } from "../native-react/HTML.Li"
import { combineClassNames } from "../utils/class-name"

export interface ListItemTermProps extends HTMLAttributes<
  HTMLElement | HTMLElement | HTMLLIElement
> {
  "data-seldon-ref"?: string
  htmlElement?: "li" | "dt" | "dd"
}

//
// Default property values
//
const sdn: ListItemTermProps = {
  children: "Term",
  htmlElement: "dt",
  "aria-hidden": "false",
}

/**
 * List Item: Term
 * Level: Element
 * Intent: One list item block. Children are inline Text runs for plain, bold, and italic spans.
 * Tags: list text, li, dt, dd, list item, description, element, text
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ListItemTerm
 *   children="Term"
 *   htmlElement="dt"
 *   aria-hidden="false"
 * />
 * ```
 */
export function ListItemTerm({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: ListItemTermProps) {
  const listItemTermClassName = combineClassNames("sdn-list-item-term", className)

  switch (htmlElement) {
    case "li":
      return (
        <HTMLLi className={listItemTermClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLLi>
      )
    case "dd":
      return (
        <HTMLDd className={listItemTermClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLDd>
      )
    default:
      return (
        <HTMLDt className={listItemTermClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLDt>
      )
  }
}
