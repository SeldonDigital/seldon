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
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TopbarMenuProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null

  frame2?: FrameProps | null
  image?: ImageProps | null
  image2?: ImageProps | null

  frame3?: FrameProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: TopbarMenuProps = {
  role: "banner",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ypwq",
  },
  button: {
    className: "sdn-button sdn-button--l9rb",
  },
  icon: {
    icon: "material-menu",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    children: "Menu",
    className: "sdn-text-label sdn-text-label--jc8n",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--fr7r",
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
  button2: {
    className: "sdn-button sdn-button--l9rb",
  },
  icon2: {
    icon: "material-phone",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--tdud",
  },
  textLabel2: {
    children: "Let&#039;s Talk",
    className: "sdn-text-label sdn-text-label--my9r",
  },
}

/**
 * Topbar: TopbarMenu
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * Structure:
 *   Frame          frame
 *     Button       button
 *       Icon       icon
 *       TextLabel  textLabel
 *   Frame          frame2
 *     Image        image
 *     Image        image2
 *   Frame          frame3
 *     Button       button2
 *       Icon       icon2
 *       TextLabel  textLabel2
 *
 * @example
 * ```tsx
 * <TopbarMenu
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 */
export function TopbarMenu({
  className = "",
  frame,
  button,
  icon,
  textLabel,

  frame2,
  image,
  image2,

  frame3,
  button2,
  icon2,
  textLabel2,

  children,
  seldonRefs,
  ...props
}: TopbarMenuProps) {
  const topbarMenuClassName = combineClassNames("sdn-topbar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const imageProps = mergeOptionalSlot(sdn.image, image, seldonRefs)
  const image2Props = mergeOptionalSlot(sdn.image2, image2, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <Frame
      className={topbarMenuClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonProps !== null && (
              <Button {...buttonProps}>
                {iconProps !== null && <Icon {...iconProps} />}
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              </Button>
            )}
          </Frame>
          <Frame {...frame2Props}>
            {imageProps !== null && <Image {...imageProps} />}
            {image2Props !== null && <Image {...image2Props} />}
          </Frame>
          <Frame {...frame3Props}>
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
