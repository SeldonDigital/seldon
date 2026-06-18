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

export interface TextTitleProps extends HTMLAttributes<
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
 * Text: TextTitle
 * Level: Primitive
 * Intent: Base text component for general-purpose inline content.
 * Tags: text, inline, paragraph, primitive, typography, UI
 * Type: Custom
 *
 * @example
 * ```tsx
 * <TextTitle
 *   children="Title"
 *   htmlElement="h4"
 * />
 * ```
 *****/
export function TextTitle({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: TextTitleProps) {
  const textTitleClassName = combineClassNames("sdn-text-title", className)

  switch (htmlElement) {
    case "p":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLParagraph className={textTitleClassName} {...props}>
          {children}
        </HTMLParagraph>
      )
    case "span":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLSpan className={textTitleClassName} {...props}>
          {children}
        </HTMLSpan>
      )
    case "a":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLAnchor className={textTitleClassName} {...props}>
          {children}
        </HTMLAnchor>
      )
    case "label":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLabel className={textTitleClassName} {...props}>
          {children}
        </HTMLLabel>
      )
    case "h1":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading1 className={textTitleClassName} {...props}>
          {children}
        </HTMLHeading1>
      )
    case "h2":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading2 className={textTitleClassName} {...props}>
          {children}
        </HTMLHeading2>
      )
    case "h3":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading3 className={textTitleClassName} {...props}>
          {children}
        </HTMLHeading3>
      )
    case "h5":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading5 className={textTitleClassName} {...props}>
          {children}
        </HTMLHeading5>
      )
    case "h6":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading6 className={textTitleClassName} {...props}>
          {children}
        </HTMLHeading6>
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading4 className={textTitleClassName} {...props}>
          {children}
        </HTMLHeading4>
      )
  }
}

//
// Default property values
//
const sdn: TextTitleProps = {
  children: "Title",
  htmlElement: "h4",
  className: "sdn-text-title sdn-text",
}
