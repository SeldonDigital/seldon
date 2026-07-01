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
import { CalendarDay, CalendarDayProps } from "../elements/CalendarDay"
import {
  CalendarDayGridCellDay,
  CalendarDayGridCellDayProps,
} from "../elements/CalendarDayGridCellDay"
import {
  CalendarDaySelectedDay,
  CalendarDaySelectedDayProps,
} from "../elements/CalendarDaySelectedDay"
import {
  CalendarDayToday,
  CalendarDayTodayProps,
} from "../elements/CalendarDayToday"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface CalendarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  textTitle?: TextTitleProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon3?: IconProps | null
  buttonIconic4?: ButtonIconicProps | null
  icon4?: IconProps | null
  container?: ContainerProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
  textLabel7?: TextLabelProps | null
  frame2?: FrameProps | null
  container2?: ContainerProps | null
  calendarDay?: CalendarDayProps | null
  textLabel8?: TextLabelProps | null
  calendarDayGridCellDay?: CalendarDayGridCellDayProps | null
  textLabel9?: TextLabelProps | null
  calendarDayGridCellDay2?: CalendarDayGridCellDayProps | null
  textLabel10?: TextLabelProps | null
  container3?: ContainerProps | null
  calendarDayGridCellDay3?: CalendarDayGridCellDayProps | null
  textLabel11?: TextLabelProps | null
  calendarDayGridCellDay4?: CalendarDayGridCellDayProps | null
  textLabel12?: TextLabelProps | null
  calendarDayGridCellDay5?: CalendarDayGridCellDayProps | null
  textLabel13?: TextLabelProps | null
  calendarDayGridCellDay6?: CalendarDayGridCellDayProps | null
  textLabel14?: TextLabelProps | null
  calendarDayGridCellDay7?: CalendarDayGridCellDayProps | null
  textLabel15?: TextLabelProps | null
  calendarDayGridCellDay8?: CalendarDayGridCellDayProps | null
  textLabel16?: TextLabelProps | null
  calendarDayGridCellDay9?: CalendarDayGridCellDayProps | null
  textLabel17?: TextLabelProps | null
  container4?: ContainerProps | null
  calendarDayGridCellDay10?: CalendarDayGridCellDayProps | null
  textLabel18?: TextLabelProps | null
  calendarDayGridCellDay11?: CalendarDayGridCellDayProps | null
  textLabel19?: TextLabelProps | null
  calendarDayGridCellDay12?: CalendarDayGridCellDayProps | null
  textLabel20?: TextLabelProps | null
  calendarDayGridCellDay13?: CalendarDayGridCellDayProps | null
  textLabel21?: TextLabelProps | null
  calendarDayGridCellDay14?: CalendarDayGridCellDayProps | null
  textLabel22?: TextLabelProps | null
  calendarDayGridCellDay15?: CalendarDayGridCellDayProps | null
  textLabel23?: TextLabelProps | null
  calendarDayGridCellDay16?: CalendarDayGridCellDayProps | null
  textLabel24?: TextLabelProps | null
  container5?: ContainerProps | null
  calendarDayGridCellDay17?: CalendarDayGridCellDayProps | null
  textLabel25?: TextLabelProps | null
  calendarDayToday?: CalendarDayTodayProps | null
  textLabel26?: TextLabelProps | null
  calendarDayGridCellDay18?: CalendarDayGridCellDayProps | null
  textLabel27?: TextLabelProps | null
  calendarDaySelectedDay?: CalendarDaySelectedDayProps | null
  textLabel28?: TextLabelProps | null
  calendarDayGridCellDay19?: CalendarDayGridCellDayProps | null
  textLabel29?: TextLabelProps | null
  calendarDayGridCellDay20?: CalendarDayGridCellDayProps | null
  textLabel30?: TextLabelProps | null
  calendarDayGridCellDay21?: CalendarDayGridCellDayProps | null
  textLabel31?: TextLabelProps | null
  container6?: ContainerProps | null
  calendarDayGridCellDay22?: CalendarDayGridCellDayProps | null
  textLabel32?: TextLabelProps | null
  calendarDayGridCellDay23?: CalendarDayGridCellDayProps | null
  textLabel33?: TextLabelProps | null
  calendarDayGridCellDay24?: CalendarDayGridCellDayProps | null
  textLabel34?: TextLabelProps | null
  calendarDayGridCellDay25?: CalendarDayGridCellDayProps | null
  textLabel35?: TextLabelProps | null
  calendarDayGridCellDay26?: CalendarDayGridCellDayProps | null
  textLabel36?: TextLabelProps | null
  calendarDayGridCellDay27?: CalendarDayGridCellDayProps | null
  textLabel37?: TextLabelProps | null
  calendarDayGridCellDay28?: CalendarDayGridCellDayProps | null
  textLabel38?: TextLabelProps | null
  container7?: ContainerProps | null
  calendarDayGridCellDay29?: CalendarDayGridCellDayProps | null
  textLabel39?: TextLabelProps | null
  calendarDay2?: CalendarDayProps | null
  textLabel40?: TextLabelProps | null
}

/*****
 * Calendar: Calendar
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
 *
 * @example
 * ```tsx
 * <Calendar
 *   aria-hidden="false"
 *   frame="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   buttonIconic2={() => {}}
 *   textTitle="Product Title"
 *   buttonIconic3={() => {}}
 *   buttonIconic4={() => {}}
 *   container="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 *   textLabel3="{}"
 *   textLabel4="{}"
 *   textLabel5="{}"
 *   textLabel6="{}"
 *   textLabel7="{}"
 *   frame2="{}"
 *   calendarDay="{}"
 *   calendarDayGridCellDay2="{}"
 *   calendarDayGridCellDay3="{}"
 *   container2="{}"
 *   calendarDayGridCellDay="{}"
 *   calendarDayGridCellDay4="{}"
 *   calendarDayGridCellDay5="{}"
 *   calendarDayGridCellDay6="{}"
 *   calendarDayGridCellDay7="{}"
 *   container3="{}"
 *   container4="{}"
 *   calendarDayToday2="{}"
 *   calendarDaySelectedDay4="{}"
 *   container5="{}"
 *   container6="{}"
 *   calendarDay2="{}"
 * />
 * ```
 *****/
export function Calendar({
  className = "",
  frame = sdn.frame,
  buttonIconic,
  icon = sdn.icon,
  buttonIconic2,
  icon2 = sdn.icon2,
  textTitle,
  buttonIconic3,
  icon3 = sdn.icon3,
  buttonIconic4,
  icon4 = sdn.icon4,
  container = sdn.container,
  textLabel,
  textLabel2,
  textLabel3,
  textLabel4,
  textLabel5,
  textLabel6,
  textLabel7,
  frame2 = sdn.frame2,
  container2 = sdn.container2,
  calendarDay,
  textLabel8,
  calendarDayGridCellDay,
  textLabel9,
  calendarDayGridCellDay2,
  textLabel10,
  container3 = sdn.container3,
  calendarDayGridCellDay3,
  textLabel11,
  calendarDayGridCellDay4,
  textLabel12,
  calendarDayGridCellDay5,
  textLabel13,
  calendarDayGridCellDay6,
  textLabel14,
  calendarDayGridCellDay7,
  textLabel15,
  calendarDayGridCellDay8,
  textLabel16,
  calendarDayGridCellDay9,
  textLabel17,
  container4 = sdn.container4,
  calendarDayGridCellDay10,
  textLabel18,
  calendarDayGridCellDay11,
  textLabel19,
  calendarDayGridCellDay12,
  textLabel20,
  calendarDayGridCellDay13,
  textLabel21,
  calendarDayGridCellDay14,
  textLabel22,
  calendarDayGridCellDay15,
  textLabel23,
  calendarDayGridCellDay16,
  textLabel24,
  container5 = sdn.container5,
  calendarDayGridCellDay17,
  textLabel25,
  calendarDayToday,
  textLabel26,
  calendarDayGridCellDay18,
  textLabel27,
  calendarDaySelectedDay,
  textLabel28,
  calendarDayGridCellDay19,
  textLabel29,
  calendarDayGridCellDay20,
  textLabel30,
  calendarDayGridCellDay21,
  textLabel31,
  container6 = sdn.container6,
  calendarDayGridCellDay22,
  textLabel32,
  calendarDayGridCellDay23,
  textLabel33,
  calendarDayGridCellDay24,
  textLabel34,
  calendarDayGridCellDay25,
  textLabel35,
  calendarDayGridCellDay26,
  textLabel36,
  calendarDayGridCellDay27,
  textLabel37,
  calendarDayGridCellDay28,
  textLabel38,
  container7 = sdn.container7,
  calendarDayGridCellDay29,
  textLabel39,
  calendarDay2,
  textLabel40,
  children,
  seldonRefs,
  ...props
}: CalendarProps) {
  const calendarClassName = combineClassNames("sdn-calendar", className)
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
  const container2Props = applyRef(
    seldonRefs,
    container2 === null
      ? null
      : {
          ...sdn.container2,
          ...container2,
          className: combineClassNames(
            sdn.container2?.className,
            container2?.className,
          ),
        },
  )
  const calendarDayProps = applyRef(
    seldonRefs,
    calendarDay === null
      ? null
      : {
          ...sdn.calendarDay,
          ...calendarDay,
          className: combineClassNames(
            sdn.calendarDay?.className,
            calendarDay?.className,
          ),
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
  const calendarDayGridCellDayProps = applyRef(
    seldonRefs,
    calendarDayGridCellDay === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay,
          ...calendarDayGridCellDay,
          className: combineClassNames(
            sdn.calendarDayGridCellDay?.className,
            calendarDayGridCellDay?.className,
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
  const calendarDayGridCellDay2Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay2 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay2,
          ...calendarDayGridCellDay2,
          className: combineClassNames(
            sdn.calendarDayGridCellDay2?.className,
            calendarDayGridCellDay2?.className,
          ),
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
  const container3Props = applyRef(
    seldonRefs,
    container3 === null
      ? null
      : {
          ...sdn.container3,
          ...container3,
          className: combineClassNames(
            sdn.container3?.className,
            container3?.className,
          ),
        },
  )
  const calendarDayGridCellDay3Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay3 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay3,
          ...calendarDayGridCellDay3,
          className: combineClassNames(
            sdn.calendarDayGridCellDay3?.className,
            calendarDayGridCellDay3?.className,
          ),
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
  const calendarDayGridCellDay4Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay4 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay4,
          ...calendarDayGridCellDay4,
          className: combineClassNames(
            sdn.calendarDayGridCellDay4?.className,
            calendarDayGridCellDay4?.className,
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
  const calendarDayGridCellDay5Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay5 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay5,
          ...calendarDayGridCellDay5,
          className: combineClassNames(
            sdn.calendarDayGridCellDay5?.className,
            calendarDayGridCellDay5?.className,
          ),
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
  const calendarDayGridCellDay6Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay6 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay6,
          ...calendarDayGridCellDay6,
          className: combineClassNames(
            sdn.calendarDayGridCellDay6?.className,
            calendarDayGridCellDay6?.className,
          ),
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
  const calendarDayGridCellDay7Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay7 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay7,
          ...calendarDayGridCellDay7,
          className: combineClassNames(
            sdn.calendarDayGridCellDay7?.className,
            calendarDayGridCellDay7?.className,
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
  const calendarDayGridCellDay8Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay8 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay8,
          ...calendarDayGridCellDay8,
          className: combineClassNames(
            sdn.calendarDayGridCellDay8?.className,
            calendarDayGridCellDay8?.className,
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
  const calendarDayGridCellDay9Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay9 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay9,
          ...calendarDayGridCellDay9,
          className: combineClassNames(
            sdn.calendarDayGridCellDay9?.className,
            calendarDayGridCellDay9?.className,
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
  const container4Props = applyRef(
    seldonRefs,
    container4 === null
      ? null
      : {
          ...sdn.container4,
          ...container4,
          className: combineClassNames(
            sdn.container4?.className,
            container4?.className,
          ),
        },
  )
  const calendarDayGridCellDay10Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay10 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay10,
          ...calendarDayGridCellDay10,
          className: combineClassNames(
            sdn.calendarDayGridCellDay10?.className,
            calendarDayGridCellDay10?.className,
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
  const calendarDayGridCellDay11Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay11 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay11,
          ...calendarDayGridCellDay11,
          className: combineClassNames(
            sdn.calendarDayGridCellDay11?.className,
            calendarDayGridCellDay11?.className,
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
  const calendarDayGridCellDay12Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay12 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay12,
          ...calendarDayGridCellDay12,
          className: combineClassNames(
            sdn.calendarDayGridCellDay12?.className,
            calendarDayGridCellDay12?.className,
          ),
        },
  )
  const textLabel20Props = applyRef(
    seldonRefs,
    textLabel20 === null
      ? null
      : {
          ...sdn.textLabel20,
          ...textLabel20,
          className: combineClassNames(
            sdn.textLabel20?.className,
            textLabel20?.className,
          ),
        },
  )
  const calendarDayGridCellDay13Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay13 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay13,
          ...calendarDayGridCellDay13,
          className: combineClassNames(
            sdn.calendarDayGridCellDay13?.className,
            calendarDayGridCellDay13?.className,
          ),
        },
  )
  const textLabel21Props = applyRef(
    seldonRefs,
    textLabel21 === null
      ? null
      : {
          ...sdn.textLabel21,
          ...textLabel21,
          className: combineClassNames(
            sdn.textLabel21?.className,
            textLabel21?.className,
          ),
        },
  )
  const calendarDayGridCellDay14Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay14 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay14,
          ...calendarDayGridCellDay14,
          className: combineClassNames(
            sdn.calendarDayGridCellDay14?.className,
            calendarDayGridCellDay14?.className,
          ),
        },
  )
  const textLabel22Props = applyRef(
    seldonRefs,
    textLabel22 === null
      ? null
      : {
          ...sdn.textLabel22,
          ...textLabel22,
          className: combineClassNames(
            sdn.textLabel22?.className,
            textLabel22?.className,
          ),
        },
  )
  const calendarDayGridCellDay15Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay15 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay15,
          ...calendarDayGridCellDay15,
          className: combineClassNames(
            sdn.calendarDayGridCellDay15?.className,
            calendarDayGridCellDay15?.className,
          ),
        },
  )
  const textLabel23Props = applyRef(
    seldonRefs,
    textLabel23 === null
      ? null
      : {
          ...sdn.textLabel23,
          ...textLabel23,
          className: combineClassNames(
            sdn.textLabel23?.className,
            textLabel23?.className,
          ),
        },
  )
  const calendarDayGridCellDay16Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay16 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay16,
          ...calendarDayGridCellDay16,
          className: combineClassNames(
            sdn.calendarDayGridCellDay16?.className,
            calendarDayGridCellDay16?.className,
          ),
        },
  )
  const textLabel24Props = applyRef(
    seldonRefs,
    textLabel24 === null
      ? null
      : {
          ...sdn.textLabel24,
          ...textLabel24,
          className: combineClassNames(
            sdn.textLabel24?.className,
            textLabel24?.className,
          ),
        },
  )
  const container5Props = applyRef(
    seldonRefs,
    container5 === null
      ? null
      : {
          ...sdn.container5,
          ...container5,
          className: combineClassNames(
            sdn.container5?.className,
            container5?.className,
          ),
        },
  )
  const calendarDayGridCellDay17Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay17 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay17,
          ...calendarDayGridCellDay17,
          className: combineClassNames(
            sdn.calendarDayGridCellDay17?.className,
            calendarDayGridCellDay17?.className,
          ),
        },
  )
  const textLabel25Props = applyRef(
    seldonRefs,
    textLabel25 === null
      ? null
      : {
          ...sdn.textLabel25,
          ...textLabel25,
          className: combineClassNames(
            sdn.textLabel25?.className,
            textLabel25?.className,
          ),
        },
  )
  const calendarDayTodayProps = applyRef(
    seldonRefs,
    calendarDayToday === null
      ? null
      : {
          ...sdn.calendarDayToday,
          ...calendarDayToday,
          className: combineClassNames(
            sdn.calendarDayToday?.className,
            calendarDayToday?.className,
          ),
        },
  )
  const textLabel26Props = applyRef(
    seldonRefs,
    textLabel26 === null
      ? null
      : {
          ...sdn.textLabel26,
          ...textLabel26,
          className: combineClassNames(
            sdn.textLabel26?.className,
            textLabel26?.className,
          ),
        },
  )
  const calendarDayGridCellDay18Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay18 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay18,
          ...calendarDayGridCellDay18,
          className: combineClassNames(
            sdn.calendarDayGridCellDay18?.className,
            calendarDayGridCellDay18?.className,
          ),
        },
  )
  const textLabel27Props = applyRef(
    seldonRefs,
    textLabel27 === null
      ? null
      : {
          ...sdn.textLabel27,
          ...textLabel27,
          className: combineClassNames(
            sdn.textLabel27?.className,
            textLabel27?.className,
          ),
        },
  )
  const calendarDaySelectedDayProps = applyRef(
    seldonRefs,
    calendarDaySelectedDay === null
      ? null
      : {
          ...sdn.calendarDaySelectedDay,
          ...calendarDaySelectedDay,
          className: combineClassNames(
            sdn.calendarDaySelectedDay?.className,
            calendarDaySelectedDay?.className,
          ),
        },
  )
  const textLabel28Props = applyRef(
    seldonRefs,
    textLabel28 === null
      ? null
      : {
          ...sdn.textLabel28,
          ...textLabel28,
          className: combineClassNames(
            sdn.textLabel28?.className,
            textLabel28?.className,
          ),
        },
  )
  const calendarDayGridCellDay19Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay19 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay19,
          ...calendarDayGridCellDay19,
          className: combineClassNames(
            sdn.calendarDayGridCellDay19?.className,
            calendarDayGridCellDay19?.className,
          ),
        },
  )
  const textLabel29Props = applyRef(
    seldonRefs,
    textLabel29 === null
      ? null
      : {
          ...sdn.textLabel29,
          ...textLabel29,
          className: combineClassNames(
            sdn.textLabel29?.className,
            textLabel29?.className,
          ),
        },
  )
  const calendarDayGridCellDay20Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay20 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay20,
          ...calendarDayGridCellDay20,
          className: combineClassNames(
            sdn.calendarDayGridCellDay20?.className,
            calendarDayGridCellDay20?.className,
          ),
        },
  )
  const textLabel30Props = applyRef(
    seldonRefs,
    textLabel30 === null
      ? null
      : {
          ...sdn.textLabel30,
          ...textLabel30,
          className: combineClassNames(
            sdn.textLabel30?.className,
            textLabel30?.className,
          ),
        },
  )
  const calendarDayGridCellDay21Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay21 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay21,
          ...calendarDayGridCellDay21,
          className: combineClassNames(
            sdn.calendarDayGridCellDay21?.className,
            calendarDayGridCellDay21?.className,
          ),
        },
  )
  const textLabel31Props = applyRef(
    seldonRefs,
    textLabel31 === null
      ? null
      : {
          ...sdn.textLabel31,
          ...textLabel31,
          className: combineClassNames(
            sdn.textLabel31?.className,
            textLabel31?.className,
          ),
        },
  )
  const container6Props = applyRef(
    seldonRefs,
    container6 === null
      ? null
      : {
          ...sdn.container6,
          ...container6,
          className: combineClassNames(
            sdn.container6?.className,
            container6?.className,
          ),
        },
  )
  const calendarDayGridCellDay22Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay22 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay22,
          ...calendarDayGridCellDay22,
          className: combineClassNames(
            sdn.calendarDayGridCellDay22?.className,
            calendarDayGridCellDay22?.className,
          ),
        },
  )
  const textLabel32Props = applyRef(
    seldonRefs,
    textLabel32 === null
      ? null
      : {
          ...sdn.textLabel32,
          ...textLabel32,
          className: combineClassNames(
            sdn.textLabel32?.className,
            textLabel32?.className,
          ),
        },
  )
  const calendarDayGridCellDay23Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay23 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay23,
          ...calendarDayGridCellDay23,
          className: combineClassNames(
            sdn.calendarDayGridCellDay23?.className,
            calendarDayGridCellDay23?.className,
          ),
        },
  )
  const textLabel33Props = applyRef(
    seldonRefs,
    textLabel33 === null
      ? null
      : {
          ...sdn.textLabel33,
          ...textLabel33,
          className: combineClassNames(
            sdn.textLabel33?.className,
            textLabel33?.className,
          ),
        },
  )
  const calendarDayGridCellDay24Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay24 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay24,
          ...calendarDayGridCellDay24,
          className: combineClassNames(
            sdn.calendarDayGridCellDay24?.className,
            calendarDayGridCellDay24?.className,
          ),
        },
  )
  const textLabel34Props = applyRef(
    seldonRefs,
    textLabel34 === null
      ? null
      : {
          ...sdn.textLabel34,
          ...textLabel34,
          className: combineClassNames(
            sdn.textLabel34?.className,
            textLabel34?.className,
          ),
        },
  )
  const calendarDayGridCellDay25Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay25 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay25,
          ...calendarDayGridCellDay25,
          className: combineClassNames(
            sdn.calendarDayGridCellDay25?.className,
            calendarDayGridCellDay25?.className,
          ),
        },
  )
  const textLabel35Props = applyRef(
    seldonRefs,
    textLabel35 === null
      ? null
      : {
          ...sdn.textLabel35,
          ...textLabel35,
          className: combineClassNames(
            sdn.textLabel35?.className,
            textLabel35?.className,
          ),
        },
  )
  const calendarDayGridCellDay26Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay26 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay26,
          ...calendarDayGridCellDay26,
          className: combineClassNames(
            sdn.calendarDayGridCellDay26?.className,
            calendarDayGridCellDay26?.className,
          ),
        },
  )
  const textLabel36Props = applyRef(
    seldonRefs,
    textLabel36 === null
      ? null
      : {
          ...sdn.textLabel36,
          ...textLabel36,
          className: combineClassNames(
            sdn.textLabel36?.className,
            textLabel36?.className,
          ),
        },
  )
  const calendarDayGridCellDay27Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay27 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay27,
          ...calendarDayGridCellDay27,
          className: combineClassNames(
            sdn.calendarDayGridCellDay27?.className,
            calendarDayGridCellDay27?.className,
          ),
        },
  )
  const textLabel37Props = applyRef(
    seldonRefs,
    textLabel37 === null
      ? null
      : {
          ...sdn.textLabel37,
          ...textLabel37,
          className: combineClassNames(
            sdn.textLabel37?.className,
            textLabel37?.className,
          ),
        },
  )
  const calendarDayGridCellDay28Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay28 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay28,
          ...calendarDayGridCellDay28,
          className: combineClassNames(
            sdn.calendarDayGridCellDay28?.className,
            calendarDayGridCellDay28?.className,
          ),
        },
  )
  const textLabel38Props = applyRef(
    seldonRefs,
    textLabel38 === null
      ? null
      : {
          ...sdn.textLabel38,
          ...textLabel38,
          className: combineClassNames(
            sdn.textLabel38?.className,
            textLabel38?.className,
          ),
        },
  )
  const container7Props = applyRef(
    seldonRefs,
    container7 === null
      ? null
      : {
          ...sdn.container7,
          ...container7,
          className: combineClassNames(
            sdn.container7?.className,
            container7?.className,
          ),
        },
  )
  const calendarDayGridCellDay29Props = applyRef(
    seldonRefs,
    calendarDayGridCellDay29 === null
      ? null
      : {
          ...sdn.calendarDayGridCellDay29,
          ...calendarDayGridCellDay29,
          className: combineClassNames(
            sdn.calendarDayGridCellDay29?.className,
            calendarDayGridCellDay29?.className,
          ),
        },
  )
  const textLabel39Props = applyRef(
    seldonRefs,
    textLabel39 === null
      ? null
      : {
          ...sdn.textLabel39,
          ...textLabel39,
          className: combineClassNames(
            sdn.textLabel39?.className,
            textLabel39?.className,
          ),
        },
  )
  const calendarDay2Props = applyRef(
    seldonRefs,
    calendarDay2 === null
      ? null
      : {
          ...sdn.calendarDay2,
          ...calendarDay2,
          className: combineClassNames(
            sdn.calendarDay2?.className,
            calendarDay2?.className,
          ),
        },
  )
  const textLabel40Props = applyRef(
    seldonRefs,
    textLabel40 === null
      ? null
      : {
          ...sdn.textLabel40,
          ...textLabel40,
          className: combineClassNames(
            sdn.textLabel40?.className,
            textLabel40?.className,
          ),
        },
  )

  return (
    <Frame
      className={calendarClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonIconic && buttonIconicProps && (
              <ButtonIconic {...buttonIconicProps} icon={iconProps} />
            )}
            {buttonIconic2 && buttonIconic2Props && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
            {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            {buttonIconic3 && buttonIconic3Props && (
              <ButtonIconic {...buttonIconic3Props} icon={icon3Props} />
            )}
            {buttonIconic4 && buttonIconic4Props && (
              <ButtonIconic {...buttonIconic4Props} icon={icon4Props} />
            )}
          </Frame>
          <Frame {...containerProps}>
            {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            {textLabel2 && textLabel2Props && (
              <TextLabel {...textLabel2Props} />
            )}
            {textLabel3 && textLabel3Props && (
              <TextLabel {...textLabel3Props} />
            )}
            {textLabel4 && textLabel4Props && (
              <TextLabel {...textLabel4Props} />
            )}
            {textLabel5 && textLabel5Props && (
              <TextLabel {...textLabel5Props} />
            )}
            {textLabel6 && textLabel6Props && (
              <TextLabel {...textLabel6Props} />
            )}
            {textLabel7 && textLabel7Props && (
              <TextLabel {...textLabel7Props} />
            )}
          </Frame>
          <Frame {...frame2Props}>
            <Frame {...container2Props}>
              {calendarDay && calendarDayProps && (
                <CalendarDay {...calendarDayProps}>
                  {textLabel8 && textLabel8Props && (
                    <TextLabel {...textLabel8Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDayGridCellDay && calendarDayGridCellDayProps && (
                <CalendarDayGridCellDay {...calendarDayGridCellDayProps}>
                  {textLabel9 && textLabel9Props && (
                    <TextLabel {...textLabel9Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay2 && calendarDayGridCellDay2Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay2Props}>
                  {textLabel10 && textLabel10Props && (
                    <TextLabel {...textLabel10Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
            </Frame>
            <Frame {...container3Props}>
              {calendarDayGridCellDay3 && calendarDayGridCellDay3Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay3Props}>
                  {textLabel11 && textLabel11Props && (
                    <TextLabel {...textLabel11Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay4 && calendarDayGridCellDay4Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay4Props}>
                  {textLabel12 && textLabel12Props && (
                    <TextLabel {...textLabel12Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay5 && calendarDayGridCellDay5Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay5Props}>
                  {textLabel13 && textLabel13Props && (
                    <TextLabel {...textLabel13Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay6 && calendarDayGridCellDay6Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay6Props}>
                  {textLabel14 && textLabel14Props && (
                    <TextLabel {...textLabel14Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay7 && calendarDayGridCellDay7Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay7Props}>
                  {textLabel15 && textLabel15Props && (
                    <TextLabel {...textLabel15Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay8 && calendarDayGridCellDay8Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay8Props}>
                  {textLabel16 && textLabel16Props && (
                    <TextLabel {...textLabel16Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay9 && calendarDayGridCellDay9Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay9Props}>
                  {textLabel17 && textLabel17Props && (
                    <TextLabel {...textLabel17Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
            </Frame>
            <Frame {...container4Props}>
              {calendarDayGridCellDay10 && calendarDayGridCellDay10Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay10Props}>
                  {textLabel18 && textLabel18Props && (
                    <TextLabel {...textLabel18Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay11 && calendarDayGridCellDay11Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay11Props}>
                  {textLabel19 && textLabel19Props && (
                    <TextLabel {...textLabel19Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay12 && calendarDayGridCellDay12Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay12Props}>
                  {textLabel20 && textLabel20Props && (
                    <TextLabel {...textLabel20Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay13 && calendarDayGridCellDay13Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay13Props}>
                  {textLabel21 && textLabel21Props && (
                    <TextLabel {...textLabel21Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay14 && calendarDayGridCellDay14Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay14Props}>
                  {textLabel22 && textLabel22Props && (
                    <TextLabel {...textLabel22Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay15 && calendarDayGridCellDay15Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay15Props}>
                  {textLabel23 && textLabel23Props && (
                    <TextLabel {...textLabel23Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay16 && calendarDayGridCellDay16Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay16Props}>
                  {textLabel24 && textLabel24Props && (
                    <TextLabel {...textLabel24Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
            </Frame>
            <Frame {...container5Props}>
              {calendarDayGridCellDay17 && calendarDayGridCellDay17Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay17Props}>
                  {textLabel25 && textLabel25Props && (
                    <TextLabel {...textLabel25Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayToday && calendarDayTodayProps && (
                <CalendarDayToday {...calendarDayTodayProps}>
                  {textLabel26 && textLabel26Props && (
                    <TextLabel {...textLabel26Props} />
                  )}
                </CalendarDayToday>
              )}
              {calendarDayGridCellDay18 && calendarDayGridCellDay18Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay18Props}>
                  {textLabel27 && textLabel27Props && (
                    <TextLabel {...textLabel27Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDaySelectedDay && calendarDaySelectedDayProps && (
                <CalendarDaySelectedDay {...calendarDaySelectedDayProps}>
                  {textLabel28 && textLabel28Props && (
                    <TextLabel {...textLabel28Props} />
                  )}
                </CalendarDaySelectedDay>
              )}
              {calendarDayGridCellDay19 && calendarDayGridCellDay19Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay19Props}>
                  {textLabel29 && textLabel29Props && (
                    <TextLabel {...textLabel29Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay20 && calendarDayGridCellDay20Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay20Props}>
                  {textLabel30 && textLabel30Props && (
                    <TextLabel {...textLabel30Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay21 && calendarDayGridCellDay21Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay21Props}>
                  {textLabel31 && textLabel31Props && (
                    <TextLabel {...textLabel31Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
            </Frame>
            <Frame {...container6Props}>
              {calendarDayGridCellDay22 && calendarDayGridCellDay22Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay22Props}>
                  {textLabel32 && textLabel32Props && (
                    <TextLabel {...textLabel32Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay23 && calendarDayGridCellDay23Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay23Props}>
                  {textLabel33 && textLabel33Props && (
                    <TextLabel {...textLabel33Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay24 && calendarDayGridCellDay24Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay24Props}>
                  {textLabel34 && textLabel34Props && (
                    <TextLabel {...textLabel34Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay25 && calendarDayGridCellDay25Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay25Props}>
                  {textLabel35 && textLabel35Props && (
                    <TextLabel {...textLabel35Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay26 && calendarDayGridCellDay26Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay26Props}>
                  {textLabel36 && textLabel36Props && (
                    <TextLabel {...textLabel36Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay27 && calendarDayGridCellDay27Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay27Props}>
                  {textLabel37 && textLabel37Props && (
                    <TextLabel {...textLabel37Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDayGridCellDay28 && calendarDayGridCellDay28Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay28Props}>
                  {textLabel38 && textLabel38Props && (
                    <TextLabel {...textLabel38Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
            </Frame>
            <Frame {...container7Props}>
              {calendarDayGridCellDay29 && calendarDayGridCellDay29Props && (
                <CalendarDayGridCellDay {...calendarDayGridCellDay29Props}>
                  {textLabel39 && textLabel39Props && (
                    <TextLabel {...textLabel39Props} />
                  )}
                </CalendarDayGridCellDay>
              )}
              {calendarDay2 && calendarDay2Props && (
                <CalendarDay {...calendarDay2Props}>
                  {textLabel40 && textLabel40Props && (
                    <TextLabel {...textLabel40Props} />
                  )}
                </CalendarDay>
              )}
            </Frame>
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: CalendarProps = {
  "aria-hidden": "false",
  className: "sdn-calendar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon: {
    icon: "material-chevronDoubleLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon2: {
    icon: "material-chevronLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--blaq",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon3: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  buttonIconic4: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon4: {
    icon: "material-chevronDoubleRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel7: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--hskv",
  },
  container2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDay: {
    className: "sdn-calendar-day sdn-calendar-day--i3zq",
  },
  textLabel8: {
    className: "sdn-text-label sdn-text-label--6f2j",
  },
  calendarDayGridCellDay: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel9: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay2: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel10: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCellDay3: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel11: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay4: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel12: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay5: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel13: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay6: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel14: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay7: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel15: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay8: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel16: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay9: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel17: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCellDay10: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel18: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay11: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel19: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay12: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel20: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay13: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel21: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay14: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel22: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay15: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel23: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay16: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel24: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCellDay17: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel25: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayToday: {
    className: "sdn-calendar-day-today sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel26: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDayGridCellDay18: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel27: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelectedDay: {
    className:
      "sdn-calendar-day-selected-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel28: {
    className: "sdn-text-label sdn-text-label--fye8",
  },
  calendarDayGridCellDay19: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel29: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay20: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel30: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay21: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel31: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCellDay22: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel32: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay23: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel33: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay24: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel34: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay25: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel35: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay26: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel36: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay27: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel37: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCellDay28: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel38: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCellDay29: {
    className:
      "sdn-calendar-day-grid-cell-day sdn-calendar-day-grid-cell-day--iysx",
  },
  textLabel39: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day--2hoh",
  },
  textLabel40: {
    className: "sdn-text-label sdn-text-label--6f2j",
  },
}
