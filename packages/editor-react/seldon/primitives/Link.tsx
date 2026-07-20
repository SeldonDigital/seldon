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

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
  "data-seldon-ref"?: string
}

/*****
 * Link: Link
 * Level: Primitive
 * Intent: A clickable link component that can be used for navigation, external links, or any clickable text. Supports various styling and accessibility options.
 * Tags: link, text, navigation, clickable, primitive, interactive
 * Type: Default
 *
 * @example
 * ```tsx
 * <Link
 *   children="Link"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Link({
  className = "",
  children = sdn.children,
  ...props
}: LinkProps) {
  const linkClassName = combineClassNames("sdn-link", className)

  //
  // React JSX component with merged default and custom properties
  //
  return (
    <HTMLAnchor
      className={linkClassName}
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
const sdn: LinkProps = {
  children: "Link",
  "aria-hidden": "false",
  className: "sdn-link",
}
