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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface BarNavigationBarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Bar: BarNavigationBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * @example
 * ```tsx
 * <BarNavigationBar
 *   role="navigation"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function BarNavigationBar({
  className = "",
  button = sdn.button,
  icon = sdn.icon,
  textLabel,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  textLabel2,
  button3 = sdn.button3,
  icon3 = sdn.icon3,
  textLabel3,
  button4 = sdn.button4,
  icon4 = sdn.icon4,
  textLabel4,
  button5 = sdn.button5,
  icon5 = sdn.icon5,
  textLabel5,
  children,
  seldonRefs,
  ...props
}: BarNavigationBarProps) {
  const barNavigationBarClassName = combineClassNames(
    "sdn-bar-navigation-bar",
    className,
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
  const button2Props = applyRef(
    seldonRefs,
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
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
  const textLabel2Props = applyRef(
    seldonRefs,
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        },
  )
  const button3Props = applyRef(
    seldonRefs,
    button3 === null
      ? null
      : {
          ...sdn.button3,
          ...button3,
          className: combineClassNames(
            sdn.button3?.className,
            button3?.className,
          ),
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
  const textLabel3Props = applyRef(
    seldonRefs,
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        },
  )
  const button4Props = applyRef(
    seldonRefs,
    button4 === null
      ? null
      : {
          ...sdn.button4,
          ...button4,
          className: combineClassNames(
            sdn.button4?.className,
            button4?.className,
          ),
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
  const textLabel4Props = applyRef(
    seldonRefs,
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
          ),
        },
  )
  const button5Props = applyRef(
    seldonRefs,
    button5 === null
      ? null
      : {
          ...sdn.button5,
          ...button5,
          className: combineClassNames(
            sdn.button5?.className,
            button5?.className,
          ),
        },
  )
  const icon5Props = applyRef(
    seldonRefs,
    icon5 === null
      ? null
      : {
          ...sdn.icon5,
          ...icon5,
          className: combineClassNames(sdn.icon5?.className, icon5?.className),
        },
  )
  const textLabel5Props = applyRef(
    seldonRefs,
    textLabel5 === null
      ? null
      : {
          ...sdn.textLabel5,
          ...textLabel5,
          className: combineClassNames(
            sdn.textLabel5?.className,
            textLabel5?.className,
          ),
        },
  )

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
              {icon && iconProps && <Icon {...iconProps} />}
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </Button>
          )}
          {button2Props !== null && (
            <Button {...button2Props}>
              {icon2 && icon2Props && <Icon {...icon2Props} />}
              {textLabel2 && textLabel2Props && (
                <TextLabel {...textLabel2Props} />
              )}
            </Button>
          )}
          {button3Props !== null && (
            <Button {...button3Props}>
              {icon3 && icon3Props && <Icon {...icon3Props} />}
              {textLabel3 && textLabel3Props && (
                <TextLabel {...textLabel3Props} />
              )}
            </Button>
          )}
          {button4Props !== null && (
            <Button {...button4Props}>
              {icon4 && icon4Props && <Icon {...icon4Props} />}
              {textLabel4 && textLabel4Props && (
                <TextLabel {...textLabel4Props} />
              )}
            </Button>
          )}
          {button5Props !== null && (
            <Button {...button5Props}>
              {icon5 && icon5Props && <Icon {...icon5Props} />}
              {textLabel5 && textLabel5Props && (
                <TextLabel {...textLabel5Props} />
              )}
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
const sdn: BarNavigationBarProps = {
  role: "navigation",
  "aria-hidden": "false",
  className: "sdn-bar-navigation-bar sdn-bar",
  button: {
    className: "sdn-button sdn-button--obir",
  },
  icon: {
    icon: "material-home",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--4k57",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--lnlb",
  },
  button2: {
    className: "sdn-button sdn-button--uncv",
  },
  icon2: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--4k57",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--lnlb",
  },
  button3: {
    className: "sdn-button sdn-button--uncv",
  },
  icon3: {
    icon: "material-favoriteBorder",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--4k57",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--lnlb",
  },
  button4: {
    className: "sdn-button sdn-button--uncv",
  },
  icon4: {
    icon: "material-accountCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--4k57",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--lnlb",
  },
  button5: {
    className: "sdn-button sdn-button--uncv",
  },
  icon5: {
    icon: "material-settings",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--4k57",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--lnlb",
  },
}
