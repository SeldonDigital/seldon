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
import { HTMLAnchor } from "../native-react/HTML.Anchor"
import { HTMLHeading1 } from "../native-react/HTML.Heading1"
import { HTMLHeading2 } from "../native-react/HTML.Heading2"
import { HTMLHeading3 } from "../native-react/HTML.Heading3"
import { HTMLHeading4 } from "../native-react/HTML.Heading4"
import { HTMLHeading5 } from "../native-react/HTML.Heading5"
import { HTMLHeading6 } from "../native-react/HTML.Heading6"
import { HTMLLabel } from "../native-react/HTML.Label"
import { HTMLParagraph } from "../native-react/HTML.Paragraph"
import { HTMLSpan } from "../native-react/HTML.Span"
import { combineClassNames } from "../utils/class-name"

export interface TextProps extends HTMLAttributes<
  | HTMLAnchorElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLLabelElement
  | HTMLParagraphElement
  | HTMLElement
> {
  className?: string
  children?: string
  htmlElement?:
    | "p"
    | "span"
    | "a"
    | "label"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
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
 *   children="Body"
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
    case "a":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLAnchor className={textClassName} {...props}>
          {children}
        </HTMLAnchor>
      )
    case "label":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLabel className={textClassName} {...props}>
          {children}
        </HTMLLabel>
      )
    case "h1":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading1 className={textClassName} {...props}>
          {children}
        </HTMLHeading1>
      )
    case "h2":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading2 className={textClassName} {...props}>
          {children}
        </HTMLHeading2>
      )
    case "h3":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading3 className={textClassName} {...props}>
          {children}
        </HTMLHeading3>
      )
    case "h4":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading4 className={textClassName} {...props}>
          {children}
        </HTMLHeading4>
      )
    case "h5":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading5 className={textClassName} {...props}>
          {children}
        </HTMLHeading5>
      )
    case "h6":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading6 className={textClassName} {...props}>
          {children}
        </HTMLHeading6>
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
  children: "Body",
  htmlElement: "p",
  className: "sdn-text",
}
