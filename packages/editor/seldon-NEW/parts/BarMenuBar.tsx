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
import { ButtonSimple, ButtonSimpleProps } from "../elements/ButtonSimple"
import { Frame } from "../frames/Frame"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"

export interface BarMenuBarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  buttonSimple?: ButtonSimpleProps | null
  textLabel?: TextLabelProps | null
  buttonSimple2?: ButtonSimpleProps | null
  textLabel2?: TextLabelProps | null
  buttonSimple3?: ButtonSimpleProps | null
  textLabel3?: TextLabelProps | null
  buttonSimple4?: ButtonSimpleProps | null
  textLabel4?: TextLabelProps | null
}

/*****
 * Bar: BarMenuBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * @example
 * ```tsx
 * <BarMenuBar
 *   role="menubar"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function BarMenuBar({
  className = "",
  buttonSimple = sdn.buttonSimple,
  textLabel,
  buttonSimple2 = sdn.buttonSimple2,
  textLabel2,
  buttonSimple3 = sdn.buttonSimple3,
  textLabel3,
  buttonSimple4 = sdn.buttonSimple4,
  textLabel4,
  children,
  ...props
}: BarMenuBarProps) {
  const barMenuBarClassName = combineClassNames("sdn-bar-menu-bar", className)
  const buttonSimpleProps =
    buttonSimple === null
      ? null
      : {
          ...sdn.buttonSimple,
          ...buttonSimple,
          className: combineClassNames(
            sdn.buttonSimple?.className,
            buttonSimple?.className,
          ),
        }
  const textLabelProps =
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        }
  const buttonSimple2Props =
    buttonSimple2 === null
      ? null
      : {
          ...sdn.buttonSimple2,
          ...buttonSimple2,
          className: combineClassNames(
            sdn.buttonSimple2?.className,
            buttonSimple2?.className,
          ),
        }
  const textLabel2Props =
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        }
  const buttonSimple3Props =
    buttonSimple3 === null
      ? null
      : {
          ...sdn.buttonSimple3,
          ...buttonSimple3,
          className: combineClassNames(
            sdn.buttonSimple3?.className,
            buttonSimple3?.className,
          ),
        }
  const textLabel3Props =
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        }
  const buttonSimple4Props =
    buttonSimple4 === null
      ? null
      : {
          ...sdn.buttonSimple4,
          ...buttonSimple4,
          className: combineClassNames(
            sdn.buttonSimple4?.className,
            buttonSimple4?.className,
          ),
        }
  const textLabel4Props =
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
          ),
        }

  return (
    <Frame
      className={barMenuBarClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonSimpleProps !== null && (
            <ButtonSimple {...buttonSimpleProps}>
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </ButtonSimple>
          )}
          {buttonSimple2Props !== null && (
            <ButtonSimple {...buttonSimple2Props}>
              {textLabel2 && textLabel2Props && (
                <TextLabel {...textLabel2Props} />
              )}
            </ButtonSimple>
          )}
          {buttonSimple3Props !== null && (
            <ButtonSimple {...buttonSimple3Props}>
              {textLabel3 && textLabel3Props && (
                <TextLabel {...textLabel3Props} />
              )}
            </ButtonSimple>
          )}
          {buttonSimple4Props !== null && (
            <ButtonSimple {...buttonSimple4Props}>
              {textLabel4 && textLabel4Props && (
                <TextLabel {...textLabel4Props} />
              )}
            </ButtonSimple>
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: BarMenuBarProps = {
  role: "menubar",
  "aria-hidden": "false",
  className: "sdn-bar-menu-bar sdn-bar",
  buttonSimple: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button--mam0",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple2: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button--mam0",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple3: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button--mam0",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple4: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button--mam0",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
