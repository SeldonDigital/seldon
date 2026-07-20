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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ItemCatalogProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null
}

/*****
 * Item: ItemCatalog
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Inline
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
 *****/
export function ItemCatalog({
  className = "",
  icon,
  frame = sdn.frame,
  textTitle,
  textSubtitle,
  children,
  seldonRefs,
  ...props
}: ItemCatalogProps) {
  const itemCatalogClassName = combineClassNames("sdn-item-catalog", className)
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
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        },
  )
  const textSubtitleProps = applyRef(
    seldonRefs,
    textSubtitle === null
      ? null
      : {
          ...sdn.textSubtitle,
          ...textSubtitle,
          className: combineClassNames(
            sdn.textSubtitle?.className,
            textSubtitle?.className,
          ),
        },
  )

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
          {icon && iconProps && <Icon {...iconProps} />}
          <Frame {...frameProps}>
            {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            {textSubtitle && textSubtitleProps && (
              <TextSubtitle {...textSubtitleProps} />
            )}
          </Frame>
        </>
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemCatalogProps = {
  "aria-hidden": "false",
  className: "sdn-item-catalog sdn-item",
  icon: {
    className: "sdn-icon sdn-icon--mene",
    "data-seldon-ref": "catalogIcon",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--noun",
    "data-seldon-ref": "catalogLabel",
  },
  textSubtitle: {
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
    "data-seldon-ref": "catalogVariant",
  },
}
