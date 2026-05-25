/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { HTMLAttributes } from "react"
import { HTMLHeading5 } from "../native-react/HTML.Heading5"
import { HTMLHeading6 } from "../native-react/HTML.Heading6"
import { HTMLParagraph } from "../native-react/HTML.Paragraph"

export interface TaglineProps
  extends HTMLAttributes<
    HTMLHeadingElement | HTMLHeadingElement | HTMLParagraphElement
  > {
  className?: string
  children?: string
  htmlElement?: "h5" | "h6" | "p"
}

export function Tagline({
  className = "",
  htmlElement,
  ...props
}: TaglineProps) {
  switch (htmlElement) {
    case "h5":
      return (
        <HTMLHeading5
          className={"variant-tagline-default " + className}
          {...props}
        />
      )
    case "h6":
      return (
        <HTMLHeading6
          className={"variant-tagline-default " + className}
          {...props}
        />
      )
    default:
      return (
        <HTMLParagraph
          className={"variant-tagline-default " + className}
          {...props}
        />
      )
  }
}
