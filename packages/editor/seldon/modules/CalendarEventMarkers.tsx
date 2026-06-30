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
  CalendarDayMutedDay,
  CalendarDayMutedDayProps,
} from "../elements/CalendarDayMutedDay"
import {
  CalendarDaySelectedDay,
  CalendarDaySelectedDayProps,
} from "../elements/CalendarDaySelectedDay"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface CalendarEventMarkersProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  textLabel?: TextLabelProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  container?: ContainerProps | null
  textLabel2?: TextLabelProps | null
  textLabel3?: TextLabelProps | null
  textLabel4?: TextLabelProps | null
  textLabel5?: TextLabelProps | null
  textLabel6?: TextLabelProps | null
  textLabel7?: TextLabelProps | null
  textLabel8?: TextLabelProps | null
  frame2?: FrameProps | null
  container2?: ContainerProps | null
  calendarDayMutedDay?: CalendarDayMutedDayProps | null
  textLabel9?: TextLabelProps | null
  calendarDaySelectedDay?: CalendarDaySelectedDayProps | null
  textLabel10?: TextLabelProps | null
  textLabel11?: TextLabelProps | null
  calendarDay?: CalendarDayProps | null
  textLabel12?: TextLabelProps | null
  calendarDay2?: CalendarDayProps | null
  textLabel13?: TextLabelProps | null
  calendarDay3?: CalendarDayProps | null
  textLabel14?: TextLabelProps | null
  calendarDay4?: CalendarDayProps | null
  textLabel15?: TextLabelProps | null
  calendarDayMutedDay2?: CalendarDayMutedDayProps | null
  textLabel16?: TextLabelProps | null
  container3?: ContainerProps | null
  calendarDayMutedDay3?: CalendarDayMutedDayProps | null
  textLabel17?: TextLabelProps | null
  calendarDayMutedDay4?: CalendarDayMutedDayProps | null
  textLabel18?: TextLabelProps | null
  calendarDayMutedDay5?: CalendarDayMutedDayProps | null
  textLabel19?: TextLabelProps | null
  calendarDayMutedDay6?: CalendarDayMutedDayProps | null
  textLabel20?: TextLabelProps | null
  calendarDayMutedDay7?: CalendarDayMutedDayProps | null
  textLabel21?: TextLabelProps | null
  calendarDayMutedDay8?: CalendarDayMutedDayProps | null
  textLabel22?: TextLabelProps | null
  calendarDayMutedDay9?: CalendarDayMutedDayProps | null
  textLabel23?: TextLabelProps | null
  container4?: ContainerProps | null
  calendarDayMutedDay10?: CalendarDayMutedDayProps | null
  textLabel24?: TextLabelProps | null
  calendarDayMutedDay11?: CalendarDayMutedDayProps | null
  textLabel25?: TextLabelProps | null
  calendarDayMutedDay12?: CalendarDayMutedDayProps | null
  textLabel26?: TextLabelProps | null
  calendarDayMutedDay13?: CalendarDayMutedDayProps | null
  textLabel27?: TextLabelProps | null
  calendarDayMutedDay14?: CalendarDayMutedDayProps | null
  textLabel28?: TextLabelProps | null
  calendarDayMutedDay15?: CalendarDayMutedDayProps | null
  textLabel29?: TextLabelProps | null
  calendarDayMutedDay16?: CalendarDayMutedDayProps | null
  textLabel30?: TextLabelProps | null
  container5?: ContainerProps | null
  calendarDayMutedDay17?: CalendarDayMutedDayProps | null
  textLabel31?: TextLabelProps | null
  calendarDayMutedDay18?: CalendarDayMutedDayProps | null
  textLabel32?: TextLabelProps | null
  calendarDayMutedDay19?: CalendarDayMutedDayProps | null
  textLabel33?: TextLabelProps | null
  calendarDayMutedDay20?: CalendarDayMutedDayProps | null
  textLabel34?: TextLabelProps | null
  calendarDayMutedDay21?: CalendarDayMutedDayProps | null
  textLabel35?: TextLabelProps | null
  calendarDayMutedDay22?: CalendarDayMutedDayProps | null
  textLabel36?: TextLabelProps | null
  calendarDayMutedDay23?: CalendarDayMutedDayProps | null
  textLabel37?: TextLabelProps | null
  container6?: ContainerProps | null
  calendarDayMutedDay24?: CalendarDayMutedDayProps | null
  textLabel38?: TextLabelProps | null
  calendarDayMutedDay25?: CalendarDayMutedDayProps | null
  textLabel39?: TextLabelProps | null
  calendarDay5?: CalendarDayProps | null
  textLabel40?: TextLabelProps | null
}

/*****
 * Calendar: CalendarEventMarkers
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
 *
 * @example
 * ```tsx
 * <CalendarEventMarkers
 *   aria-hidden="false"
 *   frame="{}"
 *   textLabel="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   buttonIconic2={() => {}}
 *   container="{}"
 *   textLabel2="{}"
 *   textLabel3="{}"
 *   textLabel4="{}"
 *   textLabel5="{}"
 *   textLabel6="{}"
 *   textLabel7="{}"
 *   frame2="{}"
 *   calendarDayMutedDay="{}"
 *   calendarDaySelectedDay2="{}"
 *   calendarDay3="{}"
 *   calendarDay4="{}"
 *   calendarDay5="{}"
 *   calendarDay6="{}"
 *   calendarDayMutedDay7="{}"
 *   container2="{}"
 *   calendarDayMutedDay2="{}"
 *   calendarDayMutedDay3="{}"
 *   calendarDayMutedDay4="{}"
 *   calendarDayMutedDay5="{}"
 *   calendarDayMutedDay6="{}"
 *   container3="{}"
 *   container4="{}"
 *   container5="{}"
 * />
 * ```
 *****/
export function CalendarEventMarkers({
  className = "",
  frame = sdn.frame,
  textLabel,
  buttonIconic,
  icon = sdn.icon,
  buttonIconic2,
  icon2 = sdn.icon2,
  container = sdn.container,
  textLabel2,
  textLabel3,
  textLabel4,
  textLabel5,
  textLabel6,
  textLabel7,
  textLabel8,
  frame2 = sdn.frame2,
  container2 = sdn.container2,
  calendarDayMutedDay,
  textLabel9,
  calendarDaySelectedDay,
  textLabel10,
  textLabel11,
  calendarDay,
  textLabel12,
  calendarDay2,
  textLabel13,
  calendarDay3,
  textLabel14,
  calendarDay4,
  textLabel15,
  calendarDayMutedDay2,
  textLabel16,
  container3 = sdn.container3,
  calendarDayMutedDay3,
  textLabel17,
  calendarDayMutedDay4,
  textLabel18,
  calendarDayMutedDay5,
  textLabel19,
  calendarDayMutedDay6,
  textLabel20,
  calendarDayMutedDay7,
  textLabel21,
  calendarDayMutedDay8,
  textLabel22,
  calendarDayMutedDay9,
  textLabel23,
  container4 = sdn.container4,
  calendarDayMutedDay10,
  textLabel24,
  calendarDayMutedDay11,
  textLabel25,
  calendarDayMutedDay12,
  textLabel26,
  calendarDayMutedDay13,
  textLabel27,
  calendarDayMutedDay14,
  textLabel28,
  calendarDayMutedDay15,
  textLabel29,
  calendarDayMutedDay16,
  textLabel30,
  container5 = sdn.container5,
  calendarDayMutedDay17,
  textLabel31,
  calendarDayMutedDay18,
  textLabel32,
  calendarDayMutedDay19,
  textLabel33,
  calendarDayMutedDay20,
  textLabel34,
  calendarDayMutedDay21,
  textLabel35,
  calendarDayMutedDay22,
  textLabel36,
  calendarDayMutedDay23,
  textLabel37,
  container6 = sdn.container6,
  calendarDayMutedDay24,
  textLabel38,
  calendarDayMutedDay25,
  textLabel39,
  calendarDay5,
  textLabel40,
  children,
  seldonRefs,
  ...props
}: CalendarEventMarkersProps) {
  const calendarEventMarkersClassName = combineClassNames(
    "sdn-calendar",
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
  const calendarDayMutedDayProps = applyRef(
    seldonRefs,
    calendarDayMutedDay === null
      ? null
      : {
          ...sdn.calendarDayMutedDay,
          ...calendarDayMutedDay,
          className: combineClassNames(
            sdn.calendarDayMutedDay?.className,
            calendarDayMutedDay?.className,
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
  const calendarDayMutedDay2Props = applyRef(
    seldonRefs,
    calendarDayMutedDay2 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay2,
          ...calendarDayMutedDay2,
          className: combineClassNames(
            sdn.calendarDayMutedDay2?.className,
            calendarDayMutedDay2?.className,
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
  const calendarDayMutedDay3Props = applyRef(
    seldonRefs,
    calendarDayMutedDay3 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay3,
          ...calendarDayMutedDay3,
          className: combineClassNames(
            sdn.calendarDayMutedDay3?.className,
            calendarDayMutedDay3?.className,
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
  const calendarDayMutedDay4Props = applyRef(
    seldonRefs,
    calendarDayMutedDay4 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay4,
          ...calendarDayMutedDay4,
          className: combineClassNames(
            sdn.calendarDayMutedDay4?.className,
            calendarDayMutedDay4?.className,
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
  const calendarDayMutedDay5Props = applyRef(
    seldonRefs,
    calendarDayMutedDay5 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay5,
          ...calendarDayMutedDay5,
          className: combineClassNames(
            sdn.calendarDayMutedDay5?.className,
            calendarDayMutedDay5?.className,
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
  const calendarDayMutedDay6Props = applyRef(
    seldonRefs,
    calendarDayMutedDay6 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay6,
          ...calendarDayMutedDay6,
          className: combineClassNames(
            sdn.calendarDayMutedDay6?.className,
            calendarDayMutedDay6?.className,
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
  const calendarDayMutedDay7Props = applyRef(
    seldonRefs,
    calendarDayMutedDay7 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay7,
          ...calendarDayMutedDay7,
          className: combineClassNames(
            sdn.calendarDayMutedDay7?.className,
            calendarDayMutedDay7?.className,
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
  const calendarDayMutedDay8Props = applyRef(
    seldonRefs,
    calendarDayMutedDay8 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay8,
          ...calendarDayMutedDay8,
          className: combineClassNames(
            sdn.calendarDayMutedDay8?.className,
            calendarDayMutedDay8?.className,
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
  const calendarDayMutedDay9Props = applyRef(
    seldonRefs,
    calendarDayMutedDay9 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay9,
          ...calendarDayMutedDay9,
          className: combineClassNames(
            sdn.calendarDayMutedDay9?.className,
            calendarDayMutedDay9?.className,
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
  const calendarDayMutedDay10Props = applyRef(
    seldonRefs,
    calendarDayMutedDay10 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay10,
          ...calendarDayMutedDay10,
          className: combineClassNames(
            sdn.calendarDayMutedDay10?.className,
            calendarDayMutedDay10?.className,
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
  const calendarDayMutedDay11Props = applyRef(
    seldonRefs,
    calendarDayMutedDay11 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay11,
          ...calendarDayMutedDay11,
          className: combineClassNames(
            sdn.calendarDayMutedDay11?.className,
            calendarDayMutedDay11?.className,
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
  const calendarDayMutedDay12Props = applyRef(
    seldonRefs,
    calendarDayMutedDay12 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay12,
          ...calendarDayMutedDay12,
          className: combineClassNames(
            sdn.calendarDayMutedDay12?.className,
            calendarDayMutedDay12?.className,
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
  const calendarDayMutedDay13Props = applyRef(
    seldonRefs,
    calendarDayMutedDay13 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay13,
          ...calendarDayMutedDay13,
          className: combineClassNames(
            sdn.calendarDayMutedDay13?.className,
            calendarDayMutedDay13?.className,
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
  const calendarDayMutedDay14Props = applyRef(
    seldonRefs,
    calendarDayMutedDay14 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay14,
          ...calendarDayMutedDay14,
          className: combineClassNames(
            sdn.calendarDayMutedDay14?.className,
            calendarDayMutedDay14?.className,
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
  const calendarDayMutedDay15Props = applyRef(
    seldonRefs,
    calendarDayMutedDay15 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay15,
          ...calendarDayMutedDay15,
          className: combineClassNames(
            sdn.calendarDayMutedDay15?.className,
            calendarDayMutedDay15?.className,
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
  const calendarDayMutedDay16Props = applyRef(
    seldonRefs,
    calendarDayMutedDay16 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay16,
          ...calendarDayMutedDay16,
          className: combineClassNames(
            sdn.calendarDayMutedDay16?.className,
            calendarDayMutedDay16?.className,
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
  const calendarDayMutedDay17Props = applyRef(
    seldonRefs,
    calendarDayMutedDay17 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay17,
          ...calendarDayMutedDay17,
          className: combineClassNames(
            sdn.calendarDayMutedDay17?.className,
            calendarDayMutedDay17?.className,
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
  const calendarDayMutedDay18Props = applyRef(
    seldonRefs,
    calendarDayMutedDay18 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay18,
          ...calendarDayMutedDay18,
          className: combineClassNames(
            sdn.calendarDayMutedDay18?.className,
            calendarDayMutedDay18?.className,
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
  const calendarDayMutedDay19Props = applyRef(
    seldonRefs,
    calendarDayMutedDay19 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay19,
          ...calendarDayMutedDay19,
          className: combineClassNames(
            sdn.calendarDayMutedDay19?.className,
            calendarDayMutedDay19?.className,
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
  const calendarDayMutedDay20Props = applyRef(
    seldonRefs,
    calendarDayMutedDay20 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay20,
          ...calendarDayMutedDay20,
          className: combineClassNames(
            sdn.calendarDayMutedDay20?.className,
            calendarDayMutedDay20?.className,
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
  const calendarDayMutedDay21Props = applyRef(
    seldonRefs,
    calendarDayMutedDay21 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay21,
          ...calendarDayMutedDay21,
          className: combineClassNames(
            sdn.calendarDayMutedDay21?.className,
            calendarDayMutedDay21?.className,
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
  const calendarDayMutedDay22Props = applyRef(
    seldonRefs,
    calendarDayMutedDay22 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay22,
          ...calendarDayMutedDay22,
          className: combineClassNames(
            sdn.calendarDayMutedDay22?.className,
            calendarDayMutedDay22?.className,
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
  const calendarDayMutedDay23Props = applyRef(
    seldonRefs,
    calendarDayMutedDay23 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay23,
          ...calendarDayMutedDay23,
          className: combineClassNames(
            sdn.calendarDayMutedDay23?.className,
            calendarDayMutedDay23?.className,
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
  const calendarDayMutedDay24Props = applyRef(
    seldonRefs,
    calendarDayMutedDay24 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay24,
          ...calendarDayMutedDay24,
          className: combineClassNames(
            sdn.calendarDayMutedDay24?.className,
            calendarDayMutedDay24?.className,
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
  const calendarDayMutedDay25Props = applyRef(
    seldonRefs,
    calendarDayMutedDay25 === null
      ? null
      : {
          ...sdn.calendarDayMutedDay25,
          ...calendarDayMutedDay25,
          className: combineClassNames(
            sdn.calendarDayMutedDay25?.className,
            calendarDayMutedDay25?.className,
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
      className={calendarEventMarkersClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            {buttonIconic && buttonIconicProps && (
              <ButtonIconic {...buttonIconicProps} icon={iconProps} />
            )}
            {buttonIconic2 && buttonIconic2Props && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
          </Frame>
          <Frame {...containerProps}>
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
            {textLabel8 && textLabel8Props && (
              <TextLabel {...textLabel8Props} />
            )}
          </Frame>
          <Frame {...frame2Props}>
            <Frame {...container2Props}>
              {calendarDayMutedDay && calendarDayMutedDayProps && (
                <CalendarDayMutedDay {...calendarDayMutedDayProps}>
                  {textLabel9 && textLabel9Props && (
                    <TextLabel {...textLabel9Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDaySelectedDay && calendarDaySelectedDayProps && (
                <CalendarDaySelectedDay {...calendarDaySelectedDayProps}>
                  {textLabel10 && textLabel10Props && (
                    <TextLabel {...textLabel10Props} />
                  )}
                  {textLabel11 && textLabel11Props && (
                    <TextLabel {...textLabel11Props} />
                  )}
                </CalendarDaySelectedDay>
              )}
              {calendarDay && calendarDayProps && (
                <CalendarDay {...calendarDayProps}>
                  {textLabel12 && textLabel12Props && (
                    <TextLabel {...textLabel12Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDay2 && calendarDay2Props && (
                <CalendarDay {...calendarDay2Props}>
                  {textLabel13 && textLabel13Props && (
                    <TextLabel {...textLabel13Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDay3 && calendarDay3Props && (
                <CalendarDay {...calendarDay3Props}>
                  {textLabel14 && textLabel14Props && (
                    <TextLabel {...textLabel14Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDay4 && calendarDay4Props && (
                <CalendarDay {...calendarDay4Props}>
                  {textLabel15 && textLabel15Props && (
                    <TextLabel {...textLabel15Props} />
                  )}
                </CalendarDay>
              )}
              {calendarDayMutedDay2 && calendarDayMutedDay2Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay2Props}>
                  {textLabel16 && textLabel16Props && (
                    <TextLabel {...textLabel16Props} />
                  )}
                </CalendarDayMutedDay>
              )}
            </Frame>
            <Frame {...container3Props}>
              {calendarDayMutedDay3 && calendarDayMutedDay3Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay3Props}>
                  {textLabel17 && textLabel17Props && (
                    <TextLabel {...textLabel17Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay4 && calendarDayMutedDay4Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay4Props}>
                  {textLabel18 && textLabel18Props && (
                    <TextLabel {...textLabel18Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay5 && calendarDayMutedDay5Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay5Props}>
                  {textLabel19 && textLabel19Props && (
                    <TextLabel {...textLabel19Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay6 && calendarDayMutedDay6Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay6Props}>
                  {textLabel20 && textLabel20Props && (
                    <TextLabel {...textLabel20Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay7 && calendarDayMutedDay7Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay7Props}>
                  {textLabel21 && textLabel21Props && (
                    <TextLabel {...textLabel21Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay8 && calendarDayMutedDay8Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay8Props}>
                  {textLabel22 && textLabel22Props && (
                    <TextLabel {...textLabel22Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay9 && calendarDayMutedDay9Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay9Props}>
                  {textLabel23 && textLabel23Props && (
                    <TextLabel {...textLabel23Props} />
                  )}
                </CalendarDayMutedDay>
              )}
            </Frame>
            <Frame {...container4Props}>
              {calendarDayMutedDay10 && calendarDayMutedDay10Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay10Props}>
                  {textLabel24 && textLabel24Props && (
                    <TextLabel {...textLabel24Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay11 && calendarDayMutedDay11Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay11Props}>
                  {textLabel25 && textLabel25Props && (
                    <TextLabel {...textLabel25Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay12 && calendarDayMutedDay12Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay12Props}>
                  {textLabel26 && textLabel26Props && (
                    <TextLabel {...textLabel26Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay13 && calendarDayMutedDay13Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay13Props}>
                  {textLabel27 && textLabel27Props && (
                    <TextLabel {...textLabel27Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay14 && calendarDayMutedDay14Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay14Props}>
                  {textLabel28 && textLabel28Props && (
                    <TextLabel {...textLabel28Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay15 && calendarDayMutedDay15Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay15Props}>
                  {textLabel29 && textLabel29Props && (
                    <TextLabel {...textLabel29Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay16 && calendarDayMutedDay16Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay16Props}>
                  {textLabel30 && textLabel30Props && (
                    <TextLabel {...textLabel30Props} />
                  )}
                </CalendarDayMutedDay>
              )}
            </Frame>
            <Frame {...container5Props}>
              {calendarDayMutedDay17 && calendarDayMutedDay17Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay17Props}>
                  {textLabel31 && textLabel31Props && (
                    <TextLabel {...textLabel31Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay18 && calendarDayMutedDay18Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay18Props}>
                  {textLabel32 && textLabel32Props && (
                    <TextLabel {...textLabel32Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay19 && calendarDayMutedDay19Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay19Props}>
                  {textLabel33 && textLabel33Props && (
                    <TextLabel {...textLabel33Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay20 && calendarDayMutedDay20Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay20Props}>
                  {textLabel34 && textLabel34Props && (
                    <TextLabel {...textLabel34Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay21 && calendarDayMutedDay21Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay21Props}>
                  {textLabel35 && textLabel35Props && (
                    <TextLabel {...textLabel35Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay22 && calendarDayMutedDay22Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay22Props}>
                  {textLabel36 && textLabel36Props && (
                    <TextLabel {...textLabel36Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay23 && calendarDayMutedDay23Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay23Props}>
                  {textLabel37 && textLabel37Props && (
                    <TextLabel {...textLabel37Props} />
                  )}
                </CalendarDayMutedDay>
              )}
            </Frame>
            <Frame {...container6Props}>
              {calendarDayMutedDay24 && calendarDayMutedDay24Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay24Props}>
                  {textLabel38 && textLabel38Props && (
                    <TextLabel {...textLabel38Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDayMutedDay25 && calendarDayMutedDay25Props && (
                <CalendarDayMutedDay {...calendarDayMutedDay25Props}>
                  {textLabel39 && textLabel39Props && (
                    <TextLabel {...textLabel39Props} />
                  )}
                </CalendarDayMutedDay>
              )}
              {calendarDay5 && calendarDay5Props && (
                <CalendarDay {...calendarDay5Props}>
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
const sdn: CalendarEventMarkersProps = {
  "aria-hidden": "false",
  className: "sdn-calendar sdn-calendar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--wrw4",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon: {
    icon: "material-chevronLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--np61",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--8tzd",
  },
  icon2: {
    icon: "material-chevronRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--np61",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
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
  textLabel8: {
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--0bj3",
  },
  container2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMutedDay: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel9: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelectedDay: {
    className: "sdn-calendar-day-selected-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel10: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  textLabel11: {
    className: "sdn-text-label sdn-text-label--mqlk",
  },
  calendarDay: {
    className: "sdn-calendar-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel12: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel13: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay3: {
    className: "sdn-calendar-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel14: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDay4: {
    className: "sdn-calendar-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel15: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDayMutedDay2: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel16: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMutedDay3: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel17: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay4: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel18: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay5: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel19: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay6: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel20: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay7: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel21: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay8: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel22: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay9: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel23: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMutedDay10: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel24: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay11: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel25: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay12: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel26: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay13: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel27: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay14: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel28: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay15: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel29: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay16: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel30: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMutedDay17: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel31: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay18: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel32: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay19: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel33: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay20: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel34: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay21: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel35: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay22: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel36: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay23: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel37: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDayMutedDay24: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel38: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMutedDay25: {
    className: "sdn-calendar-day-muted-day sdn-calendar-day-muted-day--vns2",
  },
  textLabel39: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay5: {
    className: "sdn-calendar-day sdn-calendar-day--i3zq",
  },
  textLabel40: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}
