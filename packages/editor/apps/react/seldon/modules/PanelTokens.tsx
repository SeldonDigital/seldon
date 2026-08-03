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

import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ChipAssist, ChipAssistProps } from "../elements/ChipAssist"
import { ChipToken, ChipTokenProps } from "../elements/ChipToken"
import { ComboboxFieldProps } from "../elements/ComboboxField"
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { TokenCardAlign, TokenCardAlignProps } from "../frames/TokenCardAlign"
import { TokenControls, TokenControlsProps } from "../frames/TokenControls"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelTokensProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  chipAssist?: ChipAssistProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null

  frame?: FrameProps | null
  tokenControls?: TokenControlsProps | null
  formControlCombobox?: FormControlComboboxProps | null
  comboboxField?: ComboboxFieldProps | null
  icon2?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon3?: IconProps | null
  tokenCardAlign?: TokenCardAlignProps | null
  container?: ContainerProps | null
  chipToken?: ChipTokenProps | null
  frame2?: FrameProps | null
  icon4?: IconProps | null
  frame3?: FrameProps | null
  icon5?: IconProps | null
  chipToken2?: ChipTokenProps | null
  frame4?: FrameProps | null
  icon6?: IconProps | null
  frame5?: FrameProps | null
  icon7?: IconProps | null
  chipToken3?: ChipTokenProps | null
  frame6?: FrameProps | null
  icon8?: IconProps | null
  frame7?: FrameProps | null
  icon9?: IconProps | null
  chipToken4?: ChipTokenProps | null
  frame8?: FrameProps | null
  icon10?: IconProps | null
  frame9?: FrameProps | null
  icon11?: IconProps | null
  chipToken5?: ChipTokenProps | null
  frame10?: FrameProps | null
  icon12?: IconProps | null
  frame11?: FrameProps | null
  icon13?: IconProps | null
  chipToken6?: ChipTokenProps | null
  frame12?: FrameProps | null
  icon14?: IconProps | null
  frame13?: FrameProps | null
  icon15?: IconProps | null
  chipToken7?: ChipTokenProps | null
  frame14?: FrameProps | null
  icon16?: IconProps | null
  frame15?: FrameProps | null
  icon17?: IconProps | null
  chipToken8?: ChipTokenProps | null
  frame16?: FrameProps | null
  icon18?: IconProps | null
  frame17?: FrameProps | null
  icon19?: IconProps | null
  chipToken9?: ChipTokenProps | null
  frame18?: FrameProps | null
  icon20?: IconProps | null
  frame19?: FrameProps | null
  icon21?: IconProps | null
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
    children: "TokenName",
    className: "sdn-text-label sdn-text-label--299x",
  },
  icon: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },

  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--zae0",
  },
  tokenControls: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-token-controls sdn-token-controls--jakc",
  },
  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon2: {
    icon: "seldon-positionTopLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iocq",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },
  tokenCardAlign: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-token-card-align sdn-token-card-align--dj2u",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--m4fk",
  },
  chipToken: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pefl",
  },
  icon4: {
    icon: "material-arrowForward",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--duyo",
  },
  icon5: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--7mzg",
  },
  chipToken2: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon6: {
    icon: "material-arrowForward",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--1kqj",
  },
  icon7: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--znda",
  },
  chipToken3: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon8: {
    icon: "material-wrapText",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--aksb",
  },
  icon9: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--laem",
  },
  chipToken4: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon10: {
    icon: "material-arrowForward",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--g9sz",
  },
  icon11: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--cl0c",
  },
  chipToken5: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon12: {
    icon: "material-arrowForward",
    className: "sdn-icon sdn-icon--2nwn",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--smv2",
  },
  icon13: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--znda",
  },
  chipToken6: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon14: {
    icon: "material-wrapText",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--llrf",
  },
  icon15: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--yzhv",
  },
  chipToken7: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame14: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon16: {
    icon: "material-arrowForward",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame15: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--z2od",
  },
  icon17: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--yzhv",
  },
  chipToken8: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame16: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon18: {
    icon: "material-arrowForward",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame17: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--k9li",
  },
  icon19: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--ehuw",
  },
  chipToken9: {
    className: "sdn-chip-token sdn-chip-token--ghik",
  },
  frame18: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rx6b",
  },
  icon20: {
    icon: "material-arrowForward",
    className: "sdn-icon sdn-icon--kkju",
  },
  frame19: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--qnik",
  },
  icon21: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--cl0c",
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
 *     TokenControls          tokenControls
 *       FormControlCombobox  formControlCombobox
 *         ComboboxField      comboboxField
 *           Icon             icon2
 *           Input            input
 *           ButtonIconic     buttonIconic
 *             Icon           icon3
 *     TokenCardAlign         tokenCardAlign
 *       Container            container
 *         ChipToken          chipToken
 *           Frame            frame2
 *             Icon           icon4
 *             Frame          frame3
 *               Icon         icon5
 *         ChipToken          chipToken2
 *           Frame            frame4
 *             Icon           icon6
 *             Frame          frame5
 *               Icon         icon7
 *         ChipToken          chipToken3
 *           Frame            frame6
 *             Icon           icon8
 *             Frame          frame7
 *               Icon         icon9
 *         ChipToken          chipToken4
 *           Frame            frame8
 *             Icon           icon10
 *             Frame          frame9
 *               Icon         icon11
 *         ChipToken          chipToken5
 *           Frame            frame10
 *             Icon           icon12
 *             Frame          frame11
 *               Icon         icon13
 *         ChipToken          chipToken6
 *           Frame            frame12
 *             Icon           icon14
 *             Frame          frame13
 *               Icon         icon15
 *         ChipToken          chipToken7
 *           Frame            frame14
 *             Icon           icon16
 *             Frame          frame15
 *               Icon         icon17
 *         ChipToken          chipToken8
 *           Frame            frame16
 *             Icon           icon18
 *             Frame          frame17
 *               Icon         icon19
 *         ChipToken          chipToken9
 *           Frame            frame18
 *             Icon           icon20
 *             Frame          frame19
 *               Icon         icon21
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
  tokenControls,
  formControlCombobox,
  comboboxField,
  icon2,
  input,
  buttonIconic,
  icon3,
  tokenCardAlign,
  container,
  chipToken,
  frame2,
  icon4,
  frame3,
  icon5,
  chipToken2,
  frame4,
  icon6,
  frame5,
  icon7,
  chipToken3,
  frame6,
  icon8,
  frame7,
  icon9,
  chipToken4,
  frame8,
  icon10,
  frame9,
  icon11,
  chipToken5,
  frame10,
  icon12,
  frame11,
  icon13,
  chipToken6,
  frame12,
  icon14,
  frame13,
  icon15,
  chipToken7,
  frame14,
  icon16,
  frame15,
  icon17,
  chipToken8,
  frame16,
  icon18,
  frame17,
  icon19,
  chipToken9,
  frame18,
  icon20,
  frame19,
  icon21,

  children,
  seldonRefs,
  ...props
}: PanelTokensProps) {
  const panelTokensClassName = combineClassNames("sdn-panel-tokens", className)

  const chipAssistProps = mergeOptionalSlot(sdn.chipAssist, chipAssist, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const tokenControlsProps = mergeSlot(sdn.tokenControls, tokenControls, seldonRefs)
  const formControlComboboxProps = mergeOptionalSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const tokenCardAlignProps = mergeSlot(sdn.tokenCardAlign, tokenCardAlign, seldonRefs)
  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const chipTokenProps = mergeOptionalSlot(sdn.chipToken, chipToken, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const icon4Props = mergeOptionalSlot(sdn.icon4, icon4, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const icon5Props = mergeOptionalSlot(sdn.icon5, icon5, seldonRefs)
  const chipToken2Props = mergeOptionalSlot(sdn.chipToken2, chipToken2, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const icon6Props = mergeOptionalSlot(sdn.icon6, icon6, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const icon7Props = mergeOptionalSlot(sdn.icon7, icon7, seldonRefs)
  const chipToken3Props = mergeOptionalSlot(sdn.chipToken3, chipToken3, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const icon8Props = mergeOptionalSlot(sdn.icon8, icon8, seldonRefs)
  const frame7Props = mergeSlot(sdn.frame7, frame7, seldonRefs)
  const icon9Props = mergeOptionalSlot(sdn.icon9, icon9, seldonRefs)
  const chipToken4Props = mergeOptionalSlot(sdn.chipToken4, chipToken4, seldonRefs)
  const frame8Props = mergeSlot(sdn.frame8, frame8, seldonRefs)
  const icon10Props = mergeOptionalSlot(sdn.icon10, icon10, seldonRefs)
  const frame9Props = mergeSlot(sdn.frame9, frame9, seldonRefs)
  const icon11Props = mergeOptionalSlot(sdn.icon11, icon11, seldonRefs)
  const chipToken5Props = mergeOptionalSlot(sdn.chipToken5, chipToken5, seldonRefs)
  const frame10Props = mergeSlot(sdn.frame10, frame10, seldonRefs)
  const icon12Props = mergeOptionalSlot(sdn.icon12, icon12, seldonRefs)
  const frame11Props = mergeSlot(sdn.frame11, frame11, seldonRefs)
  const icon13Props = mergeOptionalSlot(sdn.icon13, icon13, seldonRefs)
  const chipToken6Props = mergeOptionalSlot(sdn.chipToken6, chipToken6, seldonRefs)
  const frame12Props = mergeSlot(sdn.frame12, frame12, seldonRefs)
  const icon14Props = mergeOptionalSlot(sdn.icon14, icon14, seldonRefs)
  const frame13Props = mergeSlot(sdn.frame13, frame13, seldonRefs)
  const icon15Props = mergeOptionalSlot(sdn.icon15, icon15, seldonRefs)
  const chipToken7Props = mergeOptionalSlot(sdn.chipToken7, chipToken7, seldonRefs)
  const frame14Props = mergeSlot(sdn.frame14, frame14, seldonRefs)
  const icon16Props = mergeOptionalSlot(sdn.icon16, icon16, seldonRefs)
  const frame15Props = mergeSlot(sdn.frame15, frame15, seldonRefs)
  const icon17Props = mergeOptionalSlot(sdn.icon17, icon17, seldonRefs)
  const chipToken8Props = mergeOptionalSlot(sdn.chipToken8, chipToken8, seldonRefs)
  const frame16Props = mergeSlot(sdn.frame16, frame16, seldonRefs)
  const icon18Props = mergeOptionalSlot(sdn.icon18, icon18, seldonRefs)
  const frame17Props = mergeSlot(sdn.frame17, frame17, seldonRefs)
  const icon19Props = mergeOptionalSlot(sdn.icon19, icon19, seldonRefs)
  const chipToken9Props = mergeOptionalSlot(sdn.chipToken9, chipToken9, seldonRefs)
  const frame18Props = mergeSlot(sdn.frame18, frame18, seldonRefs)
  const icon20Props = mergeOptionalSlot(sdn.icon20, icon20, seldonRefs)
  const frame19Props = mergeSlot(sdn.frame19, frame19, seldonRefs)
  const icon21Props = mergeOptionalSlot(sdn.icon21, icon21, seldonRefs)

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
            <Frame {...tokenControlsProps}>
              {formControlComboboxProps !== null && (
                <FormControlCombobox
                  {...formControlComboboxProps}
                  comboboxField={comboboxFieldProps}
                  icon={icon2Props}
                  input={inputProps}
                  buttonIconic={buttonIconicProps}
                  icon2={icon3Props}
                  textLabel={null}
                />
              )}
            </Frame>
            <Frame {...tokenCardAlignProps}>
              <Frame {...containerProps}>
                {chipTokenProps !== null && (
                  <ChipToken {...chipTokenProps}>
                    <Frame {...frame2Props}>
                      {icon4Props !== null && <Icon {...icon4Props} />}
                      <Frame {...frame3Props}>
                        {icon5Props !== null && <Icon {...icon5Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken2Props !== null && (
                  <ChipToken {...chipToken2Props}>
                    <Frame {...frame4Props}>
                      {icon6Props !== null && <Icon {...icon6Props} />}
                      <Frame {...frame5Props}>
                        {icon7Props !== null && <Icon {...icon7Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken3Props !== null && (
                  <ChipToken {...chipToken3Props}>
                    <Frame {...frame6Props}>
                      {icon8Props !== null && <Icon {...icon8Props} />}
                      <Frame {...frame7Props}>
                        {icon9Props !== null && <Icon {...icon9Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken4Props !== null && (
                  <ChipToken {...chipToken4Props}>
                    <Frame {...frame8Props}>
                      {icon10Props !== null && <Icon {...icon10Props} />}
                      <Frame {...frame9Props}>
                        {icon11Props !== null && <Icon {...icon11Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken5Props !== null && (
                  <ChipToken {...chipToken5Props}>
                    <Frame {...frame10Props}>
                      {icon12Props !== null && <Icon {...icon12Props} />}
                      <Frame {...frame11Props}>
                        {icon13Props !== null && <Icon {...icon13Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken6Props !== null && (
                  <ChipToken {...chipToken6Props}>
                    <Frame {...frame12Props}>
                      {icon14Props !== null && <Icon {...icon14Props} />}
                      <Frame {...frame13Props}>
                        {icon15Props !== null && <Icon {...icon15Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken7Props !== null && (
                  <ChipToken {...chipToken7Props}>
                    <Frame {...frame14Props}>
                      {icon16Props !== null && <Icon {...icon16Props} />}
                      <Frame {...frame15Props}>
                        {icon17Props !== null && <Icon {...icon17Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken8Props !== null && (
                  <ChipToken {...chipToken8Props}>
                    <Frame {...frame16Props}>
                      {icon18Props !== null && <Icon {...icon18Props} />}
                      <Frame {...frame17Props}>
                        {icon19Props !== null && <Icon {...icon19Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
                {chipToken9Props !== null && (
                  <ChipToken {...chipToken9Props}>
                    <Frame {...frame18Props}>
                      {icon20Props !== null && <Icon {...icon20Props} />}
                      <Frame {...frame19Props}>
                        {icon21Props !== null && <Icon {...icon21Props} />}
                      </Frame>
                    </Frame>
                  </ChipToken>
                )}
              </Frame>
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
