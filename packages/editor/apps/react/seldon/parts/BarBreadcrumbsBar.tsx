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

import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Link, LinkProps } from "../primitives/Link"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface BarBreadcrumbsBarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  icon2?: IconProps | null

  link?: LinkProps | null

  icon3?: IconProps | null

  link2?: LinkProps | null

  icon4?: IconProps | null

  link3?: LinkProps | null
}

//
// Default property values
//
const sdn: BarBreadcrumbsBarProps = {
  role: "navigation",
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xl1d",
  },

  icon2: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qjxq",
  },

  link: {
    children: "Home",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--yqey",
  },

  icon3: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qjxq",
  },

  link2: {
    children: "Profile",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--yqey",
  },

  icon4: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qjxq",
  },

  link3: {
    children: "Settings",
    "aria-hidden": "false",
    "aria-current": "page",
    className: "sdn-link sdn-link--yqey",
  },
}

/**
 * Bar: BarBreadcrumbsBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic  buttonIconic
 *     Icon        icon
 *   Icon          icon2
 *   Link          link
 *   Icon          icon3
 *   Link          link2
 *   Icon          icon4
 *   Link          link3
 *
 * @example
 * ```tsx
 * <BarBreadcrumbsBar
 *   role="navigation"
 *   aria-hidden="false"
 * />
 * ```
 */
export function BarBreadcrumbsBar({
  className = "",
  buttonIconic,
  icon,

  icon2,

  link,

  icon3,

  link2,

  icon4,

  link3,

  children,
  seldonRefs,
  ...props
}: BarBreadcrumbsBarProps) {
  const barBreadcrumbsBarClassName = combineClassNames("sdn-bar-breadcrumbs-bar", className)

  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const linkProps = mergeSlot(sdn.link, link, seldonRefs)

  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  const link2Props = mergeSlot(sdn.link2, link2, seldonRefs)

  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  const link3Props = mergeSlot(sdn.link3, link3, seldonRefs)

  return (
    <Frame
      className={barBreadcrumbsBarClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
          {icon2Props !== null && <Icon {...icon2Props} />}
          {linkProps !== null && <Link {...linkProps} />}
          {icon3Props !== null && <Icon {...icon3Props} />}
          {link2Props !== null && <Link {...link2Props} />}
          {icon4Props !== null && <Icon {...icon4Props} />}
          {link3Props !== null && <Link {...link3Props} />}
        </>
      )}
    </Frame>
  )
}
