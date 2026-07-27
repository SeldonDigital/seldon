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

import { Chip, ChipProps } from "../elements/Chip"
import { Frame } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { Text, TextProps } from "../primitives/Text"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface AvatarBadgedProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  image?: ImageProps | null

  chip?: ChipProps | null
  text?: TextProps | null
}

//
// Default property values
//
const sdn: AvatarBadgedProps = {
  "aria-hidden": "false",
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--zjyq",
  },

  chip: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--3r55",
  },
  text: {
    className: "sdn-text sdn-text--0zmi",
  },
}

/**
 * Avatar: AvatarBadged
 * Level: Element
 * Intent: Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.
 * Tags: avatar, user image, profile, identity, initials, picture, circle, UI element
 * Type: Custom
 *
 * Structure:
 *   Image   image
 *   Chip    chip
 *     Text  text
 *
 * @example
 * ```tsx
 * <AvatarBadged
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   chip="{}"
 *   text="{}"
 * />
 * ```
 */
export function AvatarBadged({
  className = "",
  image,

  chip,
  text,

  children,
  seldonRefs,
  ...props
}: AvatarBadgedProps) {
  const avatarBadgedClassName = combineClassNames("sdn-avatar-badged", className)

  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  const chipProps = mergeSlot(sdn.chip, chip, seldonRefs)
  const textProps = mergeOptionalSlot(sdn.text, text, seldonRefs)

  return (
    <Frame className={avatarBadgedClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          {chipProps !== null && (
            <Chip {...chipProps}>{textProps !== null && <Text {...textProps} />}</Chip>
          )}
        </>
      )}
    </Frame>
  )
}
