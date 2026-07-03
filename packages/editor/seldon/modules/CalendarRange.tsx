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
  CalendarDayMuted,
  CalendarDayMutedProps,
} from "../elements/CalendarDayMuted"
import {
  CalendarDaySelected,
  CalendarDaySelectedProps,
} from "../elements/CalendarDaySelected"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface CalendarRangeProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  frame2?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  textTitle?: TextTitleProps | null
  container?: ContainerProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
  textLabel7?: TextLabelProps | null
  frame3?: FrameProps | null
  container2?: ContainerProps | null
  calendarDay?: CalendarDayProps | null
  textLabel8?: TextLabelProps | null
  calendarDayMuted?: CalendarDayMutedProps | null
  textLabel9?: TextLabelProps | null
  calendarDayMuted2?: CalendarDayMutedProps | null
  textLabel10?: TextLabelProps | null
  calendarDayMuted3?: CalendarDayMutedProps | null
  textLabel11?: TextLabelProps | null
  calendarDayMuted4?: CalendarDayMutedProps | null
  textLabel12?: TextLabelProps | null
  container3?: ContainerProps | null
  calendarDayMuted5?: CalendarDayMutedProps | null
  textLabel13?: TextLabelProps | null
  calendarDayMuted6?: CalendarDayMutedProps | null
  textLabel14?: TextLabelProps | null
  calendarDayMuted7?: CalendarDayMutedProps | null
  textLabel15?: TextLabelProps | null
  calendarDayMuted8?: CalendarDayMutedProps | null
  textLabel16?: TextLabelProps | null
  calendarDayMuted9?: CalendarDayMutedProps | null
  textLabel17?: TextLabelProps | null
  calendarDay2?: CalendarDayProps | null
  textLabel18?: TextLabelProps | null
  calendarDay3?: CalendarDayProps | null
  textLabel19?: TextLabelProps | null
  container4?: ContainerProps | null
  calendarDay4?: CalendarDayProps | null
  textLabel20?: TextLabelProps | null
  calendarDay5?: CalendarDayProps | null
  textLabel21?: TextLabelProps | null
  calendarDay6?: CalendarDayProps | null
  textLabel22?: TextLabelProps | null
  calendarDay7?: CalendarDayProps | null
  textLabel23?: TextLabelProps | null
  calendarDaySelected?: CalendarDaySelectedProps | null
  textLabel24?: TextLabelProps | null
  calendarDay8?: CalendarDayProps | null
  textLabel25?: TextLabelProps | null
  calendarDaySelected2?: CalendarDaySelectedProps | null
  textLabel26?: TextLabelProps | null
  container5?: ContainerProps | null
  calendarDay9?: CalendarDayProps | null
  textLabel27?: TextLabelProps | null
  calendarDay10?: CalendarDayProps | null
  textLabel28?: TextLabelProps | null
  calendarDay11?: CalendarDayProps | null
  textLabel29?: TextLabelProps | null
  calendarDay12?: CalendarDayProps | null
  textLabel30?: TextLabelProps | null
  calendarDay13?: CalendarDayProps | null
  textLabel31?: TextLabelProps | null
  calendarDay14?: CalendarDayProps | null
  textLabel32?: TextLabelProps | null
  calendarDay15?: CalendarDayProps | null
  textLabel33?: TextLabelProps | null
  container6?: ContainerProps | null
  calendarDay16?: CalendarDayProps | null
  textLabel34?: TextLabelProps | null
  calendarDay17?: CalendarDayProps | null
  textLabel35?: TextLabelProps | null
  calendarDay18?: CalendarDayProps | null
  textLabel36?: TextLabelProps | null
  calendarDay19?: CalendarDayProps | null
  textLabel37?: TextLabelProps | null
  calendarDay20?: CalendarDayProps | null
  textLabel38?: TextLabelProps | null
  calendarDay21?: CalendarDayProps | null
  textLabel39?: TextLabelProps | null
  calendarDay22?: CalendarDayProps | null
  textLabel40?: TextLabelProps | null
  frame4?: FrameProps | null
  frame5?: FrameProps | null
  textTitle2?: TextTitleProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  container7?: ContainerProps | null
  textLabel41?: TextLabelProps | null
  textLabel42?: TextLabelProps | null
  textLabel43?: TextLabelProps | null
  textLabel44?: TextLabelProps | null
  textLabel45?: TextLabelProps | null
  textLabel46?: TextLabelProps | null
  textLabel47?: TextLabelProps | null
  frame6?: FrameProps | null
  container8?: ContainerProps | null
  calendarDay23?: CalendarDayProps | null
  textLabel48?: TextLabelProps | null
  calendarDay24?: CalendarDayProps | null
  textLabel49?: TextLabelProps | null
  container9?: ContainerProps | null
  calendarDay25?: CalendarDayProps | null
  textLabel50?: TextLabelProps | null
  calendarDay26?: CalendarDayProps | null
  textLabel51?: TextLabelProps | null
  calendarDay27?: CalendarDayProps | null
  textLabel52?: TextLabelProps | null
  calendarDay28?: CalendarDayProps | null
  textLabel53?: TextLabelProps | null
  calendarDay29?: CalendarDayProps | null
  textLabel54?: TextLabelProps | null
  calendarDay30?: CalendarDayProps | null
  textLabel55?: TextLabelProps | null
  calendarDay31?: CalendarDayProps | null
  textLabel56?: TextLabelProps | null
  container10?: ContainerProps | null
  calendarDay32?: CalendarDayProps | null
  textLabel57?: TextLabelProps | null
  calendarDay33?: CalendarDayProps | null
  textLabel58?: TextLabelProps | null
  calendarDay34?: CalendarDayProps | null
  textLabel59?: TextLabelProps | null
  calendarDay35?: CalendarDayProps | null
  textLabel60?: TextLabelProps | null
  calendarDay36?: CalendarDayProps | null
  textLabel61?: TextLabelProps | null
  calendarDay37?: CalendarDayProps | null
  textLabel62?: TextLabelProps | null
  calendarDay38?: CalendarDayProps | null
  textLabel63?: TextLabelProps | null
  container11?: ContainerProps | null
  calendarDay39?: CalendarDayProps | null
  textLabel64?: TextLabelProps | null
  calendarDay40?: CalendarDayProps | null
  textLabel65?: TextLabelProps | null
  calendarDay41?: CalendarDayProps | null
  textLabel66?: TextLabelProps | null
  calendarDay42?: CalendarDayProps | null
  textLabel67?: TextLabelProps | null
  calendarDay43?: CalendarDayProps | null
  textLabel68?: TextLabelProps | null
  calendarDay44?: CalendarDayProps | null
  textLabel69?: TextLabelProps | null
  calendarDay45?: CalendarDayProps | null
  textLabel70?: TextLabelProps | null
  container12?: ContainerProps | null
  calendarDay46?: CalendarDayProps | null
  textLabel71?: TextLabelProps | null
  calendarDay47?: CalendarDayProps | null
  textLabel72?: TextLabelProps | null
  calendarDay48?: CalendarDayProps | null
  textLabel73?: TextLabelProps | null
  calendarDay49?: CalendarDayProps | null
  textLabel74?: TextLabelProps | null
  calendarDay50?: CalendarDayProps | null
  textLabel75?: TextLabelProps | null
  calendarDay51?: CalendarDayProps | null
  textLabel76?: TextLabelProps | null
  calendarDay52?: CalendarDayProps | null
  textLabel77?: TextLabelProps | null
  container13?: ContainerProps | null
  calendarDay53?: CalendarDayProps | null
  textLabel78?: TextLabelProps | null
  calendarDay54?: CalendarDayProps | null
  textLabel79?: TextLabelProps | null
}

/*****
 * Calendar: CalendarRange
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
 *
 * @example
 * ```tsx
 * <CalendarRange
 *   aria-hidden="false"
 *   frame="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   textTitle="Product Title"
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
 *   calendarDayMuted2="{}"
 *   calendarDayMuted3="{}"
 *   calendarDayMuted4="{}"
 *   calendarDayMuted5="{}"
 *   container2="{}"
 *   calendarDayMuted="{}"
 *   calendarDay6="{}"
 *   calendarDay7="{}"
 *   container3="{}"
 *   calendarDay2="{}"
 *   calendarDay3="{}"
 *   calendarDay4="{}"
 *   calendarDaySelected5="{}"
 *   calendarDaySelected7="{}"
 *   container4="{}"
 *   calendarDay5="{}"
 *   container5="{}"
 *   container6="{}"
 * />
 * ```
 *****/
export function CalendarRange({
  className = "",
  frame = sdn.frame,
  frame2 = sdn.frame2,
  buttonIconic,
  icon = sdn.icon,
  textTitle,
  container = sdn.container,
  textLabel,
  textLabel2,
  textLabel3,
  textLabel4,
  textLabel5,
  textLabel6,
  textLabel7,
  frame3 = sdn.frame3,
  container2 = sdn.container2,
  calendarDay,
  textLabel8,
  calendarDayMuted,
  textLabel9,
  calendarDayMuted2,
  textLabel10,
  calendarDayMuted3,
  textLabel11,
  calendarDayMuted4,
  textLabel12,
  container3 = sdn.container3,
  calendarDayMuted5,
  textLabel13,
  calendarDayMuted6,
  textLabel14,
  calendarDayMuted7,
  textLabel15,
  calendarDayMuted8,
  textLabel16,
  calendarDayMuted9,
  textLabel17,
  calendarDay2,
  textLabel18,
  calendarDay3,
  textLabel19,
  container4 = sdn.container4,
  calendarDay4,
  textLabel20,
  calendarDay5,
  textLabel21,
  calendarDay6,
  textLabel22,
  calendarDay7,
  textLabel23,
  calendarDaySelected,
  textLabel24,
  calendarDay8,
  textLabel25,
  calendarDaySelected2,
  textLabel26,
  container5 = sdn.container5,
  calendarDay9,
  textLabel27,
  calendarDay10,
  textLabel28,
  calendarDay11,
  textLabel29,
  calendarDay12,
  textLabel30,
  calendarDay13,
  textLabel31,
  calendarDay14,
  textLabel32,
  calendarDay15,
  textLabel33,
  container6 = sdn.container6,
  calendarDay16,
  textLabel34,
  calendarDay17,
  textLabel35,
  calendarDay18,
  textLabel36,
  calendarDay19,
  textLabel37,
  calendarDay20,
  textLabel38,
  calendarDay21,
  textLabel39,
  calendarDay22,
  textLabel40,
  frame4 = sdn.frame4,
  frame5 = sdn.frame5,
  textTitle2,
  buttonIconic2,
  icon2 = sdn.icon2,
  container7 = sdn.container7,
  textLabel41,
  textLabel42,
  textLabel43,
  textLabel44,
  textLabel45,
  textLabel46,
  textLabel47,
  frame6 = sdn.frame6,
  container8 = sdn.container8,
  calendarDay23,
  textLabel48,
  calendarDay24,
  textLabel49,
  container9 = sdn.container9,
  calendarDay25,
  textLabel50,
  calendarDay26,
  textLabel51,
  calendarDay27,
  textLabel52,
  calendarDay28,
  textLabel53,
  calendarDay29,
  textLabel54,
  calendarDay30,
  textLabel55,
  calendarDay31,
  textLabel56,
  container10 = sdn.container10,
  calendarDay32,
  textLabel57,
  calendarDay33,
  textLabel58,
  calendarDay34,
  textLabel59,
  calendarDay35,
  textLabel60,
  calendarDay36,
  textLabel61,
  calendarDay37,
  textLabel62,
  calendarDay38,
  textLabel63,
  container11 = sdn.container11,
  calendarDay39,
  textLabel64,
  calendarDay40,
  textLabel65,
  calendarDay41,
  textLabel66,
  calendarDay42,
  textLabel67,
  calendarDay43,
  textLabel68,
  calendarDay44,
  textLabel69,
  calendarDay45,
  textLabel70,
  container12 = sdn.container12,
  calendarDay46,
  textLabel71,
  calendarDay47,
  textLabel72,
  calendarDay48,
  textLabel73,
  calendarDay49,
  textLabel74,
  calendarDay50,
  textLabel75,
  calendarDay51,
  textLabel76,
  calendarDay52,
  textLabel77,
  container13 = sdn.container13,
  calendarDay53,
  textLabel78,
  calendarDay54,
  textLabel79,
  children,
  seldonRefs,
  ...props
}: CalendarRangeProps) {
  const calendarRangeClassName = combineClassNames(
    "sdn-calendar-range",
    className,
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
  const calendarDayMutedProps = applyRef(
    seldonRefs,
    calendarDayMuted === null
      ? null
      : {
          ...sdn.calendarDayMuted,
          ...calendarDayMuted,
          className: combineClassNames(
            sdn.calendarDayMuted?.className,
            calendarDayMuted?.className,
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
  const calendarDayMuted2Props = applyRef(
    seldonRefs,
    calendarDayMuted2 === null
      ? null
      : {
          ...sdn.calendarDayMuted2,
          ...calendarDayMuted2,
          className: combineClassNames(
            sdn.calendarDayMuted2?.className,
            calendarDayMuted2?.className,
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
  const calendarDayMuted3Props = applyRef(
    seldonRefs,
    calendarDayMuted3 === null
      ? null
      : {
          ...sdn.calendarDayMuted3,
          ...calendarDayMuted3,
          className: combineClassNames(
            sdn.calendarDayMuted3?.className,
            calendarDayMuted3?.className,
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
  const calendarDayMuted4Props = applyRef(
    seldonRefs,
    calendarDayMuted4 === null
      ? null
      : {
          ...sdn.calendarDayMuted4,
          ...calendarDayMuted4,
          className: combineClassNames(
            sdn.calendarDayMuted4?.className,
            calendarDayMuted4?.className,
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
  const calendarDayMuted5Props = applyRef(
    seldonRefs,
    calendarDayMuted5 === null
      ? null
      : {
          ...sdn.calendarDayMuted5,
          ...calendarDayMuted5,
          className: combineClassNames(
            sdn.calendarDayMuted5?.className,
            calendarDayMuted5?.className,
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
  const calendarDayMuted6Props = applyRef(
    seldonRefs,
    calendarDayMuted6 === null
      ? null
      : {
          ...sdn.calendarDayMuted6,
          ...calendarDayMuted6,
          className: combineClassNames(
            sdn.calendarDayMuted6?.className,
            calendarDayMuted6?.className,
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
  const calendarDayMuted7Props = applyRef(
    seldonRefs,
    calendarDayMuted7 === null
      ? null
      : {
          ...sdn.calendarDayMuted7,
          ...calendarDayMuted7,
          className: combineClassNames(
            sdn.calendarDayMuted7?.className,
            calendarDayMuted7?.className,
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
  const calendarDayMuted8Props = applyRef(
    seldonRefs,
    calendarDayMuted8 === null
      ? null
      : {
          ...sdn.calendarDayMuted8,
          ...calendarDayMuted8,
          className: combineClassNames(
            sdn.calendarDayMuted8?.className,
            calendarDayMuted8?.className,
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
  const calendarDayMuted9Props = applyRef(
    seldonRefs,
    calendarDayMuted9 === null
      ? null
      : {
          ...sdn.calendarDayMuted9,
          ...calendarDayMuted9,
          className: combineClassNames(
            sdn.calendarDayMuted9?.className,
            calendarDayMuted9?.className,
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
  const calendarDay3Props = applyRef(
    seldonRefs,
    calendarDay3 === null
      ? null
      : {
          ...sdn.calendarDay3,
          ...calendarDay3,
          className: combineClassNames(
            sdn.calendarDay3?.className,
            calendarDay3?.className,
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
  const calendarDay4Props = applyRef(
    seldonRefs,
    calendarDay4 === null
      ? null
      : {
          ...sdn.calendarDay4,
          ...calendarDay4,
          className: combineClassNames(
            sdn.calendarDay4?.className,
            calendarDay4?.className,
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
  const calendarDay5Props = applyRef(
    seldonRefs,
    calendarDay5 === null
      ? null
      : {
          ...sdn.calendarDay5,
          ...calendarDay5,
          className: combineClassNames(
            sdn.calendarDay5?.className,
            calendarDay5?.className,
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
  const calendarDay6Props = applyRef(
    seldonRefs,
    calendarDay6 === null
      ? null
      : {
          ...sdn.calendarDay6,
          ...calendarDay6,
          className: combineClassNames(
            sdn.calendarDay6?.className,
            calendarDay6?.className,
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
  const calendarDay7Props = applyRef(
    seldonRefs,
    calendarDay7 === null
      ? null
      : {
          ...sdn.calendarDay7,
          ...calendarDay7,
          className: combineClassNames(
            sdn.calendarDay7?.className,
            calendarDay7?.className,
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
  const calendarDaySelectedProps = applyRef(
    seldonRefs,
    calendarDaySelected === null
      ? null
      : {
          ...sdn.calendarDaySelected,
          ...calendarDaySelected,
          className: combineClassNames(
            sdn.calendarDaySelected?.className,
            calendarDaySelected?.className,
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
  const calendarDay8Props = applyRef(
    seldonRefs,
    calendarDay8 === null
      ? null
      : {
          ...sdn.calendarDay8,
          ...calendarDay8,
          className: combineClassNames(
            sdn.calendarDay8?.className,
            calendarDay8?.className,
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
  const calendarDaySelected2Props = applyRef(
    seldonRefs,
    calendarDaySelected2 === null
      ? null
      : {
          ...sdn.calendarDaySelected2,
          ...calendarDaySelected2,
          className: combineClassNames(
            sdn.calendarDaySelected2?.className,
            calendarDaySelected2?.className,
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
  const calendarDay9Props = applyRef(
    seldonRefs,
    calendarDay9 === null
      ? null
      : {
          ...sdn.calendarDay9,
          ...calendarDay9,
          className: combineClassNames(
            sdn.calendarDay9?.className,
            calendarDay9?.className,
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
  const calendarDay10Props = applyRef(
    seldonRefs,
    calendarDay10 === null
      ? null
      : {
          ...sdn.calendarDay10,
          ...calendarDay10,
          className: combineClassNames(
            sdn.calendarDay10?.className,
            calendarDay10?.className,
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
  const calendarDay11Props = applyRef(
    seldonRefs,
    calendarDay11 === null
      ? null
      : {
          ...sdn.calendarDay11,
          ...calendarDay11,
          className: combineClassNames(
            sdn.calendarDay11?.className,
            calendarDay11?.className,
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
  const calendarDay12Props = applyRef(
    seldonRefs,
    calendarDay12 === null
      ? null
      : {
          ...sdn.calendarDay12,
          ...calendarDay12,
          className: combineClassNames(
            sdn.calendarDay12?.className,
            calendarDay12?.className,
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
  const calendarDay13Props = applyRef(
    seldonRefs,
    calendarDay13 === null
      ? null
      : {
          ...sdn.calendarDay13,
          ...calendarDay13,
          className: combineClassNames(
            sdn.calendarDay13?.className,
            calendarDay13?.className,
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
  const calendarDay14Props = applyRef(
    seldonRefs,
    calendarDay14 === null
      ? null
      : {
          ...sdn.calendarDay14,
          ...calendarDay14,
          className: combineClassNames(
            sdn.calendarDay14?.className,
            calendarDay14?.className,
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
  const calendarDay15Props = applyRef(
    seldonRefs,
    calendarDay15 === null
      ? null
      : {
          ...sdn.calendarDay15,
          ...calendarDay15,
          className: combineClassNames(
            sdn.calendarDay15?.className,
            calendarDay15?.className,
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
  const calendarDay16Props = applyRef(
    seldonRefs,
    calendarDay16 === null
      ? null
      : {
          ...sdn.calendarDay16,
          ...calendarDay16,
          className: combineClassNames(
            sdn.calendarDay16?.className,
            calendarDay16?.className,
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
  const calendarDay17Props = applyRef(
    seldonRefs,
    calendarDay17 === null
      ? null
      : {
          ...sdn.calendarDay17,
          ...calendarDay17,
          className: combineClassNames(
            sdn.calendarDay17?.className,
            calendarDay17?.className,
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
  const calendarDay18Props = applyRef(
    seldonRefs,
    calendarDay18 === null
      ? null
      : {
          ...sdn.calendarDay18,
          ...calendarDay18,
          className: combineClassNames(
            sdn.calendarDay18?.className,
            calendarDay18?.className,
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
  const calendarDay19Props = applyRef(
    seldonRefs,
    calendarDay19 === null
      ? null
      : {
          ...sdn.calendarDay19,
          ...calendarDay19,
          className: combineClassNames(
            sdn.calendarDay19?.className,
            calendarDay19?.className,
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
  const calendarDay20Props = applyRef(
    seldonRefs,
    calendarDay20 === null
      ? null
      : {
          ...sdn.calendarDay20,
          ...calendarDay20,
          className: combineClassNames(
            sdn.calendarDay20?.className,
            calendarDay20?.className,
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
  const calendarDay21Props = applyRef(
    seldonRefs,
    calendarDay21 === null
      ? null
      : {
          ...sdn.calendarDay21,
          ...calendarDay21,
          className: combineClassNames(
            sdn.calendarDay21?.className,
            calendarDay21?.className,
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
  const calendarDay22Props = applyRef(
    seldonRefs,
    calendarDay22 === null
      ? null
      : {
          ...sdn.calendarDay22,
          ...calendarDay22,
          className: combineClassNames(
            sdn.calendarDay22?.className,
            calendarDay22?.className,
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
  const textLabel41Props = applyRef(
    seldonRefs,
    textLabel41 === null
      ? null
      : {
          ...sdn.textLabel41,
          ...textLabel41,
          className: combineClassNames(
            sdn.textLabel41?.className,
            textLabel41?.className,
          ),
        },
  )
  const textLabel42Props = applyRef(
    seldonRefs,
    textLabel42 === null
      ? null
      : {
          ...sdn.textLabel42,
          ...textLabel42,
          className: combineClassNames(
            sdn.textLabel42?.className,
            textLabel42?.className,
          ),
        },
  )
  const textLabel43Props = applyRef(
    seldonRefs,
    textLabel43 === null
      ? null
      : {
          ...sdn.textLabel43,
          ...textLabel43,
          className: combineClassNames(
            sdn.textLabel43?.className,
            textLabel43?.className,
          ),
        },
  )
  const textLabel44Props = applyRef(
    seldonRefs,
    textLabel44 === null
      ? null
      : {
          ...sdn.textLabel44,
          ...textLabel44,
          className: combineClassNames(
            sdn.textLabel44?.className,
            textLabel44?.className,
          ),
        },
  )
  const textLabel45Props = applyRef(
    seldonRefs,
    textLabel45 === null
      ? null
      : {
          ...sdn.textLabel45,
          ...textLabel45,
          className: combineClassNames(
            sdn.textLabel45?.className,
            textLabel45?.className,
          ),
        },
  )
  const textLabel46Props = applyRef(
    seldonRefs,
    textLabel46 === null
      ? null
      : {
          ...sdn.textLabel46,
          ...textLabel46,
          className: combineClassNames(
            sdn.textLabel46?.className,
            textLabel46?.className,
          ),
        },
  )
  const textLabel47Props = applyRef(
    seldonRefs,
    textLabel47 === null
      ? null
      : {
          ...sdn.textLabel47,
          ...textLabel47,
          className: combineClassNames(
            sdn.textLabel47?.className,
            textLabel47?.className,
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
  const container8Props = applyRef(
    seldonRefs,
    container8 === null
      ? null
      : {
          ...sdn.container8,
          ...container8,
          className: combineClassNames(
            sdn.container8?.className,
            container8?.className,
          ),
        },
  )
  const calendarDay23Props = applyRef(
    seldonRefs,
    calendarDay23 === null
      ? null
      : {
          ...sdn.calendarDay23,
          ...calendarDay23,
          className: combineClassNames(
            sdn.calendarDay23?.className,
            calendarDay23?.className,
          ),
        },
  )
  const textLabel48Props = applyRef(
    seldonRefs,
    textLabel48 === null
      ? null
      : {
          ...sdn.textLabel48,
          ...textLabel48,
          className: combineClassNames(
            sdn.textLabel48?.className,
            textLabel48?.className,
          ),
        },
  )
  const calendarDay24Props = applyRef(
    seldonRefs,
    calendarDay24 === null
      ? null
      : {
          ...sdn.calendarDay24,
          ...calendarDay24,
          className: combineClassNames(
            sdn.calendarDay24?.className,
            calendarDay24?.className,
          ),
        },
  )
  const textLabel49Props = applyRef(
    seldonRefs,
    textLabel49 === null
      ? null
      : {
          ...sdn.textLabel49,
          ...textLabel49,
          className: combineClassNames(
            sdn.textLabel49?.className,
            textLabel49?.className,
          ),
        },
  )
  const container9Props = applyRef(
    seldonRefs,
    container9 === null
      ? null
      : {
          ...sdn.container9,
          ...container9,
          className: combineClassNames(
            sdn.container9?.className,
            container9?.className,
          ),
        },
  )
  const calendarDay25Props = applyRef(
    seldonRefs,
    calendarDay25 === null
      ? null
      : {
          ...sdn.calendarDay25,
          ...calendarDay25,
          className: combineClassNames(
            sdn.calendarDay25?.className,
            calendarDay25?.className,
          ),
        },
  )
  const textLabel50Props = applyRef(
    seldonRefs,
    textLabel50 === null
      ? null
      : {
          ...sdn.textLabel50,
          ...textLabel50,
          className: combineClassNames(
            sdn.textLabel50?.className,
            textLabel50?.className,
          ),
        },
  )
  const calendarDay26Props = applyRef(
    seldonRefs,
    calendarDay26 === null
      ? null
      : {
          ...sdn.calendarDay26,
          ...calendarDay26,
          className: combineClassNames(
            sdn.calendarDay26?.className,
            calendarDay26?.className,
          ),
        },
  )
  const textLabel51Props = applyRef(
    seldonRefs,
    textLabel51 === null
      ? null
      : {
          ...sdn.textLabel51,
          ...textLabel51,
          className: combineClassNames(
            sdn.textLabel51?.className,
            textLabel51?.className,
          ),
        },
  )
  const calendarDay27Props = applyRef(
    seldonRefs,
    calendarDay27 === null
      ? null
      : {
          ...sdn.calendarDay27,
          ...calendarDay27,
          className: combineClassNames(
            sdn.calendarDay27?.className,
            calendarDay27?.className,
          ),
        },
  )
  const textLabel52Props = applyRef(
    seldonRefs,
    textLabel52 === null
      ? null
      : {
          ...sdn.textLabel52,
          ...textLabel52,
          className: combineClassNames(
            sdn.textLabel52?.className,
            textLabel52?.className,
          ),
        },
  )
  const calendarDay28Props = applyRef(
    seldonRefs,
    calendarDay28 === null
      ? null
      : {
          ...sdn.calendarDay28,
          ...calendarDay28,
          className: combineClassNames(
            sdn.calendarDay28?.className,
            calendarDay28?.className,
          ),
        },
  )
  const textLabel53Props = applyRef(
    seldonRefs,
    textLabel53 === null
      ? null
      : {
          ...sdn.textLabel53,
          ...textLabel53,
          className: combineClassNames(
            sdn.textLabel53?.className,
            textLabel53?.className,
          ),
        },
  )
  const calendarDay29Props = applyRef(
    seldonRefs,
    calendarDay29 === null
      ? null
      : {
          ...sdn.calendarDay29,
          ...calendarDay29,
          className: combineClassNames(
            sdn.calendarDay29?.className,
            calendarDay29?.className,
          ),
        },
  )
  const textLabel54Props = applyRef(
    seldonRefs,
    textLabel54 === null
      ? null
      : {
          ...sdn.textLabel54,
          ...textLabel54,
          className: combineClassNames(
            sdn.textLabel54?.className,
            textLabel54?.className,
          ),
        },
  )
  const calendarDay30Props = applyRef(
    seldonRefs,
    calendarDay30 === null
      ? null
      : {
          ...sdn.calendarDay30,
          ...calendarDay30,
          className: combineClassNames(
            sdn.calendarDay30?.className,
            calendarDay30?.className,
          ),
        },
  )
  const textLabel55Props = applyRef(
    seldonRefs,
    textLabel55 === null
      ? null
      : {
          ...sdn.textLabel55,
          ...textLabel55,
          className: combineClassNames(
            sdn.textLabel55?.className,
            textLabel55?.className,
          ),
        },
  )
  const calendarDay31Props = applyRef(
    seldonRefs,
    calendarDay31 === null
      ? null
      : {
          ...sdn.calendarDay31,
          ...calendarDay31,
          className: combineClassNames(
            sdn.calendarDay31?.className,
            calendarDay31?.className,
          ),
        },
  )
  const textLabel56Props = applyRef(
    seldonRefs,
    textLabel56 === null
      ? null
      : {
          ...sdn.textLabel56,
          ...textLabel56,
          className: combineClassNames(
            sdn.textLabel56?.className,
            textLabel56?.className,
          ),
        },
  )
  const container10Props = applyRef(
    seldonRefs,
    container10 === null
      ? null
      : {
          ...sdn.container10,
          ...container10,
          className: combineClassNames(
            sdn.container10?.className,
            container10?.className,
          ),
        },
  )
  const calendarDay32Props = applyRef(
    seldonRefs,
    calendarDay32 === null
      ? null
      : {
          ...sdn.calendarDay32,
          ...calendarDay32,
          className: combineClassNames(
            sdn.calendarDay32?.className,
            calendarDay32?.className,
          ),
        },
  )
  const textLabel57Props = applyRef(
    seldonRefs,
    textLabel57 === null
      ? null
      : {
          ...sdn.textLabel57,
          ...textLabel57,
          className: combineClassNames(
            sdn.textLabel57?.className,
            textLabel57?.className,
          ),
        },
  )
  const calendarDay33Props = applyRef(
    seldonRefs,
    calendarDay33 === null
      ? null
      : {
          ...sdn.calendarDay33,
          ...calendarDay33,
          className: combineClassNames(
            sdn.calendarDay33?.className,
            calendarDay33?.className,
          ),
        },
  )
  const textLabel58Props = applyRef(
    seldonRefs,
    textLabel58 === null
      ? null
      : {
          ...sdn.textLabel58,
          ...textLabel58,
          className: combineClassNames(
            sdn.textLabel58?.className,
            textLabel58?.className,
          ),
        },
  )
  const calendarDay34Props = applyRef(
    seldonRefs,
    calendarDay34 === null
      ? null
      : {
          ...sdn.calendarDay34,
          ...calendarDay34,
          className: combineClassNames(
            sdn.calendarDay34?.className,
            calendarDay34?.className,
          ),
        },
  )
  const textLabel59Props = applyRef(
    seldonRefs,
    textLabel59 === null
      ? null
      : {
          ...sdn.textLabel59,
          ...textLabel59,
          className: combineClassNames(
            sdn.textLabel59?.className,
            textLabel59?.className,
          ),
        },
  )
  const calendarDay35Props = applyRef(
    seldonRefs,
    calendarDay35 === null
      ? null
      : {
          ...sdn.calendarDay35,
          ...calendarDay35,
          className: combineClassNames(
            sdn.calendarDay35?.className,
            calendarDay35?.className,
          ),
        },
  )
  const textLabel60Props = applyRef(
    seldonRefs,
    textLabel60 === null
      ? null
      : {
          ...sdn.textLabel60,
          ...textLabel60,
          className: combineClassNames(
            sdn.textLabel60?.className,
            textLabel60?.className,
          ),
        },
  )
  const calendarDay36Props = applyRef(
    seldonRefs,
    calendarDay36 === null
      ? null
      : {
          ...sdn.calendarDay36,
          ...calendarDay36,
          className: combineClassNames(
            sdn.calendarDay36?.className,
            calendarDay36?.className,
          ),
        },
  )
  const textLabel61Props = applyRef(
    seldonRefs,
    textLabel61 === null
      ? null
      : {
          ...sdn.textLabel61,
          ...textLabel61,
          className: combineClassNames(
            sdn.textLabel61?.className,
            textLabel61?.className,
          ),
        },
  )
  const calendarDay37Props = applyRef(
    seldonRefs,
    calendarDay37 === null
      ? null
      : {
          ...sdn.calendarDay37,
          ...calendarDay37,
          className: combineClassNames(
            sdn.calendarDay37?.className,
            calendarDay37?.className,
          ),
        },
  )
  const textLabel62Props = applyRef(
    seldonRefs,
    textLabel62 === null
      ? null
      : {
          ...sdn.textLabel62,
          ...textLabel62,
          className: combineClassNames(
            sdn.textLabel62?.className,
            textLabel62?.className,
          ),
        },
  )
  const calendarDay38Props = applyRef(
    seldonRefs,
    calendarDay38 === null
      ? null
      : {
          ...sdn.calendarDay38,
          ...calendarDay38,
          className: combineClassNames(
            sdn.calendarDay38?.className,
            calendarDay38?.className,
          ),
        },
  )
  const textLabel63Props = applyRef(
    seldonRefs,
    textLabel63 === null
      ? null
      : {
          ...sdn.textLabel63,
          ...textLabel63,
          className: combineClassNames(
            sdn.textLabel63?.className,
            textLabel63?.className,
          ),
        },
  )
  const container11Props = applyRef(
    seldonRefs,
    container11 === null
      ? null
      : {
          ...sdn.container11,
          ...container11,
          className: combineClassNames(
            sdn.container11?.className,
            container11?.className,
          ),
        },
  )
  const calendarDay39Props = applyRef(
    seldonRefs,
    calendarDay39 === null
      ? null
      : {
          ...sdn.calendarDay39,
          ...calendarDay39,
          className: combineClassNames(
            sdn.calendarDay39?.className,
            calendarDay39?.className,
          ),
        },
  )
  const textLabel64Props = applyRef(
    seldonRefs,
    textLabel64 === null
      ? null
      : {
          ...sdn.textLabel64,
          ...textLabel64,
          className: combineClassNames(
            sdn.textLabel64?.className,
            textLabel64?.className,
          ),
        },
  )
  const calendarDay40Props = applyRef(
    seldonRefs,
    calendarDay40 === null
      ? null
      : {
          ...sdn.calendarDay40,
          ...calendarDay40,
          className: combineClassNames(
            sdn.calendarDay40?.className,
            calendarDay40?.className,
          ),
        },
  )
  const textLabel65Props = applyRef(
    seldonRefs,
    textLabel65 === null
      ? null
      : {
          ...sdn.textLabel65,
          ...textLabel65,
          className: combineClassNames(
            sdn.textLabel65?.className,
            textLabel65?.className,
          ),
        },
  )
  const calendarDay41Props = applyRef(
    seldonRefs,
    calendarDay41 === null
      ? null
      : {
          ...sdn.calendarDay41,
          ...calendarDay41,
          className: combineClassNames(
            sdn.calendarDay41?.className,
            calendarDay41?.className,
          ),
        },
  )
  const textLabel66Props = applyRef(
    seldonRefs,
    textLabel66 === null
      ? null
      : {
          ...sdn.textLabel66,
          ...textLabel66,
          className: combineClassNames(
            sdn.textLabel66?.className,
            textLabel66?.className,
          ),
        },
  )
  const calendarDay42Props = applyRef(
    seldonRefs,
    calendarDay42 === null
      ? null
      : {
          ...sdn.calendarDay42,
          ...calendarDay42,
          className: combineClassNames(
            sdn.calendarDay42?.className,
            calendarDay42?.className,
          ),
        },
  )
  const textLabel67Props = applyRef(
    seldonRefs,
    textLabel67 === null
      ? null
      : {
          ...sdn.textLabel67,
          ...textLabel67,
          className: combineClassNames(
            sdn.textLabel67?.className,
            textLabel67?.className,
          ),
        },
  )
  const calendarDay43Props = applyRef(
    seldonRefs,
    calendarDay43 === null
      ? null
      : {
          ...sdn.calendarDay43,
          ...calendarDay43,
          className: combineClassNames(
            sdn.calendarDay43?.className,
            calendarDay43?.className,
          ),
        },
  )
  const textLabel68Props = applyRef(
    seldonRefs,
    textLabel68 === null
      ? null
      : {
          ...sdn.textLabel68,
          ...textLabel68,
          className: combineClassNames(
            sdn.textLabel68?.className,
            textLabel68?.className,
          ),
        },
  )
  const calendarDay44Props = applyRef(
    seldonRefs,
    calendarDay44 === null
      ? null
      : {
          ...sdn.calendarDay44,
          ...calendarDay44,
          className: combineClassNames(
            sdn.calendarDay44?.className,
            calendarDay44?.className,
          ),
        },
  )
  const textLabel69Props = applyRef(
    seldonRefs,
    textLabel69 === null
      ? null
      : {
          ...sdn.textLabel69,
          ...textLabel69,
          className: combineClassNames(
            sdn.textLabel69?.className,
            textLabel69?.className,
          ),
        },
  )
  const calendarDay45Props = applyRef(
    seldonRefs,
    calendarDay45 === null
      ? null
      : {
          ...sdn.calendarDay45,
          ...calendarDay45,
          className: combineClassNames(
            sdn.calendarDay45?.className,
            calendarDay45?.className,
          ),
        },
  )
  const textLabel70Props = applyRef(
    seldonRefs,
    textLabel70 === null
      ? null
      : {
          ...sdn.textLabel70,
          ...textLabel70,
          className: combineClassNames(
            sdn.textLabel70?.className,
            textLabel70?.className,
          ),
        },
  )
  const container12Props = applyRef(
    seldonRefs,
    container12 === null
      ? null
      : {
          ...sdn.container12,
          ...container12,
          className: combineClassNames(
            sdn.container12?.className,
            container12?.className,
          ),
        },
  )
  const calendarDay46Props = applyRef(
    seldonRefs,
    calendarDay46 === null
      ? null
      : {
          ...sdn.calendarDay46,
          ...calendarDay46,
          className: combineClassNames(
            sdn.calendarDay46?.className,
            calendarDay46?.className,
          ),
        },
  )
  const textLabel71Props = applyRef(
    seldonRefs,
    textLabel71 === null
      ? null
      : {
          ...sdn.textLabel71,
          ...textLabel71,
          className: combineClassNames(
            sdn.textLabel71?.className,
            textLabel71?.className,
          ),
        },
  )
  const calendarDay47Props = applyRef(
    seldonRefs,
    calendarDay47 === null
      ? null
      : {
          ...sdn.calendarDay47,
          ...calendarDay47,
          className: combineClassNames(
            sdn.calendarDay47?.className,
            calendarDay47?.className,
          ),
        },
  )
  const textLabel72Props = applyRef(
    seldonRefs,
    textLabel72 === null
      ? null
      : {
          ...sdn.textLabel72,
          ...textLabel72,
          className: combineClassNames(
            sdn.textLabel72?.className,
            textLabel72?.className,
          ),
        },
  )
  const calendarDay48Props = applyRef(
    seldonRefs,
    calendarDay48 === null
      ? null
      : {
          ...sdn.calendarDay48,
          ...calendarDay48,
          className: combineClassNames(
            sdn.calendarDay48?.className,
            calendarDay48?.className,
          ),
        },
  )
  const textLabel73Props = applyRef(
    seldonRefs,
    textLabel73 === null
      ? null
      : {
          ...sdn.textLabel73,
          ...textLabel73,
          className: combineClassNames(
            sdn.textLabel73?.className,
            textLabel73?.className,
          ),
        },
  )
  const calendarDay49Props = applyRef(
    seldonRefs,
    calendarDay49 === null
      ? null
      : {
          ...sdn.calendarDay49,
          ...calendarDay49,
          className: combineClassNames(
            sdn.calendarDay49?.className,
            calendarDay49?.className,
          ),
        },
  )
  const textLabel74Props = applyRef(
    seldonRefs,
    textLabel74 === null
      ? null
      : {
          ...sdn.textLabel74,
          ...textLabel74,
          className: combineClassNames(
            sdn.textLabel74?.className,
            textLabel74?.className,
          ),
        },
  )
  const calendarDay50Props = applyRef(
    seldonRefs,
    calendarDay50 === null
      ? null
      : {
          ...sdn.calendarDay50,
          ...calendarDay50,
          className: combineClassNames(
            sdn.calendarDay50?.className,
            calendarDay50?.className,
          ),
        },
  )
  const textLabel75Props = applyRef(
    seldonRefs,
    textLabel75 === null
      ? null
      : {
          ...sdn.textLabel75,
          ...textLabel75,
          className: combineClassNames(
            sdn.textLabel75?.className,
            textLabel75?.className,
          ),
        },
  )
  const calendarDay51Props = applyRef(
    seldonRefs,
    calendarDay51 === null
      ? null
      : {
          ...sdn.calendarDay51,
          ...calendarDay51,
          className: combineClassNames(
            sdn.calendarDay51?.className,
            calendarDay51?.className,
          ),
        },
  )
  const textLabel76Props = applyRef(
    seldonRefs,
    textLabel76 === null
      ? null
      : {
          ...sdn.textLabel76,
          ...textLabel76,
          className: combineClassNames(
            sdn.textLabel76?.className,
            textLabel76?.className,
          ),
        },
  )
  const calendarDay52Props = applyRef(
    seldonRefs,
    calendarDay52 === null
      ? null
      : {
          ...sdn.calendarDay52,
          ...calendarDay52,
          className: combineClassNames(
            sdn.calendarDay52?.className,
            calendarDay52?.className,
          ),
        },
  )
  const textLabel77Props = applyRef(
    seldonRefs,
    textLabel77 === null
      ? null
      : {
          ...sdn.textLabel77,
          ...textLabel77,
          className: combineClassNames(
            sdn.textLabel77?.className,
            textLabel77?.className,
          ),
        },
  )
  const container13Props = applyRef(
    seldonRefs,
    container13 === null
      ? null
      : {
          ...sdn.container13,
          ...container13,
          className: combineClassNames(
            sdn.container13?.className,
            container13?.className,
          ),
        },
  )
  const calendarDay53Props = applyRef(
    seldonRefs,
    calendarDay53 === null
      ? null
      : {
          ...sdn.calendarDay53,
          ...calendarDay53,
          className: combineClassNames(
            sdn.calendarDay53?.className,
            calendarDay53?.className,
          ),
        },
  )
  const textLabel78Props = applyRef(
    seldonRefs,
    textLabel78 === null
      ? null
      : {
          ...sdn.textLabel78,
          ...textLabel78,
          className: combineClassNames(
            sdn.textLabel78?.className,
            textLabel78?.className,
          ),
        },
  )
  const calendarDay54Props = applyRef(
    seldonRefs,
    calendarDay54 === null
      ? null
      : {
          ...sdn.calendarDay54,
          ...calendarDay54,
          className: combineClassNames(
            sdn.calendarDay54?.className,
            calendarDay54?.className,
          ),
        },
  )
  const textLabel79Props = applyRef(
    seldonRefs,
    textLabel79 === null
      ? null
      : {
          ...sdn.textLabel79,
          ...textLabel79,
          className: combineClassNames(
            sdn.textLabel79?.className,
            textLabel79?.className,
          ),
        },
  )

  return (
    <Frame
      className={calendarRangeClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              {buttonIconic && buttonIconicProps && (
                <ButtonIconic {...buttonIconicProps} icon={iconProps} />
              )}
              {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
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
            <Frame {...frame3Props}>
              <Frame {...container2Props}>
                {calendarDay && calendarDayProps && (
                  <CalendarDay {...calendarDayProps}>
                    {textLabel8 && textLabel8Props && (
                      <TextLabel {...textLabel8Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDayMuted && calendarDayMutedProps && (
                  <CalendarDayMuted {...calendarDayMutedProps}>
                    {textLabel9 && textLabel9Props && (
                      <TextLabel {...textLabel9Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted2 && calendarDayMuted2Props && (
                  <CalendarDayMuted {...calendarDayMuted2Props}>
                    {textLabel10 && textLabel10Props && (
                      <TextLabel {...textLabel10Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted3 && calendarDayMuted3Props && (
                  <CalendarDayMuted {...calendarDayMuted3Props}>
                    {textLabel11 && textLabel11Props && (
                      <TextLabel {...textLabel11Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted4 && calendarDayMuted4Props && (
                  <CalendarDayMuted {...calendarDayMuted4Props}>
                    {textLabel12 && textLabel12Props && (
                      <TextLabel {...textLabel12Props} />
                    )}
                  </CalendarDayMuted>
                )}
              </Frame>
              <Frame {...container3Props}>
                {calendarDayMuted5 && calendarDayMuted5Props && (
                  <CalendarDayMuted {...calendarDayMuted5Props}>
                    {textLabel13 && textLabel13Props && (
                      <TextLabel {...textLabel13Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted6 && calendarDayMuted6Props && (
                  <CalendarDayMuted {...calendarDayMuted6Props}>
                    {textLabel14 && textLabel14Props && (
                      <TextLabel {...textLabel14Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted7 && calendarDayMuted7Props && (
                  <CalendarDayMuted {...calendarDayMuted7Props}>
                    {textLabel15 && textLabel15Props && (
                      <TextLabel {...textLabel15Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted8 && calendarDayMuted8Props && (
                  <CalendarDayMuted {...calendarDayMuted8Props}>
                    {textLabel16 && textLabel16Props && (
                      <TextLabel {...textLabel16Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted9 && calendarDayMuted9Props && (
                  <CalendarDayMuted {...calendarDayMuted9Props}>
                    {textLabel17 && textLabel17Props && (
                      <TextLabel {...textLabel17Props} />
                    )}
                  </CalendarDayMuted>
                )}
                {calendarDay2 && calendarDay2Props && (
                  <CalendarDay {...calendarDay2Props}>
                    {textLabel18 && textLabel18Props && (
                      <TextLabel {...textLabel18Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay3 && calendarDay3Props && (
                  <CalendarDay {...calendarDay3Props}>
                    {textLabel19 && textLabel19Props && (
                      <TextLabel {...textLabel19Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container4Props}>
                {calendarDay4 && calendarDay4Props && (
                  <CalendarDay {...calendarDay4Props}>
                    {textLabel20 && textLabel20Props && (
                      <TextLabel {...textLabel20Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay5 && calendarDay5Props && (
                  <CalendarDay {...calendarDay5Props}>
                    {textLabel21 && textLabel21Props && (
                      <TextLabel {...textLabel21Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay6 && calendarDay6Props && (
                  <CalendarDay {...calendarDay6Props}>
                    {textLabel22 && textLabel22Props && (
                      <TextLabel {...textLabel22Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay7 && calendarDay7Props && (
                  <CalendarDay {...calendarDay7Props}>
                    {textLabel23 && textLabel23Props && (
                      <TextLabel {...textLabel23Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDaySelected && calendarDaySelectedProps && (
                  <CalendarDaySelected {...calendarDaySelectedProps}>
                    {textLabel24 && textLabel24Props && (
                      <TextLabel {...textLabel24Props} />
                    )}
                  </CalendarDaySelected>
                )}
                {calendarDay8 && calendarDay8Props && (
                  <CalendarDay {...calendarDay8Props}>
                    {textLabel25 && textLabel25Props && (
                      <TextLabel {...textLabel25Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDaySelected2 && calendarDaySelected2Props && (
                  <CalendarDaySelected {...calendarDaySelected2Props}>
                    {textLabel26 && textLabel26Props && (
                      <TextLabel {...textLabel26Props} />
                    )}
                  </CalendarDaySelected>
                )}
              </Frame>
              <Frame {...container5Props}>
                {calendarDay9 && calendarDay9Props && (
                  <CalendarDay {...calendarDay9Props}>
                    {textLabel27 && textLabel27Props && (
                      <TextLabel {...textLabel27Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay10 && calendarDay10Props && (
                  <CalendarDay {...calendarDay10Props}>
                    {textLabel28 && textLabel28Props && (
                      <TextLabel {...textLabel28Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay11 && calendarDay11Props && (
                  <CalendarDay {...calendarDay11Props}>
                    {textLabel29 && textLabel29Props && (
                      <TextLabel {...textLabel29Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay12 && calendarDay12Props && (
                  <CalendarDay {...calendarDay12Props}>
                    {textLabel30 && textLabel30Props && (
                      <TextLabel {...textLabel30Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay13 && calendarDay13Props && (
                  <CalendarDay {...calendarDay13Props}>
                    {textLabel31 && textLabel31Props && (
                      <TextLabel {...textLabel31Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay14 && calendarDay14Props && (
                  <CalendarDay {...calendarDay14Props}>
                    {textLabel32 && textLabel32Props && (
                      <TextLabel {...textLabel32Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay15 && calendarDay15Props && (
                  <CalendarDay {...calendarDay15Props}>
                    {textLabel33 && textLabel33Props && (
                      <TextLabel {...textLabel33Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container6Props}>
                {calendarDay16 && calendarDay16Props && (
                  <CalendarDay {...calendarDay16Props}>
                    {textLabel34 && textLabel34Props && (
                      <TextLabel {...textLabel34Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay17 && calendarDay17Props && (
                  <CalendarDay {...calendarDay17Props}>
                    {textLabel35 && textLabel35Props && (
                      <TextLabel {...textLabel35Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay18 && calendarDay18Props && (
                  <CalendarDay {...calendarDay18Props}>
                    {textLabel36 && textLabel36Props && (
                      <TextLabel {...textLabel36Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay19 && calendarDay19Props && (
                  <CalendarDay {...calendarDay19Props}>
                    {textLabel37 && textLabel37Props && (
                      <TextLabel {...textLabel37Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay20 && calendarDay20Props && (
                  <CalendarDay {...calendarDay20Props}>
                    {textLabel38 && textLabel38Props && (
                      <TextLabel {...textLabel38Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay21 && calendarDay21Props && (
                  <CalendarDay {...calendarDay21Props}>
                    {textLabel39 && textLabel39Props && (
                      <TextLabel {...textLabel39Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay22 && calendarDay22Props && (
                  <CalendarDay {...calendarDay22Props}>
                    {textLabel40 && textLabel40Props && (
                      <TextLabel {...textLabel40Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
            </Frame>
          </Frame>
          <Frame {...frame4Props}>
            <Frame {...frame5Props}>
              {textTitle2 && textTitle2Props && (
                <TextTitle {...textTitle2Props} />
              )}
              {buttonIconic2 && buttonIconic2Props && (
                <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
              )}
            </Frame>
            <Frame {...container7Props}>
              {textLabel41 && textLabel41Props && (
                <TextLabel {...textLabel41Props} />
              )}
              {textLabel42 && textLabel42Props && (
                <TextLabel {...textLabel42Props} />
              )}
              {textLabel43 && textLabel43Props && (
                <TextLabel {...textLabel43Props} />
              )}
              {textLabel44 && textLabel44Props && (
                <TextLabel {...textLabel44Props} />
              )}
              {textLabel45 && textLabel45Props && (
                <TextLabel {...textLabel45Props} />
              )}
              {textLabel46 && textLabel46Props && (
                <TextLabel {...textLabel46Props} />
              )}
              {textLabel47 && textLabel47Props && (
                <TextLabel {...textLabel47Props} />
              )}
            </Frame>
            <Frame {...frame6Props}>
              <Frame {...container8Props}>
                {calendarDay23 && calendarDay23Props && (
                  <CalendarDay {...calendarDay23Props}>
                    {textLabel48 && textLabel48Props && (
                      <TextLabel {...textLabel48Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay24 && calendarDay24Props && (
                  <CalendarDay {...calendarDay24Props}>
                    {textLabel49 && textLabel49Props && (
                      <TextLabel {...textLabel49Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container9Props}>
                {calendarDay25 && calendarDay25Props && (
                  <CalendarDay {...calendarDay25Props}>
                    {textLabel50 && textLabel50Props && (
                      <TextLabel {...textLabel50Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay26 && calendarDay26Props && (
                  <CalendarDay {...calendarDay26Props}>
                    {textLabel51 && textLabel51Props && (
                      <TextLabel {...textLabel51Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay27 && calendarDay27Props && (
                  <CalendarDay {...calendarDay27Props}>
                    {textLabel52 && textLabel52Props && (
                      <TextLabel {...textLabel52Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay28 && calendarDay28Props && (
                  <CalendarDay {...calendarDay28Props}>
                    {textLabel53 && textLabel53Props && (
                      <TextLabel {...textLabel53Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay29 && calendarDay29Props && (
                  <CalendarDay {...calendarDay29Props}>
                    {textLabel54 && textLabel54Props && (
                      <TextLabel {...textLabel54Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay30 && calendarDay30Props && (
                  <CalendarDay {...calendarDay30Props}>
                    {textLabel55 && textLabel55Props && (
                      <TextLabel {...textLabel55Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay31 && calendarDay31Props && (
                  <CalendarDay {...calendarDay31Props}>
                    {textLabel56 && textLabel56Props && (
                      <TextLabel {...textLabel56Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container10Props}>
                {calendarDay32 && calendarDay32Props && (
                  <CalendarDay {...calendarDay32Props}>
                    {textLabel57 && textLabel57Props && (
                      <TextLabel {...textLabel57Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay33 && calendarDay33Props && (
                  <CalendarDay {...calendarDay33Props}>
                    {textLabel58 && textLabel58Props && (
                      <TextLabel {...textLabel58Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay34 && calendarDay34Props && (
                  <CalendarDay {...calendarDay34Props}>
                    {textLabel59 && textLabel59Props && (
                      <TextLabel {...textLabel59Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay35 && calendarDay35Props && (
                  <CalendarDay {...calendarDay35Props}>
                    {textLabel60 && textLabel60Props && (
                      <TextLabel {...textLabel60Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay36 && calendarDay36Props && (
                  <CalendarDay {...calendarDay36Props}>
                    {textLabel61 && textLabel61Props && (
                      <TextLabel {...textLabel61Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay37 && calendarDay37Props && (
                  <CalendarDay {...calendarDay37Props}>
                    {textLabel62 && textLabel62Props && (
                      <TextLabel {...textLabel62Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay38 && calendarDay38Props && (
                  <CalendarDay {...calendarDay38Props}>
                    {textLabel63 && textLabel63Props && (
                      <TextLabel {...textLabel63Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container11Props}>
                {calendarDay39 && calendarDay39Props && (
                  <CalendarDay {...calendarDay39Props}>
                    {textLabel64 && textLabel64Props && (
                      <TextLabel {...textLabel64Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay40 && calendarDay40Props && (
                  <CalendarDay {...calendarDay40Props}>
                    {textLabel65 && textLabel65Props && (
                      <TextLabel {...textLabel65Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay41 && calendarDay41Props && (
                  <CalendarDay {...calendarDay41Props}>
                    {textLabel66 && textLabel66Props && (
                      <TextLabel {...textLabel66Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay42 && calendarDay42Props && (
                  <CalendarDay {...calendarDay42Props}>
                    {textLabel67 && textLabel67Props && (
                      <TextLabel {...textLabel67Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay43 && calendarDay43Props && (
                  <CalendarDay {...calendarDay43Props}>
                    {textLabel68 && textLabel68Props && (
                      <TextLabel {...textLabel68Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay44 && calendarDay44Props && (
                  <CalendarDay {...calendarDay44Props}>
                    {textLabel69 && textLabel69Props && (
                      <TextLabel {...textLabel69Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay45 && calendarDay45Props && (
                  <CalendarDay {...calendarDay45Props}>
                    {textLabel70 && textLabel70Props && (
                      <TextLabel {...textLabel70Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container12Props}>
                {calendarDay46 && calendarDay46Props && (
                  <CalendarDay {...calendarDay46Props}>
                    {textLabel71 && textLabel71Props && (
                      <TextLabel {...textLabel71Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay47 && calendarDay47Props && (
                  <CalendarDay {...calendarDay47Props}>
                    {textLabel72 && textLabel72Props && (
                      <TextLabel {...textLabel72Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay48 && calendarDay48Props && (
                  <CalendarDay {...calendarDay48Props}>
                    {textLabel73 && textLabel73Props && (
                      <TextLabel {...textLabel73Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay49 && calendarDay49Props && (
                  <CalendarDay {...calendarDay49Props}>
                    {textLabel74 && textLabel74Props && (
                      <TextLabel {...textLabel74Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay50 && calendarDay50Props && (
                  <CalendarDay {...calendarDay50Props}>
                    {textLabel75 && textLabel75Props && (
                      <TextLabel {...textLabel75Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay51 && calendarDay51Props && (
                  <CalendarDay {...calendarDay51Props}>
                    {textLabel76 && textLabel76Props && (
                      <TextLabel {...textLabel76Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay52 && calendarDay52Props && (
                  <CalendarDay {...calendarDay52Props}>
                    {textLabel77 && textLabel77Props && (
                      <TextLabel {...textLabel77Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container13Props}>
                {calendarDay53 && calendarDay53Props && (
                  <CalendarDay {...calendarDay53Props}>
                    {textLabel78 && textLabel78Props && (
                      <TextLabel {...textLabel78Props} />
                    )}
                  </CalendarDay>
                )}
                {calendarDay54 && calendarDay54Props && (
                  <CalendarDay {...calendarDay54Props}>
                    {textLabel79 && textLabel79Props && (
                      <TextLabel {...textLabel79Props} />
                    )}
                  </CalendarDay>
                )}
              </Frame>
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
const sdn: CalendarRangeProps = {
  "aria-hidden": "false",
  className: "sdn-calendar-range sdn-calendar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--zjsr",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon: {
    icon: "material-chevronLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--pmi9",
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
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rpjl",
  },
  container2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay: {
    className: "sdn-calendar-day sdn-calendar-day--bh5j",
  },
  textLabel8: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel9: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted2: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel10: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted3: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel11: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted4: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel12: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMuted5: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel13: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted6: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel14: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted7: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel15: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted8: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel16: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted9: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel17: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel18: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay3: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel19: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay4: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel20: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay5: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel21: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay6: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel22: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay7: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel23: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected: {
    className: "sdn-calendar-day-selected sdn-calendar-day-selected--dulb",
  },
  textLabel24: {
    className: "sdn-text-label sdn-text-label--fye8",
  },
  calendarDay8: {
    className: "sdn-calendar-day sdn-calendar-day--omg8",
  },
  textLabel25: {
    className: "sdn-text-label sdn-text-label--6f2j",
  },
  calendarDaySelected2: {
    className: "sdn-calendar-day-selected sdn-calendar-day-selected--zit2",
  },
  textLabel26: {
    className: "sdn-text-label sdn-text-label--fye8",
  },
  container5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay9: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel27: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay10: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel28: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay11: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel29: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay12: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel30: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay13: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel31: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay14: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel32: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay15: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel33: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay16: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel34: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay17: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel35: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay18: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel36: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay19: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel37: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay20: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel38: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay21: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel39: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay22: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel40: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--zjsr",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  textTitle2: {
    className: "sdn-text-title sdn-text-title--pmi9",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon2: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--nlt7",
  },
  container7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  textLabel41: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel42: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel43: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel44: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel45: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel46: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel47: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rpjl",
  },
  container8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay23: {
    className: "sdn-calendar-day sdn-calendar-day--2hoh",
  },
  textLabel48: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay24: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel49: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay25: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel50: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay26: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel51: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay27: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel52: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay28: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel53: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay29: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel54: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay30: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel55: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay31: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel56: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container10: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay32: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel57: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay33: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel58: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay34: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel59: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay35: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel60: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay36: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel61: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay37: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel62: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay38: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel63: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container11: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay39: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel64: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay40: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel65: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay41: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel66: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay42: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel67: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay43: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel68: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay44: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel69: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay45: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel70: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container12: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay46: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel71: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay47: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel72: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay48: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel73: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay49: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel74: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay50: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel75: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay51: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel76: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay52: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel77: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container13: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay53: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel78: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay54: {
    className: "sdn-calendar-day sdn-calendar-day--2hoh",
  },
  textLabel79: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}
