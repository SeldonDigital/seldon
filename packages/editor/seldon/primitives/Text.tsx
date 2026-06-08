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
import { HTMLParagraph } from "../native-react/HTML.Paragraph"
import { HTMLSpan } from "../native-react/HTML.Span"
import { combineClassNames } from "../utils/class-name"

export interface TextProps
  extends HTMLAttributes<HTMLParagraphElement | HTMLElement> {
  className?: string
  children?: string
  htmlElement?: "p" | "span"
}

/*****
 * Text: Text
 * Level: Primitive
 * Intent: Base text component for general-purpose inline content.
 * Tags: text, inline, paragraph, primitive, typography, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <Text
 *   children="Text"
 *   htmlElement="p"
 * />
 * ```
 *****/
export function Text({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: TextProps) {
  const textClassName = combineClassNames("sdn-text", className)

  switch (htmlElement) {
    case "span":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLSpan className={textClassName} {...props}>
          {children}
        </HTMLSpan>
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLParagraph className={textClassName} {...props}>
          {children}
        </HTMLParagraph>
      )
  }
}

//
// Default property values
//
const sdn: TextProps = {
  children: "Text",
  htmlElement: "p",
  className: "sdn-text",
}
