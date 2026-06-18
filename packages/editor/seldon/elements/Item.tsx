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
import { LiHTMLAttributes } from "react"
import { HTMLLi } from "../native-react/HTML.Li"
import { combineClassNames } from "../utils/class-name"

export interface ItemProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
}

/*****
 * Item: Item
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Default
 *
 * @example
 * ```tsx
 * <Item

 * />
 * ```
 *****/
export function Item({ className = "", ...props }: ItemProps) {
  const itemClassName = combineClassNames("sdn-item", className)

  //
  // React JSX component with merged default and custom properties
  //
  return <HTMLLi className={itemClassName} {...props} />
}
