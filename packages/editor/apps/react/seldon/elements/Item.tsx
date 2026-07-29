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

import { LiHTMLAttributes } from "react"

import { Button, ButtonProps } from "../elements/Button"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { InputCheckbox, InputCheckboxProps } from "../primitives/InputCheckbox"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  inputCheckbox?: InputCheckboxProps | null

  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null

  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ItemProps = {
  "aria-hidden": "false",
  inputCheckbox: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--ulqm",
  },
  textSubtitle: {
    className: "sdn-text-subtitle sdn-text-subtitle--nxwj",
  },

  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

/**
 * Item: Item
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
 *
 * Structure:
 *   InputCheckbox   inputCheckbox
 *   Frame           frame
 *     TextTitle     textTitle
 *     TextSubtitle  textSubtitle
 *   Button          button
 *     Icon          icon
 *     TextLabel     textLabel
 *
 * @example
 * ```tsx
 * <Item
 *   aria-hidden="false"
 *   inputCheckbox="{}"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 */
export function Item({
  className = "",
  inputCheckbox,

  frame,
  textTitle,
  textSubtitle,

  button,
  icon,
  textLabel,

  children,
  seldonRefs,
  ...props
}: ItemProps) {
  const itemClassName = combineClassNames("sdn-item", className)

  const inputCheckboxProps = mergeOptionalSlot(sdn.inputCheckbox, inputCheckbox, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <HTMLLi className={itemClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {inputCheckboxProps !== null && <InputCheckbox {...inputCheckboxProps} />}
          <Frame {...frameProps}>
            {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
          </Frame>
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {iconProps !== null && <Icon {...iconProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </HTMLLi>
  )
}
