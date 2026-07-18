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
import { AnchorHTMLAttributes } from "react"
import { HTMLAnchor } from "../native-react/HTML.Anchor"
import { combineClassNames } from "../utils/class-name"

export interface LinkFooterProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
  "data-seldon-ref"?: string
}

/*****
 * Link: LinkFooter
 * Level: Primitive
 * Intent: A clickable link component that can be used for navigation, external links, or any clickable text. Supports various styling and accessibility options.
 * Tags: link, text, navigation, clickable, primitive, interactive
 * Type: Custom
 *
 * @example
 * ```tsx
 * <LinkFooter
 *   children="Link"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function LinkFooter({
  className = "",
  children = sdn.children,
  ...props
}: LinkFooterProps) {
  const linkFooterClassName = combineClassNames("sdn-link-footer", className)

  //
  // React JSX component with merged default and custom properties
  //
  return (
    <HTMLAnchor
      className={linkFooterClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children}
    </HTMLAnchor>
  )
}

//
// Default property values
//
const sdn: LinkFooterProps = {
  children: "Link",
  "aria-hidden": "false",
  className: "sdn-link-footer sdn-link",
}
