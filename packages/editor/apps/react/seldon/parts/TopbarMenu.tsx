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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface TopbarMenuProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Topbar: TopbarMenu
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <TopbarMenu
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function TopbarMenu({
  className = "",
  frame = sdn.frame,
  button,
  icon = sdn.icon,
  textLabel,
  frame2 = sdn.frame2,
  image,
  image2,
  frame3 = sdn.frame3,
  button2,
  icon2 = sdn.icon2,
  textLabel2,
  children,
  seldonRefs,
  ...props
}: TopbarMenuProps) {
  const topbarMenuClassName = combineClassNames("sdn-topbar", className)
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        },
  )
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
        },
  )
  const iconProps = applyRef(
    seldonRefs,
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        },
  )
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
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
  const frame3Props = applyRef(
    seldonRefs,
    frame3 === null
      ? null
      : {
          ...sdn.frame3,
          ...frame3,
          className: combineClassNames(
            sdn.frame3?.className,
            frame3?.className,
          ),
        },
  )
  const button2Props = applyRef(
    seldonRefs,
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
          ),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        },
  )
  const textLabel2Props = applyRef(
    seldonRefs,
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        },
  )

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
            {button && buttonProps && (
              <Button {...buttonProps}>
                {icon && iconProps && <Icon {...iconProps} />}
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
              </Button>
            )}
          </Frame>
          <Frame {...frame2Props}>
            {image && imageProps && <Image {...imageProps} />}
            {image2 && image2Props && <Image {...image2Props} />}
          </Frame>
          <Frame {...frame3Props}>
            {button2 && button2Props && (
              <Button {...button2Props}>
                {icon2 && icon2Props && <Icon {...icon2Props} />}
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
                )}
              </Button>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: TopbarMenuProps = {
  role: "banner",
  "aria-hidden": "false",
  className: "sdn-topbar",
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
    className: "sdn-text-label sdn-text-label--my9r",
  },
}
