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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface TopbarSpreadProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Topbar: TopbarSpread
 * Level: Part
 * Intent: Site header that pairs a brand logo and wordmark with primary navigation and a call-to-action.
 * Tags: topbar, navbar, header, navigation, brand, menu, part, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <TopbarSpread
 *   role="banner"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function TopbarSpread({
  className = "",
  frame = sdn.frame,
  image,
  image2,
  frame2 = sdn.frame2,
  linkPlain,
  linkPlain2,
  linkPlain3,
  frame3 = sdn.frame3,
  linkPlain4,
  text,
  linkPlain5,
  children,
  seldonRefs,
  ...props
}: TopbarSpreadProps) {
  const topbarSpreadClassName = combineClassNames(
    "sdn-topbar-spread",
    className,
  )
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
  const linkPlain4Props = applyRef(
    seldonRefs,
    linkPlain4 === null
      ? null
      : {
          ...sdn.linkPlain4,
          ...linkPlain4,
          className: combineClassNames(
            sdn.linkPlain4?.className,
            linkPlain4?.className,
          ),
        },
  )
  const textProps = applyRef(
    seldonRefs,
    text === null
      ? null
      : {
          ...sdn.text,
          ...text,
          className: combineClassNames(sdn.text?.className, text?.className),
        },
  )
  const linkPlain5Props = applyRef(
    seldonRefs,
    linkPlain5 === null
      ? null
      : {
          ...sdn.linkPlain5,
          ...linkPlain5,
          className: combineClassNames(
            sdn.linkPlain5?.className,
            linkPlain5?.className,
          ),
        },
  )

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
            {image && imageProps && <Image {...imageProps} />}
            {image2 && image2Props && <Image {...image2Props} />}
          </Frame>
          <Frame {...frame2Props}>
            {linkPlain && linkPlainProps && <LinkPlain {...linkPlainProps} />}
            {linkPlain2 && linkPlain2Props && (
              <LinkPlain {...linkPlain2Props} />
            )}
            {linkPlain3 && linkPlain3Props && (
              <LinkPlain {...linkPlain3Props} />
            )}
          </Frame>
          <Frame {...frame3Props}>
            {linkPlain4 && linkPlain4Props && (
              <LinkPlain {...linkPlain4Props} />
            )}
            {text && textProps && <Text {...textProps} />}
            {linkPlain5 && linkPlain5Props && (
              <LinkPlain {...linkPlain5Props} />
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
const sdn: TopbarSpreadProps = {
  role: "banner",
  "aria-hidden": "false",
  className: "sdn-topbar-spread sdn-topbar",
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
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  linkPlain2: {
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  linkPlain3: {
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--eicl",
  },
  linkPlain4: {
    className: "sdn-link-plain sdn-link-plain--1tic",
  },
  text: {
    className: "sdn-text sdn-text--svkr",
  },
  linkPlain5: {
    className: "sdn-link-plain sdn-link-plain--q3fs",
  },
}
