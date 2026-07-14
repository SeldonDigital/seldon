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

export interface ListItemListItem_01Props extends HTMLAttributes<
  HTMLElement | HTMLElement | HTMLLIElement
> {
  className?: string
  "data-seldon-ref"?: string
  children?: string
  htmlElement?: "li" | "dt" | "dd"
}

/*****
 * List Item: ListItem_01
 * Level: Primitive
 * Intent: Text item inside a list. Renders as li in ordered and unordered lists, or as dt and dd in description lists.
 * Tags: list text, li, dt, dd, list item, description, primitive, text
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ListItemListItem_01
 *   children="Description Term"
 *   htmlElement="dt"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function ListItemListItem_01({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: ListItemListItem_01Props) {
  const listItemListItem_01ClassName = combineClassNames(
    "sdn-list-item-list-item-01",
    className,
  )

  switch (htmlElement) {
    case "li":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLi
          className={listItemListItem_01ClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLLi>
      )
    case "dd":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLDd
          className={listItemListItem_01ClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLDd>
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLDt
          className={listItemListItem_01ClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLDt>
      )
  }
}

//
// Default property values
//
const sdn: ListItemListItem_01Props = {
  children: "Description Term",
  htmlElement: "dt",
  "aria-hidden": "false",
  className: "sdn-list-item-list-item-01 sdn-list-item",
}
