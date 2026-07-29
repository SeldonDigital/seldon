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

import { HTMLLegend } from "../native-react/HTML.Legend"
import { combineClassNames } from "../utils/class-name"

export interface LegendProps extends HTMLAttributes<HTMLLegendElement> {
  "data-seldon-ref"?: string
}

//
// Default property values
//
const sdn: LegendProps = {
  children: "Legend",
  "aria-hidden": "false",
}

/**
 * Legend: Legend
 * Level: Primitive
 * Intent: Provides a caption for a group of related form controls.
 * Tags: legend, form, group, caption, fieldset, primitive, text
 * Type: Default
 *
 * @example
 * ```tsx
 * <Legend
 *   children="Legend"
 *   aria-hidden="false"
 * />
 * ```
 */
export function Legend({ className = "", children = sdn.children, ...props }: LegendProps) {
  const legendClassName = combineClassNames("sdn-legend", className)

  //
  // React JSX component with merged default and custom properties
  //
  return (
    <HTMLLegend className={legendClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children}
    </HTMLLegend>
  )
}
