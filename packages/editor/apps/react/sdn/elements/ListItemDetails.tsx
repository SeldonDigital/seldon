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

export interface ListItemDetailsProps extends HTMLAttributes<
  HTMLElement | HTMLElement | HTMLLIElement
> {
  "data-seldon-ref"?: string
  htmlElement?: "li" | "dt" | "dd"
}

//
// Default property values
//
const sdn: ListItemDetailsProps = {
  children: "Details",
  htmlElement: "dd",
  "aria-hidden": "false",
}

/**
 * List Item: Details
 * Level: Element
 * Intent: One list item block. Children are inline Text runs for plain, bold, and italic spans.
 * Tags: list text, li, dt, dd, list item, description, element, text
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ListItemDetails
 *   children="Details"
 *   htmlElement="dd"
 *   aria-hidden="false"
 * />
 * ```
 */
export function ListItemDetails({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: ListItemDetailsProps) {
  const listItemDetailsClassName = combineClassNames("sdn-list-item-details", className)

  switch (htmlElement) {
    case "li":
      return (
        <HTMLLi className={listItemDetailsClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLLi>
      )
    case "dt":
      return (
        <HTMLDt className={listItemDetailsClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLDt>
      )
    default:
      return (
        <HTMLDd className={listItemDetailsClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLDd>
      )
  }
}
