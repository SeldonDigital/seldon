/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/
import { HTMLAttributes } from "react"
import { HTMLLabel } from "../../native-react/HTML.Label"
import { HTMLSpan } from "../../native-react/HTML.Span"
import { combineClassNames } from "../../utils/class-name"

export interface LabelProps extends HTMLAttributes<
  HTMLLabelElement | HTMLElement
> {
  className?: string
  children?: string
  htmlElement?: "span" | "label"
}

/*****
 * Label: Label
 * Level: Primitive
 * Intent: Associates readable text with a form control for accessibility.
 * Tags: label, form, input, text, accessibility, primitive, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <Label
 *   children="Label"
 *   htmlElement="label"
 * />
 * ```
 *****/
export function Label({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: LabelProps) {
  const labelClassName = combineClassNames("sdn-label", className)

  switch (htmlElement) {
    case "span":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLSpan className={labelClassName} {...props}>
          {children}
        </HTMLSpan>
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLabel className={labelClassName} {...props}>
          {children}
        </HTMLLabel>
      )
  }
}

//
// Default property values
//
const sdn: LabelProps = {
  children: "Label",
  htmlElement: "label",
  className: "sdn-label",
}
