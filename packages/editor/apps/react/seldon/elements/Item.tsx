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
import { Button } from "../elements/Button"
import { Frame } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon } from "../primitives/Icon"
import { InputCheckbox } from "../primitives/InputCheckbox"
import { TextLabel } from "../primitives/TextLabel"
import { TextSubtitle } from "../primitives/TextSubtitle"
import { TextTitle } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

import type { ButtonProps } from "../elements/Button"
import type { FrameProps } from "../frames/Frame"
import type { IconProps } from "../primitives/Icon"
import type { InputCheckboxProps } from "../primitives/InputCheckbox"
import type { TextLabelProps } from "../primitives/TextLabel"
import type { TextSubtitleProps } from "../primitives/TextSubtitle"
import type { TextTitleProps } from "../primitives/TextTitle"
import type { LiHTMLAttributes } from "react"

export interface ItemProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  inputCheckbox?: InputCheckboxProps | null
  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * Item: Item
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
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
 *****/
export function Item({
  className = "",
  inputCheckbox,
  frame = sdn.frame,
  textTitle,
  textSubtitle,
  button = sdn.button,
  icon = sdn.icon,
  textLabel,
  children,
  seldonRefs,
  ...props
}: ItemProps) {
  const itemClassName = combineClassNames("sdn-item", className)
  const inputCheckboxProps = applyRef(
    seldonRefs,
    inputCheckbox === null
      ? null
      : {
          ...sdn.inputCheckbox,
          ...inputCheckbox,
          className: combineClassNames(sdn.inputCheckbox?.className, inputCheckbox?.className),
        },
  )
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        },
  )
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(sdn.textTitle?.className, textTitle?.className),
        },
  )
  const textSubtitleProps = applyRef(
    seldonRefs,
    textSubtitle === null
      ? null
      : {
          ...sdn.textSubtitle,
          ...textSubtitle,
          className: combineClassNames(sdn.textSubtitle?.className, textSubtitle?.className),
        },
  )
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(sdn.button?.className, button?.className),
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
          className: combineClassNames(sdn.textLabel?.className, textLabel?.className),
        },
  )

  return (
    <HTMLLi className={itemClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {inputCheckbox && inputCheckboxProps && <InputCheckbox {...inputCheckboxProps} />}
          <Frame {...frameProps}>
            {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            {textSubtitle && textSubtitleProps && <TextSubtitle {...textSubtitleProps} />}
          </Frame>
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {icon && iconProps && <Icon {...iconProps} />}
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemProps = {
  "aria-hidden": "false",
  className: "sdn-item",
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
