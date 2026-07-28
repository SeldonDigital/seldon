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

export interface BarNavigationBarProps extends HTMLAttributes<HTMLElement> {
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

  button4?: ButtonProps | null
  icon4?: IconProps | null
  textLabel4?: TextLabelProps | null

  button5?: ButtonProps | null
  icon5?: IconProps | null
  textLabel5?: TextLabelProps | null
}

//
// Default property values
//
const sdn: BarNavigationBarProps = {
  role: "navigation",
  "aria-hidden": "false",
  button: {
    className: "sdn-button sdn-button--rurb",
  },
  icon: {
    icon: "material-home",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ivvi",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--p4vx",
  },

  button2: {
    className: "sdn-button sdn-button--ze8m",
  },
  icon2: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--pbp5",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--4mii",
  },

  button3: {
    className: "sdn-button sdn-button--ze8m",
  },
  icon3: {
    icon: "material-favoriteBorder",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--pbp5",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--4mii",
  },

  button4: {
    className: "sdn-button sdn-button--ze8m",
  },
  icon4: {
    icon: "material-accountCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--pbp5",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--4mii",
  },

  button5: {
    className: "sdn-button sdn-button--ze8m",
  },
  icon5: {
    icon: "material-settings",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--pbp5",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--4mii",
  },
}

/**
 * Bar: BarNavigationBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
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
 *   Button       button4
 *     Icon       icon4
 *     TextLabel  textLabel4
 *   Button       button5
 *     Icon       icon5
 *     TextLabel  textLabel5
 *
 * @example
 * ```tsx
 * <BarNavigationBar
 *   role="navigation"
 *   aria-hidden="false"
 * />
 * ```
 */
export function BarNavigationBar({
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

  button4,
  icon4,
  textLabel4,

  button5,
  icon5,
  textLabel5,

  children,
  seldonRefs,
  ...props
}: BarNavigationBarProps) {
  const barNavigationBarClassName = combineClassNames("sdn-bar-navigation-bar", className)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const button3Props = mergeSlot(sdn.button3, button3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  const button4Props = mergeSlot(sdn.button4, button4, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)

  const button5Props = mergeSlot(sdn.button5, button5, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)

  return (
    <Frame
      className={barNavigationBarClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
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
          {button4Props !== null && (
            <Button {...button4Props}>
              {icon4Props !== null && <Icon {...icon4Props} />}
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            </Button>
          )}
          {button5Props !== null && (
            <Button {...button5Props}>
              {icon5Props !== null && <Icon {...icon5Props} />}
              {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}
