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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SectionSectionLegalProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  link?: LinkProps | null
  link2?: LinkProps | null
  link3?: LinkProps | null
}

/*****
 * Section: SectionLegal
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * @example
 * ```tsx
 * <SectionSectionLegal
 *   aria-hidden="false"
 *   link="{}"
 *   link2="{}"
 *   link3="{}"
 * />
 * ```
 *****/
export function SectionSectionLegal({
  className = "",
  link = sdn.link,
  link2 = sdn.link2,
  link3 = sdn.link3,
  children,
  seldonRefs,
  ...props
}: SectionSectionLegalProps) {
  const sectionSectionLegalClassName = combineClassNames(
    "sdn-section",
    className,
  )
  const linkProps = applyRef(
    seldonRefs,
    link === null
      ? null
      : {
          ...sdn.link,
          ...link,
          className: combineClassNames(sdn.link?.className, link?.className),
        },
  )
  const link2Props = applyRef(
    seldonRefs,
    link2 === null
      ? null
      : {
          ...sdn.link2,
          ...link2,
          className: combineClassNames(sdn.link2?.className, link2?.className),
        },
  )
  const link3Props = applyRef(
    seldonRefs,
    link3 === null
      ? null
      : {
          ...sdn.link3,
          ...link3,
          className: combineClassNames(sdn.link3?.className, link3?.className),
        },
  )

  return (
    <Frame
      className={sectionSectionLegalClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
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

//
// Default property values
//
const sdn: SectionSectionLegalProps = {
  "aria-hidden": "false",
  className: "sdn-section",
  link: {
    children: "Privacy Policy",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--bvcm",
  },
  link2: {
    children: "Terms of Service",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--bvcm",
  },
  link3: {
    children: "Cookie Policy",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--bvcm",
  },
}
