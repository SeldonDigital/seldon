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

import { ButtonProps } from "../elements/Button"
import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ComboboxField, ComboboxFieldProps } from "../elements/ComboboxField"
import { FormControl, FormControlProps } from "../elements/FormControl"
import {
  FormControlRadio,
  FormControlRadioProps,
} from "../elements/FormControlRadio"
import { MenuItemRadio, MenuItemRadioProps } from "../elements/MenuItemRadio"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import {
  TextDescription,
  TextDescriptionProps,
} from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface DialogExportComponentProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  frame?: FrameProps | null
  formControl?: FormControlProps | null
  textLabel?: TextLabelProps | null
  input?: InputProps | null
  formControl2?: FormControlProps | null
  textLabel2?: TextLabelProps | null
  comboboxField?: ComboboxFieldProps | null
  input2?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  formControlRadio?: FormControlRadioProps | null
  frame2?: FrameProps | null
  textLabel3?: TextLabelProps | null
  textDescription?: TextDescriptionProps | null
  frame3?: FrameProps | null
  menuItemRadio?: MenuItemRadioProps | null
  icon2?: IconProps | null
  textLabel4?: TextLabelProps | null
  menuItemRadio2?: MenuItemRadioProps | null
  icon3?: IconProps | null
  textLabel5?: TextLabelProps | null
  formControlRadio2?: FormControlRadioProps | null
  frame4?: FrameProps | null
  textLabel6?: TextLabelProps | null
  textDescription2?: TextDescriptionProps | null
  frame5?: FrameProps | null
  menuItemRadio3?: MenuItemRadioProps | null
  icon4?: IconProps | null
  textLabel7?: TextLabelProps | null
  menuItemRadio4?: MenuItemRadioProps | null
  icon5?: IconProps | null
  textLabel8?: TextLabelProps | null
  formControlRadio3?: FormControlRadioProps | null
  frame6?: FrameProps | null
  textLabel9?: TextLabelProps | null
  textDescription3?: TextDescriptionProps | null
  frame7?: FrameProps | null
  menuItemRadio5?: MenuItemRadioProps | null
  icon6?: IconProps | null
  textLabel10?: TextLabelProps | null
  menuItemRadio6?: MenuItemRadioProps | null
  icon7?: IconProps | null
  textLabel11?: TextLabelProps | null
  formControlRadio4?: FormControlRadioProps | null
  frame8?: FrameProps | null
  textLabel12?: TextLabelProps | null
  textDescription4?: TextDescriptionProps | null
  frame9?: FrameProps | null
  menuItemRadio7?: MenuItemRadioProps | null
  icon8?: IconProps | null
  textLabel13?: TextLabelProps | null
  menuItemRadio8?: MenuItemRadioProps | null
  icon9?: IconProps | null
  textLabel14?: TextLabelProps | null
  formControlRadio5?: FormControlRadioProps | null
  frame10?: FrameProps | null
  textLabel15?: TextLabelProps | null
  textDescription5?: TextDescriptionProps | null
  frame11?: FrameProps | null
  menuItemRadio9?: MenuItemRadioProps | null
  icon10?: IconProps | null
  textLabel16?: TextLabelProps | null
  menuItemRadio10?: MenuItemRadioProps | null
  icon11?: IconProps | null
  textLabel17?: TextLabelProps | null
  barButtons?: BarButtonsProps | null
  button?: ButtonProps | null
  icon12?: IconProps | null
  textLabel18?: TextLabelProps | null
  button2?: ButtonProps | null
  icon13?: IconProps | null
  textLabel19?: TextLabelProps | null
}

/*****
 * Module: DialogExportComponent
 * Level: Module
 * Intent:
 * Tags:
 * Type: Inline
 *
 * @example
 * ```tsx
 * <DialogExportComponent
 *   aria-hidden="false"
 *   bar="{}"
 *   textTitle="Product Title"
 *   frame="{}"
 *   formControl="{}"
 *   textLabel="{}"
 *   input="{}"
 *   formControl2="{}"
 *   comboboxField="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlRadio3="{}"
 *   textDescription2="{}"
 *   frame2="{}"
 *   menuItemRadio="{}"
 *   menuItemRadio2="{}"
 *   formControlRadio4="{}"
 *   formControlRadio5="{}"
 *   formControlRadio6="{}"
 *   formControlRadio7="{}"
 *   barButtons2="{}"
 *   button={() => {}}
 *   button2={() => {}}
 * />
 * ```
 *****/
export function DialogExportComponent({
  className = "",
  bar = sdn.bar,
  textTitle,
  frame = sdn.frame,
  formControl,
  textLabel,
  input = sdn.input,
  formControl2,
  textLabel2,
  comboboxField,
  input2 = sdn.input2,
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  formControlRadio,
  frame2 = sdn.frame2,
  textLabel3,
  textDescription,
  frame3 = sdn.frame3,
  menuItemRadio,
  icon2 = sdn.icon2,
  textLabel4,
  menuItemRadio2,
  icon3 = sdn.icon3,
  textLabel5,
  formControlRadio2,
  frame4 = sdn.frame4,
  textLabel6,
  textDescription2,
  frame5 = sdn.frame5,
  menuItemRadio3,
  icon4 = sdn.icon4,
  textLabel7,
  menuItemRadio4,
  icon5 = sdn.icon5,
  textLabel8,
  formControlRadio3,
  frame6 = sdn.frame6,
  textLabel9,
  textDescription3,
  frame7 = sdn.frame7,
  menuItemRadio5,
  icon6 = sdn.icon6,
  textLabel10,
  menuItemRadio6,
  icon7 = sdn.icon7,
  textLabel11,
  formControlRadio4,
  frame8 = sdn.frame8,
  textLabel12,
  textDescription4,
  frame9 = sdn.frame9,
  menuItemRadio7,
  icon8 = sdn.icon8,
  textLabel13,
  menuItemRadio8,
  icon9 = sdn.icon9,
  textLabel14,
  formControlRadio5,
  frame10 = sdn.frame10,
  textLabel15,
  textDescription5,
  frame11 = sdn.frame11,
  menuItemRadio9,
  icon10 = sdn.icon10,
  textLabel16,
  menuItemRadio10,
  icon11 = sdn.icon11,
  textLabel17,
  barButtons = sdn.barButtons,
  button = sdn.button,
  icon12 = sdn.icon12,
  textLabel18,
  button2 = sdn.button2,
  icon13 = sdn.icon13,
  textLabel19,
  children,
  seldonRefs,
  ...props
}: DialogExportComponentProps) {
  const dialogExportComponentClassName = combineClassNames(
    "sdn-dialog-export-component",
    className,
  )
  const barProps = applyRef(
    seldonRefs,
    bar === null
      ? null
      : {
          ...sdn.bar,
          ...bar,
          className: combineClassNames(sdn.bar?.className, bar?.className),
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
  const formControlProps = applyRef(
    seldonRefs,
    formControl === null
      ? null
      : {
          ...sdn.formControl,
          ...formControl,
          className: combineClassNames(
            sdn.formControl?.className,
            formControl?.className,
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
  const formControl2Props = applyRef(
    seldonRefs,
    formControl2 === null
      ? null
      : {
          ...sdn.formControl2,
          ...formControl2,
          className: combineClassNames(
            sdn.formControl2?.className,
            formControl2?.className,
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
  const formControlRadioProps = applyRef(
    seldonRefs,
    formControlRadio === null
      ? null
      : {
          ...sdn.formControlRadio,
          ...formControlRadio,
          className: combineClassNames(
            sdn.formControlRadio?.className,
            formControlRadio?.className,
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
  const textDescriptionProps = applyRef(
    seldonRefs,
    textDescription === null
      ? null
      : {
          ...sdn.textDescription,
          ...textDescription,
          className: combineClassNames(
            sdn.textDescription?.className,
            textDescription?.className,
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
  const menuItemRadioProps = applyRef(
    seldonRefs,
    menuItemRadio === null
      ? null
      : {
          ...sdn.menuItemRadio,
          ...menuItemRadio,
          className: combineClassNames(
            sdn.menuItemRadio?.className,
            menuItemRadio?.className,
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
  const menuItemRadio2Props = applyRef(
    seldonRefs,
    menuItemRadio2 === null
      ? null
      : {
          ...sdn.menuItemRadio2,
          ...menuItemRadio2,
          className: combineClassNames(
            sdn.menuItemRadio2?.className,
            menuItemRadio2?.className,
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
  const textLabel5Props = applyRef(
    seldonRefs,
    textLabel5 === null
      ? null
      : {
          ...sdn.textLabel5,
          ...textLabel5,
          className: combineClassNames(
            sdn.textLabel5?.className,
            textLabel5?.className,
          ),
        },
  )
  const formControlRadio2Props = applyRef(
    seldonRefs,
    formControlRadio2 === null
      ? null
      : {
          ...sdn.formControlRadio2,
          ...formControlRadio2,
          className: combineClassNames(
            sdn.formControlRadio2?.className,
            formControlRadio2?.className,
          ),
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
  const textLabel6Props = applyRef(
    seldonRefs,
    textLabel6 === null
      ? null
      : {
          ...sdn.textLabel6,
          ...textLabel6,
          className: combineClassNames(
            sdn.textLabel6?.className,
            textLabel6?.className,
          ),
        },
  )
  const textDescription2Props = applyRef(
    seldonRefs,
    textDescription2 === null
      ? null
      : {
          ...sdn.textDescription2,
          ...textDescription2,
          className: combineClassNames(
            sdn.textDescription2?.className,
            textDescription2?.className,
          ),
        },
  )
  const frame5Props = applyRef(
    seldonRefs,
    frame5 === null
      ? null
      : {
          ...sdn.frame5,
          ...frame5,
          className: combineClassNames(
            sdn.frame5?.className,
            frame5?.className,
          ),
        },
  )
  const menuItemRadio3Props = applyRef(
    seldonRefs,
    menuItemRadio3 === null
      ? null
      : {
          ...sdn.menuItemRadio3,
          ...menuItemRadio3,
          className: combineClassNames(
            sdn.menuItemRadio3?.className,
            menuItemRadio3?.className,
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
  const textLabel7Props = applyRef(
    seldonRefs,
    textLabel7 === null
      ? null
      : {
          ...sdn.textLabel7,
          ...textLabel7,
          className: combineClassNames(
            sdn.textLabel7?.className,
            textLabel7?.className,
          ),
        },
  )
  const menuItemRadio4Props = applyRef(
    seldonRefs,
    menuItemRadio4 === null
      ? null
      : {
          ...sdn.menuItemRadio4,
          ...menuItemRadio4,
          className: combineClassNames(
            sdn.menuItemRadio4?.className,
            menuItemRadio4?.className,
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
  const textLabel8Props = applyRef(
    seldonRefs,
    textLabel8 === null
      ? null
      : {
          ...sdn.textLabel8,
          ...textLabel8,
          className: combineClassNames(
            sdn.textLabel8?.className,
            textLabel8?.className,
          ),
        },
  )
  const formControlRadio3Props = applyRef(
    seldonRefs,
    formControlRadio3 === null
      ? null
      : {
          ...sdn.formControlRadio3,
          ...formControlRadio3,
          className: combineClassNames(
            sdn.formControlRadio3?.className,
            formControlRadio3?.className,
          ),
        },
  )
  const frame6Props = applyRef(
    seldonRefs,
    frame6 === null
      ? null
      : {
          ...sdn.frame6,
          ...frame6,
          className: combineClassNames(
            sdn.frame6?.className,
            frame6?.className,
          ),
        },
  )
  const textLabel9Props = applyRef(
    seldonRefs,
    textLabel9 === null
      ? null
      : {
          ...sdn.textLabel9,
          ...textLabel9,
          className: combineClassNames(
            sdn.textLabel9?.className,
            textLabel9?.className,
          ),
        },
  )
  const textDescription3Props = applyRef(
    seldonRefs,
    textDescription3 === null
      ? null
      : {
          ...sdn.textDescription3,
          ...textDescription3,
          className: combineClassNames(
            sdn.textDescription3?.className,
            textDescription3?.className,
          ),
        },
  )
  const frame7Props = applyRef(
    seldonRefs,
    frame7 === null
      ? null
      : {
          ...sdn.frame7,
          ...frame7,
          className: combineClassNames(
            sdn.frame7?.className,
            frame7?.className,
          ),
        },
  )
  const menuItemRadio5Props = applyRef(
    seldonRefs,
    menuItemRadio5 === null
      ? null
      : {
          ...sdn.menuItemRadio5,
          ...menuItemRadio5,
          className: combineClassNames(
            sdn.menuItemRadio5?.className,
            menuItemRadio5?.className,
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
  const textLabel10Props = applyRef(
    seldonRefs,
    textLabel10 === null
      ? null
      : {
          ...sdn.textLabel10,
          ...textLabel10,
          className: combineClassNames(
            sdn.textLabel10?.className,
            textLabel10?.className,
          ),
        },
  )
  const menuItemRadio6Props = applyRef(
    seldonRefs,
    menuItemRadio6 === null
      ? null
      : {
          ...sdn.menuItemRadio6,
          ...menuItemRadio6,
          className: combineClassNames(
            sdn.menuItemRadio6?.className,
            menuItemRadio6?.className,
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
  const textLabel11Props = applyRef(
    seldonRefs,
    textLabel11 === null
      ? null
      : {
          ...sdn.textLabel11,
          ...textLabel11,
          className: combineClassNames(
            sdn.textLabel11?.className,
            textLabel11?.className,
          ),
        },
  )
  const formControlRadio4Props = applyRef(
    seldonRefs,
    formControlRadio4 === null
      ? null
      : {
          ...sdn.formControlRadio4,
          ...formControlRadio4,
          className: combineClassNames(
            sdn.formControlRadio4?.className,
            formControlRadio4?.className,
          ),
        },
  )
  const frame8Props = applyRef(
    seldonRefs,
    frame8 === null
      ? null
      : {
          ...sdn.frame8,
          ...frame8,
          className: combineClassNames(
            sdn.frame8?.className,
            frame8?.className,
          ),
        },
  )
  const textLabel12Props = applyRef(
    seldonRefs,
    textLabel12 === null
      ? null
      : {
          ...sdn.textLabel12,
          ...textLabel12,
          className: combineClassNames(
            sdn.textLabel12?.className,
            textLabel12?.className,
          ),
        },
  )
  const textDescription4Props = applyRef(
    seldonRefs,
    textDescription4 === null
      ? null
      : {
          ...sdn.textDescription4,
          ...textDescription4,
          className: combineClassNames(
            sdn.textDescription4?.className,
            textDescription4?.className,
          ),
        },
  )
  const frame9Props = applyRef(
    seldonRefs,
    frame9 === null
      ? null
      : {
          ...sdn.frame9,
          ...frame9,
          className: combineClassNames(
            sdn.frame9?.className,
            frame9?.className,
          ),
        },
  )
  const menuItemRadio7Props = applyRef(
    seldonRefs,
    menuItemRadio7 === null
      ? null
      : {
          ...sdn.menuItemRadio7,
          ...menuItemRadio7,
          className: combineClassNames(
            sdn.menuItemRadio7?.className,
            menuItemRadio7?.className,
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
  const textLabel13Props = applyRef(
    seldonRefs,
    textLabel13 === null
      ? null
      : {
          ...sdn.textLabel13,
          ...textLabel13,
          className: combineClassNames(
            sdn.textLabel13?.className,
            textLabel13?.className,
          ),
        },
  )
  const menuItemRadio8Props = applyRef(
    seldonRefs,
    menuItemRadio8 === null
      ? null
      : {
          ...sdn.menuItemRadio8,
          ...menuItemRadio8,
          className: combineClassNames(
            sdn.menuItemRadio8?.className,
            menuItemRadio8?.className,
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
  const textLabel14Props = applyRef(
    seldonRefs,
    textLabel14 === null
      ? null
      : {
          ...sdn.textLabel14,
          ...textLabel14,
          className: combineClassNames(
            sdn.textLabel14?.className,
            textLabel14?.className,
          ),
        },
  )
  const formControlRadio5Props = applyRef(
    seldonRefs,
    formControlRadio5 === null
      ? null
      : {
          ...sdn.formControlRadio5,
          ...formControlRadio5,
          className: combineClassNames(
            sdn.formControlRadio5?.className,
            formControlRadio5?.className,
          ),
        },
  )
  const frame10Props = applyRef(
    seldonRefs,
    frame10 === null
      ? null
      : {
          ...sdn.frame10,
          ...frame10,
          className: combineClassNames(
            sdn.frame10?.className,
            frame10?.className,
          ),
        },
  )
  const textLabel15Props = applyRef(
    seldonRefs,
    textLabel15 === null
      ? null
      : {
          ...sdn.textLabel15,
          ...textLabel15,
          className: combineClassNames(
            sdn.textLabel15?.className,
            textLabel15?.className,
          ),
        },
  )
  const textDescription5Props = applyRef(
    seldonRefs,
    textDescription5 === null
      ? null
      : {
          ...sdn.textDescription5,
          ...textDescription5,
          className: combineClassNames(
            sdn.textDescription5?.className,
            textDescription5?.className,
          ),
        },
  )
  const frame11Props = applyRef(
    seldonRefs,
    frame11 === null
      ? null
      : {
          ...sdn.frame11,
          ...frame11,
          className: combineClassNames(
            sdn.frame11?.className,
            frame11?.className,
          ),
        },
  )
  const menuItemRadio9Props = applyRef(
    seldonRefs,
    menuItemRadio9 === null
      ? null
      : {
          ...sdn.menuItemRadio9,
          ...menuItemRadio9,
          className: combineClassNames(
            sdn.menuItemRadio9?.className,
            menuItemRadio9?.className,
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
  const textLabel16Props = applyRef(
    seldonRefs,
    textLabel16 === null
      ? null
      : {
          ...sdn.textLabel16,
          ...textLabel16,
          className: combineClassNames(
            sdn.textLabel16?.className,
            textLabel16?.className,
          ),
        },
  )
  const menuItemRadio10Props = applyRef(
    seldonRefs,
    menuItemRadio10 === null
      ? null
      : {
          ...sdn.menuItemRadio10,
          ...menuItemRadio10,
          className: combineClassNames(
            sdn.menuItemRadio10?.className,
            menuItemRadio10?.className,
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
  const textLabel17Props = applyRef(
    seldonRefs,
    textLabel17 === null
      ? null
      : {
          ...sdn.textLabel17,
          ...textLabel17,
          className: combineClassNames(
            sdn.textLabel17?.className,
            textLabel17?.className,
          ),
        },
  )
  const barButtonsProps = applyRef(
    seldonRefs,
    barButtons === null
      ? null
      : {
          ...sdn.barButtons,
          ...barButtons,
          className: combineClassNames(
            sdn.barButtons?.className,
            barButtons?.className,
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
  const textLabel18Props = applyRef(
    seldonRefs,
    textLabel18 === null
      ? null
      : {
          ...sdn.textLabel18,
          ...textLabel18,
          className: combineClassNames(
            sdn.textLabel18?.className,
            textLabel18?.className,
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
  const textLabel19Props = applyRef(
    seldonRefs,
    textLabel19 === null
      ? null
      : {
          ...sdn.textLabel19,
          ...textLabel19,
          className: combineClassNames(
            sdn.textLabel19?.className,
            textLabel19?.className,
          ),
        },
  )

  return (
    <HTMLDiv
      className={dialogExportComponentClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>
              {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            </Bar>
          )}
          <Frame {...frameProps}>
            {formControl && formControlProps && (
              <FormControl {...formControlProps}>
                {textLabel && textLabelProps && (
                  <TextLabel {...textLabelProps} />
                )}
                {input && inputProps && <Input {...inputProps} />}
              </FormControl>
            )}
            {formControl2 && formControl2Props && (
              <FormControl {...formControl2Props}>
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
                )}
                {comboboxField && comboboxFieldProps && (
                  <ComboboxField
                    {...comboboxFieldProps}
                    input={input2Props}
                    buttonIconic={buttonIconicProps}
                    icon2={iconProps}
                    icon={null}
                  />
                )}
              </FormControl>
            )}
            {formControlRadio && formControlRadioProps && (
              <FormControlRadio {...formControlRadioProps}>
                <Frame {...frame2Props}>
                  {textLabel3 && textLabel3Props && (
                    <TextLabel {...textLabel3Props} />
                  )}
                  {textDescription && textDescriptionProps && (
                    <TextDescription {...textDescriptionProps} />
                  )}
                </Frame>
                <Frame {...frame3Props}>
                  {menuItemRadio && menuItemRadioProps && (
                    <MenuItemRadio {...menuItemRadioProps}>
                      {icon2 && icon2Props && <Icon {...icon2Props} />}
                      {textLabel4 && textLabel4Props && (
                        <TextLabel {...textLabel4Props} />
                      )}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio2 && menuItemRadio2Props && (
                    <MenuItemRadio {...menuItemRadio2Props}>
                      {icon3 && icon3Props && <Icon {...icon3Props} />}
                      {textLabel5 && textLabel5Props && (
                        <TextLabel {...textLabel5Props} />
                      )}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio2 && formControlRadio2Props && (
              <FormControlRadio {...formControlRadio2Props}>
                <Frame {...frame4Props}>
                  {textLabel6 && textLabel6Props && (
                    <TextLabel {...textLabel6Props} />
                  )}
                  {textDescription2 && textDescription2Props && (
                    <TextDescription {...textDescription2Props} />
                  )}
                </Frame>
                <Frame {...frame5Props}>
                  {menuItemRadio3 && menuItemRadio3Props && (
                    <MenuItemRadio {...menuItemRadio3Props}>
                      {icon4 && icon4Props && <Icon {...icon4Props} />}
                      {textLabel7 && textLabel7Props && (
                        <TextLabel {...textLabel7Props} />
                      )}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio4 && menuItemRadio4Props && (
                    <MenuItemRadio {...menuItemRadio4Props}>
                      {icon5 && icon5Props && <Icon {...icon5Props} />}
                      {textLabel8 && textLabel8Props && (
                        <TextLabel {...textLabel8Props} />
                      )}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio3 && formControlRadio3Props && (
              <FormControlRadio {...formControlRadio3Props}>
                <Frame {...frame6Props}>
                  {textLabel9 && textLabel9Props && (
                    <TextLabel {...textLabel9Props} />
                  )}
                  {textDescription3 && textDescription3Props && (
                    <TextDescription {...textDescription3Props} />
                  )}
                </Frame>
                <Frame {...frame7Props}>
                  {menuItemRadio5 && menuItemRadio5Props && (
                    <MenuItemRadio {...menuItemRadio5Props}>
                      {icon6 && icon6Props && <Icon {...icon6Props} />}
                      {textLabel10 && textLabel10Props && (
                        <TextLabel {...textLabel10Props} />
                      )}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio6 && menuItemRadio6Props && (
                    <MenuItemRadio {...menuItemRadio6Props}>
                      {icon7 && icon7Props && <Icon {...icon7Props} />}
                      {textLabel11 && textLabel11Props && (
                        <TextLabel {...textLabel11Props} />
                      )}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio4 && formControlRadio4Props && (
              <FormControlRadio {...formControlRadio4Props}>
                <Frame {...frame8Props}>
                  {textLabel12 && textLabel12Props && (
                    <TextLabel {...textLabel12Props} />
                  )}
                  {textDescription4 && textDescription4Props && (
                    <TextDescription {...textDescription4Props} />
                  )}
                </Frame>
                <Frame {...frame9Props}>
                  {menuItemRadio7 && menuItemRadio7Props && (
                    <MenuItemRadio {...menuItemRadio7Props}>
                      {icon8 && icon8Props && <Icon {...icon8Props} />}
                      {textLabel13 && textLabel13Props && (
                        <TextLabel {...textLabel13Props} />
                      )}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio8 && menuItemRadio8Props && (
                    <MenuItemRadio {...menuItemRadio8Props}>
                      {icon9 && icon9Props && <Icon {...icon9Props} />}
                      {textLabel14 && textLabel14Props && (
                        <TextLabel {...textLabel14Props} />
                      )}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
            {formControlRadio5 && formControlRadio5Props && (
              <FormControlRadio {...formControlRadio5Props}>
                <Frame {...frame10Props}>
                  {textLabel15 && textLabel15Props && (
                    <TextLabel {...textLabel15Props} />
                  )}
                  {textDescription5 && textDescription5Props && (
                    <TextDescription {...textDescription5Props} />
                  )}
                </Frame>
                <Frame {...frame11Props}>
                  {menuItemRadio9 && menuItemRadio9Props && (
                    <MenuItemRadio {...menuItemRadio9Props}>
                      {icon10 && icon10Props && <Icon {...icon10Props} />}
                      {textLabel16 && textLabel16Props && (
                        <TextLabel {...textLabel16Props} />
                      )}
                    </MenuItemRadio>
                  )}
                  {menuItemRadio10 && menuItemRadio10Props && (
                    <MenuItemRadio {...menuItemRadio10Props}>
                      {icon11 && icon11Props && <Icon {...icon11Props} />}
                      {textLabel17 && textLabel17Props && (
                        <TextLabel {...textLabel17Props} />
                      )}
                    </MenuItemRadio>
                  )}
                </Frame>
              </FormControlRadio>
            )}
          </Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button4={buttonProps}
              icon4={icon12Props}
              textLabel4={textLabel18 && textLabel18Props}
              button5={button2Props}
              icon5={icon13Props}
              textLabel5={textLabel19 && textLabel19Props}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: DialogExportComponentProps = {
  "aria-hidden": "false",
  className: "sdn-dialog-export-component sdn-dialog",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--zhvk",
  },
  textTitle: {
    children: "Export Components",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--eodu",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--q7m7",
  },
  formControl: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel: {
    children: "Export to",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    className: "sdn-input sdn-input--qirj",
    "data-seldon-ref": "exportRootPath",
  },
  formControl2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control--vmxp",
  },
  textLabel2: {
    children: "Platform",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--l6fl",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--ull6",
  },
  input2: {
    placeholder: "Platform",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
    "data-seldon-ref": "exportPlatform",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  formControlRadio: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel3: {
    children: "Include Hidden Components",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription: {
    children:
      "When enabled, components hidden with Exclude or Mock are also exported.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenYes",
  },
  icon2: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel4: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio2: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportHiddenNo",
  },
  icon3: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel5: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel6: {
    children: "Include All Themes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription2: {
    children: "Export all themes regardless if they are used in the workspace.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio3: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesYes",
  },
  icon4: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel7: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio4: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllThemesNo",
  },
  icon5: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel8: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel9: {
    children: "Include All Fonts",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription3: {
    children: "Export all fonts regardless if they used in the workspace.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio5: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsYes",
  },
  icon6: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel10: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio6: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllFontsNo",
  },
  icon7: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel11: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio4: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel12: {
    children: "Generate Font Links",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription4: {
    children:
      "When enabled, add Google Fonts links, which makes requests to Google. When set to off, keep export request free.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio7: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksYes",
  },
  icon8: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel13: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio8: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportFontLinksNo",
  },
  icon9: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel14: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  formControlRadio5: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-radio--9dpd",
  },
  frame10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ejha",
  },
  textLabel15: {
    children: "Include All Icons",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--s1qr",
  },
  textDescription5: {
    children: "Export all icons regardless if they are used in the workspace.",
    htmlElement: "p",
    "aria-hidden": "false",
    className: "sdn-text-description sdn-text-description--ljmd",
  },
  frame11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pwes",
  },
  menuItemRadio9: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllIconsYes",
  },
  icon10: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel16: {
    children: "Yes",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  menuItemRadio10: {
    role: "menuitemradio",
    "aria-hidden": "false",
    className: "sdn-menu-item sdn-menu-item-radio--wifm",
    "data-seldon-ref": "exportAllIconsNo",
  },
  icon11: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel17: {
    children: "No",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--xohb",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--36qz",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "exportCancel",
  },
  icon12: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel18: {
    children: "Cancel",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--upjl",
    "data-seldon-ref": "exportConfirm",
  },
  icon13: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel19: {
    children: "Export",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}
