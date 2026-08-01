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
import { Text, TextProps } from "../primitives/Text"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TopbarCompactProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  image?: ImageProps | null
  image2?: ImageProps | null

  frame2?: FrameProps | null
  linkPlain?: LinkPlainProps | null
  linkPlain2?: LinkPlainProps | null
  linkPlain3?: LinkPlainProps | null
  linkPlain4?: LinkPlainProps | null

  frame3?: FrameProps | null
  linkPlain5?: LinkPlainProps | null
  text?: TextProps | null
  linkPlain6?: LinkPlainProps | null

  button?: ButtonProps | null
  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: TopbarCompactProps = {
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
    className: "sdn-frame sdn-frame--cbw3",
  },
  linkPlain: {
    children: "Expertise",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain2: {
    children: "Services",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain3: {
    children: "Study Case",
    className: "sdn-link-plain sdn-link-plain--yexk",
  },
  linkPlain4: {
    children: "Contact Us",
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },

  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--adqt",
  },
  linkPlain5: {
    children: "EN",
    className: "sdn-link-plain sdn-link-plain--67at",
  },
  text: {
    children: " | ",
    className: "sdn-text sdn-text-label--jndm",
  },
  linkPlain6: {
    children: "JP",
    className: "sdn-link-plain sdn-link-plain--yc40",
  },

  button: {
    className: "sdn-button sdn-button--aket",
  },
  textLabel: {
    children: "Start Project",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Topbar: TopbarCompact
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
 *     LinkPlain  linkPlain4
 *   Frame        frame3
 *     LinkPlain  linkPlain5
 *     Text       text
 *     LinkPlain  linkPlain6
 *   Button       button
 *     TextLabel  textLabel
 *
 * @example
 * ```tsx
 * <TopbarCompact
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export function TopbarCompact({
  className = "",
  frame,
  image,
  image2,

  frame2,
  linkPlain,
  linkPlain2,
  linkPlain3,
  linkPlain4,

  frame3,
  linkPlain5,
  text,
  linkPlain6,

  button,
  textLabel,

  children,
  seldonRefs,
  ...props
}: TopbarCompactProps) {
  const topbarCompactClassName = combineClassNames("sdn-topbar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const imageProps = mergeOptionalSlot(sdn.image, image, seldonRefs)
  const image2Props = mergeOptionalSlot(sdn.image2, image2, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const linkPlainProps = mergeOptionalSlot(sdn.linkPlain, linkPlain, seldonRefs)
  const linkPlain2Props = mergeOptionalSlot(sdn.linkPlain2, linkPlain2, seldonRefs)
  const linkPlain3Props = mergeOptionalSlot(sdn.linkPlain3, linkPlain3, seldonRefs)
  const linkPlain4Props = mergeOptionalSlot(sdn.linkPlain4, linkPlain4, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const linkPlain5Props = mergeOptionalSlot(sdn.linkPlain5, linkPlain5, seldonRefs)
  const textProps = mergeOptionalSlot(sdn.text, text, seldonRefs)
  const linkPlain6Props = mergeOptionalSlot(sdn.linkPlain6, linkPlain6, seldonRefs)

  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <Frame
      className={topbarCompactClassName}
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
            {linkPlain4Props !== null && <LinkPlain {...linkPlain4Props} />}
          </Frame>
          <Frame {...frame3Props}>
            {linkPlain5Props !== null && <LinkPlain {...linkPlain5Props} />}
            {textProps !== null && <Text {...textProps} />}
            {linkPlain6Props !== null && <LinkPlain {...linkPlain6Props} />}
          </Frame>
          {buttonProps !== null && (
            <Button {...buttonProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </Button>
          )}
        </>
      )}
    </Frame>
  )
}
