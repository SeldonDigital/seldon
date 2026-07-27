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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ItemAvatarItemProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Item: ItemAvatarItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
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
 *****/
export function ItemAvatarItem({
  className = "",
  inputCheckbox,
  avatarRounded = sdn.avatarRounded,
  image = sdn.image,
  frame = sdn.frame,
  textTitle,
  textSubtitle,
  button = sdn.button,
  icon = sdn.icon,
  textLabel,
  children,
  seldonRefs,
  ...props
}: ItemAvatarItemProps) {
  const itemAvatarItemClassName = combineClassNames("sdn-item", className)
  const inputCheckboxProps = applyRef(
    seldonRefs,
    inputCheckbox === null
      ? null
      : {
          ...sdn.inputCheckbox,
          ...inputCheckbox,
          className: combineClassNames(
            sdn.inputCheckbox?.className,
            inputCheckbox?.className,
          ),
        },
  )
  const avatarRoundedProps = applyRef(
    seldonRefs,
    avatarRounded === null
      ? null
      : {
          ...sdn.avatarRounded,
          ...avatarRounded,
          className: combineClassNames(
            sdn.avatarRounded?.className,
            avatarRounded?.className,
          ),
        },
  )
  const imageProps = applyRef(
    seldonRefs,
    image === null
      ? null
      : {
          ...sdn.image,
          ...image,
          className: combineClassNames(sdn.image?.className, image?.className),
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
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        },
  )
  const textSubtitleProps = applyRef(
    seldonRefs,
    textSubtitle === null
      ? null
      : {
          ...sdn.textSubtitle,
          ...textSubtitle,
          className: combineClassNames(
            sdn.textSubtitle?.className,
            textSubtitle?.className,
          ),
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

  return (
    <HTMLLi
      className={itemAvatarItemClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {inputCheckbox && inputCheckboxProps && (
            <InputCheckbox {...inputCheckboxProps} />
          )}
          {avatarRoundedProps !== null && (
            <AvatarRounded {...avatarRoundedProps} image={imageProps} />
          )}
          <Frame {...frameProps}>
            {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            {textSubtitle && textSubtitleProps && (
              <TextSubtitle {...textSubtitleProps} />
            )}
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
const sdn: ItemAvatarItemProps = {
  "aria-hidden": "false",
  className: "sdn-item",
  inputCheckbox: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  avatarRounded: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar--a890",
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
