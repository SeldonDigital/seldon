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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface BarTabsBarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  buttonSimple?: ButtonSimpleProps | null
  textLabel?: TextLabelProps | null
  buttonSimple2?: ButtonSimpleProps | null
  textLabel2?: TextLabelProps | null
  buttonSimple3?: ButtonSimpleProps | null
  textLabel3?: TextLabelProps | null
}

/*****
 * Bar: BarTabsBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * @example
 * ```tsx
 * <BarTabsBar
 *   role="tablist"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function BarTabsBar({
  className = "",
  buttonSimple = sdn.buttonSimple,
  textLabel,
  buttonSimple2 = sdn.buttonSimple2,
  textLabel2,
  buttonSimple3 = sdn.buttonSimple3,
  textLabel3,
  children,
  seldonRefs,
  ...props
}: BarTabsBarProps) {
  const barTabsBarClassName = combineClassNames("sdn-bar-tabs-bar", className)
  const buttonSimpleProps = applyRef(
    seldonRefs,
    buttonSimple === null
      ? null
      : {
          ...sdn.buttonSimple,
          ...buttonSimple,
          className: combineClassNames(
            sdn.buttonSimple?.className,
            buttonSimple?.className,
          ),
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
  const buttonSimple2Props = applyRef(
    seldonRefs,
    buttonSimple2 === null
      ? null
      : {
          ...sdn.buttonSimple2,
          ...buttonSimple2,
          className: combineClassNames(
            sdn.buttonSimple2?.className,
            buttonSimple2?.className,
          ),
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
  const buttonSimple3Props = applyRef(
    seldonRefs,
    buttonSimple3 === null
      ? null
      : {
          ...sdn.buttonSimple3,
          ...buttonSimple3,
          className: combineClassNames(
            sdn.buttonSimple3?.className,
            buttonSimple3?.className,
          ),
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

  return (
    <Frame
      className={barTabsBarClassName}
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
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: BarTabsBarProps = {
  role: "tablist",
  "aria-hidden": "false",
  className: "sdn-bar-tabs-bar sdn-bar",
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple2: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple3: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
