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
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TokenCardAlignProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  container?: ContainerProps | null
  chipToken?: ChipTokenProps | null
  frame?: FrameProps | null
  icon?: IconProps | null
  frame2?: FrameProps | null
  icon2?: IconProps | null
  chipToken2?: ChipTokenProps | null
  frame3?: FrameProps | null
  icon3?: IconProps | null
  frame4?: FrameProps | null
  icon4?: IconProps | null
  chipToken3?: ChipTokenProps | null
  frame5?: FrameProps | null
  icon5?: IconProps | null
  frame6?: FrameProps | null
  icon6?: IconProps | null
  chipToken4?: ChipTokenProps | null
  frame7?: FrameProps | null
  icon7?: IconProps | null
  frame8?: FrameProps | null
  icon8?: IconProps | null
  chipToken5?: ChipTokenProps | null
  frame9?: FrameProps | null
  icon9?: IconProps | null
  frame10?: FrameProps | null
  icon10?: IconProps | null
  chipToken6?: ChipTokenProps | null
  frame11?: FrameProps | null
  icon11?: IconProps | null
  frame12?: FrameProps | null
  icon12?: IconProps | null
  chipToken7?: ChipTokenProps | null
  frame13?: FrameProps | null
  icon13?: IconProps | null
  frame14?: FrameProps | null
  icon14?: IconProps | null
  chipToken8?: ChipTokenProps | null
  frame15?: FrameProps | null
  icon15?: IconProps | null
  frame16?: FrameProps | null
  icon16?: IconProps | null
  chipToken9?: ChipTokenProps | null
  frame17?: FrameProps | null
  icon17?: IconProps | null
  frame18?: FrameProps | null
  icon18?: IconProps | null
}

//
// Default property values
//
const sdn: TokenCardAlignProps = {
  "aria-hidden": "false",
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--m4fk",
  },
  chipToken: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pefl",
  },
  icon: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--duyo",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--7mzg",
  },
  chipToken2: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon3: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--1kqj",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--znda",
  },
  chipToken3: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon5: {
    icon: "material-wrapText",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--aksb",
  },
  icon6: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--laem",
  },
  chipToken4: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon7: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g9sz",
  },
  icon8: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--cl0c",
  },
  chipToken5: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon9: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--2nwn",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--smv2",
  },
  icon10: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--znda",
  },
  chipToken6: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon11: {
    icon: "material-wrapText",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--llrf",
  },
  icon12: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--yzhv",
  },
  chipToken7: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon13: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--z2od",
  },
  icon14: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--yzhv",
  },
  chipToken8: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame15: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon15: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame16: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--k9li",
  },
  icon16: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ehuw",
  },
  chipToken9: {
    "aria-hidden": "false",
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame17: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon17: {
    icon: "material-arrowForward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame18: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--qnik",
  },
  icon18: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--cl0c",
  },
}

/**
 * Part: TokenCardAlign
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Container     container
 *     ChipToken   chipToken
 *       Frame     frame
 *         Icon    icon
 *         Frame   frame2
 *           Icon  icon2
 *     ChipToken   chipToken2
 *       Frame     frame3
 *         Icon    icon3
 *         Frame   frame4
 *           Icon  icon4
 *     ChipToken   chipToken3
 *       Frame     frame5
 *         Icon    icon5
 *         Frame   frame6
 *           Icon  icon6
 *     ChipToken   chipToken4
 *       Frame     frame7
 *         Icon    icon7
 *         Frame   frame8
 *           Icon  icon8
 *     ChipToken   chipToken5
 *       Frame     frame9
 *         Icon    icon9
 *         Frame   frame10
 *           Icon  icon10
 *     ChipToken   chipToken6
 *       Frame     frame11
 *         Icon    icon11
 *         Frame   frame12
 *           Icon  icon12
 *     ChipToken   chipToken7
 *       Frame     frame13
 *         Icon    icon13
 *         Frame   frame14
 *           Icon  icon14
 *     ChipToken   chipToken8
 *       Frame     frame15
 *         Icon    icon15
 *         Frame   frame16
 *           Icon  icon16
 *     ChipToken   chipToken9
 *       Frame     frame17
 *         Icon    icon17
 *         Frame   frame18
 *           Icon  icon18
 *
 * @example
 * ```tsx
 * <TokenCardAlign
 *   aria-hidden="false"
 *   container="{}"
 *   chipToken="{}"
 *   frame="{}"
 *   icon="material-star"
 *   chipToken2="{}"
 *   chipToken3="{}"
 *   chipToken4="{}"
 *   chipToken5="{}"
 *   chipToken6="{}"
 *   chipToken7="{}"
 *   chipToken8="{}"
 *   chipToken9="{}"
 * />
 * ```
 */
export function TokenCardAlign({
  className = "",
  container,
  chipToken,
  frame,
  icon,
  frame2,
  icon2,
  chipToken2,
  frame3,
  icon3,
  frame4,
  icon4,
  chipToken3,
  frame5,
  icon5,
  frame6,
  icon6,
  chipToken4,
  frame7,
  icon7,
  frame8,
  icon8,
  chipToken5,
  frame9,
  icon9,
  frame10,
  icon10,
  chipToken6,
  frame11,
  icon11,
  frame12,
  icon12,
  chipToken7,
  frame13,
  icon13,
  frame14,
  icon14,
  chipToken8,
  frame15,
  icon15,
  frame16,
  icon16,
  chipToken9,
  frame17,
  icon17,
  frame18,
  icon18,

  children,
  seldonRefs,
  ...props
}: TokenCardAlignProps) {
  const tokenCardAlignClassName = combineClassNames("sdn-token-card-align", className)

  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const chipTokenProps = mergeOptionalSlot(sdn.chipToken, chipToken, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const chipToken2Props = mergeOptionalSlot(sdn.chipToken2, chipToken2, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const icon4Props = mergeOptionalSlot(sdn.icon4, icon4, seldonRefs)
  const chipToken3Props = mergeOptionalSlot(sdn.chipToken3, chipToken3, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const icon5Props = mergeOptionalSlot(sdn.icon5, icon5, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const icon6Props = mergeOptionalSlot(sdn.icon6, icon6, seldonRefs)
  const chipToken4Props = mergeOptionalSlot(sdn.chipToken4, chipToken4, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const icon7Props = mergeOptionalSlot(sdn.icon7, icon7, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const icon8Props = mergeOptionalSlot(sdn.icon8, icon8, seldonRefs)
  const chipToken5Props = mergeOptionalSlot(sdn.chipToken5, chipToken5, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const icon9Props = mergeOptionalSlot(sdn.icon9, icon9, seldonRefs)
  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const icon10Props = mergeOptionalSlot(sdn.icon10, icon10, seldonRefs)
  const chipToken6Props = mergeOptionalSlot(sdn.chipToken6, chipToken6, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const icon11Props = mergeOptionalSlot(sdn.icon11, icon11, seldonRefs)
  const frame12Props = mergeSlot(sdn.frame12, frame12, seldonRefs)
  const icon12Props = mergeOptionalSlot(sdn.icon12, icon12, seldonRefs)
  const chipToken7Props = mergeOptionalSlot(sdn.chipToken7, chipToken7, seldonRefs)
  const frame13Props = mergeSlot(sdn.frame13, frame13, seldonRefs)
  const icon13Props = mergeOptionalSlot(sdn.icon13, icon13, seldonRefs)
  const frame14Props = mergeSlot(sdn.frame14, frame14, seldonRefs)
  const icon14Props = mergeOptionalSlot(sdn.icon14, icon14, seldonRefs)
  const chipToken8Props = mergeOptionalSlot(sdn.chipToken8, chipToken8, seldonRefs)
  const frame15Props = mergeSlot(sdn.frame15, frame15, seldonRefs)
  const icon15Props = mergeOptionalSlot(sdn.icon15, icon15, seldonRefs)
  const frame16Props = mergeSlot(sdn.frame16, frame16, seldonRefs)
  const icon16Props = mergeOptionalSlot(sdn.icon16, icon16, seldonRefs)
  const chipToken9Props = mergeOptionalSlot(sdn.chipToken9, chipToken9, seldonRefs)
  const frame17Props = mergeSlot(sdn.frame17, frame17, seldonRefs)
  const icon17Props = mergeOptionalSlot(sdn.icon17, icon17, seldonRefs)
  const frame18Props = mergeSlot(sdn.frame18, frame18, seldonRefs)
  const icon18Props = mergeOptionalSlot(sdn.icon18, icon18, seldonRefs)

  return (
    <HTMLDiv className={tokenCardAlignClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...containerProps}>
            {chipTokenProps !== null && (
              <ChipToken {...chipTokenProps}>
                <Frame {...frameProps}>
                  {iconProps !== null && <Icon {...iconProps} />}
                  <Frame {...frame2Props}>{icon2Props !== null && <Icon {...icon2Props} />}</Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken2Props !== null && (
              <ChipToken {...chipToken2Props}>
                <Frame {...frame3Props}>
                  {icon3Props !== null && <Icon {...icon3Props} />}
                  <Frame {...frame4Props}>{icon4Props !== null && <Icon {...icon4Props} />}</Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken3Props !== null && (
              <ChipToken {...chipToken3Props}>
                <Frame {...frame5Props}>
                  {icon5Props !== null && <Icon {...icon5Props} />}
                  <Frame {...frame6Props}>{icon6Props !== null && <Icon {...icon6Props} />}</Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken4Props !== null && (
              <ChipToken {...chipToken4Props}>
                <Frame {...frame7Props}>
                  {icon7Props !== null && <Icon {...icon7Props} />}
                  <Frame {...frame8Props}>{icon8Props !== null && <Icon {...icon8Props} />}</Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken5Props !== null && (
              <ChipToken {...chipToken5Props}>
                <Frame {...frame9Props}>
                  {icon9Props !== null && <Icon {...icon9Props} />}
                  <Frame {...frame10Props}>
                    {icon10Props !== null && <Icon {...icon10Props} />}
                  </Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken6Props !== null && (
              <ChipToken {...chipToken6Props}>
                <Frame {...frame11Props}>
                  {icon11Props !== null && <Icon {...icon11Props} />}
                  <Frame {...frame12Props}>
                    {icon12Props !== null && <Icon {...icon12Props} />}
                  </Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken7Props !== null && (
              <ChipToken {...chipToken7Props}>
                <Frame {...frame13Props}>
                  {icon13Props !== null && <Icon {...icon13Props} />}
                  <Frame {...frame14Props}>
                    {icon14Props !== null && <Icon {...icon14Props} />}
                  </Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken8Props !== null && (
              <ChipToken {...chipToken8Props}>
                <Frame {...frame15Props}>
                  {icon15Props !== null && <Icon {...icon15Props} />}
                  <Frame {...frame16Props}>
                    {icon16Props !== null && <Icon {...icon16Props} />}
                  </Frame>
                </Frame>
              </ChipToken>
            )}
            {chipToken9Props !== null && (
              <ChipToken {...chipToken9Props}>
                <Frame {...frame17Props}>
                  {icon17Props !== null && <Icon {...icon17Props} />}
                  <Frame {...frame18Props}>
                    {icon18Props !== null && <Icon {...icon18Props} />}
                  </Frame>
                </Frame>
              </ChipToken>
            )}
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
