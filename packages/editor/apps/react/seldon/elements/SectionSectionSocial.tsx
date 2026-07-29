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

import { Button, ButtonProps } from "../elements/Button"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SectionSectionSocialProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null

  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null

  button3?: ButtonProps | null
  icon3?: IconProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: SectionSectionSocialProps = {
  "aria-hidden": "false",
  button: {
    className: "sdn-button sdn-button--vd3d",
  },
  icon: {
    icon: "seldon-iconSocialTwitter",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel: {
    children: "Twitter",
    className: "sdn-text-label sdn-text-label--zk5o",
  },

  button2: {
    className: "sdn-button sdn-button--vd3d",
  },
  icon2: {
    icon: "seldon-iconSocialLinkedin",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel2: {
    children: "LinkedIn",
    className: "sdn-text-label sdn-text-label--zk5o",
  },

  button3: {
    className: "sdn-button sdn-button--vd3d",
  },
  icon3: {
    icon: "seldon-iconSocialInstagram",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel3: {
    children: "Instagram",
    className: "sdn-text-label sdn-text-label--zk5o",
  },
}

/**
 * Section: SectionSocial
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * Structure:
 *   Button       button
 *     Icon       icon
 *     TextLabel  textLabel
 *   Button       button2
 *     Icon       icon2
 *     TextLabel  textLabel2
 *   Button       button3
 *     Icon       icon3
 *     TextLabel  textLabel3
 *
 * @example
 * ```tsx
 * <SectionSectionSocial
 *   aria-hidden="false"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 * />
 * ```
 */
export function SectionSectionSocial({
  className = "",
  button,
  icon,
  textLabel,

  button2,
  icon2,
  textLabel2,

  button3,
  icon3,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: SectionSectionSocialProps) {
  const sectionSectionSocialClassName = combineClassNames("sdn-section", className)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const button3Props = mergeSlot(sdn.button3, button3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  return (
    <Frame className={sectionSectionSocialClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {iconProps !== null && <Icon {...iconProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </Button>
          )}
          {button2Props !== null && (
            <Button {...button2Props}>
              {icon2Props !== null && <Icon {...icon2Props} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </Button>
          )}
          {button3Props !== null && (
            <Button {...button3Props}>
              {icon3Props !== null && <Icon {...icon3Props} />}
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}
