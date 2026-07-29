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

import { Avatar, AvatarProps } from "../elements/Avatar"
import { Button, ButtonProps } from "../elements/Button"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { ImageProps } from "../primitives/Image"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface CardStackedHorizontalProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  avatar?: AvatarProps | null
  image?: ImageProps | null

  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: CardStackedHorizontalProps = {
  "aria-hidden": "false",
  avatar: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar--bbqh",
  },
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--to5v",
  },

  button: {
    className: "sdn-button sdn-button--6pop",
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
 * Card: CardStackedHorizontal
 * Level: Part
 * Intent: Defines a vertically stacked card layout with support for headers, content blocks, and action elements.
 * Tags: card, stacked, vertical, ui, block, layout, cta, content
 * Type: Custom
 *
 * Structure:
 *   Avatar       avatar
 *     Image      image
 *   Button       button
 *     Icon       icon
 *     TextLabel  textLabel
 *
 * @example
 * ```tsx
 * <CardStackedHorizontal
 *   aria-hidden="false"
 *   avatar="/image.jpg"
 *   image="/image.jpg"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 */
export function CardStackedHorizontal({
  className = "",
  avatar,
  image,

  button,
  icon,
  textLabel,

  children,
  seldonRefs,
  ...props
}: CardStackedHorizontalProps) {
  const cardStackedHorizontalClassName = combineClassNames("sdn-card-stacked-horizontal", className)

  const avatarProps = mergeSlot(sdn.avatar, avatar, seldonRefs)
  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <Frame className={cardStackedHorizontalClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {avatarProps !== null && <Avatar {...avatarProps} image={imageProps} />}
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {iconProps !== null && <Icon {...iconProps} />}
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}
