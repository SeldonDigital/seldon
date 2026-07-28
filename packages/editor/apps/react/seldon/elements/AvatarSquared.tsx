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

import { Frame } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface AvatarSquaredProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  image?: ImageProps | null
}

//
// Default property values
//
const sdn: AvatarSquaredProps = {
  "aria-hidden": "false",
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--9jgp",
  },
}

/**
 * Avatar: AvatarSquared
 * Level: Element
 * Intent: Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.
 * Tags: avatar, user image, profile, identity, initials, picture, circle, UI element
 * Type: Custom
 *
 * Structure:
 *   Image  image
 *
 * @example
 * ```tsx
 * <AvatarSquared
 *   aria-hidden="false"
 *   image="/image.jpg"
 * />
 * ```
 */
export function AvatarSquared({
  className = "",
  image,

  children,
  seldonRefs,
  ...props
}: AvatarSquaredProps) {
  const avatarSquaredClassName = combineClassNames("sdn-avatar", className)

  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  return (
    <Frame className={avatarSquaredClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? children : <>{imageProps !== null && <Image {...imageProps} />}</>}
    </Frame>
  )
}
