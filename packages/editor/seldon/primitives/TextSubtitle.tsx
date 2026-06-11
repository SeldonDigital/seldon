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

export interface TextSubtitleProps extends HTMLAttributes<
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
 * Text: TextSubtitle
 * Level: Primitive
 * Intent: Base text component for general-purpose inline content.
 * Tags: text, inline, paragraph, primitive, typography, UI
 * Type: Custom
 *
 * @example
 * ```tsx
 * <TextSubtitle
 *   children="Subtitle"
 *   htmlElement="h5"
 * />
 * ```
 *****/
export function TextSubtitle({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: TextSubtitleProps) {
  const textSubtitleClassName = combineClassNames(
    "sdn-text-subtitle",
    className,
  )

  switch (htmlElement) {
    case "p":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLParagraph className={textSubtitleClassName} {...props}>
          {children}
        </HTMLParagraph>
      )
    case "span":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLSpan className={textSubtitleClassName} {...props}>
          {children}
        </HTMLSpan>
      )
    case "a":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLAnchor className={textSubtitleClassName} {...props}>
          {children}
        </HTMLAnchor>
      )
    case "label":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLabel className={textSubtitleClassName} {...props}>
          {children}
        </HTMLLabel>
      )
    case "h1":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading1 className={textSubtitleClassName} {...props}>
          {children}
        </HTMLHeading1>
      )
    case "h2":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading2 className={textSubtitleClassName} {...props}>
          {children}
        </HTMLHeading2>
      )
    case "h3":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading3 className={textSubtitleClassName} {...props}>
          {children}
        </HTMLHeading3>
      )
    case "h4":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading4 className={textSubtitleClassName} {...props}>
          {children}
        </HTMLHeading4>
      )
    case "h6":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading6 className={textSubtitleClassName} {...props}>
          {children}
        </HTMLHeading6>
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading5 className={textSubtitleClassName} {...props}>
          {children}
        </HTMLHeading5>
      )
  }
}

//
// Default property values
//
const sdn: TextSubtitleProps = {
  children: "Subtitle",
  htmlElement: "h5",
  className: "sdn-text-subtitle sdn-text",
}
