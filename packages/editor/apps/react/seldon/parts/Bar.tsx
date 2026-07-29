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
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface BarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textTitle?: TextTitleProps | null

  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  button?: ButtonProps | null
  icon2?: IconProps | null
  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: BarProps = {
  "aria-hidden": "false",
  textTitle: {
    className: "sdn-text-title sdn-text-title--qbtu",
  },

  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },

  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

/**
 * Bar: Bar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Default
 *
 * Structure:
 *   TextTitle     textTitle
 *   ButtonIconic  buttonIconic
 *     Icon        icon
 *   Button        button
 *     Icon        icon2
 *     TextLabel   textLabel
 *
 * @example
 * ```tsx
 * <Bar
 *   aria-hidden="false"
 *   textTitle="Product Title"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   button2={() => {}}
 *   textLabel="{}"
 * />
 * ```
 */
export function Bar({
  className = "",
  textTitle,

  buttonIconic,
  icon,

  button,
  icon2,
  textLabel,

  children,
  seldonRefs,
  ...props
}: BarProps) {
  const barClassName = combineClassNames("sdn-bar", className)

  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <Frame className={barClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textTitleProps !== null && <TextTitle {...textTitleProps} />}
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {icon2Props !== null && <Icon {...icon2Props} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}
