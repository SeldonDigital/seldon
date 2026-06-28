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
import { ComboboxFieldProps } from "../elements/ComboboxField"
import {
  ComboboxFieldFilterField,
  ComboboxFieldFilterFieldProps,
} from "../elements/ComboboxFieldFilterField"
import {
  FormControlComboboxControl,
  FormControlComboboxControlProps,
} from "../elements/FormControlComboboxControl"
import { ItemProperty, ItemPropertyProps } from "../elements/ItemProperty"
import { ItemSection, ItemSectionProps } from "../elements/ItemSection"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SidebarPropertiesProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  comboboxFieldFilterField?: ComboboxFieldFilterFieldProps | null
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
  itemProperty?: ItemPropertyProps | null
  buttonIconic5?: ButtonIconicProps | null
  icon6?: IconProps | null
  formControlComboboxControl2?: FormControlComboboxControlProps | null
  textLabel2?: TextLabelProps | null
  comboboxField?: ComboboxFieldProps | null
  icon7?: IconProps | null
  input2?: InputProps | null
  buttonIconic6?: ButtonIconicProps | null
  icon8?: IconProps | null
  buttonIconic7?: ButtonIconicProps | null
  icon9?: IconProps | null
  itemSection2?: ItemSectionProps | null
  buttonIconic8?: ButtonIconicProps | null
  icon10?: IconProps | null
  formControlComboboxControl3?: FormControlComboboxControlProps | null
  textLabel3?: TextLabelProps | null
  buttonIconic9?: ButtonIconicProps | null
  icon11?: IconProps | null
  buttonIconic10?: ButtonIconicProps | null
  icon12?: IconProps | null
  itemProperty2?: ItemPropertyProps | null
  buttonIconic11?: ButtonIconicProps | null
  icon13?: IconProps | null
  formControlComboboxControl4?: FormControlComboboxControlProps | null
  textLabel4?: TextLabelProps | null
  comboboxField2?: ComboboxFieldProps | null
  icon14?: IconProps | null
  input3?: InputProps | null
  buttonIconic12?: ButtonIconicProps | null
  icon15?: IconProps | null
  buttonIconic13?: ButtonIconicProps | null
  icon16?: IconProps | null
}

/*****
 * Sidebar: SidebarProperties
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <SidebarProperties
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function SidebarProperties({
  className = "",
  comboboxFieldFilterField,
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
  itemProperty,
  buttonIconic5 = sdn.buttonIconic5,
  icon6 = sdn.icon6,
  formControlComboboxControl2 = sdn.formControlComboboxControl2,
  textLabel2,
  comboboxField = sdn.comboboxField,
  icon7 = sdn.icon7,
  input2 = sdn.input2,
  buttonIconic6 = sdn.buttonIconic6,
  icon8 = sdn.icon8,
  buttonIconic7 = sdn.buttonIconic7,
  icon9 = sdn.icon9,
  itemSection2,
  buttonIconic8,
  icon10 = sdn.icon10,
  formControlComboboxControl3,
  textLabel3,
  buttonIconic9,
  icon11 = sdn.icon11,
  buttonIconic10,
  icon12 = sdn.icon12,
  itemProperty2,
  buttonIconic11 = sdn.buttonIconic11,
  icon13 = sdn.icon13,
  formControlComboboxControl4 = sdn.formControlComboboxControl4,
  textLabel4,
  comboboxField2 = sdn.comboboxField2,
  icon14 = sdn.icon14,
  input3 = sdn.input3,
  buttonIconic12 = sdn.buttonIconic12,
  icon15 = sdn.icon15,
  buttonIconic13 = sdn.buttonIconic13,
  icon16 = sdn.icon16,
  children,
  seldonRefs,
  ...props
}: SidebarPropertiesProps) {
  const sidebarPropertiesClassName = combineClassNames(
    "sdn-sidebar-objects",
    className,
  )
  const comboboxFieldFilterFieldProps = applyRef(
    seldonRefs,
    comboboxFieldFilterField === null
      ? null
      : {
          ...sdn.comboboxFieldFilterField,
          ...comboboxFieldFilterField,
          className: combineClassNames(
            sdn.comboboxFieldFilterField?.className,
            comboboxFieldFilterField?.className,
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
  const itemPropertyProps = applyRef(
    seldonRefs,
    itemProperty === null
      ? null
      : {
          ...sdn.itemProperty,
          ...itemProperty,
          className: combineClassNames(
            sdn.itemProperty?.className,
            itemProperty?.className,
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
  const formControlComboboxControl3Props = applyRef(
    seldonRefs,
    formControlComboboxControl3 === null
      ? null
      : {
          ...sdn.formControlComboboxControl3,
          ...formControlComboboxControl3,
          className: combineClassNames(
            sdn.formControlComboboxControl3?.className,
            formControlComboboxControl3?.className,
          ),
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
  const itemProperty2Props = applyRef(
    seldonRefs,
    itemProperty2 === null
      ? null
      : {
          ...sdn.itemProperty2,
          ...itemProperty2,
          className: combineClassNames(
            sdn.itemProperty2?.className,
            itemProperty2?.className,
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
  const formControlComboboxControl4Props = applyRef(
    seldonRefs,
    formControlComboboxControl4 === null
      ? null
      : {
          ...sdn.formControlComboboxControl4,
          ...formControlComboboxControl4,
          className: combineClassNames(
            sdn.formControlComboboxControl4?.className,
            formControlComboboxControl4?.className,
          ),
        },
  )
  const textLabel4Props = applyRef(
    seldonRefs,
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
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
  const buttonIconic12Props = applyRef(
    seldonRefs,
    buttonIconic12 === null
      ? null
      : {
          ...sdn.buttonIconic12,
          ...buttonIconic12,
          className: combineClassNames(
            sdn.buttonIconic12?.className,
            buttonIconic12?.className,
          ),
        },
  )
  const icon15Props = applyRef(
    seldonRefs,
    icon15 === null
      ? null
      : {
          ...sdn.icon15,
          ...icon15,
          className: combineClassNames(
            sdn.icon15?.className,
            icon15?.className,
          ),
        },
  )
  const buttonIconic13Props = applyRef(
    seldonRefs,
    buttonIconic13 === null
      ? null
      : {
          ...sdn.buttonIconic13,
          ...buttonIconic13,
          className: combineClassNames(
            sdn.buttonIconic13?.className,
            buttonIconic13?.className,
          ),
        },
  )
  const icon16Props = applyRef(
    seldonRefs,
    icon16 === null
      ? null
      : {
          ...sdn.icon16,
          ...icon16,
          className: combineClassNames(
            sdn.icon16?.className,
            icon16?.className,
          ),
        },
  )

  return (
    <HTMLDiv
      className={sidebarPropertiesClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {comboboxFieldFilterField && comboboxFieldFilterFieldProps && (
            <ComboboxFieldFilterField
              {...comboboxFieldFilterFieldProps}
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
            {itemProperty && itemPropertyProps && (
              <ItemProperty
                {...itemPropertyProps}
                buttonIconic={buttonIconic5Props}
                icon={icon6Props}
                formControlComboboxControl={formControlComboboxControl2Props}
                buttonIconic3={buttonIconic7Props}
                icon4={icon9Props}
              />
            )}
            {itemSection2 && itemSection2Props && (
              <ItemSection {...itemSection2Props}>
                {buttonIconic8 && buttonIconic8Props && (
                  <ButtonIconic {...buttonIconic8Props} icon={icon10Props} />
                )}
                {formControlComboboxControl3 &&
                  formControlComboboxControl3Props && (
                    <FormControlComboboxControl
                      {...formControlComboboxControl3Props}
                    >
                      {textLabel3 && textLabel3Props && (
                        <TextLabel {...textLabel3Props} />
                      )}
                    </FormControlComboboxControl>
                  )}
                {buttonIconic9 && buttonIconic9Props && (
                  <ButtonIconic {...buttonIconic9Props} icon={icon11Props} />
                )}
                {buttonIconic10 && buttonIconic10Props && (
                  <ButtonIconic {...buttonIconic10Props} icon={icon12Props} />
                )}
              </ItemSection>
            )}
            {itemProperty2 && itemProperty2Props && (
              <ItemProperty
                {...itemProperty2Props}
                buttonIconic={buttonIconic11Props}
                icon={icon13Props}
                formControlComboboxControl={formControlComboboxControl4Props}
                buttonIconic3={buttonIconic13Props}
                icon4={icon16Props}
              />
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
const sdn: SidebarPropertiesProps = {
  role: "complementary",
  "aria-hidden": "false",
  className: "sdn-sidebar-objects sdn-sidebar",
  comboboxFieldFilterField: {
    className:
      "sdn-combobox-field-filter-field sdn-combobox-field-filter-field--lsiw",
  },
  icon: {
    icon: "material-filterList",
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
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--enpy",
    "data-seldon-ref": "proeprtiesContainer",
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
  itemProperty: {
    className: "sdn-item-property sdn-item-section--ymri",
  },
  buttonIconic5: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon6: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControlComboboxControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox-control--qmop",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--xg6p",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--j44i",
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
    className: "sdn-input sdn-input--iegt",
  },
  buttonIconic6: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon8: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic7: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon9: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  itemSection2: {
    className: "sdn-item-section sdn-item-section--ymri",
  },
  buttonIconic8: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon10: {
    icon: "material-unfoldMore",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControlComboboxControl3: {
    className: "sdn-form-control sdn-form-control-combobox-control--qmop",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--z34z",
  },
  buttonIconic9: {
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
  },
  icon11: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic10: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon12: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  itemProperty2: {
    className: "sdn-item-property sdn-item-section--ymri",
  },
  buttonIconic11: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon13: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControlComboboxControl4: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox-control--qmop",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--xg6p",
  },
  comboboxField2: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--j44i",
  },
  icon14: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input3: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iegt",
  },
  buttonIconic12: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon15: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic13: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon16: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}
