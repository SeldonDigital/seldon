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

import { LiHTMLAttributes } from "react"

import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemCatalogProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null
}

//
// Default property values
//
const sdn: ItemCatalogProps = {
  "aria-hidden": "false",
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--mene",
    "data-seldon-ref": "catalogIcon",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--noun",
    "data-seldon-ref": "catalogLabel",
  },
  textSubtitle: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
    "data-seldon-ref": "catalogVariant",
  },
}

/**
 * Item: ItemCatalog
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
 *
 * Structure:
 *   Icon            icon          -> catalogIcon
 *   Frame           frame
 *     TextTitle     textTitle     -> catalogLabel
 *     TextSubtitle  textSubtitle  -> catalogVariant
 *
 * @example
 * ```tsx
 * <ItemCatalog
 *   aria-hidden="false"
 *   icon="material-star"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 * />
 * ```
 */
export function ItemCatalog({
  className = "",
  icon,

  frame,
  textTitle,
  textSubtitle,

  children,
  seldonRefs,
  ...props
}: ItemCatalogProps) {
  const itemCatalogClassName = combineClassNames("sdn-item-catalog", className)

  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  return (
    <HTMLLi
      className={itemCatalogClassName}
      data-seldon-ref={"catalogItem"}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          <Frame {...frameProps}>
            {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
          </Frame>
        </>
      )}
    </HTMLLi>
  )
}
