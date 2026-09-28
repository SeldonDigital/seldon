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
import { ItemCatalog } from "../elements/ItemCatalog"
import { Container } from "../frames/Container"
import { Frame } from "../frames/Frame"
import { HTMLUl } from "../native-react/HTML.Ul"
import { TextSubtitle } from "../primitives/TextSubtitle"
import { TextTitle } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

import type { ItemCatalogProps } from "../elements/ItemCatalog"
import type { ContainerProps } from "../frames/Container"
import type { FrameProps } from "../frames/Frame"
import type { TextSubtitleProps } from "../primitives/TextSubtitle"
import type { TextTitleProps } from "../primitives/TextTitle"
import type { SeldonRefs } from "../utils/merge-slot"
import type { HTMLAttributes } from "react"

export interface ListStandardCatalogProps extends HTMLAttributes<HTMLUListElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textSubtitle?: TextSubtitleProps | null

  container?: ContainerProps | null
  itemCatalog?: ItemCatalogProps | null
  frame?: FrameProps | null
  frame2?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle2?: TextSubtitleProps | null
  textSubtitle3?: TextSubtitleProps | null
}

//
// Default property values
//
const sdn: ListStandardCatalogProps = {
  "aria-hidden": "false",
  textSubtitle: {
    children: "Component Level",
    className: "sdn-text-subtitle sdn-text-subtitle--qgof",
  },

  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--x52o",
    "data-seldon-ref": "catalogItems",
  },
  itemCatalog: {
    className: "sdn-item-catalog sdn-item-catalog--yumy",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pg9d",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Component Name",
    className: "sdn-text-title sdn-text-subtitle--uv0m",
  },
  textSubtitle2: {
    children: "Default Variant",
    className: "sdn-text-subtitle sdn-text-subtitle--glvh",
  },
  textSubtitle3: {
    children: "Description · Tag · Tag · Tag",
    className: "sdn-text-subtitle sdn-text-subtitle--uvjq",
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
 *       Frame           frame
 *       Frame           frame2
 *         TextTitle     textTitle
 *         TextSubtitle  textSubtitle2
 *         TextSubtitle  textSubtitle3
 *
 * @example
 * ```tsx
 * <ListStandardCatalog
 *   aria-hidden="false"
 *   textSubtitle="Product Title"
 *   container="{}"
 *   itemCatalog="{}"
 *   frame="{}"
 *   frame2="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   textSubtitle3="Product Title"
 * />
 * ```
 */
export function ListStandardCatalog({
  className = "",
  textSubtitle,

  container,
  itemCatalog,
  frame,
  frame2,
  textTitle,
  textSubtitle2,
  textSubtitle3,

  children,
  seldonRefs,
  ...props
}: ListStandardCatalogProps) {
  const listStandardCatalogClassName = combineClassNames("sdn-list-standard-catalog", className)

  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)

  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const itemCatalogProps = mergeOptionalSlot(sdn.itemCatalog, itemCatalog, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitle2Props = mergeOptionalSlot(sdn.textSubtitle2, textSubtitle2, seldonRefs)
  const textSubtitle3Props = mergeOptionalSlot(sdn.textSubtitle3, textSubtitle3, seldonRefs)

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
                <Frame {...frameProps}></Frame>
                <Frame {...frame2Props}>
                  {textTitleProps !== null && <TextTitle {...textTitleProps} />}
                  {textSubtitle2Props !== null && <TextSubtitle {...textSubtitle2Props} />}
                  {textSubtitle3Props !== null && <TextSubtitle {...textSubtitle3Props} />}
                </Frame>
              </ItemCatalog>
            )}
          </Frame>
        </>
      )}
    </HTMLUl>
  )
}
