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
import { HTMLCode } from "../native-react/HTML.Code"
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
import { combineClassNames } from "../utils/class-name"

export interface TextSubtitleProps extends HTMLAttributes<
  | HTMLAnchorElement
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
> {
  className?: string
  "data-seldon-ref"?: string
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
    | "pre"
    | "code"
    | "option"
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
 *   aria-hidden="false"
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
        <HTMLParagraph
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLParagraph>
      )
    case "span":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLSpan
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLSpan>
      )
    case "a":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLAnchor
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLAnchor>
      )
    case "label":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLLabel
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLLabel>
      )
    case "h1":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading1
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLHeading1>
      )
    case "h2":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading2
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLHeading2>
      )
    case "h3":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading3
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLHeading3>
      )
    case "h4":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading4
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLHeading4>
      )
    case "h6":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading6
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLHeading6>
      )
    case "pre":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLPre
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLPre>
      )
    case "code":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLCode
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLCode>
      )
    case "option":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLOption
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
          {children}
        </HTMLOption>
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading5
          className={textSubtitleClassName}
          aria-hidden={sdn["aria-hidden"]}
          {...props}
        >
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
  "aria-hidden": "false",
  className: "sdn-text-subtitle sdn-text",
}
