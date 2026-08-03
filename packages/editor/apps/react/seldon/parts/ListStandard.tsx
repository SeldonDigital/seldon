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

import { Button, ButtonProps } from "../elements/Button"
import { Item, ItemProps } from "../elements/Item"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLUl } from "../native-react/HTML.Ul"
import { Icon, IconProps } from "../primitives/Icon"
import { InputCheckbox, InputCheckboxProps } from "../primitives/InputCheckbox"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ListStandardProps extends HTMLAttributes<HTMLUListElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  item?: ItemProps | null
  inputCheckbox?: InputCheckboxProps | null
  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null

  item2?: ItemProps | null
  inputCheckbox2?: InputCheckboxProps | null
  frame2?: FrameProps | null
  textTitle2?: TextTitleProps | null
  textSubtitle2?: TextSubtitleProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null

  item3?: ItemProps | null
  inputCheckbox3?: InputCheckboxProps | null
  frame3?: FrameProps | null
  textTitle3?: TextTitleProps | null
  textSubtitle3?: TextSubtitleProps | null
  button3?: ButtonProps | null
  icon3?: IconProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ListStandardProps = {
  "aria-hidden": "false",
  item: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--vvmc",
  },
  inputCheckbox: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Title",
    className: "sdn-text-title sdn-text-title--drqy",
  },
  textSubtitle: {
    children: "Subtitle",
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
  },
  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },

  item2: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--vvmc",
  },
  inputCheckbox2: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Title",
    className: "sdn-text-title sdn-text-title--drqy",
  },
  textSubtitle2: {
    children: "Subtitle",
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
  },
  button2: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel2: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },

  item3: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--7egk",
  },
  inputCheckbox3: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Title",
    className: "sdn-text-title sdn-text-title--drqy",
  },
  textSubtitle3: {
    children: "Subtitle",
    className: "sdn-text-subtitle sdn-text-subtitle--pyri",
  },
  button3: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel3: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },
}

/**
 * List: Standard
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Default
 *
 * Structure:
 *   Item              item
 *     InputCheckbox   inputCheckbox
 *     Frame           frame
 *       TextTitle     textTitle
 *       TextSubtitle  textSubtitle
 *     Button          button
 *       Icon          icon
 *       TextLabel     textLabel
 *   Item              item2
 *     InputCheckbox   inputCheckbox2
 *     Frame           frame2
 *       TextTitle     textTitle2
 *       TextSubtitle  textSubtitle2
 *     Button          button2
 *       Icon          icon2
 *       TextLabel     textLabel2
 *   Item              item3
 *     InputCheckbox   inputCheckbox3
 *     Frame           frame3
 *       TextTitle     textTitle3
 *       TextSubtitle  textSubtitle3
 *     Button          button3
 *       Icon          icon3
 *       TextLabel     textLabel3
 *
 * @example
 * ```tsx
 * <ListStandard
 *   aria-hidden="false"
 *   item="{}"
 *   inputCheckbox="{}"
 *   frame="{}"
 *   textTitle="Product Title"
 *   textSubtitle2="Product Title"
 *   button={() => {}}
 *   icon="material-star"
 *   textLabel="{}"
 *   item2="{}"
 *   item3="{}"
 * />
 * ```
 */
export function ListStandard({
  className = "",
  item,
  inputCheckbox,
  frame,
  textTitle,
  textSubtitle,
  button,
  icon,
  textLabel,

  item2,
  inputCheckbox2,
  frame2,
  textTitle2,
  textSubtitle2,
  button2,
  icon2,
  textLabel2,

  item3,
  inputCheckbox3,
  frame3,
  textTitle3,
  textSubtitle3,
  button3,
  icon3,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: ListStandardProps) {
  const listStandardClassName = combineClassNames("sdn-list-standard", className)

  const itemProps = mergeSlot(sdn.item, item, seldonRefs)
  const inputCheckboxProps = mergeOptionalSlot(sdn.inputCheckbox, inputCheckbox, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const item2Props = mergeSlot(sdn.item2, item2, seldonRefs)
  const inputCheckbox2Props = mergeOptionalSlot(sdn.inputCheckbox2, inputCheckbox2, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textTitle2Props = mergeOptionalSlot(sdn.textTitle2, textTitle2, seldonRefs)
  const textSubtitle2Props = mergeOptionalSlot(sdn.textSubtitle2, textSubtitle2, seldonRefs)
  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const item3Props = mergeSlot(sdn.item3, item3, seldonRefs)
  const inputCheckbox3Props = mergeOptionalSlot(sdn.inputCheckbox3, inputCheckbox3, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const textTitle3Props = mergeOptionalSlot(sdn.textTitle3, textTitle3, seldonRefs)
  const textSubtitle3Props = mergeOptionalSlot(sdn.textSubtitle3, textSubtitle3, seldonRefs)
  const button3Props = mergeSlot(sdn.button3, button3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  return (
    <HTMLUl className={listStandardClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {itemProps !== null && (
            <Item {...itemProps}>
              {inputCheckboxProps !== null && <InputCheckbox {...inputCheckboxProps} />}
              <Frame {...frameProps}>
                {textTitleProps !== null && <TextTitle {...textTitleProps} />}
                {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
              </Frame>
              {buttonProps !== null && (
                <Button {...buttonProps}>
                  {iconProps !== null && <Icon {...iconProps} />}
                  {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                </Button>
              )}
            </Item>
          )}
          {item2Props !== null && (
            <Item {...item2Props}>
              {inputCheckbox2Props !== null && <InputCheckbox {...inputCheckbox2Props} />}
              <Frame {...frame2Props}>
                {textTitle2Props !== null && <TextTitle {...textTitle2Props} />}
                {textSubtitle2Props !== null && <TextSubtitle {...textSubtitle2Props} />}
              </Frame>
              {button2Props !== null && (
                <Button {...button2Props}>
                  {icon2Props !== null && <Icon {...icon2Props} />}
                  {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                </Button>
              )}
            </Item>
          )}
          {item3Props !== null && (
            <Item {...item3Props}>
              {inputCheckbox3Props !== null && <InputCheckbox {...inputCheckbox3Props} />}
              <Frame {...frame3Props}>
                {textTitle3Props !== null && <TextTitle {...textTitle3Props} />}
                {textSubtitle3Props !== null && <TextSubtitle {...textSubtitle3Props} />}
              </Frame>
              {button3Props !== null && (
                <Button {...button3Props}>
                  {icon3Props !== null && <Icon {...icon3Props} />}
                  {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                </Button>
              )}
            </Item>
          )}
        </>
      )}
    </HTMLUl>
  )
}
