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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ListStandardCatalogProps extends HTMLAttributes<HTMLUListElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * List: StandardCatalog
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Inline
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
 *****/
export function ListStandardCatalog({
  className = "",
  textSubtitle,
  container = sdn.container,
  itemCatalog,
  icon,
  frame = sdn.frame,
  textTitle,
  textSubtitle2,
  itemCatalog2,
  icon2,
  frame2 = sdn.frame2,
  textTitle2,
  textSubtitle3,
  itemCatalog3,
  icon3,
  frame3 = sdn.frame3,
  textTitle3,
  textSubtitle4,
  itemCatalog4,
  icon4,
  frame4 = sdn.frame4,
  textTitle4,
  textSubtitle5,
  children,
  seldonRefs,
  ...props
}: ListStandardCatalogProps) {
  const listStandardCatalogClassName = combineClassNames(
    "sdn-list-standard-catalog",
    className,
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
  const containerProps = applyRef(
    seldonRefs,
    container === null
      ? null
      : {
          ...sdn.container,
          ...container,
          className: combineClassNames(
            sdn.container?.className,
            container?.className,
          ),
        },
  )
  const itemCatalogProps = applyRef(
    seldonRefs,
    itemCatalog === null
      ? null
      : {
          ...sdn.itemCatalog,
          ...itemCatalog,
          className: combineClassNames(
            sdn.itemCatalog?.className,
            itemCatalog?.className,
          ),
        },
  )
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
  const textSubtitle2Props = applyRef(
    seldonRefs,
    textSubtitle2 === null
      ? null
      : {
          ...sdn.textSubtitle2,
          ...textSubtitle2,
          className: combineClassNames(
            sdn.textSubtitle2?.className,
            textSubtitle2?.className,
          ),
        },
  )
  const itemCatalog2Props = applyRef(
    seldonRefs,
    itemCatalog2 === null
      ? null
      : {
          ...sdn.itemCatalog2,
          ...itemCatalog2,
          className: combineClassNames(
            sdn.itemCatalog2?.className,
            itemCatalog2?.className,
          ),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
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
  const textTitle2Props = applyRef(
    seldonRefs,
    textTitle2 === null
      ? null
      : {
          ...sdn.textTitle2,
          ...textTitle2,
          className: combineClassNames(
            sdn.textTitle2?.className,
            textTitle2?.className,
          ),
        },
  )
  const textSubtitle3Props = applyRef(
    seldonRefs,
    textSubtitle3 === null
      ? null
      : {
          ...sdn.textSubtitle3,
          ...textSubtitle3,
          className: combineClassNames(
            sdn.textSubtitle3?.className,
            textSubtitle3?.className,
          ),
        },
  )
  const itemCatalog3Props = applyRef(
    seldonRefs,
    itemCatalog3 === null
      ? null
      : {
          ...sdn.itemCatalog3,
          ...itemCatalog3,
          className: combineClassNames(
            sdn.itemCatalog3?.className,
            itemCatalog3?.className,
          ),
        },
  )
  const icon3Props = applyRef(
    seldonRefs,
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
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
  const textTitle3Props = applyRef(
    seldonRefs,
    textTitle3 === null
      ? null
      : {
          ...sdn.textTitle3,
          ...textTitle3,
          className: combineClassNames(
            sdn.textTitle3?.className,
            textTitle3?.className,
          ),
        },
  )
  const textSubtitle4Props = applyRef(
    seldonRefs,
    textSubtitle4 === null
      ? null
      : {
          ...sdn.textSubtitle4,
          ...textSubtitle4,
          className: combineClassNames(
            sdn.textSubtitle4?.className,
            textSubtitle4?.className,
          ),
        },
  )
  const itemCatalog4Props = applyRef(
    seldonRefs,
    itemCatalog4 === null
      ? null
      : {
          ...sdn.itemCatalog4,
          ...itemCatalog4,
          className: combineClassNames(
            sdn.itemCatalog4?.className,
            itemCatalog4?.className,
          ),
        },
  )
  const icon4Props = applyRef(
    seldonRefs,
    icon4 === null
      ? null
      : {
          ...sdn.icon4,
          ...icon4,
          className: combineClassNames(sdn.icon4?.className, icon4?.className),
        },
  )
  const frame4Props = applyRef(
    seldonRefs,
    frame4 === null
      ? null
      : {
          ...sdn.frame4,
          ...frame4,
          className: combineClassNames(
            sdn.frame4?.className,
            frame4?.className,
          ),
        },
  )
  const textTitle4Props = applyRef(
    seldonRefs,
    textTitle4 === null
      ? null
      : {
          ...sdn.textTitle4,
          ...textTitle4,
          className: combineClassNames(
            sdn.textTitle4?.className,
            textTitle4?.className,
          ),
        },
  )
  const textSubtitle5Props = applyRef(
    seldonRefs,
    textSubtitle5 === null
      ? null
      : {
          ...sdn.textSubtitle5,
          ...textSubtitle5,
          className: combineClassNames(
            sdn.textSubtitle5?.className,
            textSubtitle5?.className,
          ),
        },
  )

  return (
    <HTMLUl
      className={listStandardCatalogClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {textSubtitle && textSubtitleProps && (
            <TextSubtitle {...textSubtitleProps} />
          )}
          <Frame {...containerProps}>
            {itemCatalog && itemCatalogProps && (
              <ItemCatalog {...itemCatalogProps}>
                {icon && iconProps && <Icon {...iconProps} />}
                <Frame {...frameProps}>
                  {textTitle && textTitleProps && (
                    <TextTitle {...textTitleProps} />
                  )}
                  {textSubtitle2 && textSubtitle2Props && (
                    <TextSubtitle {...textSubtitle2Props} />
                  )}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog2 && itemCatalog2Props && (
              <ItemCatalog {...itemCatalog2Props}>
                {icon2 && icon2Props && <Icon {...icon2Props} />}
                <Frame {...frame2Props}>
                  {textTitle2 && textTitle2Props && (
                    <TextTitle {...textTitle2Props} />
                  )}
                  {textSubtitle3 && textSubtitle3Props && (
                    <TextSubtitle {...textSubtitle3Props} />
                  )}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog3 && itemCatalog3Props && (
              <ItemCatalog {...itemCatalog3Props}>
                {icon3 && icon3Props && <Icon {...icon3Props} />}
                <Frame {...frame3Props}>
                  {textTitle3 && textTitle3Props && (
                    <TextTitle {...textTitle3Props} />
                  )}
                  {textSubtitle4 && textSubtitle4Props && (
                    <TextSubtitle {...textSubtitle4Props} />
                  )}
                </Frame>
              </ItemCatalog>
            )}
            {itemCatalog4 && itemCatalog4Props && (
              <ItemCatalog {...itemCatalog4Props}>
                {icon4 && icon4Props && <Icon {...icon4Props} />}
                <Frame {...frame4Props}>
                  {textTitle4 && textTitle4Props && (
                    <TextTitle {...textTitle4Props} />
                  )}
                  {textSubtitle5 && textSubtitle5Props && (
                    <TextSubtitle {...textSubtitle5Props} />
                  )}
                </Frame>
              </ItemCatalog>
            )}
          </Frame>
        </>
      )}
    </HTMLUl>
  )
}

//
// Default property values
//
const sdn: ListStandardCatalogProps = {
  "aria-hidden": "false",
  className: "sdn-list-standard-catalog sdn-list-standard",
  textSubtitle: {
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
    className: "sdn-icon sdn-icon--km45",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--dr0a",
  },
  textSubtitle2: {
    className: "sdn-text-subtitle sdn-text-subtitle--uv0m",
  },
  itemCatalog2: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon2: {
    className: "sdn-icon sdn-icon--km45",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    className: "sdn-text-title sdn-text-title--dr0a",
  },
  textSubtitle3: {
    className: "sdn-text-subtitle sdn-text-subtitle--uv0m",
  },
  itemCatalog3: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon3: {
    className: "sdn-icon sdn-icon--km45",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    className: "sdn-text-title sdn-text-title--dr0a",
  },
  textSubtitle4: {
    className: "sdn-text-subtitle sdn-text-subtitle--uv0m",
  },
  itemCatalog4: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon4: {
    className: "sdn-icon sdn-icon--km45",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle4: {
    className: "sdn-text-title sdn-text-title--dr0a",
  },
  textSubtitle5: {
    className: "sdn-text-subtitle sdn-text-subtitle--uv0m",
  },
}
