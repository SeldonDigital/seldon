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

import { Frame, FrameProps } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { LinkPlain, LinkPlainProps } from "../primitives/LinkPlain"
import { Text, TextProps } from "../primitives/Text"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TopbarSpreadProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  image?: ImageProps | null
  image2?: ImageProps | null

  frame2?: FrameProps | null
  linkPlain?: LinkPlainProps | null
  linkPlain2?: LinkPlainProps | null
  linkPlain3?: LinkPlainProps | null

  frame3?: FrameProps | null
  linkPlain4?: LinkPlainProps | null
  text?: TextProps | null
  linkPlain5?: LinkPlainProps | null
}

//
// Default property values
//
const sdn: TopbarSpreadProps = {
  role: "banner",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--3jq4",
  },
  image: {
    className: "sdn-image sdn-image--guh3",
  },
  image2: {
    className: "sdn-image sdn-image--guh3",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tv9y",
  },
  linkPlain: {
    children: "What We Do",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  linkPlain2: {
    children: "Project",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  linkPlain3: {
    children: "Contact",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },

  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--eicl",
  },
  linkPlain4: {
    children: "EN",
    className: "sdn-link-plain sdn-link-plain--1tic",
  },
  text: {
    children: " | ",
    className: "sdn-text sdn-text-label--jndm",
  },
  linkPlain5: {
    children: "JP",
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
}

/**
 * Topbar: TopbarSpread
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame        frame
 *     Image      image
 *     Image      image2
 *   Frame        frame2
 *     LinkPlain  linkPlain
 *     LinkPlain  linkPlain2
 *     LinkPlain  linkPlain3
 *   Frame        frame3
 *     LinkPlain  linkPlain4
 *     Text       text
 *     LinkPlain  linkPlain5
 *
 * @example
 * ```tsx
 * <TopbarSpread
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export function TopbarSpread({
  className = "",
  frame,
  image,
  image2,

  frame2,
  linkPlain,
  linkPlain2,
  linkPlain3,

  frame3,
  linkPlain4,
  text,
  linkPlain5,

  children,
  seldonRefs,
  ...props
}: TopbarSpreadProps) {
  const topbarSpreadClassName = combineClassNames("sdn-topbar-spread", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const imageProps = mergeOptionalSlot(sdn.image, image, seldonRefs)
  const image2Props = mergeOptionalSlot(sdn.image2, image2, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const linkPlainProps = mergeOptionalSlot(sdn.linkPlain, linkPlain, seldonRefs)
  const linkPlain2Props = mergeOptionalSlot(sdn.linkPlain2, linkPlain2, seldonRefs)
  const linkPlain3Props = mergeOptionalSlot(sdn.linkPlain3, linkPlain3, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const linkPlain4Props = mergeOptionalSlot(sdn.linkPlain4, linkPlain4, seldonRefs)
  const textProps = mergeOptionalSlot(sdn.text, text, seldonRefs)
  const linkPlain5Props = mergeOptionalSlot(sdn.linkPlain5, linkPlain5, seldonRefs)

  return (
    <Frame
      className={topbarSpreadClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {imageProps !== null && <Image {...imageProps} />}
            {image2Props !== null && <Image {...image2Props} />}
          </Frame>
          <Frame {...frame2Props}>
            {linkPlainProps !== null && <LinkPlain {...linkPlainProps} />}
            {linkPlain2Props !== null && <LinkPlain {...linkPlain2Props} />}
            {linkPlain3Props !== null && <LinkPlain {...linkPlain3Props} />}
          </Frame>
          <Frame {...frame3Props}>
            {linkPlain4Props !== null && <LinkPlain {...linkPlain4Props} />}
            {textProps !== null && <Text {...textProps} />}
            {linkPlain5Props !== null && <LinkPlain {...linkPlain5Props} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
