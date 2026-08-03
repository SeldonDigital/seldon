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

import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import { Chip, ChipProps } from "../elements/Chip"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { BarHariModels, BarHariModelsProps } from "../parts/BarHariModels"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { Textarea, TextareaProps } from "../primitives/Textarea"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelHariProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null

  frame2?: FrameProps | null

  frame3?: FrameProps | null
  barHariModels?: BarHariModelsProps | null
  textarea?: TextareaProps | null
  frame4?: FrameProps | null
  frame5?: FrameProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon3?: IconProps | null
  buttonMenu2?: ButtonMenuProps | null
  textLabel2?: TextLabelProps | null
  icon4?: IconProps | null
  chip?: ChipProps | null
  textLabel3?: TextLabelProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon5?: IconProps | null
}

//
// Default property values
//
const sdn: PanelHariProps = {
  role: "dialog",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
  },
  icon: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jv04",
    "data-seldon-ref": "hariTurns",
  },

  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
  },
  barHariModels: {
    className: "sdn-bar-hari-models sdn-bar-state--mlcq",
  },
  textarea: {
    placeholder: "What do want to do...",
    className: "sdn-textarea sdn-textarea--tyvc",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--o0l9",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ygx6",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
  },
  textLabel: {
    children: "Model Menu",
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
  },
  textLabel2: {
    children: "Thinking Level",
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon4: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  chip: {
    className: "sdn-chip sdn-chip--dzlq",
  },
  textLabel3: {
    children: "Scope",
    className: "sdn-text-label sdn-text-label--ngh4",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--gbhl",
  },
  icon5: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
}

/**
 * Panel: PanelHari
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Frame                frame
 *     ButtonIconic       buttonIconic
 *       Icon             icon
 *     ButtonIconic       buttonIconic2
 *       Icon             icon2
 *   Frame                frame2         -> hariTurns
 *   Frame                frame3
 *     BarHariModels      barHariModels
 *       Textarea         textarea
 *       Frame            frame4
 *         Frame          frame5
 *           ButtonMenu   buttonMenu
 *             TextLabel  textLabel
 *             Icon       icon3
 *           ButtonMenu   buttonMenu2
 *             TextLabel  textLabel2
 *             Icon       icon4
 *         Chip           chip
 *           TextLabel    textLabel3
 *         ButtonIconic   buttonIconic3
 *           Icon         icon5
 *
 * @example
 * ```tsx
 * <PanelHari
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelHari({
  className = "",
  frame,
  buttonIconic,
  icon,
  buttonIconic2,
  icon2,

  frame2,

  frame3,
  barHariModels,
  textarea,
  frame4,
  frame5,
  buttonMenu,
  textLabel,
  icon3,
  buttonMenu2,
  textLabel2,
  icon4,
  chip,
  textLabel3,
  buttonIconic3,
  icon5,

  children,
  seldonRefs,
  ...props
}: PanelHariProps) {
  const panelHariClassName = combineClassNames("sdn-panel-palette", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const barHariModelsProps = mergeOptionalSlot(sdn.barHariModels, barHariModels, seldonRefs)
  const textareaProps = mergeOptionalSlot(sdn.textarea, textarea, seldonRefs)
  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const buttonMenuProps = mergeOptionalSlot(sdn.buttonMenu, buttonMenu, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const buttonMenu2Props = mergeOptionalSlot(sdn.buttonMenu2, buttonMenu2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const buttonIconic3Props = mergeOptionalSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)

  return (
    <HTMLDiv
      className={panelHariClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {buttonIconic2Props !== null && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
          </Frame>
          <Frame {...frame2Props}></Frame>
          <Frame {...frame3Props}>
            {barHariModelsProps !== null && (
              <BarHariModels {...barHariModelsProps}>
                {textareaProps !== null && <Textarea {...textareaProps} />}
                <Frame {...frame4Props}>
                  <Frame {...frame5Props}>
                    {buttonMenuProps !== null && (
                      <ButtonMenu {...buttonMenuProps}>
                        {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                        {icon3Props !== null && <Icon {...icon3Props} />}
                      </ButtonMenu>
                    )}
                    {buttonMenu2Props !== null && (
                      <ButtonMenu {...buttonMenu2Props}>
                        {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                        {icon4Props !== null && <Icon {...icon4Props} />}
                      </ButtonMenu>
                    )}
                  </Frame>
                  {chipProps !== null && (
                    <Chip {...chipProps}>
                      {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                    </Chip>
                  )}
                  {buttonIconic3Props !== null && (
                    <ButtonIconic {...buttonIconic3Props} icon={icon5Props} />
                  )}
                </Frame>
              </BarHariModels>
            )}
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
