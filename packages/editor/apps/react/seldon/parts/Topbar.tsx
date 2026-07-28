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
import { Icon, IconProps } from "../primitives/Icon"
import { Image, ImageProps } from "../primitives/Image"
import { LinkPlain, LinkPlainProps } from "../primitives/LinkPlain"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TopbarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  image?: ImageProps | null
  image2?: ImageProps | null

  frame2?: FrameProps | null
  button?: ButtonProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null
  linkPlain?: LinkPlainProps | null
  linkPlain2?: LinkPlainProps | null
  linkPlain3?: LinkPlainProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: TopbarProps = {
  role: "banner",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ypwq",
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
    className: "sdn-frame sdn-frame--qvz9",
  },
  button: {
    className: "sdn-button sdn-button--l9rb",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  icon: {
    icon: "material-expandMore",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  linkPlain: {
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain2: {
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain3: {
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  button2: {
    className: "sdn-button sdn-button--l9rb",
  },
  icon2: {
    icon: "material-email",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--tdud",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--d65z",
  },
}

/**
 * Topbar: Topbar
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame          frame
 *     Image        image
 *     Image        image2
 *   Frame          frame2
 *     Button       button
 *       TextLabel  textLabel
 *       Icon       icon
 *     LinkPlain    linkPlain
 *     LinkPlain    linkPlain2
 *     LinkPlain    linkPlain3
 *     Button       button2
 *       Icon       icon2
 *       TextLabel  textLabel2
 *
 * @example
 * ```tsx
 * <Topbar
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export function Topbar({
  className = "",
  frame,
  image,
  image2,

  frame2,
  button,
  textLabel,
  icon,
  linkPlain,
  linkPlain2,
  linkPlain3,
  button2,
  icon2,
  textLabel2,

  children,
  seldonRefs,
  ...props
}: TopbarProps) {
  const topbarClassName = combineClassNames("sdn-topbar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const imageProps = mergeOptionalSlot(sdn.image, image, seldonRefs)
  const image2Props = mergeOptionalSlot(sdn.image2, image2, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const linkPlainProps = mergeOptionalSlot(sdn.linkPlain, linkPlain, seldonRefs)
  const linkPlain2Props = mergeOptionalSlot(sdn.linkPlain2, linkPlain2, seldonRefs)
  const linkPlain3Props = mergeOptionalSlot(sdn.linkPlain3, linkPlain3, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <Frame
      className={topbarClassName}
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
            {buttonProps !== null && (
              <Button {...buttonProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                {iconProps !== null && <Icon {...iconProps} />}
              </Button>
            )}
            {linkPlainProps !== null && <LinkPlain {...linkPlainProps} />}
            {linkPlain2Props !== null && <LinkPlain {...linkPlain2Props} />}
            {linkPlain3Props !== null && <LinkPlain {...linkPlain3Props} />}
            {button2Props !== null && (
              <Button {...button2Props}>
                {icon2Props !== null && <Icon {...icon2Props} />}
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              </Button>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
