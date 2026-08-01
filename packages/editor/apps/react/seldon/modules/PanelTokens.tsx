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

import { AvatarRounded, AvatarRoundedProps } from "../elements/AvatarRounded"
import { Button, ButtonProps } from "../elements/Button"
import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ChipAssist, ChipAssistProps } from "../elements/ChipAssist"
import { ComboboxFieldProps } from "../elements/ComboboxField"
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { ItemAvatarItem, ItemAvatarItemProps } from "../elements/ItemAvatarItem"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { ImageProps } from "../primitives/Image"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextSubtitle, TextSubtitleProps } from "../primitives/TextSubtitle"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelTokensProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  chipAssist?: ChipAssistProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null

  frame?: FrameProps | null
  frame2?: FrameProps | null
  frame3?: FrameProps | null
  itemAvatarItem?: ItemAvatarItemProps | null
  avatarRounded?: AvatarRoundedProps | null
  image?: ImageProps | null
  frame4?: FrameProps | null
  textTitle?: TextTitleProps | null
  textSubtitle?: TextSubtitleProps | null
  button?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
  formControlCombobox?: FormControlComboboxProps | null
  comboboxField?: ComboboxFieldProps | null
  icon3?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon4?: IconProps | null
}

//
// Default property values
//
const sdn: PanelTokensProps = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--1bvt",
  },
  textLabel: {
    children: "PropertyName",
    className: "sdn-text-label sdn-text-label--299x",
  },
  icon: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ckag",
  },

  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--lad1",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ocgw",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6zsw",
  },
  itemAvatarItem: {
    className: "sdn-item sdn-item-avatar-item--w6ed",
  },
  avatarRounded: {
    "aria-hidden": "false",
    className: "sdn-avatar sdn-avatar-rounded--fb5j",
  },
  image: {
    src: "/avatar-user.png",
    "aria-hidden": "false",
    className: "sdn-image sdn-image--98gd",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle: {
    children: "Full Name",
    className: "sdn-text-title sdn-text-title--noun",
  },
  textSubtitle: {
    children: "Position",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  button: {
    className: "sdn-button sdn-button--ogcw",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ptko",
  },
  textLabel2: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wotu",
  },
  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--rmtv",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--iuzk",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gl7b",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--t0am",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--0aip",
  },
}

/**
 * Panel: PanelTokens
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist               chipAssist
 *     TextLabel              textLabel
 *     Icon                   icon
 *   Frame                    frame
 *     Frame                  frame2
 *       Frame                frame3
 *         ItemAvatarItem     itemAvatarItem
 *           AvatarRounded    avatarRounded
 *             Image          image
 *           Frame            frame4
 *             TextTitle      textTitle
 *             TextSubtitle   textSubtitle
 *           Button           button
 *             Icon           icon2
 *             TextLabel      textLabel2
 *       FormControlCombobox  formControlCombobox
 *         ComboboxField      comboboxField
 *           Icon             icon3
 *           Input            input
 *           ButtonIconic     buttonIconic
 *             Icon           icon4
 *
 * @example
 * ```tsx
 * <PanelTokens
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelTokens({
  className = "",
  chipAssist,
  textLabel,
  icon,

  frame,
  frame2,
  frame3,
  itemAvatarItem,
  avatarRounded,
  image,
  frame4,
  textTitle,
  textSubtitle,
  button,
  icon2,
  textLabel2,
  formControlCombobox,
  comboboxField,
  icon3,
  input,
  buttonIconic,
  icon4,

  children,
  seldonRefs,
  ...props
}: PanelTokensProps) {
  const panelTokensClassName = combineClassNames("sdn-panel-tokens", className)

  const chipAssistProps = mergeOptionalSlot(sdn.chipAssist, chipAssist, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const itemAvatarItemProps = mergeOptionalSlot(sdn.itemAvatarItem, itemAvatarItem, seldonRefs)
  const avatarRoundedProps = mergeSlot(sdn.avatarRounded, avatarRounded, seldonRefs)
  const imageProps = mergeSlot(sdn.image, image, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textSubtitleProps = mergeOptionalSlot(sdn.textSubtitle, textSubtitle, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const formControlComboboxProps = mergeOptionalSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  return (
    <HTMLDiv
      className={panelTokensClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {chipAssistProps !== null && (
            <ChipAssist {...chipAssistProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {iconProps !== null && <Icon {...iconProps} />}
            </ChipAssist>
          )}
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              <Frame {...frame3Props}>
                {itemAvatarItemProps !== null && (
                  <ItemAvatarItem {...itemAvatarItemProps}>
                    {avatarRoundedProps !== null && (
                      <AvatarRounded {...avatarRoundedProps} image={imageProps} />
                    )}
                    <Frame {...frame4Props}>
                      {textTitleProps !== null && <TextTitle {...textTitleProps} />}
                      {textSubtitleProps !== null && <TextSubtitle {...textSubtitleProps} />}
                    </Frame>
                    {buttonProps !== null && (
                      <Button {...buttonProps}>
                        {icon2Props !== null && <Icon {...icon2Props} />}
                        {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                      </Button>
                    )}
                  </ItemAvatarItem>
                )}
              </Frame>
              {formControlComboboxProps !== null && (
                <FormControlCombobox
                  {...formControlComboboxProps}
                  comboboxField={comboboxFieldProps}
                  icon={icon3Props}
                  input={inputProps}
                  buttonIconic={buttonIconicProps}
                  icon2={icon4Props}
                  textLabel={null}
                />
              )}
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
