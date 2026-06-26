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

export interface AvatarRoundBorderProps extends HTMLAttributes<HTMLElement> {
  className?: string
  image?: ImageProps | null
}

/*****
 * Avatar: AvatarRoundBorder
 * Level: Element
 * Intent: Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.
 * Tags: avatar, user image, profile, identity, initials, picture, circle, UI element
 * Type: Custom
 *
 * @example
 * ```tsx
 * <AvatarRoundBorder
 *   aria-hidden="false"
 *   image="/image.jpg"
 * />
 * ```
 *****/
export function AvatarRoundBorder({
  className = "",
  image = sdn.image,
  children,
  ...props
}: AvatarRoundBorderProps) {
  const avatarRoundBorderClassName = combineClassNames("sdn-avatar", className)
  const imageProps =
    image === null
      ? null
      : {
          ...sdn.image,
          ...image,
          className: combineClassNames(sdn.image?.className, image?.className),
        }

  return (
    <Frame
      className={avatarRoundBorderClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>{imageProps !== null && <Image {...imageProps} />}</>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: AvatarRoundBorderProps = {
  "aria-hidden": "false",
  className: "sdn-avatar sdn-avatar",
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--zjyq",
  },
}
