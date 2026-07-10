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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ListStandardProps extends HTMLAttributes<HTMLUListElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * List: Standard
 * Level: Part
 * Intent: General-purpose vertical list schema for rendering repeated content items such as posts, links, or summaries.
 * Tags: list, standard, vertical, ui, content, items, generic, repeater
 * Type: Default
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
 *****/
export function ListStandard({
  className = "",
  item = sdn.item,
  inputCheckbox,
  frame = sdn.frame,
  textTitle,
  textSubtitle,
  button = sdn.button,
  icon = sdn.icon,
  textLabel,
  item2 = sdn.item2,
  inputCheckbox2,
  frame2 = sdn.frame2,
  textTitle2,
  textSubtitle2,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  textLabel2,
  item3 = sdn.item3,
  inputCheckbox3,
  frame3 = sdn.frame3,
  textTitle3,
  textSubtitle3,
  button3 = sdn.button3,
  icon3 = sdn.icon3,
  textLabel3,
  children,
  seldonRefs,
  ...props
}: ListStandardProps) {
  const listStandardClassName = combineClassNames(
    "sdn-list-standard",
    className,
  )
  const itemProps = applyRef(
    seldonRefs,
    item === null
      ? null
      : {
          ...sdn.item,
          ...item,
          className: combineClassNames(sdn.item?.className, item?.className),
        },
  )
  const inputCheckboxProps = applyRef(
    seldonRefs,
    inputCheckbox === null
      ? null
      : {
          ...sdn.inputCheckbox,
          ...inputCheckbox,
          className: combineClassNames(
            sdn.inputCheckbox?.className,
            inputCheckbox?.className,
          ),
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
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
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
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )
  const item2Props = applyRef(
    seldonRefs,
    item2 === null
      ? null
      : {
          ...sdn.item2,
          ...item2,
          className: combineClassNames(sdn.item2?.className, item2?.className),
        },
  )
  const inputCheckbox2Props = applyRef(
    seldonRefs,
    inputCheckbox2 === null
      ? null
      : {
          ...sdn.inputCheckbox2,
          ...inputCheckbox2,
          className: combineClassNames(
            sdn.inputCheckbox2?.className,
            inputCheckbox2?.className,
          ),
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
  const button2Props = applyRef(
    seldonRefs,
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
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
  const textLabel2Props = applyRef(
    seldonRefs,
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        },
  )
  const item3Props = applyRef(
    seldonRefs,
    item3 === null
      ? null
      : {
          ...sdn.item3,
          ...item3,
          className: combineClassNames(sdn.item3?.className, item3?.className),
        },
  )
  const inputCheckbox3Props = applyRef(
    seldonRefs,
    inputCheckbox3 === null
      ? null
      : {
          ...sdn.inputCheckbox3,
          ...inputCheckbox3,
          className: combineClassNames(
            sdn.inputCheckbox3?.className,
            inputCheckbox3?.className,
          ),
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
  const button3Props = applyRef(
    seldonRefs,
    button3 === null
      ? null
      : {
          ...sdn.button3,
          ...button3,
          className: combineClassNames(
            sdn.button3?.className,
            button3?.className,
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
  const textLabel3Props = applyRef(
    seldonRefs,
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        },
  )

  return (
    <HTMLUl
      className={listStandardClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {itemProps !== null && (
            <Item {...itemProps}>
              {inputCheckbox && inputCheckboxProps && (
                <InputCheckbox {...inputCheckboxProps} />
              )}
              <Frame {...frameProps}>
                {textTitle && textTitleProps && (
                  <TextTitle {...textTitleProps} />
                )}
                {textSubtitle && textSubtitleProps && (
                  <TextSubtitle {...textSubtitleProps} />
                )}
              </Frame>
              {button && buttonProps && (
                <Button {...buttonProps}>
                  {icon && iconProps && <Icon {...iconProps} />}
                  {textLabel && textLabelProps && (
                    <TextLabel {...textLabelProps} />
                  )}
                </Button>
              )}
            </Item>
          )}
          {item2Props !== null && (
            <Item {...item2Props}>
              {inputCheckbox2 && inputCheckbox2Props && (
                <InputCheckbox {...inputCheckbox2Props} />
              )}
              <Frame {...frame2Props}>
                {textTitle2 && textTitle2Props && (
                  <TextTitle {...textTitle2Props} />
                )}
                {textSubtitle2 && textSubtitle2Props && (
                  <TextSubtitle {...textSubtitle2Props} />
                )}
              </Frame>
              {button2 && button2Props && (
                <Button {...button2Props}>
                  {icon2 && icon2Props && <Icon {...icon2Props} />}
                  {textLabel2 && textLabel2Props && (
                    <TextLabel {...textLabel2Props} />
                  )}
                </Button>
              )}
            </Item>
          )}
          {item3Props !== null && (
            <Item {...item3Props}>
              {inputCheckbox3 && inputCheckbox3Props && (
                <InputCheckbox {...inputCheckbox3Props} />
              )}
              <Frame {...frame3Props}>
                {textTitle3 && textTitle3Props && (
                  <TextTitle {...textTitle3Props} />
                )}
                {textSubtitle3 && textSubtitle3Props && (
                  <TextSubtitle {...textSubtitle3Props} />
                )}
              </Frame>
              {button3 && button3Props && (
                <Button {...button3Props}>
                  {icon3 && icon3Props && <Icon {...icon3Props} />}
                  {textLabel3 && textLabel3Props && (
                    <TextLabel {...textLabel3Props} />
                  )}
                </Button>
              )}
            </Item>
          )}
        </>
      )}
    </HTMLUl>
  )
}

//
// Default property values
//
const sdn: ListStandardProps = {
  "aria-hidden": "false",
  className: "sdn-list-standard",
  item: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--vvmc",
  },
  inputCheckbox: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--adfu",
  },
  textSubtitle: {
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
    className: "sdn-text-label sdn-text-label--ylte",
  },
  item2: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--vvmc",
  },
  inputCheckbox2: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    className: "sdn-text-title sdn-text-title--adfu",
  },
  textSubtitle2: {
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
    className: "sdn-text-label sdn-text-label--ylte",
  },
  item3: {
    "aria-hidden": "false",
    className: "sdn-item sdn-item--7egk",
  },
  inputCheckbox3: {
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    className: "sdn-text-title sdn-text-title--adfu",
  },
  textSubtitle3: {
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
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
