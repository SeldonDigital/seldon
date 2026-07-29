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

export interface TopbarInlineLinksProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  linkPlain?: LinkPlainProps | null
  linkPlain2?: LinkPlainProps | null

  frame2?: FrameProps | null
  linkPlain3?: LinkPlainProps | null
  button?: ButtonProps | null
  textLabel?: TextLabelProps | null
  image?: ImageProps | null
}

//
// Default property values
//
const sdn: TopbarInlineLinksProps = {
  role: "banner",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rclo",
  },
  linkPlain: {
    children: "Services",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain2: {
    children: "Our Work",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--az2m",
  },
  linkPlain3: {
    children: "Contact",
    className: "sdn-link-plain sdn-link-plain--yc40",
  },
  button: {
    className: "sdn-button sdn-button--aket",
  },
  textLabel: {
    children: "Let&#039;s Connect",
    className: "sdn-text-label sdn-text-label--fcuq",
  },
  image: {
    className: "sdn-image sdn-image--guh3",
  },
}

/**
 * Topbar: TopbarInlineLinks
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame          frame
 *     LinkPlain    linkPlain
 *     LinkPlain    linkPlain2
 *   Frame          frame2
 *     LinkPlain    linkPlain3
 *     Button       button
 *       TextLabel  textLabel
 *     Image        image
 *
 * @example
 * ```tsx
 * <TopbarInlineLinks
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export function TopbarInlineLinks({
  className = "",
  frame,
  linkPlain,
  linkPlain2,

  frame2,
  linkPlain3,
  button,
  textLabel,
  image,

  children,
  seldonRefs,
  ...props
}: TopbarInlineLinksProps) {
  const topbarInlineLinksClassName = combineClassNames("sdn-topbar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const linkPlainProps = mergeOptionalSlot(sdn.linkPlain, linkPlain, seldonRefs)
  const linkPlain2Props = mergeOptionalSlot(sdn.linkPlain2, linkPlain2, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const linkPlain3Props = mergeOptionalSlot(sdn.linkPlain3, linkPlain3, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const imageProps = mergeOptionalSlot(sdn.image, image, seldonRefs)

  return (
    <Frame
      className={topbarInlineLinksClassName}
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
          </Frame>
          <Frame {...frame2Props}>
            {linkPlain3Props !== null && <LinkPlain {...linkPlain3Props} />}
            {buttonProps !== null && (
              <Button {...buttonProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              </Button>
            )}
            {imageProps !== null && <Image {...imageProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
