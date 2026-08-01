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

import { ItemAvatarItem, ItemAvatarItemProps } from "../elements/ItemAvatarItem"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TokenPreviewProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  container?: ContainerProps | null
  frame?: FrameProps | null
  itemAvatarItem?: ItemAvatarItemProps | null
  frame2?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null
  frame3?: FrameProps | null
  itemAvatarItem2?: ItemAvatarItemProps | null
  frame4?: FrameProps | null
  textTitle2?: TextTitleProps | null
  textSubtitle2?: TextSubtitleProps | null
  frame5?: FrameProps | null
  itemAvatarItem3?: ItemAvatarItemProps | null
  frame6?: FrameProps | null
  textTitle3?: TextTitleProps | null
  textSubtitle3?: TextSubtitleProps | null
  frame7?: FrameProps | null
  itemAvatarItem4?: ItemAvatarItemProps | null
  frame8?: FrameProps | null
  textTitle4?: TextTitleProps | null
  textSubtitle4?: TextSubtitleProps | null
  frame9?: FrameProps | null
  itemAvatarItem5?: ItemAvatarItemProps | null
  frame10?: FrameProps | null
  textTitle5?: TextTitleProps | null
  textSubtitle5?: TextSubtitleProps | null
  frame11?: FrameProps | null
  itemAvatarItem6?: ItemAvatarItemProps | null
  frame12?: FrameProps | null
  textTitle6?: TextTitleProps | null
  textSubtitle6?: TextSubtitleProps | null
}

//
// Default property values
//
const sdn: TokenPreviewProps = {
  "aria-hidden": "false",
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--eaf4",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a082",
  },
  itemAvatarItem: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--lrtt",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Full Name",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem2: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--8cdo",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Tight",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle2: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem3: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--39hf",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Compact",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle3: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem4: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--oect",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle4: {
    children: "Cozy",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle4: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem5: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--okng",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle5: {
    children: "Comfortable",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle5: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ijvp",
  },
  itemAvatarItem6: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item-avatar-item--p1hh",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle6: {
    children: "Open",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--zbun",
  },
  textSubtitle6: {
    children: "12px · 0.5rem",
    htmlElement: "h5",
    "aria-hidden": "false",
    className: "sdn-text-subtitle sdn-text-subtitle--7zxo",
  },
}

/**
 * Part: TokenPreview
 * Level: Part
 * Intent: Used for preview and properties badges over the canvas.
 * Tags: Properties, tokens, margins, padding, orientation, align, gap
 * Type: Inline
 *
 * Structure:
 *   Container             container
 *     Frame               frame
 *       ItemAvatarItem    itemAvatarItem
 *         Frame           frame2
 *           TextTitle     textTitle
 *           TextSubtitle  textSubtitle
 *     Frame               frame3
 *       ItemAvatarItem    itemAvatarItem2
 *         Frame           frame4
 *           TextTitle     textTitle2
 *           TextSubtitle  textSubtitle2
 *     Frame               frame5
 *       ItemAvatarItem    itemAvatarItem3
 *         Frame           frame6
 *           TextTitle     textTitle3
 *           TextSubtitle  textSubtitle3
 *     Frame               frame7
 *       ItemAvatarItem    itemAvatarItem4
 *         Frame           frame8
 *           TextTitle     textTitle4
 *           TextSubtitle  textSubtitle4
 *     Frame               frame9
 *       ItemAvatarItem    itemAvatarItem5
 *         Frame           frame10
 *           TextTitle     textTitle5
 *           TextSubtitle  textSubtitle5
 *     Frame               frame11
 *       ItemAvatarItem    itemAvatarItem6
 *         Frame           frame12
 *           TextTitle     textTitle6
 *           TextSubtitle  textSubtitle6
 *
 * @example
 * ```tsx
 * <TokenPreview
 *   aria-hidden="false"
 *   container="{}"
 *   frame="{}"
 *   itemAvatarItem="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   frame2="{}"
 *   frame3="{}"
 *   frame4="{}"
 *   frame5="{}"
 *   frame6="{}"
 * />
 * ```
 */
export function TokenPreview({
  className = "",
  container,
  frame,
  itemAvatarItem,
  frame2,
  textTitle,
  textSubtitle,
  frame3,
  itemAvatarItem2,
  frame4,
  textTitle2,
  textSubtitle2,
  frame5,
  itemAvatarItem3,
  frame6,
  textTitle3,
  textSubtitle3,
  frame7,
  itemAvatarItem4,
  frame8,
  textTitle4,
  textSubtitle4,
  frame9,
  itemAvatarItem5,
  frame10,
  textTitle5,
  textSubtitle5,
  frame11,
  itemAvatarItem6,
  frame12,
  textTitle6,
  textSubtitle6,

  children,
  seldonRefs,
  ...props
}: TokenPreviewProps) {
  const tokenPreviewClassName = combineClassNames("sdn-frame", className)

  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const itemAvatarItemProps = mergeOptionalSlot(sdn.itemAvatarItem, itemAvatarItem, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const itemAvatarItem2Props = mergeOptionalSlot(sdn.itemAvatarItem2, itemAvatarItem2, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const textTitle2Props = mergeOptionalSlot(sdn.textTitle2, textTitle2, seldonRefs)
  const textSubtitle2Props = mergeOptionalSlot(sdn.textSubtitle2, textSubtitle2, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const itemAvatarItem3Props = mergeOptionalSlot(sdn.itemAvatarItem3, itemAvatarItem3, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const textTitle3Props = mergeOptionalSlot(sdn.textTitle3, textTitle3, seldonRefs)
  const textSubtitle3Props = mergeOptionalSlot(sdn.textSubtitle3, textSubtitle3, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const itemAvatarItem4Props = mergeOptionalSlot(sdn.itemAvatarItem4, itemAvatarItem4, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const textTitle4Props = mergeOptionalSlot(sdn.textTitle4, textTitle4, seldonRefs)
  const textSubtitle4Props = mergeOptionalSlot(sdn.textSubtitle4, textSubtitle4, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const itemAvatarItem5Props = mergeOptionalSlot(sdn.itemAvatarItem5, itemAvatarItem5, seldonRefs)
  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const textTitle5Props = mergeOptionalSlot(sdn.textTitle5, textTitle5, seldonRefs)
  const textSubtitle5Props = mergeOptionalSlot(sdn.textSubtitle5, textSubtitle5, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const itemAvatarItem6Props = mergeOptionalSlot(sdn.itemAvatarItem6, itemAvatarItem6, seldonRefs)
  const frame12Props = mergeSlot(sdn.frame12, frame12, seldonRefs)
  const textTitle6Props = mergeOptionalSlot(sdn.textTitle6, textTitle6, seldonRefs)
  const textSubtitle6Props = mergeOptionalSlot(sdn.textSubtitle6, textSubtitle6, seldonRefs)

  return (
    <HTMLDiv className={tokenPreviewClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...containerProps}>
            <Frame {...frameProps}>
              {itemAvatarItemProps !== null && (
                <ItemAvatarItem {...itemAvatarItemProps}>
                  <Frame {...frame2Props}>
                    {textTitleProps !== null && <TextTitle {...textTitleProps} />}
                    {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
                  </Frame>
                </ItemAvatarItem>
              )}
            </Frame>
            <Frame {...frame3Props}>
              {itemAvatarItem2Props !== null && (
                <ItemAvatarItem {...itemAvatarItem2Props}>
                  <Frame {...frame4Props}>
                    {textTitle2Props !== null && <TextTitle {...textTitle2Props} />}
                    {textSubtitle2Props !== null && <TextSubtitle {...textSubtitle2Props} />}
                  </Frame>
                </ItemAvatarItem>
              )}
            </Frame>
            <Frame {...frame5Props}>
              {itemAvatarItem3Props !== null && (
                <ItemAvatarItem {...itemAvatarItem3Props}>
                  <Frame {...frame6Props}>
                    {textTitle3Props !== null && <TextTitle {...textTitle3Props} />}
                    {textSubtitle3Props !== null && <TextSubtitle {...textSubtitle3Props} />}
                  </Frame>
                </ItemAvatarItem>
              )}
            </Frame>
            <Frame {...frame7Props}>
              {itemAvatarItem4Props !== null && (
                <ItemAvatarItem {...itemAvatarItem4Props}>
                  <Frame {...frame8Props}>
                    {textTitle4Props !== null && <TextTitle {...textTitle4Props} />}
                    {textSubtitle4Props !== null && <TextSubtitle {...textSubtitle4Props} />}
                  </Frame>
                </ItemAvatarItem>
              )}
            </Frame>
            <Frame {...frame9Props}>
              {itemAvatarItem5Props !== null && (
                <ItemAvatarItem {...itemAvatarItem5Props}>
                  <Frame {...frame10Props}>
                    {textTitle5Props !== null && <TextTitle {...textTitle5Props} />}
                    {textSubtitle5Props !== null && <TextSubtitle {...textSubtitle5Props} />}
                  </Frame>
                </ItemAvatarItem>
              )}
            </Frame>
            <Frame {...frame11Props}>
              {itemAvatarItem6Props !== null && (
                <ItemAvatarItem {...itemAvatarItem6Props}>
                  <Frame {...frame12Props}>
                    {textTitle6Props !== null && <TextTitle {...textTitle6Props} />}
                    {textSubtitle6Props !== null && <TextSubtitle {...textSubtitle6Props} />}
                  </Frame>
                </ItemAvatarItem>
              )}
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
