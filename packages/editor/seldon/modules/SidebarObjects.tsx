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
import { ComboboxField, ComboboxFieldProps } from "../elements/ComboboxField"
import {
  ComboboxFieldProjectField,
  ComboboxFieldProjectFieldProps,
} from "../elements/ComboboxFieldProjectField"
import {
  FormControlComboboxControl,
  FormControlComboboxControlProps,
} from "../elements/FormControlComboboxControl"
import { ItemNode, ItemNodeProps } from "../elements/ItemNode"
import { ItemSection, ItemSectionProps } from "../elements/ItemSection"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SidebarObjectsProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  comboboxFieldProjectField?: ComboboxFieldProjectFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
  frame?: FrameProps | null
  itemSection?: ItemSectionProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null
  formControlComboboxControl?: FormControlComboboxControlProps | null
  textLabel?: TextLabelProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon4?: IconProps | null
  buttonIconic4?: ButtonIconicProps | null
  icon5?: IconProps | null
  itemNode?: ItemNodeProps | null
  buttonIconic5?: ButtonIconicProps | null
  icon6?: IconProps | null
  comboboxField?: ComboboxFieldProps | null
  icon7?: IconProps | null
  input2?: InputProps | null
  buttonIconic6?: ButtonIconicProps | null
  icon8?: IconProps | null
  itemSection2?: ItemSectionProps | null
  buttonIconic7?: ButtonIconicProps | null
  icon9?: IconProps | null
  formControlComboboxControl2?: FormControlComboboxControlProps | null
  textLabel2?: TextLabelProps | null
  buttonIconic8?: ButtonIconicProps | null
  icon10?: IconProps | null
  buttonIconic9?: ButtonIconicProps | null
  icon11?: IconProps | null
  itemNode2?: ItemNodeProps | null
  buttonIconic10?: ButtonIconicProps | null
  icon12?: IconProps | null
  comboboxField2?: ComboboxFieldProps | null
  icon13?: IconProps | null
  input3?: InputProps | null
  buttonIconic11?: ButtonIconicProps | null
  icon14?: IconProps | null
}

/*****
 * Sidebar: SidebarObjects
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <SidebarObjects
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function SidebarObjects({
  className = "",
  comboboxFieldProjectField,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  frame = sdn.frame,
  itemSection,
  buttonIconic2,
  icon3 = sdn.icon3,
  formControlComboboxControl,
  textLabel,
  buttonIconic3,
  icon4 = sdn.icon4,
  buttonIconic4,
  icon5 = sdn.icon5,
  itemNode,
  buttonIconic5,
  icon6 = sdn.icon6,
  comboboxField,
  icon7 = sdn.icon7,
  input2 = sdn.input2,
  buttonIconic6 = sdn.buttonIconic6,
  icon8 = sdn.icon8,
  itemSection2,
  buttonIconic7,
  icon9 = sdn.icon9,
  formControlComboboxControl2,
  textLabel2,
  buttonIconic8,
  icon10 = sdn.icon10,
  buttonIconic9,
  icon11 = sdn.icon11,
  itemNode2,
  buttonIconic10,
  icon12 = sdn.icon12,
  comboboxField2,
  icon13 = sdn.icon13,
  input3 = sdn.input3,
  buttonIconic11 = sdn.buttonIconic11,
  icon14 = sdn.icon14,
  children,
  seldonRefs,
  ...props
}: SidebarObjectsProps) {
  const sidebarObjectsClassName = combineClassNames(
    "sdn-sidebar-objects",
    className,
  )
  const comboboxFieldProjectFieldProps = applyRef(
    seldonRefs,
    comboboxFieldProjectField === null
      ? null
      : {
          ...sdn.comboboxFieldProjectField,
          ...comboboxFieldProjectField,
          className: combineClassNames(
            sdn.comboboxFieldProjectField?.className,
            comboboxFieldProjectField?.className,
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
  const inputProps = applyRef(
    seldonRefs,
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
        },
  )
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
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
  const itemSectionProps = applyRef(
    seldonRefs,
    itemSection === null
      ? null
      : {
          ...sdn.itemSection,
          ...itemSection,
          className: combineClassNames(
            sdn.itemSection?.className,
            itemSection?.className,
          ),
        },
  )
  const buttonIconic2Props = applyRef(
    seldonRefs,
    buttonIconic2 === null
      ? null
      : {
          ...sdn.buttonIconic2,
          ...buttonIconic2,
          className: combineClassNames(
            sdn.buttonIconic2?.className,
            buttonIconic2?.className,
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
  const formControlComboboxControlProps = applyRef(
    seldonRefs,
    formControlComboboxControl === null
      ? null
      : {
          ...sdn.formControlComboboxControl,
          ...formControlComboboxControl,
          className: combineClassNames(
            sdn.formControlComboboxControl?.className,
            formControlComboboxControl?.className,
          ),
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
  const buttonIconic3Props = applyRef(
    seldonRefs,
    buttonIconic3 === null
      ? null
      : {
          ...sdn.buttonIconic3,
          ...buttonIconic3,
          className: combineClassNames(
            sdn.buttonIconic3?.className,
            buttonIconic3?.className,
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
  const buttonIconic4Props = applyRef(
    seldonRefs,
    buttonIconic4 === null
      ? null
      : {
          ...sdn.buttonIconic4,
          ...buttonIconic4,
          className: combineClassNames(
            sdn.buttonIconic4?.className,
            buttonIconic4?.className,
          ),
        },
  )
  const icon5Props = applyRef(
    seldonRefs,
    icon5 === null
      ? null
      : {
          ...sdn.icon5,
          ...icon5,
          className: combineClassNames(sdn.icon5?.className, icon5?.className),
        },
  )
  const itemNodeProps = applyRef(
    seldonRefs,
    itemNode === null
      ? null
      : {
          ...sdn.itemNode,
          ...itemNode,
          className: combineClassNames(
            sdn.itemNode?.className,
            itemNode?.className,
          ),
        },
  )
  const buttonIconic5Props = applyRef(
    seldonRefs,
    buttonIconic5 === null
      ? null
      : {
          ...sdn.buttonIconic5,
          ...buttonIconic5,
          className: combineClassNames(
            sdn.buttonIconic5?.className,
            buttonIconic5?.className,
          ),
        },
  )
  const icon6Props = applyRef(
    seldonRefs,
    icon6 === null
      ? null
      : {
          ...sdn.icon6,
          ...icon6,
          className: combineClassNames(sdn.icon6?.className, icon6?.className),
        },
  )
  const comboboxFieldProps = applyRef(
    seldonRefs,
    comboboxField === null
      ? null
      : {
          ...sdn.comboboxField,
          ...comboboxField,
          className: combineClassNames(
            sdn.comboboxField?.className,
            comboboxField?.className,
          ),
        },
  )
  const icon7Props = applyRef(
    seldonRefs,
    icon7 === null
      ? null
      : {
          ...sdn.icon7,
          ...icon7,
          className: combineClassNames(sdn.icon7?.className, icon7?.className),
        },
  )
  const input2Props = applyRef(
    seldonRefs,
    input2 === null
      ? null
      : {
          ...sdn.input2,
          ...input2,
          className: combineClassNames(
            sdn.input2?.className,
            input2?.className,
          ),
        },
  )
  const buttonIconic6Props = applyRef(
    seldonRefs,
    buttonIconic6 === null
      ? null
      : {
          ...sdn.buttonIconic6,
          ...buttonIconic6,
          className: combineClassNames(
            sdn.buttonIconic6?.className,
            buttonIconic6?.className,
          ),
        },
  )
  const icon8Props = applyRef(
    seldonRefs,
    icon8 === null
      ? null
      : {
          ...sdn.icon8,
          ...icon8,
          className: combineClassNames(sdn.icon8?.className, icon8?.className),
        },
  )
  const itemSection2Props = applyRef(
    seldonRefs,
    itemSection2 === null
      ? null
      : {
          ...sdn.itemSection2,
          ...itemSection2,
          className: combineClassNames(
            sdn.itemSection2?.className,
            itemSection2?.className,
          ),
        },
  )
  const buttonIconic7Props = applyRef(
    seldonRefs,
    buttonIconic7 === null
      ? null
      : {
          ...sdn.buttonIconic7,
          ...buttonIconic7,
          className: combineClassNames(
            sdn.buttonIconic7?.className,
            buttonIconic7?.className,
          ),
        },
  )
  const icon9Props = applyRef(
    seldonRefs,
    icon9 === null
      ? null
      : {
          ...sdn.icon9,
          ...icon9,
          className: combineClassNames(sdn.icon9?.className, icon9?.className),
        },
  )
  const formControlComboboxControl2Props = applyRef(
    seldonRefs,
    formControlComboboxControl2 === null
      ? null
      : {
          ...sdn.formControlComboboxControl2,
          ...formControlComboboxControl2,
          className: combineClassNames(
            sdn.formControlComboboxControl2?.className,
            formControlComboboxControl2?.className,
          ),
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
  const buttonIconic8Props = applyRef(
    seldonRefs,
    buttonIconic8 === null
      ? null
      : {
          ...sdn.buttonIconic8,
          ...buttonIconic8,
          className: combineClassNames(
            sdn.buttonIconic8?.className,
            buttonIconic8?.className,
          ),
        },
  )
  const icon10Props = applyRef(
    seldonRefs,
    icon10 === null
      ? null
      : {
          ...sdn.icon10,
          ...icon10,
          className: combineClassNames(
            sdn.icon10?.className,
            icon10?.className,
          ),
        },
  )
  const buttonIconic9Props = applyRef(
    seldonRefs,
    buttonIconic9 === null
      ? null
      : {
          ...sdn.buttonIconic9,
          ...buttonIconic9,
          className: combineClassNames(
            sdn.buttonIconic9?.className,
            buttonIconic9?.className,
          ),
        },
  )
  const icon11Props = applyRef(
    seldonRefs,
    icon11 === null
      ? null
      : {
          ...sdn.icon11,
          ...icon11,
          className: combineClassNames(
            sdn.icon11?.className,
            icon11?.className,
          ),
        },
  )
  const itemNode2Props = applyRef(
    seldonRefs,
    itemNode2 === null
      ? null
      : {
          ...sdn.itemNode2,
          ...itemNode2,
          className: combineClassNames(
            sdn.itemNode2?.className,
            itemNode2?.className,
          ),
        },
  )
  const buttonIconic10Props = applyRef(
    seldonRefs,
    buttonIconic10 === null
      ? null
      : {
          ...sdn.buttonIconic10,
          ...buttonIconic10,
          className: combineClassNames(
            sdn.buttonIconic10?.className,
            buttonIconic10?.className,
          ),
        },
  )
  const icon12Props = applyRef(
    seldonRefs,
    icon12 === null
      ? null
      : {
          ...sdn.icon12,
          ...icon12,
          className: combineClassNames(
            sdn.icon12?.className,
            icon12?.className,
          ),
        },
  )
  const comboboxField2Props = applyRef(
    seldonRefs,
    comboboxField2 === null
      ? null
      : {
          ...sdn.comboboxField2,
          ...comboboxField2,
          className: combineClassNames(
            sdn.comboboxField2?.className,
            comboboxField2?.className,
          ),
        },
  )
  const icon13Props = applyRef(
    seldonRefs,
    icon13 === null
      ? null
      : {
          ...sdn.icon13,
          ...icon13,
          className: combineClassNames(
            sdn.icon13?.className,
            icon13?.className,
          ),
        },
  )
  const input3Props = applyRef(
    seldonRefs,
    input3 === null
      ? null
      : {
          ...sdn.input3,
          ...input3,
          className: combineClassNames(
            sdn.input3?.className,
            input3?.className,
          ),
        },
  )
  const buttonIconic11Props = applyRef(
    seldonRefs,
    buttonIconic11 === null
      ? null
      : {
          ...sdn.buttonIconic11,
          ...buttonIconic11,
          className: combineClassNames(
            sdn.buttonIconic11?.className,
            buttonIconic11?.className,
          ),
        },
  )
  const icon14Props = applyRef(
    seldonRefs,
    icon14 === null
      ? null
      : {
          ...sdn.icon14,
          ...icon14,
          className: combineClassNames(
            sdn.icon14?.className,
            icon14?.className,
          ),
        },
  )

  return (
    <HTMLDiv
      className={sidebarObjectsClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {comboboxFieldProjectField && comboboxFieldProjectFieldProps && (
            <ComboboxFieldProjectField
              {...comboboxFieldProjectFieldProps}
              icon={iconProps}
              input={inputProps}
              buttonIconic={buttonIconicProps}
              icon2={icon2Props}
            />
          )}
          <Frame {...frameProps}>
            {itemSection && itemSectionProps && (
              <ItemSection {...itemSectionProps}>
                {buttonIconic2 && buttonIconic2Props && (
                  <ButtonIconic {...buttonIconic2Props} icon={icon3Props} />
                )}
                {formControlComboboxControl &&
                  formControlComboboxControlProps && (
                    <FormControlComboboxControl
                      {...formControlComboboxControlProps}
                    >
                      {textLabel && textLabelProps && (
                        <TextLabel {...textLabelProps} />
                      )}
                    </FormControlComboboxControl>
                  )}
                {buttonIconic3 && buttonIconic3Props && (
                  <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
                )}
                {buttonIconic4 && buttonIconic4Props && (
                  <ButtonIconic {...buttonIconic4Props} icon={icon5Props} />
                )}
              </ItemSection>
            )}
            {itemNode && itemNodeProps && (
              <ItemNode {...itemNodeProps}>
                {buttonIconic5 && buttonIconic5Props && (
                  <ButtonIconic {...buttonIconic5Props} icon={icon6Props} />
                )}
                {comboboxField && comboboxFieldProps && (
                  <ComboboxField
                    {...comboboxFieldProps}
                    icon={icon7Props}
                    input={input2Props}
                    buttonIconic={buttonIconic6Props}
                    icon2={icon8Props}
                  />
                )}
              </ItemNode>
            )}
            {itemSection2 && itemSection2Props && (
              <ItemSection {...itemSection2Props}>
                {buttonIconic7 && buttonIconic7Props && (
                  <ButtonIconic {...buttonIconic7Props} icon={icon9Props} />
                )}
                {formControlComboboxControl2 &&
                  formControlComboboxControl2Props && (
                    <FormControlComboboxControl
                      {...formControlComboboxControl2Props}
                    >
                      {textLabel2 && textLabel2Props && (
                        <TextLabel {...textLabel2Props} />
                      )}
                    </FormControlComboboxControl>
                  )}
                {buttonIconic8 && buttonIconic8Props && (
                  <ButtonIconic {...buttonIconic8Props} icon={icon10Props} />
                )}
                {buttonIconic9 && buttonIconic9Props && (
                  <ButtonIconic {...buttonIconic9Props} icon={icon11Props} />
                )}
              </ItemSection>
            )}
            {itemNode2 && itemNode2Props && (
              <ItemNode {...itemNode2Props}>
                {buttonIconic10 && buttonIconic10Props && (
                  <ButtonIconic {...buttonIconic10Props} icon={icon12Props} />
                )}
                {comboboxField2 && comboboxField2Props && (
                  <ComboboxField
                    {...comboboxField2Props}
                    icon={icon13Props}
                    input={input3Props}
                    buttonIconic={buttonIconic11Props}
                    icon2={icon14Props}
                  />
                )}
              </ItemNode>
            )}
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: SidebarObjectsProps = {
  role: "complementary",
  "aria-hidden": "false",
  className: "sdn-sidebar-objects sdn-sidebar",
  comboboxFieldProjectField: {
    className:
      "sdn-combobox-field-filter-field sdn-combobox-field-project-field--rzdy",
  },
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--enpy",
    "data-seldon-ref": "objectsContainer",
  },
  itemSection: {
    className: "sdn-item-section sdn-item-section--ymri",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "material-unfoldMore",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControlComboboxControl: {
    className: "sdn-form-control sdn-form-control-combobox-control--qmop",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--z34z",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
  },
  icon4: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic4: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon5: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  itemNode: {
    className: "sdn-item-node sdn-item-section--ymri",
  },
  buttonIconic5: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon6: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  comboboxField: {
    className: "sdn-combobox-field sdn-combobox-field--lmje",
  },
  icon7: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input2: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--pzcf",
  },
  buttonIconic6: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon8: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  itemSection2: {
    className: "sdn-item-section sdn-item-section--ymri",
  },
  buttonIconic7: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon9: {
    icon: "material-unfoldMore",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControlComboboxControl2: {
    className: "sdn-form-control sdn-form-control-combobox-control--qmop",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--z34z",
  },
  buttonIconic8: {
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
  },
  icon10: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic9: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon11: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  itemNode2: {
    className: "sdn-item-node sdn-item-section--ymri",
  },
  buttonIconic10: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon12: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  comboboxField2: {
    className: "sdn-combobox-field sdn-combobox-field--lmje",
  },
  icon13: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input3: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--pzcf",
  },
  buttonIconic11: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon14: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}
