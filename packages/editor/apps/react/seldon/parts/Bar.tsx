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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface BarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textTitle?: TextTitleProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  button?: ButtonProps | null
  icon2?: IconProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * Bar: Bar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Default
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
 *****/
export function Bar({
  className = "",
  textTitle,
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  button = sdn.button,
  icon2 = sdn.icon2,
  textLabel,
  children,
  seldonRefs,
  ...props
}: BarProps) {
  const barClassName = combineClassNames("sdn-bar", className)
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        },
  )
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
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
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
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )

  return (
    <Frame className={barClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
          {buttonIconicProps !== null && (
            <ButtonIconic {...buttonIconicProps} icon={iconProps} />
          )}
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {icon2 && icon2Props && <Icon {...icon2Props} />}
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: BarProps = {
  "aria-hidden": "false",
  className: "sdn-bar",
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
