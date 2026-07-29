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
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface ListProps extends HTMLAttributes<HTMLOListElement | HTMLUListElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs
  htmlElement?: "ul" | "ol"

  listItem?: ListItemProps | null
}

//
// Default property values
//
const sdn: ListProps = {
  htmlElement: "ul",
  "aria-hidden": "false",
  listItem: {
    className: "sdn-list-item sdn-list-item--uvyv",
  },
}

/**
 * List: List
 * Level: Element
 * Intent: Displays a list of items. Renders as an unordered bulleted list or an ordered numbered list.
 * Tags: list, ul, ol, element, bulleted, numbered, sequence, text, UI
 * Type: Default
 *
 * Structure:
 *   ListItem  listItem
 *
 * @example
 * ```tsx
 * <List
 *   htmlElement="ul"
 *   aria-hidden="false"
 * />
 * ```
 */
export function List({
  className = "",
  htmlElement = sdn.htmlElement,
  listItem,

  seldonRefs,
  ...props
}: ListProps) {
  const listClassName = combineClassNames("sdn-list", className)

  const listItemProps = mergeOptionalSlot(sdn.listItem, listItem, seldonRefs)

  switch (htmlElement) {
    case "ol":
      //
      // React JSX component with merged default and custom properties
      //
      return <HTMLOl className={listClassName} aria-hidden={sdn["aria-hidden"]} {...props} />
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return <HTMLUl className={listClassName} aria-hidden={sdn["aria-hidden"]} {...props} />
  }
}
