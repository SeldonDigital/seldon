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

import { AvatarRounded, AvatarRoundedProps } from "../elements/AvatarRounded"
import { Button, ButtonProps } from "../elements/Button"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { ImageProps } from "../primitives/Image"
import { InputCheckbox, InputCheckboxProps } from "../primitives/InputCheckbox"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemAvatarItemProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  inputCheckbox?: InputCheckboxProps | null

  avatarRounded?: AvatarRoundedProps | null
  image?: ImageProps | null

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
const sdn: ItemAvatarItemProps = {
  "aria-hidden": "false",
  inputCheckbox: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },

  avatarRounded: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar-rounded--fb5j",
  },
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--zjyq",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Full Name",
    className: "sdn-text-title sdn-text-title--ulqm",
  },
  textSubtitle: {
    children: "Position",
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
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

/**
 * Item: ItemAvatarItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
 *
 * Structure:
 *   InputCheckbox   inputCheckbox
 *   AvatarRounded   avatarRounded
 *     Image         image
 *   Frame           frame
 *     TextTitle     textTitle
 *     TextSubtitle  textSubtitle
 *   Button          button
 *     Icon          icon
 *     TextLabel     textLabel
 *
 * @example
 * ```tsx
 * <ItemAvatarItem
 *   aria-hidden="false"
 *   inputCheckbox="{}"
 *   avatarRounded="/image.jpg"
 *   image="/image.jpg"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 */
export function ItemAvatarItem({
  className = "",
  inputCheckbox,

  avatarRounded,
  image,

  frame,
  textTitle,
  textSubtitle,

  button,
  icon,
  textLabel,

  children,
  seldonRefs,
  ...props
}: ItemAvatarItemProps) {
  const itemAvatarItemClassName = combineClassNames("sdn-item", className)

  const inputCheckboxProps = mergeOptionalSlot(sdn.inputCheckbox, inputCheckbox, seldonRefs)

  const avatarRoundedProps = mergeSlot(sdn.avatarRounded, avatarRounded, seldonRefs)
  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <HTMLLi className={itemAvatarItemClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {inputCheckboxProps !== null && <InputCheckbox {...inputCheckboxProps} />}
          {avatarRoundedProps !== null && (
            <AvatarRounded {...avatarRoundedProps} image={imageProps} />
          )}
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
