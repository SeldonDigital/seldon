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
import { HTMLBold } from "../native-react/HTML.Bold"
import { HTMLCode } from "../native-react/HTML.Code"
import { HTMLEmphasis } from "../native-react/HTML.Emphasis"
import { HTMLHeading1 } from "../native-react/HTML.Heading1"
import { HTMLHeading2 } from "../native-react/HTML.Heading2"
import { HTMLHeading3 } from "../native-react/HTML.Heading3"
import { HTMLHeading4 } from "../native-react/HTML.Heading4"
import { HTMLHeading5 } from "../native-react/HTML.Heading5"
import { HTMLHeading6 } from "../native-react/HTML.Heading6"
import { HTMLLabel } from "../native-react/HTML.Label"
import { HTMLOption } from "../native-react/HTML.Option"
import { HTMLParagraph } from "../native-react/HTML.Paragraph"
import { HTMLPre } from "../native-react/HTML.Pre"
import { HTMLSpan } from "../native-react/HTML.Span"
import { HTMLStrong } from "../native-react/HTML.Strong"
import { combineClassNames } from "../utils/class-name"

export interface TextSubtitleProps extends HTMLAttributes<
  | HTMLAnchorElement
  | HTMLElement
  | HTMLElement
  | HTMLElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLLabelElement
  | HTMLOptionElement
  | HTMLParagraphElement
  | HTMLPreElement
  | HTMLElement
  | HTMLElement
> {
  "data-seldon-ref"?: string
  htmlElement?:
    | "p"
    | "span"
    | "b"
    | "strong"
    | "em"
    | "a"
    | "label"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "pre"
    | "code"
    | "option"
}

//
// Default property values
//
const sdn: TextSubtitleProps = {
  children: "Subtitle",
  htmlElement: "h5",
  "aria-hidden": "false",
}

/**
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
 *   aria-hidden="false"
 * />
 * ```
 */
export function TextSubtitle({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: TextSubtitleProps) {
  const textSubtitleClassName = combineClassNames("sdn-text-subtitle", className)

  switch (htmlElement) {
    case "p":
      return (
        <HTMLParagraph
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLParagraph>
      )
    case "span":
      return (
        <HTMLSpan className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLSpan>
      )
    case "b":
      return (
        <HTMLBold className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLBold>
      )
    case "strong":
      return (
        <HTMLStrong className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLStrong>
      )
    case "em":
      return (
        <HTMLEmphasis className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLEmphasis>
      )
    case "a":
      return (
        <HTMLAnchor className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLAnchor>
      )
    case "label":
      return (
        <HTMLLabel className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLLabel>
      )
    case "h1":
      return (
        <HTMLHeading1 className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLHeading1>
      )
    case "h2":
      return (
        <HTMLHeading2 className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLHeading2>
      )
    case "h3":
      return (
        <HTMLHeading3 className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLHeading3>
      )
    case "h4":
      return (
        <HTMLHeading4 className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLHeading4>
      )
    case "h6":
      return (
        <HTMLHeading6 className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLHeading6>
      )
    case "pre":
      return (
        <HTMLPre className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLPre>
      )
    case "code":
      return (
        <HTMLCode className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLCode>
      )
    case "option":
      return (
        <HTMLOption className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLOption>
      )
    default:
      return (
        <HTMLHeading5 className={textSubtitleClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
          {children}
        </HTMLHeading5>
      )
  }
}
