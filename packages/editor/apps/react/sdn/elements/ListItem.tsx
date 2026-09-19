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

export interface ListItemProps extends HTMLAttributes<HTMLElement | HTMLElement | HTMLLIElement> {
  "data-seldon-ref"?: string
  htmlElement?: "li" | "dt" | "dd"
}

//
// Default property values
//
const sdn: ListItemProps = {
  htmlElement: "li",
  "aria-hidden": "false",
}

/**
 * List Item: Item
 * Level: Element
 * Intent: One list item block. Children are inline Text runs for plain, bold, and italic spans.
 * Tags: list text, li, dt, dd, list item, description, element, text
 * Type: Default
 *
 * @example
 * ```tsx
 * <ListItem
 *   htmlElement="li"
 *   aria-hidden="false"
 * />
 * ```
 */
export function ListItem({
  className = "",
  htmlElement = sdn.htmlElement,
  ...props
}: ListItemProps) {
  const listItemClassName = combineClassNames("sdn-list-item", className)

  switch (htmlElement) {
    case "dt":
      return <HTMLDt className={listItemClassName} aria-hidden={sdn["aria-hidden"]} {...props} />
    case "dd":
      return <HTMLDd className={listItemClassName} aria-hidden={sdn["aria-hidden"]} {...props} />
    default:
      return <HTMLLi className={listItemClassName} aria-hidden={sdn["aria-hidden"]} {...props} />
  }
}
