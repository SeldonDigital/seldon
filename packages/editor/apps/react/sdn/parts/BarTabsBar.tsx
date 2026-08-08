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
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface BarTabsBarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonSimple?: ButtonSimpleProps | null
  textLabel?: TextLabelProps | null

  buttonSimple2?: ButtonSimpleProps | null
  textLabel2?: TextLabelProps | null

  buttonSimple3?: ButtonSimpleProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: BarTabsBarProps = {
  role: "tablist",
  "aria-hidden": "false",
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel: {
    children: "Tab 1",
    className: "sdn-text-label sdn-text-label--ylte",
  },

  buttonSimple2: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel2: {
    children: "Tab 2",
    className: "sdn-text-label sdn-text-label--ylte",
  },

  buttonSimple3: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel3: {
    children: "Tab 3",
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

/**
 * Bar: BarTabsBar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Custom
 *
 * Structure:
 *   ButtonSimple  buttonSimple
 *     TextLabel   textLabel
 *   ButtonSimple  buttonSimple2
 *     TextLabel   textLabel2
 *   ButtonSimple  buttonSimple3
 *     TextLabel   textLabel3
 *
 * @example
 * ```tsx
 * <BarTabsBar
 *   role="tablist"
 *   aria-hidden="false"
 * />
 * ```
 */
export function BarTabsBar({
  className = "",
  buttonSimple,
  textLabel,

  buttonSimple2,
  textLabel2,

  buttonSimple3,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: BarTabsBarProps) {
  const barTabsBarClassName = combineClassNames("sdn-bar-tabs-bar", className)

  const buttonSimpleProps = mergeSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const buttonSimple2Props = mergeSlot(sdn.buttonSimple2, buttonSimple2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const buttonSimple3Props = mergeSlot(sdn.buttonSimple3, buttonSimple3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

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
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </ButtonSimple>
          )}
          {buttonSimple2Props !== null && (
            <ButtonSimple {...buttonSimple2Props}>
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </ButtonSimple>
          )}
          {buttonSimple3Props !== null && (
            <ButtonSimple {...buttonSimple3Props}>
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            </ButtonSimple>
          )}
        </>
      )}
    </Frame>
  )
}
