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
import { HTMLHeading1 } from "../native-react/HTML.Heading1"
import { HTMLHeading2 } from "../native-react/HTML.Heading2"
import { HTMLHeading3 } from "../native-react/HTML.Heading3"
import { HTMLHeading4 } from "../native-react/HTML.Heading4"
import { HTMLHeading5 } from "../native-react/HTML.Heading5"
import { HTMLHeading6 } from "../native-react/HTML.Heading6"
import { combineClassNames } from "../utils/class-name"

export interface TitleProps extends HTMLAttributes<
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
  | HTMLHeadingElement
> {
  className?: string
  children?: string
  htmlElement?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

/*****
 * Title: Title
 * Level: Primitive
 * Intent: Prominent title text used at the top of sections or views.
 * Tags: title, heading, top, section, primitive, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <Title
 *   children="Title"
 *   htmlElement="h4"
 * />
 * ```
 *****/
export function Title({
  className = "",
  children = sdn.children,
  htmlElement = sdn.htmlElement,
  ...props
}: TitleProps) {
  const titleClassName = combineClassNames("sdn-title", className)

  switch (htmlElement) {
    case "h1":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading1 className={titleClassName} {...props}>
          {children}
        </HTMLHeading1>
      )
    case "h2":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading2 className={titleClassName} {...props}>
          {children}
        </HTMLHeading2>
      )
    case "h3":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading3 className={titleClassName} {...props}>
          {children}
        </HTMLHeading3>
      )
    case "h5":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading5 className={titleClassName} {...props}>
          {children}
        </HTMLHeading5>
      )
    case "h6":
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading6 className={titleClassName} {...props}>
          {children}
        </HTMLHeading6>
      )
    default:
      //
      // React JSX component with merged default and custom properties
      //
      return (
        <HTMLHeading4 className={titleClassName} {...props}>
          {children}
        </HTMLHeading4>
      )
  }
}

//
// Default property values
//
const sdn: TitleProps = {
  children: "Title",
  htmlElement: "h4",
  className: "sdn-title",
}
