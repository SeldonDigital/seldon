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

import { Frame } from "../frames/Frame"
import { Link, LinkProps } from "../primitives/Link"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  link?: LinkProps | null

  link2?: LinkProps | null

  link3?: LinkProps | null
}

//
// Default property values
//
const sdn: SectionProps = {
  "aria-hidden": "false",
  link: {
    children: "About",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--bvcm",
  },

  link2: {
    children: "Contact",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--bvcm",
  },

  link3: {
    children: "Support",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--bvcm",
  },
}

/**
 * Section: Section
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Default
 *
 * Structure:
 *   Link  link
 *   Link  link2
 *   Link  link3
 *
 * @example
 * ```tsx
 * <Section
 *   aria-hidden="false"
 *   link="{}"
 *   link2="{}"
 *   link3="{}"
 * />
 * ```
 */
export function Section({
  className = "",
  link,

  link2,

  link3,

  children,
  seldonRefs,
  ...props
}: SectionProps) {
  const sectionClassName = combineClassNames("sdn-section", className)

  const linkProps = mergeSlot(sdn.link, link, seldonRefs)

  const link2Props = mergeSlot(sdn.link2, link2, seldonRefs)

  const link3Props = mergeSlot(sdn.link3, link3, seldonRefs)

  return (
    <Frame className={sectionClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {linkProps !== null && <Link {...linkProps} />}
          {link2Props !== null && <Link {...link2Props} />}
          {link3Props !== null && <Link {...link3Props} />}
        </>
      )}
    </Frame>
  )
}
