/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { ImgHTMLAttributes } from "react"
import { HTMLImg } from "../native-react/HTML.Img"

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  className?: string
  src?: string
}

export function Image({ className = "", ...props }: ImageProps) {
  return <HTMLImg className={"variant-image-default " + className} {...props} />
}
