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
import { HTMLOl } from "../native-react/HTML.Ol"
import { HTMLUl } from "../native-react/HTML.Ul"
import { ListItem, ListItemProps } from "../primitives/ListItem"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ListOrderedProps extends HTMLAttributes<
  HTMLOListElement | HTMLUListElement
> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  htmlElement?: "ul" | "ol"
  listItem?: ListItemProps | null
}

/*****
 * List: Ordered
 * Level: Element
 * Intent: Displays a list of items. Renders as an unordered bulleted list or an ordered numbered list.
 * Tags: list, ul, ol, element, bulleted, numbered, sequence, text, UI
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ListOrdered
 *   htmlElement="ol"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function ListOrdered({
  className = "",
  htmlElement = sdn.htmlElement,
  listItem,
  seldonRefs,
  ...props
}: ListOrderedProps) {
  const listOrderedClassName = combineClassNames("sdn-list-ordered", className)
  const listItemProps = applyRef(
    seldonRefs,
    listItem === null
      ? null
      : {
          ...sdn.listItem,
          ...listItem,
          className: combineClassNames(
            sdn.listItem?.className,
            listItem?.className,
          ),
        },
  )

  switch (htmlElement) {
    case "ul":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLUl
          className={listOrderedClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLOl
          className={listOrderedClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        />
      )
  }
}

//
// Default property values
//
const sdn: ListOrderedProps = {
  htmlElement: "ol",
  "aria-hidden": "false",
  className: "sdn-list-ordered sdn-list",
  listItem: {
    className: "sdn-list-item sdn-list-item--uvyv",
  },
}
