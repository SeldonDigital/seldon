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
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TokenCardSpacingProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  frame2?: FrameProps | null
  frame3?: FrameProps | null
  frame4?: FrameProps | null
  frame5?: FrameProps | null
  frame6?: FrameProps | null
  frame7?: FrameProps | null
  frame8?: FrameProps | null
  frame9?: FrameProps | null
  frame10?: FrameProps | null
  frame11?: FrameProps | null
  frame12?: FrameProps | null
  frame13?: FrameProps | null
  frame14?: FrameProps | null
  icon?: IconProps | null
  icon2?: IconProps | null
  icon3?: IconProps | null
}

//
// Default property values
//
const sdn: TokenCardSpacingProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--1bby",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--l9hu",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ozrx",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--kjlc",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--puja",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--hog9",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ud2b",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tznm",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nbi9",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--5puw",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--5wjq",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--zlbo",
  },
  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--4cb4",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--j4z9",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qnkh",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qnkh",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qnkh",
  },
}

/**
 * Part: TokenCardSpacing
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Frame         frame
 *     Frame       frame2
 *       Frame     frame3
 *       Frame     frame4
 *       Frame     frame5
 *       Frame     frame6
 *       Frame     frame7
 *       Frame     frame8
 *         Frame   frame9
 *         Frame   frame10
 *         Frame   frame11
 *         Frame   frame12
 *         Frame   frame13
 *         Frame   frame14
 *           Icon  icon
 *           Icon  icon2
 *           Icon  icon3
 *
 * @example
 * ```tsx
 * <TokenCardSpacing
 *   aria-hidden="false"
 *   frame="{}"
 *   frame2="{}"
 *   frame3="{}"
 *   frame4="{}"
 *   frame5="{}"
 *   frame6="{}"
 *   icon="material-star"
 *   icon2="material-star"
 *   icon3="material-star"
 * />
 * ```
 */
export function TokenCardSpacing({
  className = "",
  frame,
  frame2,
  frame3,
  frame4,
  frame5,
  frame6,
  frame7,
  frame8,
  frame9,
  frame10,
  frame11,
  frame12,
  frame13,
  frame14,
  icon,
  icon2,
  icon3,

  children,
  seldonRefs,
  ...props
}: TokenCardSpacingProps) {
  const tokenCardSpacingClassName = combineClassNames("sdn-token-card-spacing", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const frame12Props = mergeSlot(sdn.frame12, frame12, seldonRefs)
  const frame13Props = mergeSlot(sdn.frame13, frame13, seldonRefs)
  const frame14Props = mergeSlot(sdn.frame14, frame14, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)

  return (
    <HTMLDiv className={tokenCardSpacingClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              <Frame {...frame3Props}></Frame>
              <Frame {...frame4Props}></Frame>
              <Frame {...frame5Props}></Frame>
              <Frame {...frame6Props}></Frame>
              <Frame {...frame7Props}></Frame>
              <Frame {...frame8Props}>
                <Frame {...frame9Props}></Frame>
                <Frame {...frame10Props}></Frame>
                <Frame {...frame11Props}></Frame>
                <Frame {...frame12Props}></Frame>
                <Frame {...frame13Props}></Frame>
                <Frame {...frame14Props}>
                  {iconProps !== null && <Icon {...iconProps} />}
                  {icon2Props !== null && <Icon {...icon2Props} />}
                  {icon3Props !== null && <Icon {...icon3Props} />}
                </Frame>
              </Frame>
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
