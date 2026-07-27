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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface TopbarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Topbar: Topbar
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <Topbar
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Topbar({
  className = "",
  frame = sdn.frame,
  image,
  image2,
  frame2 = sdn.frame2,
  button,
  textLabel,
  icon = sdn.icon,
  linkPlain,
  linkPlain2,
  linkPlain3,
  button2,
  icon2 = sdn.icon2,
  textLabel2,
  children,
  seldonRefs,
  ...props
}: TopbarProps) {
  const topbarClassName = combineClassNames("sdn-topbar", className)
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
  const linkPlainProps = applyRef(
    seldonRefs,
    linkPlain === null
      ? null
      : {
          ...sdn.linkPlain,
          ...linkPlain,
          className: combineClassNames(
            sdn.linkPlain?.className,
            linkPlain?.className,
          ),
        },
  )
  const linkPlain2Props = applyRef(
    seldonRefs,
    linkPlain2 === null
      ? null
      : {
          ...sdn.linkPlain2,
          ...linkPlain2,
          className: combineClassNames(
            sdn.linkPlain2?.className,
            linkPlain2?.className,
          ),
        },
  )
  const linkPlain3Props = applyRef(
    seldonRefs,
    linkPlain3 === null
      ? null
      : {
          ...sdn.linkPlain3,
          ...linkPlain3,
          className: combineClassNames(
            sdn.linkPlain3?.className,
            linkPlain3?.className,
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
            {image && imageProps && <Image {...imageProps} />}
            {image2 && image2Props && <Image {...image2Props} />}
          </Frame>
          <Frame {...frame2Props}>
            {button && buttonProps && (
              <Button {...buttonProps}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
                {icon && iconProps && <Icon {...iconProps} />}
              </Button>
            )}
            {linkPlain && linkPlainProps && <LinkPlain {...linkPlainProps} />}
            {linkPlain2 && linkPlain2Props && (
              <LinkPlain {...linkPlain2Props} />
            )}
            {linkPlain3 && linkPlain3Props && (
              <LinkPlain {...linkPlain3Props} />
            )}
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
const sdn: TopbarProps = {
  role: "banner",
  "aria-hidden": "false",
  className: "sdn-topbar",
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
