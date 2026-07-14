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

export interface ListItemUnorderedProps extends HTMLAttributes<
  HTMLElement | HTMLElement | HTMLLIElement
> {
  className?: string
  "data-seldon-ref"?: string
  children?: string
  htmlElement?: "li" | "dt" | "dd"
}

/*****
 * List Item: Unordered
 * Level: Primitive
 * Intent: Text item inside a list. Renders as li in ordered and unordered lists, or as dt and dd in description lists.
 * Tags: list text, li, dt, dd, list item, description, primitive, text
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ListItemUnordered
 *   children="Unordered List"
 *   htmlElement="ul"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function ListItemUnordered({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: ListItemUnorderedProps) {
  const listItemUnorderedClassName = combineClassNames(
    "sdn-list-item-ordered",
    className,
  )

  switch (htmlElement) {
    case "li":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLi
          className={listItemUnorderedClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLLi>
      )
    case "dt":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLDt
          className={listItemUnorderedClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLDt>
      )
    case "dd":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLDd
          className={listItemUnorderedClassName}
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
        <HTMLUl
          className={listItemUnorderedClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLUl>
      )
  }
}

//
// Default property values
//
const sdn: ListItemUnorderedProps = {
  children: "Unordered List",
  htmlElement: "ul",
  "aria-hidden": "false",
  className: "sdn-list-item-ordered sdn-list-item",
}
