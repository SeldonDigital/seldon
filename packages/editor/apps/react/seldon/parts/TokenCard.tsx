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

import { ChipToken, ChipTokenProps } from "../elements/ChipToken"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TokenCardProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  frame2?: FrameProps | null
  chipToken?: ChipTokenProps | null
  frame3?: FrameProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  frame4?: FrameProps | null
  chipToken2?: ChipTokenProps | null
  frame5?: FrameProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  frame6?: FrameProps | null
  chipToken3?: ChipTokenProps | null
  frame7?: FrameProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
  frame8?: FrameProps | null
  chipToken4?: ChipTokenProps | null
  frame9?: FrameProps | null
  textLabel7?: TextLabelProps | null
  textLabel8?: TextLabelProps | null
  frame10?: FrameProps | null
  chipToken5?: ChipTokenProps | null
  frame11?: FrameProps | null
  textLabel9?: TextLabelProps | null
  textLabel10?: TextLabelProps | null
  frame12?: FrameProps | null
  chipToken6?: ChipTokenProps | null
  frame13?: FrameProps | null
  textLabel11?: TextLabelProps | null
  textLabel12?: TextLabelProps | null
  frame14?: FrameProps | null
  chipToken7?: ChipTokenProps | null
  frame15?: FrameProps | null
  textLabel13?: TextLabelProps | null
  textLabel14?: TextLabelProps | null
}

//
// Default property values
//
const sdn: TokenCardProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--vatw",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--id7p",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel: {
    children: "None",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel2: {
    children: "0px · 0rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken2: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--j4sq",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel3: {
    children: "Tight",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel4: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken3: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--wqm9",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel5: {
    children: "Compact",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel6: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken4: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--l5ve",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel7: {
    children: "Cozy",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel8: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken5: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--rioz",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel9: {
    children: "Comfortable",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel10: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken6: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--9aok",
  },
  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel11: {
    children: "Open",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel12: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  chipToken7: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--vuac",
  },
  frame15: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--yxbv",
  },
  textLabel13: {
    children: "Custom Token",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel14: {
    children: "16px · 1rem",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
}

/**
 * Part: TokenCard
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     Frame            frame2
 *       ChipToken      chipToken
 *         Frame        frame3
 *           TextLabel  textLabel
 *           TextLabel  textLabel2
 *     Frame            frame4
 *       ChipToken      chipToken2
 *         Frame        frame5
 *           TextLabel  textLabel3
 *           TextLabel  textLabel4
 *     Frame            frame6
 *       ChipToken      chipToken3
 *         Frame        frame7
 *           TextLabel  textLabel5
 *           TextLabel  textLabel6
 *     Frame            frame8
 *       ChipToken      chipToken4
 *         Frame        frame9
 *           TextLabel  textLabel7
 *           TextLabel  textLabel8
 *     Frame            frame10
 *       ChipToken      chipToken5
 *         Frame        frame11
 *           TextLabel  textLabel9
 *           TextLabel  textLabel10
 *     Frame            frame12
 *       ChipToken      chipToken6
 *         Frame        frame13
 *           TextLabel  textLabel11
 *           TextLabel  textLabel12
 *     Frame            frame14
 *       ChipToken      chipToken7
 *         Frame        frame15
 *           TextLabel  textLabel13
 *           TextLabel  textLabel14
 *
 * @example
 * ```tsx
 * <TokenCard
 *   aria-hidden="false"
 *   frame="{}"
 *   chipToken="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   frame2="{}"
 *   frame3="{}"
 *   frame4="{}"
 *   frame5="{}"
 *   frame6="{}"
 *   frame7="{}"
 * />
 * ```
 */
export function TokenCard({
  className = "",
  frame,
  frame2,
  chipToken,
  frame3,
  textLabel,
  textLabel2,
  frame4,
  chipToken2,
  frame5,
  textLabel3,
  textLabel4,
  frame6,
  chipToken3,
  frame7,
  textLabel5,
  textLabel6,
  frame8,
  chipToken4,
  frame9,
  textLabel7,
  textLabel8,
  frame10,
  chipToken5,
  frame11,
  textLabel9,
  textLabel10,
  frame12,
  chipToken6,
  frame13,
  textLabel11,
  textLabel12,
  frame14,
  chipToken7,
  frame15,
  textLabel13,
  textLabel14,

  children,
  seldonRefs,
  ...props
}: TokenCardProps) {
  const tokenCardClassName = combineClassNames("sdn-token-card", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const chipTokenProps = mergeOptionalSlot(sdn.chipToken, chipToken, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const chipToken2Props = mergeOptionalSlot(sdn.chipToken2, chipToken2, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const chipToken3Props = mergeOptionalSlot(sdn.chipToken3, chipToken3, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const chipToken4Props = mergeOptionalSlot(sdn.chipToken4, chipToken4, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const chipToken5Props = mergeOptionalSlot(sdn.chipToken5, chipToken5, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const frame12Props = mergeSlot(sdn.frame12, frame12, seldonRefs)
  const chipToken6Props = mergeOptionalSlot(sdn.chipToken6, chipToken6, seldonRefs)
  const frame13Props = mergeSlot(sdn.frame13, frame13, seldonRefs)
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const frame14Props = mergeSlot(sdn.frame14, frame14, seldonRefs)
  const chipToken7Props = mergeOptionalSlot(sdn.chipToken7, chipToken7, seldonRefs)
  const frame15Props = mergeSlot(sdn.frame15, frame15, seldonRefs)
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)

  return (
    <HTMLDiv className={tokenCardClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              {chipTokenProps !== null && (
                <ChipToken {...chipTokenProps}>
                  <Frame {...frame3Props}>
                    {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                    {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                  </Frame>
                </ChipToken>
              )}
            </Frame>
            <Frame {...frame4Props}>
              {chipToken2Props !== null && (
                <ChipToken {...chipToken2Props}>
                  <Frame {...frame5Props}>
                    {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                    {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                  </Frame>
                </ChipToken>
              )}
            </Frame>
            <Frame {...frame6Props}>
              {chipToken3Props !== null && (
                <ChipToken {...chipToken3Props}>
                  <Frame {...frame7Props}>
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                    {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                  </Frame>
                </ChipToken>
              )}
            </Frame>
            <Frame {...frame8Props}>
              {chipToken4Props !== null && (
                <ChipToken {...chipToken4Props}>
                  <Frame {...frame9Props}>
                    {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                    {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                  </Frame>
                </ChipToken>
              )}
            </Frame>
            <Frame {...frame10Props}>
              {chipToken5Props !== null && (
                <ChipToken {...chipToken5Props}>
                  <Frame {...frame11Props}>
                    {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                    {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                  </Frame>
                </ChipToken>
              )}
            </Frame>
            <Frame {...frame12Props}>
              {chipToken6Props !== null && (
                <ChipToken {...chipToken6Props}>
                  <Frame {...frame13Props}>
                    {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                    {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                  </Frame>
                </ChipToken>
              )}
            </Frame>
            <Frame {...frame14Props}>
              {chipToken7Props !== null && (
                <ChipToken {...chipToken7Props}>
                  <Frame {...frame15Props}>
                    {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                    {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                  </Frame>
                </ChipToken>
              )}
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
