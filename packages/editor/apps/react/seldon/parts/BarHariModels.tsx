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
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { Textarea, TextareaProps } from "../primitives/Textarea"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface BarHariModelsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textarea?: TextareaProps | null

  frame?: FrameProps | null
  frame2?: FrameProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null
  buttonMenu2?: ButtonMenuProps | null
  textLabel2?: TextLabelProps | null
  icon2?: IconProps | null
  chip?: ChipProps | null
  textLabel3?: TextLabelProps | null
  buttonIconic?: ButtonIconicProps | null
  icon3?: IconProps | null
}

//
// Default property values
//
const sdn: BarHariModelsProps = {
  "aria-hidden": "false",
  textarea: {
    placeholder: "What do want to do...",
    className: "sdn-textarea sdn-textarea--tyvc",
    "data-seldon-ref": "hariInput",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--o0l9",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ygx6",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariModel",
  },
  textLabel: {
    children: "Model Menu",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "hariModelLabel",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariThinking",
  },
  textLabel2: {
    children: "Thinking Level",
    className: "sdn-text-label sdn-text-label--sa6t",
    "data-seldon-ref": "hariThinkingLabel",
  },
  icon2: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  chip: {
    className: "sdn-chip sdn-chip--dzlq",
    "data-seldon-ref": "hariSelection",
  },
  textLabel3: {
    children: "Scope",
    className: "sdn-text-label sdn-text-label--ngh4",
    "data-seldon-ref": "hariSelectionLabel",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--gbhl",
    "data-seldon-ref": "hariSend",
  },
  icon3: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
    "data-seldon-ref": "hariSendIcon",
  },
}

/**
 * Bar: BarHariModels
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * Structure:
 *   Textarea         textarea      -> hariInput
 *   Frame            frame
 *     Frame          frame2
 *       ButtonMenu   buttonMenu    -> hariModel
 *         TextLabel  textLabel     -> hariModelLabel
 *         Icon       icon
 *       ButtonMenu   buttonMenu2   -> hariThinking
 *         TextLabel  textLabel2    -> hariThinkingLabel
 *         Icon       icon2
 *     Chip           chip          -> hariSelection
 *       TextLabel    textLabel3    -> hariSelectionLabel
 *     ButtonIconic   buttonIconic  -> hariSend
 *       Icon         icon3         -> hariSendIcon
 *
 * @example
 * ```tsx
 * <BarHariModels
 *   aria-hidden="false"
 *   textarea="{}"
 *   frame="{}"
 *   buttonMenu={() => {}}
 *   textLabel="{}"
 *   icon="material-star"
 *   buttonMenu2={() => {}}
 *   chip="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 */
export function BarHariModels({
  className = "",
  textarea,

  frame,
  frame2,
  buttonMenu,
  textLabel,
  icon,
  buttonMenu2,
  textLabel2,
  icon2,
  chip,
  textLabel3,
  buttonIconic,
  icon3,

  children,
  seldonRefs,
  ...props
}: BarHariModelsProps) {
  const barHariModelsClassName = combineClassNames("sdn-bar-hari-models", className)

  const textareaProps = mergeOptionalSlot(sdn.textarea, textarea, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonMenuProps = mergeOptionalSlot(sdn.buttonMenu, buttonMenu, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonMenu2Props = mergeOptionalSlot(sdn.buttonMenu2, buttonMenu2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  return (
    <Frame className={barHariModelsClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textareaProps !== null && <Textarea {...textareaProps} />}
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              {buttonMenuProps !== null && (
                <ButtonMenu {...buttonMenuProps}>
                  {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                  {iconProps !== null && <Icon {...iconProps} />}
                </ButtonMenu>
              )}
              {buttonMenu2Props !== null && (
                <ButtonMenu {...buttonMenu2Props}>
                  {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                  {icon2Props !== null && <Icon {...icon2Props} />}
                </ButtonMenu>
              )}
            </Frame>
            {chipProps !== null && (
              <Chip {...chipProps}>
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              </Chip>
            )}
            {buttonIconicProps !== null && (
              <ButtonIconic {...buttonIconicProps} icon={icon3Props} />
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
