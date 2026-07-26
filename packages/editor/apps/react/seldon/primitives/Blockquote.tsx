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
import { BlockquoteHTMLAttributes } from "react"

import { HTMLBlockquote } from "../native-react/HTML.Blockquote"
import { combineClassNames } from "../utils/class-name"

export interface BlockquoteProps extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
  className?: string
  "data-seldon-ref"?: string
}

/*****
 * Blockquote: Blockquote
 * Level: Primitive
 * Intent: Displays a block-level quotation for cited or referenced content.
 * Tags: blockquote, quote, text, citation, primitive, typography
 * Type: Default
 *
 * @example
 * ```tsx
 * <Blockquote
 *   children="Blockquote"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Blockquote({
  className = "",
  children = sdn.children,
  ...props
}: BlockquoteProps) {
  const blockquoteClassName = combineClassNames("sdn-blockquote", className)

  //
  // React JSX component with merged default and custom properties
  //
  return (
    <HTMLBlockquote
      className={blockquoteClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children}
    </HTMLBlockquote>
  )
}

//
// Default property values
//
const sdn: BlockquoteProps = {
  children: "Blockquote",
  "aria-hidden": "false",
  className: "sdn-blockquote",
}
