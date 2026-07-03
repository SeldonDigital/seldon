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
  CalendarDayGridCell,
  CalendarDayGridCellProps,
} from "../elements/CalendarDayGridCell"
import {
  CalendarDaySelected,
  CalendarDaySelectedProps,
} from "../elements/CalendarDaySelected"
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
  calendarDayGridCell?: CalendarDayGridCellProps | null
  textLabel9?: TextLabelProps | null
  calendarDayGridCell2?: CalendarDayGridCellProps | null
  textLabel10?: TextLabelProps | null
  container3?: ContainerProps | null
  calendarDayGridCell3?: CalendarDayGridCellProps | null
  textLabel11?: TextLabelProps | null
  calendarDayGridCell4?: CalendarDayGridCellProps | null
  textLabel12?: TextLabelProps | null
  calendarDayGridCell5?: CalendarDayGridCellProps | null
  textLabel13?: TextLabelProps | null
  calendarDayGridCell6?: CalendarDayGridCellProps | null
  textLabel14?: TextLabelProps | null
  calendarDayGridCell7?: CalendarDayGridCellProps | null
  textLabel15?: TextLabelProps | null
  calendarDayGridCell8?: CalendarDayGridCellProps | null
  textLabel16?: TextLabelProps | null
  calendarDayGridCell9?: CalendarDayGridCellProps | null
  textLabel17?: TextLabelProps | null
  container4?: ContainerProps | null
  calendarDayGridCell10?: CalendarDayGridCellProps | null
  textLabel18?: TextLabelProps | null
  calendarDayGridCell11?: CalendarDayGridCellProps | null
  textLabel19?: TextLabelProps | null
  calendarDayGridCell12?: CalendarDayGridCellProps | null
  textLabel20?: TextLabelProps | null
  calendarDayGridCell13?: CalendarDayGridCellProps | null
  textLabel21?: TextLabelProps | null
  calendarDayGridCell14?: CalendarDayGridCellProps | null
  textLabel22?: TextLabelProps | null
  calendarDayGridCell15?: CalendarDayGridCellProps | null
  textLabel23?: TextLabelProps | null
  calendarDayGridCell16?: CalendarDayGridCellProps | null
  textLabel24?: TextLabelProps | null
  container5?: ContainerProps | null
  calendarDayGridCell17?: CalendarDayGridCellProps | null
  textLabel25?: TextLabelProps | null
  calendarDayToday?: CalendarDayTodayProps | null
  textLabel26?: TextLabelProps | null
  calendarDayGridCell18?: CalendarDayGridCellProps | null
  textLabel27?: TextLabelProps | null
  calendarDaySelected?: CalendarDaySelectedProps | null
  textLabel28?: TextLabelProps | null
  calendarDayGridCell19?: CalendarDayGridCellProps | null
  textLabel29?: TextLabelProps | null
  calendarDayGridCell20?: CalendarDayGridCellProps | null
  textLabel30?: TextLabelProps | null
  calendarDayGridCell21?: CalendarDayGridCellProps | null
  textLabel31?: TextLabelProps | null
  container6?: ContainerProps | null
  calendarDayGridCell22?: CalendarDayGridCellProps | null
  textLabel32?: TextLabelProps | null
  calendarDayGridCell23?: CalendarDayGridCellProps | null
  textLabel33?: TextLabelProps | null
  calendarDayGridCell24?: CalendarDayGridCellProps | null
  textLabel34?: TextLabelProps | null
  calendarDayGridCell25?: CalendarDayGridCellProps | null
  textLabel35?: TextLabelProps | null
  calendarDayGridCell26?: CalendarDayGridCellProps | null
  textLabel36?: TextLabelProps | null
  calendarDayGridCell27?: CalendarDayGridCellProps | null
  textLabel37?: TextLabelProps | null
  calendarDayGridCell28?: CalendarDayGridCellProps | null
  textLabel38?: TextLabelProps | null
  container7?: ContainerProps | null
  calendarDayGridCell29?: CalendarDayGridCellProps | null
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
 *   calendarDayGridCell2="{}"
 *   calendarDayGridCell3="{}"
 *   container2="{}"
 *   calendarDayGridCell="{}"
 *   calendarDayGridCell4="{}"
 *   calendarDayGridCell5="{}"
 *   calendarDayGridCell6="{}"
 *   calendarDayGridCell7="{}"
 *   container3="{}"
 *   container4="{}"
 *   calendarDayToday2="{}"
 *   calendarDaySelected4="{}"
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
  calendarDayGridCell,
  textLabel9,
  calendarDayGridCell2,
  textLabel10,
  container3 = sdn.container3,
  calendarDayGridCell3,
  textLabel11,
  calendarDayGridCell4,
  textLabel12,
  calendarDayGridCell5,
  textLabel13,
  calendarDayGridCell6,
  textLabel14,
  calendarDayGridCell7,
  textLabel15,
  calendarDayGridCell8,
  textLabel16,
  calendarDayGridCell9,
  textLabel17,
  container4 = sdn.container4,
  calendarDayGridCell10,
  textLabel18,
  calendarDayGridCell11,
  textLabel19,
  calendarDayGridCell12,
  textLabel20,
  calendarDayGridCell13,
  textLabel21,
  calendarDayGridCell14,
  textLabel22,
  calendarDayGridCell15,
  textLabel23,
  calendarDayGridCell16,
  textLabel24,
  container5 = sdn.container5,
  calendarDayGridCell17,
  textLabel25,
  calendarDayToday,
  textLabel26,
  calendarDayGridCell18,
  textLabel27,
  calendarDaySelected,
  textLabel28,
  calendarDayGridCell19,
  textLabel29,
  calendarDayGridCell20,
  textLabel30,
  calendarDayGridCell21,
  textLabel31,
  container6 = sdn.container6,
  calendarDayGridCell22,
  textLabel32,
  calendarDayGridCell23,
  textLabel33,
  calendarDayGridCell24,
  textLabel34,
  calendarDayGridCell25,
  textLabel35,
  calendarDayGridCell26,
  textLabel36,
  calendarDayGridCell27,
  textLabel37,
  calendarDayGridCell28,
  textLabel38,
  container7 = sdn.container7,
  calendarDayGridCell29,
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
  const calendarDayGridCellProps = applyRef(
    seldonRefs,
    calendarDayGridCell === null
      ? null
      : {
          ...sdn.calendarDayGridCell,
          ...calendarDayGridCell,
          className: combineClassNames(
            sdn.calendarDayGridCell?.className,
            calendarDayGridCell?.className,
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
  const calendarDayGridCell2Props = applyRef(
    seldonRefs,
    calendarDayGridCell2 === null
      ? null
      : {
          ...sdn.calendarDayGridCell2,
          ...calendarDayGridCell2,
          className: combineClassNames(
            sdn.calendarDayGridCell2?.className,
            calendarDayGridCell2?.className,
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
  const calendarDayGridCell3Props = applyRef(
    seldonRefs,
    calendarDayGridCell3 === null
      ? null
      : {
          ...sdn.calendarDayGridCell3,
          ...calendarDayGridCell3,
          className: combineClassNames(
            sdn.calendarDayGridCell3?.className,
            calendarDayGridCell3?.className,
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
  const calendarDayGridCell4Props = applyRef(
    seldonRefs,
    calendarDayGridCell4 === null
      ? null
      : {
          ...sdn.calendarDayGridCell4,
          ...calendarDayGridCell4,
          className: combineClassNames(
            sdn.calendarDayGridCell4?.className,
            calendarDayGridCell4?.className,
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
  const calendarDayGridCell5Props = applyRef(
    seldonRefs,
    calendarDayGridCell5 === null
      ? null
      : {
          ...sdn.calendarDayGridCell5,
          ...calendarDayGridCell5,
          className: combineClassNames(
            sdn.calendarDayGridCell5?.className,
            calendarDayGridCell5?.className,
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
  const calendarDayGridCell6Props = applyRef(
    seldonRefs,
    calendarDayGridCell6 === null
      ? null
      : {
          ...sdn.calendarDayGridCell6,
          ...calendarDayGridCell6,
          className: combineClassNames(
            sdn.calendarDayGridCell6?.className,
            calendarDayGridCell6?.className,
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
  const calendarDayGridCell7Props = applyRef(
    seldonRefs,
    calendarDayGridCell7 === null
      ? null
      : {
          ...sdn.calendarDayGridCell7,
          ...calendarDayGridCell7,
          className: combineClassNames(
            sdn.calendarDayGridCell7?.className,
            calendarDayGridCell7?.className,
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
  const calendarDayGridCell8Props = applyRef(
    seldonRefs,
    calendarDayGridCell8 === null
      ? null
      : {
          ...sdn.calendarDayGridCell8,
          ...calendarDayGridCell8,
          className: combineClassNames(
            sdn.calendarDayGridCell8?.className,
            calendarDayGridCell8?.className,
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
  const calendarDayGridCell9Props = applyRef(
    seldonRefs,
    calendarDayGridCell9 === null
      ? null
      : {
          ...sdn.calendarDayGridCell9,
          ...calendarDayGridCell9,
          className: combineClassNames(
            sdn.calendarDayGridCell9?.className,
            calendarDayGridCell9?.className,
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
  const calendarDayGridCell10Props = applyRef(
    seldonRefs,
    calendarDayGridCell10 === null
      ? null
      : {
          ...sdn.calendarDayGridCell10,
          ...calendarDayGridCell10,
          className: combineClassNames(
            sdn.calendarDayGridCell10?.className,
            calendarDayGridCell10?.className,
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
  const calendarDayGridCell11Props = applyRef(
    seldonRefs,
    calendarDayGridCell11 === null
      ? null
      : {
          ...sdn.calendarDayGridCell11,
          ...calendarDayGridCell11,
          className: combineClassNames(
            sdn.calendarDayGridCell11?.className,
            calendarDayGridCell11?.className,
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
  const calendarDayGridCell12Props = applyRef(
    seldonRefs,
    calendarDayGridCell12 === null
      ? null
      : {
          ...sdn.calendarDayGridCell12,
          ...calendarDayGridCell12,
          className: combineClassNames(
            sdn.calendarDayGridCell12?.className,
            calendarDayGridCell12?.className,
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
  const calendarDayGridCell13Props = applyRef(
    seldonRefs,
    calendarDayGridCell13 === null
      ? null
      : {
          ...sdn.calendarDayGridCell13,
          ...calendarDayGridCell13,
          className: combineClassNames(
            sdn.calendarDayGridCell13?.className,
            calendarDayGridCell13?.className,
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
  const calendarDayGridCell14Props = applyRef(
    seldonRefs,
    calendarDayGridCell14 === null
      ? null
      : {
          ...sdn.calendarDayGridCell14,
          ...calendarDayGridCell14,
          className: combineClassNames(
            sdn.calendarDayGridCell14?.className,
            calendarDayGridCell14?.className,
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
  const calendarDayGridCell15Props = applyRef(
    seldonRefs,
    calendarDayGridCell15 === null
      ? null
      : {
          ...sdn.calendarDayGridCell15,
          ...calendarDayGridCell15,
          className: combineClassNames(
            sdn.calendarDayGridCell15?.className,
            calendarDayGridCell15?.className,
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
  const calendarDayGridCell16Props = applyRef(
    seldonRefs,
    calendarDayGridCell16 === null
      ? null
      : {
          ...sdn.calendarDayGridCell16,
          ...calendarDayGridCell16,
          className: combineClassNames(
            sdn.calendarDayGridCell16?.className,
            calendarDayGridCell16?.className,
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
  const calendarDayGridCell17Props = applyRef(
    seldonRefs,
    calendarDayGridCell17 === null
      ? null
      : {
          ...sdn.calendarDayGridCell17,
          ...calendarDayGridCell17,
          className: combineClassNames(
            sdn.calendarDayGridCell17?.className,
            calendarDayGridCell17?.className,
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
  const calendarDayGridCell18Props = applyRef(
    seldonRefs,
    calendarDayGridCell18 === null
      ? null
      : {
          ...sdn.calendarDayGridCell18,
          ...calendarDayGridCell18,
          className: combineClassNames(
            sdn.calendarDayGridCell18?.className,
            calendarDayGridCell18?.className,
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
  const calendarDayGridCell19Props = applyRef(
    seldonRefs,
    calendarDayGridCell19 === null
      ? null
      : {
          ...sdn.calendarDayGridCell19,
          ...calendarDayGridCell19,
          className: combineClassNames(
            sdn.calendarDayGridCell19?.className,
            calendarDayGridCell19?.className,
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
  const calendarDayGridCell20Props = applyRef(
    seldonRefs,
    calendarDayGridCell20 === null
      ? null
      : {
          ...sdn.calendarDayGridCell20,
          ...calendarDayGridCell20,
          className: combineClassNames(
            sdn.calendarDayGridCell20?.className,
            calendarDayGridCell20?.className,
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
  const calendarDayGridCell21Props = applyRef(
    seldonRefs,
    calendarDayGridCell21 === null
      ? null
      : {
          ...sdn.calendarDayGridCell21,
          ...calendarDayGridCell21,
          className: combineClassNames(
            sdn.calendarDayGridCell21?.className,
            calendarDayGridCell21?.className,
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
  const calendarDayGridCell22Props = applyRef(
    seldonRefs,
    calendarDayGridCell22 === null
      ? null
      : {
          ...sdn.calendarDayGridCell22,
          ...calendarDayGridCell22,
          className: combineClassNames(
            sdn.calendarDayGridCell22?.className,
            calendarDayGridCell22?.className,
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
  const calendarDayGridCell23Props = applyRef(
    seldonRefs,
    calendarDayGridCell23 === null
      ? null
      : {
          ...sdn.calendarDayGridCell23,
          ...calendarDayGridCell23,
          className: combineClassNames(
            sdn.calendarDayGridCell23?.className,
            calendarDayGridCell23?.className,
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
  const calendarDayGridCell24Props = applyRef(
    seldonRefs,
    calendarDayGridCell24 === null
      ? null
      : {
          ...sdn.calendarDayGridCell24,
          ...calendarDayGridCell24,
          className: combineClassNames(
            sdn.calendarDayGridCell24?.className,
            calendarDayGridCell24?.className,
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
  const calendarDayGridCell25Props = applyRef(
    seldonRefs,
    calendarDayGridCell25 === null
      ? null
      : {
          ...sdn.calendarDayGridCell25,
          ...calendarDayGridCell25,
          className: combineClassNames(
            sdn.calendarDayGridCell25?.className,
            calendarDayGridCell25?.className,
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
  const calendarDayGridCell26Props = applyRef(
    seldonRefs,
    calendarDayGridCell26 === null
      ? null
      : {
          ...sdn.calendarDayGridCell26,
          ...calendarDayGridCell26,
          className: combineClassNames(
            sdn.calendarDayGridCell26?.className,
            calendarDayGridCell26?.className,
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
  const calendarDayGridCell27Props = applyRef(
    seldonRefs,
    calendarDayGridCell27 === null
      ? null
      : {
          ...sdn.calendarDayGridCell27,
          ...calendarDayGridCell27,
          className: combineClassNames(
            sdn.calendarDayGridCell27?.className,
            calendarDayGridCell27?.className,
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
  const calendarDayGridCell28Props = applyRef(
    seldonRefs,
    calendarDayGridCell28 === null
      ? null
      : {
          ...sdn.calendarDayGridCell28,
          ...calendarDayGridCell28,
          className: combineClassNames(
            sdn.calendarDayGridCell28?.className,
            calendarDayGridCell28?.className,
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
  const calendarDayGridCell29Props = applyRef(
    seldonRefs,
    calendarDayGridCell29 === null
      ? null
      : {
          ...sdn.calendarDayGridCell29,
          ...calendarDayGridCell29,
          className: combineClassNames(
            sdn.calendarDayGridCell29?.className,
            calendarDayGridCell29?.className,
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
              {calendarDayGridCell && calendarDayGridCellProps && (
                <CalendarDayGridCell {...calendarDayGridCellProps}>
                  {textLabel9 && textLabel9Props && (
                    <TextLabel {...textLabel9Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell2 && calendarDayGridCell2Props && (
                <CalendarDayGridCell {...calendarDayGridCell2Props}>
                  {textLabel10 && textLabel10Props && (
                    <TextLabel {...textLabel10Props} />
                  )}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container3Props}>
              {calendarDayGridCell3 && calendarDayGridCell3Props && (
                <CalendarDayGridCell {...calendarDayGridCell3Props}>
                  {textLabel11 && textLabel11Props && (
                    <TextLabel {...textLabel11Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell4 && calendarDayGridCell4Props && (
                <CalendarDayGridCell {...calendarDayGridCell4Props}>
                  {textLabel12 && textLabel12Props && (
                    <TextLabel {...textLabel12Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell5 && calendarDayGridCell5Props && (
                <CalendarDayGridCell {...calendarDayGridCell5Props}>
                  {textLabel13 && textLabel13Props && (
                    <TextLabel {...textLabel13Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell6 && calendarDayGridCell6Props && (
                <CalendarDayGridCell {...calendarDayGridCell6Props}>
                  {textLabel14 && textLabel14Props && (
                    <TextLabel {...textLabel14Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell7 && calendarDayGridCell7Props && (
                <CalendarDayGridCell {...calendarDayGridCell7Props}>
                  {textLabel15 && textLabel15Props && (
                    <TextLabel {...textLabel15Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell8 && calendarDayGridCell8Props && (
                <CalendarDayGridCell {...calendarDayGridCell8Props}>
                  {textLabel16 && textLabel16Props && (
                    <TextLabel {...textLabel16Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell9 && calendarDayGridCell9Props && (
                <CalendarDayGridCell {...calendarDayGridCell9Props}>
                  {textLabel17 && textLabel17Props && (
                    <TextLabel {...textLabel17Props} />
                  )}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container4Props}>
              {calendarDayGridCell10 && calendarDayGridCell10Props && (
                <CalendarDayGridCell {...calendarDayGridCell10Props}>
                  {textLabel18 && textLabel18Props && (
                    <TextLabel {...textLabel18Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell11 && calendarDayGridCell11Props && (
                <CalendarDayGridCell {...calendarDayGridCell11Props}>
                  {textLabel19 && textLabel19Props && (
                    <TextLabel {...textLabel19Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell12 && calendarDayGridCell12Props && (
                <CalendarDayGridCell {...calendarDayGridCell12Props}>
                  {textLabel20 && textLabel20Props && (
                    <TextLabel {...textLabel20Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell13 && calendarDayGridCell13Props && (
                <CalendarDayGridCell {...calendarDayGridCell13Props}>
                  {textLabel21 && textLabel21Props && (
                    <TextLabel {...textLabel21Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell14 && calendarDayGridCell14Props && (
                <CalendarDayGridCell {...calendarDayGridCell14Props}>
                  {textLabel22 && textLabel22Props && (
                    <TextLabel {...textLabel22Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell15 && calendarDayGridCell15Props && (
                <CalendarDayGridCell {...calendarDayGridCell15Props}>
                  {textLabel23 && textLabel23Props && (
                    <TextLabel {...textLabel23Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell16 && calendarDayGridCell16Props && (
                <CalendarDayGridCell {...calendarDayGridCell16Props}>
                  {textLabel24 && textLabel24Props && (
                    <TextLabel {...textLabel24Props} />
                  )}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container5Props}>
              {calendarDayGridCell17 && calendarDayGridCell17Props && (
                <CalendarDayGridCell {...calendarDayGridCell17Props}>
                  {textLabel25 && textLabel25Props && (
                    <TextLabel {...textLabel25Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayToday && calendarDayTodayProps && (
                <CalendarDayToday {...calendarDayTodayProps}>
                  {textLabel26 && textLabel26Props && (
                    <TextLabel {...textLabel26Props} />
                  )}
                </CalendarDayToday>
              )}
              {calendarDayGridCell18 && calendarDayGridCell18Props && (
                <CalendarDayGridCell {...calendarDayGridCell18Props}>
                  {textLabel27 && textLabel27Props && (
                    <TextLabel {...textLabel27Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDaySelected && calendarDaySelectedProps && (
                <CalendarDaySelected {...calendarDaySelectedProps}>
                  {textLabel28 && textLabel28Props && (
                    <TextLabel {...textLabel28Props} />
                  )}
                </CalendarDaySelected>
              )}
              {calendarDayGridCell19 && calendarDayGridCell19Props && (
                <CalendarDayGridCell {...calendarDayGridCell19Props}>
                  {textLabel29 && textLabel29Props && (
                    <TextLabel {...textLabel29Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell20 && calendarDayGridCell20Props && (
                <CalendarDayGridCell {...calendarDayGridCell20Props}>
                  {textLabel30 && textLabel30Props && (
                    <TextLabel {...textLabel30Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell21 && calendarDayGridCell21Props && (
                <CalendarDayGridCell {...calendarDayGridCell21Props}>
                  {textLabel31 && textLabel31Props && (
                    <TextLabel {...textLabel31Props} />
                  )}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container6Props}>
              {calendarDayGridCell22 && calendarDayGridCell22Props && (
                <CalendarDayGridCell {...calendarDayGridCell22Props}>
                  {textLabel32 && textLabel32Props && (
                    <TextLabel {...textLabel32Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell23 && calendarDayGridCell23Props && (
                <CalendarDayGridCell {...calendarDayGridCell23Props}>
                  {textLabel33 && textLabel33Props && (
                    <TextLabel {...textLabel33Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell24 && calendarDayGridCell24Props && (
                <CalendarDayGridCell {...calendarDayGridCell24Props}>
                  {textLabel34 && textLabel34Props && (
                    <TextLabel {...textLabel34Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell25 && calendarDayGridCell25Props && (
                <CalendarDayGridCell {...calendarDayGridCell25Props}>
                  {textLabel35 && textLabel35Props && (
                    <TextLabel {...textLabel35Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell26 && calendarDayGridCell26Props && (
                <CalendarDayGridCell {...calendarDayGridCell26Props}>
                  {textLabel36 && textLabel36Props && (
                    <TextLabel {...textLabel36Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell27 && calendarDayGridCell27Props && (
                <CalendarDayGridCell {...calendarDayGridCell27Props}>
                  {textLabel37 && textLabel37Props && (
                    <TextLabel {...textLabel37Props} />
                  )}
                </CalendarDayGridCell>
              )}
              {calendarDayGridCell28 && calendarDayGridCell28Props && (
                <CalendarDayGridCell {...calendarDayGridCell28Props}>
                  {textLabel38 && textLabel38Props && (
                    <TextLabel {...textLabel38Props} />
                  )}
                </CalendarDayGridCell>
              )}
            </Frame>
            <Frame {...container7Props}>
              {calendarDayGridCell29 && calendarDayGridCell29Props && (
                <CalendarDayGridCell {...calendarDayGridCell29Props}>
                  {textLabel39 && textLabel39Props && (
                    <TextLabel {...textLabel39Props} />
                  )}
                </CalendarDayGridCell>
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
  calendarDayGridCell: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel9: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell2: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel10: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell3: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel11: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell4: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel12: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell5: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel13: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell6: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel14: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell7: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel15: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell8: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel16: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell9: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel17: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell10: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel18: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell11: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel19: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell12: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel20: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell13: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel21: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell14: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel22: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell15: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel23: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell16: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel24: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell17: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel25: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayToday: {
    className: "sdn-calendar-day-today sdn-calendar-day-grid-cell--iysx",
  },
  textLabel26: {
    className: "sdn-text-label sdn-text-label--bwn4",
  },
  calendarDayGridCell18: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel27: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected: {
    className: "sdn-calendar-day-selected sdn-calendar-day-grid-cell--iysx",
  },
  textLabel28: {
    className: "sdn-text-label sdn-text-label--fye8",
  },
  calendarDayGridCell19: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel29: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell20: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel30: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell21: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel31: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell22: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel32: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell23: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel33: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell24: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel34: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell25: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel35: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell26: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel36: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell27: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel37: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayGridCell28: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
  },
  textLabel38: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  container7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--edpm",
  },
  calendarDayGridCell29: {
    className: "sdn-calendar-day-grid-cell sdn-calendar-day-grid-cell--iysx",
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
