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
import { HTMLHr } from "../native-react/HTML.Hr"
import { combineClassNames } from "../utils/class-name"

export interface HrProps extends HTMLAttributes<HTMLHRElement> {
  className?: string
  "data-seldon-ref"?: string
}

/*****
 * Horizontal Rule: Hr
 * Level: Primitive
 * Intent: Renders a horizontal rule for visual separation of content.
 * Tags: divider, hr, horizontal rule, primitive, separator, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <Hr
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Hr({ className = "", ...props }: HrProps) {
  const hrClassName = combineClassNames("sdn-hr", className)

  //
  // React JSX component with merged default and custom properties
  //
  return (
    <HTMLHr
      className={hrClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    />
  )
}

//
// Default property values
//
const sdn: HrProps = {
  "aria-hidden": "false",
  className: "sdn-hr",
}
