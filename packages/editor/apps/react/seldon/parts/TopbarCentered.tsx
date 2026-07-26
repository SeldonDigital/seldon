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

export interface TopbarCenteredProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Topbar: TopbarCentered
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <TopbarCentered
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function TopbarCentered({
  className = "",
  frame = sdn.frame,
  linkPlain,
  linkPlain2,
  linkPlain3,
  frame2 = sdn.frame2,
  image,
  image2,
  frame3 = sdn.frame3,
  button,
  textLabel,
  children,
  seldonRefs,
  ...props
}: TopbarCenteredProps) {
  const topbarCenteredClassName = combineClassNames("sdn-topbar", className)
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
            {linkPlain && linkPlainProps && <LinkPlain {...linkPlainProps} />}
            {linkPlain2 && linkPlain2Props && (
              <LinkPlain {...linkPlain2Props} />
            )}
            {linkPlain3 && linkPlain3Props && (
              <LinkPlain {...linkPlain3Props} />
            )}
          </Frame>
          <Frame {...frame2Props}>
            {image && imageProps && <Image {...imageProps} />}
            {image2 && image2Props && <Image {...image2Props} />}
          </Frame>
          <Frame {...frame3Props}>
            {button && buttonProps && (
              <Button {...buttonProps}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
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
const sdn: TopbarCenteredProps = {
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
  linkPlain3: {
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
    className: "sdn-text-label sdn-text-label--my9r",
  },
}
