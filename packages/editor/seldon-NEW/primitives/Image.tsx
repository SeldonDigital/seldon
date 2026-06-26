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
 
import { ImgHTMLAttributes } from "react"
import { HTMLImg } from "../native-react/HTML.Img"
import { combineClassNames } from "../utils/class-name"

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  src?: string
}

/*****
 * Image: Image
 * Level: Primitive
 * Intent: Renders an image asset within the UI, supporting alt text and sizing.
 * Tags: image, media, photo, UI, primitive, asset, visual
 * Type: Default
 *
 * @example
 * ```tsx
 * <Image
 *   src="https://static.seldon.app/background-default-dark.jpg"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Image({ className = "", src = sdn.src, ...props }: ImageProps) {
  const imageClassName = combineClassNames("sdn-image", className)

  //
  // React JSX component with merged default and custom properties
  //
  return (
    <HTMLImg
      className={imageClassName}
      src={src}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    />
  )
}

//
// Default property values
//
const sdn: ImageProps = {
  src: "https://static.seldon.app/background-default-dark.jpg",
  "aria-hidden": "false",
  className: "sdn-image",
}
