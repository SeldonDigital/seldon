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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface TopbarInlineLinksProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  linkPlain?: LinkPlainProps | null
  linkPlain2?: LinkPlainProps | null
  frame2?: FrameProps | null
  linkPlain3?: LinkPlainProps | null
  button?: ButtonProps | null
  textLabel?: TextLabelProps | null
  image?: ImageProps | null
}

/*****
 * Topbar: TopbarInlineLinks
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <TopbarInlineLinks
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function TopbarInlineLinks({
  className = "",
  frame = sdn.frame,
  linkPlain,
  linkPlain2,
  frame2 = sdn.frame2,
  linkPlain3,
  button,
  textLabel,
  image,
  children,
  seldonRefs,
  ...props
}: TopbarInlineLinksProps) {
  const topbarInlineLinksClassName = combineClassNames("sdn-topbar", className)
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
            {linkPlain && linkPlainProps && <LinkPlain {...linkPlainProps} />}
            {linkPlain2 && linkPlain2Props && (
              <LinkPlain {...linkPlain2Props} />
            )}
          </Frame>
          <Frame {...frame2Props}>
            {linkPlain3 && linkPlain3Props && (
              <LinkPlain {...linkPlain3Props} />
            )}
            {button && buttonProps && (
              <Button {...buttonProps}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
              </Button>
            )}
            {image && imageProps && <Image {...imageProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: TopbarInlineLinksProps = {
  role: "banner",
  "aria-hidden": "false",
  className: "sdn-topbar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rclo",
  },
  linkPlain: {
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  linkPlain2: {
    className: "sdn-link-plain sdn-link-plain--hnhh",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--az2m",
  },
  linkPlain3: {
    className: "sdn-link-plain sdn-link-plain--yc40",
  },
  button: {
    className: "sdn-button sdn-button--aket",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--fcuq",
  },
  image: {
    className: "sdn-image sdn-image--guh3",
  },
}
