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
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SectionSectionBrandProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  image?: ImageProps | null

  textTitle?: TextTitleProps | null

  textDescription?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: SectionSectionBrandProps = {
  "aria-hidden": "false",
  image: {
    src: "https://static.seldon.app/logo.svg",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--wxaq",
  },

  textTitle: {
    className: "sdn-text-title sdn-text-title--unrf",
  },

  textDescription: {
    className: "sdn-text-description sdn-text-title--unrf",
  },
}

/**
 * Section: SectionBrand
 * Level: Element
 * Intent: Navigation section containing links to important pages. Can be used in footers, headers, sidebars, or any other layout context. Follows Material Design navigation patterns.
 * Tags: section, navigation, links, menu, element, layout, header, footer, sidebar
 * Type: Custom
 *
 * Structure:
 *   Image            image
 *   TextTitle        textTitle
 *   TextDescription  textDescription
 *
 * @example
 * ```tsx
 * <SectionSectionBrand
 *   aria-hidden="false"
 *   image="/image.jpg"
 *   textTitle="Product Title"
 *   textDescription2="{}"
 * />
 * ```
 */
export function SectionSectionBrand({
  className = "",
  image,

  textTitle,

  textDescription,

  children,
  seldonRefs,
  ...props
}: SectionSectionBrandProps) {
  const sectionSectionBrandClassName = combineClassNames("sdn-section", className)

  const imageProps = mergeSlot(sdn.image, image, seldonRefs)

  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  return (
    <Frame className={sectionSectionBrandClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {imageProps !== null && <Image {...imageProps} />}
          {textTitleProps !== null && <TextTitle {...textTitleProps} />}
          {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
        </>
      )}
    </Frame>
  )
}
