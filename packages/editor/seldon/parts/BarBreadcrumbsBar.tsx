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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface BarBreadcrumbsBarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  icon2?: IconProps | null
  link?: LinkProps | null
  icon3?: IconProps | null
  link2?: LinkProps | null
  icon4?: IconProps | null
  link3?: LinkProps | null
}

/*****
 * Bar: BarBreadcrumbsBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * @example
 * ```tsx
 * <BarBreadcrumbsBar
 *   role="navigation"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function BarBreadcrumbsBar({
  className = "",
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  icon2 = sdn.icon2,
  link = sdn.link,
  icon3 = sdn.icon3,
  link2 = sdn.link2,
  icon4 = sdn.icon4,
  link3 = sdn.link3,
  children,
  seldonRefs,
  ...props
}: BarBreadcrumbsBarProps) {
  const barBreadcrumbsBarClassName = combineClassNames("sdn-bar", className)
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
          ),
        },
  )
  const iconProps = applyRef(
    seldonRefs,
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        },
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
  const icon3Props = applyRef(
    seldonRefs,
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
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
  const icon4Props = applyRef(
    seldonRefs,
    icon4 === null
      ? null
      : {
          ...sdn.icon4,
          ...icon4,
          className: combineClassNames(sdn.icon4?.className, icon4?.className),
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
      className={barBreadcrumbsBarClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && (
            <ButtonIconic {...buttonIconicProps} icon={iconProps} />
          )}
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

//
// Default property values
//
const sdn: BarBreadcrumbsBarProps = {
  role: "navigation",
  "aria-hidden": "false",
  className: "sdn-bar sdn-bar",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
  icon2: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ucf5",
  },
  link: {
    children: "Home",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--yqey",
  },
  icon3: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ucf5",
  },
  link2: {
    children: "Profile",
    "aria-hidden": "false",
    className: "sdn-link sdn-link--yqey",
  },
  icon4: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ucf5",
  },
  link3: {
    children: "Settings",
    "aria-hidden": "false",
    "aria-current": "page",
    className: "sdn-link sdn-link--yqey",
  },
}
