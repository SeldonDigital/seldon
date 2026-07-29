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

import { ItemCatalog, ItemCatalogProps } from "../elements/ItemCatalog"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLUl } from "../native-react/HTML.Ul"
import { Icon, IconProps } from "../primitives/Icon"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ListStandardCatalogProps extends HTMLAttributes<HTMLUListElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textSubtitle?: TextSubtitleProps | null

  container?: ContainerProps | null
  itemCatalog?: ItemCatalogProps | null
  icon?: IconProps | null
  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle2?: TextSubtitleProps | null
  itemCatalog2?: ItemCatalogProps | null
  icon2?: IconProps | null
  frame2?: FrameProps | null
  textTitle2?: TextTitleProps | null
  textSubtitle3?: TextSubtitleProps | null
  itemCatalog3?: ItemCatalogProps | null
  icon3?: IconProps | null
  frame3?: FrameProps | null
  textTitle3?: TextTitleProps | null
  textSubtitle4?: TextSubtitleProps | null
  itemCatalog4?: ItemCatalogProps | null
  icon4?: IconProps | null
  frame4?: FrameProps | null
  textTitle4?: TextTitleProps | null
  textSubtitle5?: TextSubtitleProps | null
}

//
// Default property values
//
const sdn: ListStandardCatalogProps = {
  "aria-hidden": "false",
  textSubtitle: {
    children: "Component Level",
    className: "sdn-text-subtitle sdn-text-label--yqnd",
  },

  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--x52o",
    "data-seldon-ref": "catalogItems",
  },
  itemCatalog: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--dr0a",
  },
  textSubtitle2: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--uv0m",
  },
  itemCatalog2: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--matt",
  },
  textSubtitle3: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--b0xy",
  },
  itemCatalog3: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon3: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--matt",
  },
  textSubtitle4: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--b0xy",
  },
  itemCatalog4: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon4: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--km45",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle4: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--matt",
  },
  textSubtitle5: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--b0xy",
  },
}

/**
 * List: StandardCatalog
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Inline
 *
 * Structure:
 *   TextSubtitle        textSubtitle
 *   Container           container      -> catalogItems
 *     ItemCatalog       itemCatalog
 *       Icon            icon
 *       Frame           frame
 *         TextTitle     textTitle
 *         TextSubtitle  textSubtitle2
 *     ItemCatalog       itemCatalog2
 *       Icon            icon2
 *       Frame           frame2
 *         TextTitle     textTitle2
 *         TextSubtitle  textSubtitle3
 *     ItemCatalog       itemCatalog3
 *       Icon            icon3
 *       Frame           frame3
 *         TextTitle     textTitle3
 *         TextSubtitle  textSubtitle4
 *     ItemCatalog       itemCatalog4
 *       Icon            icon4
 *       Frame           frame4
 *         TextTitle     textTitle4
 *         TextSubtitle  textSubtitle5
 *
 * @example
 * ```tsx
 * <ListStandardCatalog
 *   aria-hidden="false"
 *   textSubtitle="Product Title"
 *   container="{}"
 *   itemCatalog="{}"
 *   icon="material-star"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   itemCatalog2="{}"
 *   itemCatalog3="{}"
 *   itemCatalog4="{}"
 * />
 * ```
 */
export function ListStandardCatalog({
  className = "",
  textSubtitle,

  container,
  itemCatalog,
  icon,
  frame,
  textTitle,
  textSubtitle2,
  itemCatalog2,
  icon2,
  frame2,
  textTitle2,
  textSubtitle3,
  itemCatalog3,
  icon3,
  frame3,
  textTitle3,
  textSubtitle4,
  itemCatalog4,
  icon4,
  frame4,
  textTitle4,
  textSubtitle5,

  children,
  seldonRefs,
  ...props
}: ListStandardCatalogProps) {
  const listStandardCatalogClassName = combineClassNames("sdn-list-standard-catalog", className)

  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const itemCatalogProps = mergeOptionalSlot(sdn.itemCatalog, itemCatalog, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitle2Props = mergeOptionalSlot(sdn.textSubtitle2, textSubtitle2, seldonRefs)
  const itemCatalog2Props = mergeOptionalSlot(sdn.itemCatalog2, itemCatalog2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textTitle2Props = mergeOptionalSlot(sdn.textTitle2, textTitle2, seldonRefs)
  const textSubtitle3Props = mergeOptionalSlot(sdn.textSubtitle3, textSubtitle3, seldonRefs)
  const itemCatalog3Props = mergeOptionalSlot(sdn.itemCatalog3, itemCatalog3, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const textTitle3Props = mergeOptionalSlot(sdn.textTitle3, textTitle3, seldonRefs)
  const textSubtitle4Props = mergeOptionalSlot(sdn.textSubtitle4, textSubtitle4, seldonRefs)
  const itemCatalog4Props = mergeOptionalSlot(sdn.itemCatalog4, itemCatalog4, seldonRefs)
  const icon4Props = mergeOptionalSlot(sdn.icon4, icon4, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const textTitle4Props = mergeOptionalSlot(sdn.textTitle4, textTitle4, seldonRefs)
  const textSubtitle5Props = mergeOptionalSlot(sdn.textSubtitle5, textSubtitle5, seldonRefs)

  return (
    <HTMLUl className={listStandardCatalogClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
          <Frame {...containerProps}>
            {itemCatalogProps !== null && (
              <ItemCatalog {...itemCatalogProps}>
                {iconProps !== null && <Icon {...iconProps} />}
                <Frame {...frameProps}>
                  {textTitleProps !== null && <TextTitle {...textTitleProps} />}
                  {textSubtitle2Props !== null && <TextSubtitle {...textSubtitle2Props} />}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog2Props !== null && (
              <ItemCatalog {...itemCatalog2Props}>
                {icon2Props !== null && <Icon {...icon2Props} />}
                <Frame {...frame2Props}>
                  {textTitle2Props !== null && <TextTitle {...textTitle2Props} />}
                  {textSubtitle3Props !== null && <TextSubtitle {...textSubtitle3Props} />}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog3Props !== null && (
              <ItemCatalog {...itemCatalog3Props}>
                {icon3Props !== null && <Icon {...icon3Props} />}
                <Frame {...frame3Props}>
                  {textTitle3Props !== null && <TextTitle {...textTitle3Props} />}
                  {textSubtitle4Props !== null && <TextSubtitle {...textSubtitle4Props} />}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog4Props !== null && (
              <ItemCatalog {...itemCatalog4Props}>
                {icon4Props !== null && <Icon {...icon4Props} />}
                <Frame {...frame4Props}>
                  {textTitle4Props !== null && <TextTitle {...textTitle4Props} />}
                  {textSubtitle5Props !== null && <TextSubtitle {...textSubtitle5Props} />}
                </Frame>
              </ItemCatalog>
            )}
          </Frame>
        </>
      )}
    </HTMLUl>
  )
}
