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

import { Button, ButtonProps } from "../elements/Button"
import { Frame, FrameProps } from "../frames/Frame"
import { Image, ImageProps } from "../primitives/Image"
import { LinkPlain, LinkPlainProps } from "../primitives/LinkPlain"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TopbarCenteredProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  linkPlain?: LinkPlainProps | null
  linkPlain2?: LinkPlainProps | null
  linkPlain3?: LinkPlainProps | null

  frame2?: FrameProps | null
  image?: ImageProps | null
  image2?: ImageProps | null

  frame3?: FrameProps | null
  button?: ButtonProps | null
  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: TopbarCenteredProps = {
  role: "banner",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rclo",
  },
  linkPlain: {
    children: "What We Do",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain2: {
    children: "Our Work",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain3: {
    children: "Contact Us",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--adqt",
  },
  image: {
    className: "sdn-image sdn-image--guh3",
  },
  image2: {
    className: "sdn-image sdn-image--guh3",
  },

  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--0lrb",
  },
  button: {
    className: "sdn-button sdn-button--l9rb",
  },
  textLabel: {
    children: "Let&#039;s Talk",
    className: "sdn-text-label sdn-text-label--my9r",
  },
}

/**
 * Topbar: TopbarCentered
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame          frame
 *     LinkPlain    linkPlain
 *     LinkPlain    linkPlain2
 *     LinkPlain    linkPlain3
 *   Frame          frame2
 *     Image        image
 *     Image        image2
 *   Frame          frame3
 *     Button       button
 *       TextLabel  textLabel
 *
 * @example
 * ```tsx
 * <TopbarCentered
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export function TopbarCentered({
  className = "",
  frame,
  linkPlain,
  linkPlain2,
  linkPlain3,

  frame2,
  image,
  image2,

  frame3,
  button,
  textLabel,

  children,
  seldonRefs,
  ...props
}: TopbarCenteredProps) {
  const topbarCenteredClassName = combineClassNames("sdn-topbar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const linkPlainProps = mergeOptionalSlot(sdn.linkPlain, linkPlain, seldonRefs)
  const linkPlain2Props = mergeOptionalSlot(sdn.linkPlain2, linkPlain2, seldonRefs)
  const linkPlain3Props = mergeOptionalSlot(sdn.linkPlain3, linkPlain3, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const imageProps = mergeOptionalSlot(sdn.image, image, seldonRefs)
  const image2Props = mergeOptionalSlot(sdn.image2, image2, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <Frame
      className={topbarCenteredClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {linkPlainProps !== null && <LinkPlain {...linkPlainProps} />}
            {linkPlain2Props !== null && <LinkPlain {...linkPlain2Props} />}
            {linkPlain3Props !== null && <LinkPlain {...linkPlain3Props} />}
          </Frame>
          <Frame {...frame2Props}>
            {imageProps !== null && <Image {...imageProps} />}
            {image2Props !== null && <Image {...image2Props} />}
          </Frame>
          <Frame {...frame3Props}>
            {buttonProps !== null && (
              <Button {...buttonProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              </Button>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
