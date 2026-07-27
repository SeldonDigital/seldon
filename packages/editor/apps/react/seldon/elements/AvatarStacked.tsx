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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface AvatarStackedProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  image?: ImageProps | null
  image2?: ImageProps | null
  image3?: ImageProps | null
}

/*****
 * Avatar: AvatarStacked
 * Level: Element
 * Intent: Displays a user or entity's image or initials in UI elements like lists, headers, or profiles.
 * Tags: avatar, user image, profile, identity, initials, picture, circle, UI element
 * Type: Custom
 *
 * @example
 * ```tsx
 * <AvatarStacked
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   image2="/image.jpg"
 *   image3="/image.jpg"
 * />
 * ```
 *****/
export function AvatarStacked({
  className = "",
  image = sdn.image,
  image2 = sdn.image2,
  image3 = sdn.image3,
  children,
  seldonRefs,
  ...props
}: AvatarStackedProps) {
  const avatarStackedClassName = combineClassNames(
    "sdn-avatar-badged",
    className,
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
  const image2Props = applyRef(
    seldonRefs,
    image2 === null
      ? null
      : {
          ...sdn.image2,
          ...image2,
          className: combineClassNames(
            sdn.image2?.className,
            image2?.className,
          ),
        },
  )
  const image3Props = applyRef(
    seldonRefs,
    image3 === null
      ? null
      : {
          ...sdn.image3,
          ...image3,
          className: combineClassNames(
            sdn.image3?.className,
            image3?.className,
          ),
        },
  )

  return (
    <Frame
      className={avatarStackedClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          {image2Props !== null && <Image {...image2Props} />}
          {image3Props !== null && <Image {...image3Props} />}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: AvatarStackedProps = {
  "aria-hidden": "false",
  className: "sdn-avatar-badged sdn-avatar",
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--zjyq",
  },
  image2: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--yscg",
  },
  image3: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--hzdf",
  },
}
