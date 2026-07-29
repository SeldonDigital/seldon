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

export interface BarMenusProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonSimple?: ButtonSimpleProps | null
  textLabel?: TextLabelProps | null

  buttonSimple2?: ButtonSimpleProps | null
  textLabel2?: TextLabelProps | null

  buttonSimple3?: ButtonSimpleProps | null
  textLabel3?: TextLabelProps | null

  buttonSimple4?: ButtonSimpleProps | null
  textLabel4?: TextLabelProps | null
}

//
// Default property values
//
const sdn: BarMenusProps = {
  role: "menubar",
  "aria-hidden": "false",
  buttonSimple: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },

  buttonSimple2: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },

  buttonSimple3: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },

  buttonSimple4: {
    "aria-haspopup": "menu",
    className: "sdn-button-simple sdn-button-simple--fjtm",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

/**
 * Bar: BarMenus
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
 *   ButtonSimple  buttonSimple4
 *     TextLabel   textLabel4
 *
 * @example
 * ```tsx
 * <BarMenus
 *   role="menubar"
 *   aria-hidden="false"
 * />
 * ```
 */
export function BarMenus({
  className = "",
  buttonSimple,
  textLabel,

  buttonSimple2,
  textLabel2,

  buttonSimple3,
  textLabel3,

  buttonSimple4,
  textLabel4,

  children,
  seldonRefs,
  ...props
}: BarMenusProps) {
  const barMenusClassName = combineClassNames("sdn-bar-menus", className)

  const buttonSimpleProps = mergeSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const buttonSimple2Props = mergeSlot(sdn.buttonSimple2, buttonSimple2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const buttonSimple3Props = mergeSlot(sdn.buttonSimple3, buttonSimple3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  const buttonSimple4Props = mergeSlot(sdn.buttonSimple4, buttonSimple4, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)

  return (
    <Frame
      className={barMenusClassName}
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
          {buttonSimple4Props !== null && (
            <ButtonSimple {...buttonSimple4Props}>
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            </ButtonSimple>
          )}
        </>
      )}
    </Frame>
  )
}
