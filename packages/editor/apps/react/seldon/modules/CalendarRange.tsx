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
import { CalendarDayMuted, CalendarDayMutedProps } from "../elements/CalendarDayMuted"
import { CalendarDaySelected, CalendarDaySelectedProps } from "../elements/CalendarDaySelected"
import { Container, ContainerProps } from "../frames/Container"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface CalendarRangeProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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

//
// Default property values
//
const sdn: CalendarRangeProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--h7wy",
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
    children: "October 2020",
    className: "sdn-text-title sdn-text-title--mo5p",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  textLabel: {
    children: "Mo",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel2: {
    children: "Tu",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel3: {
    children: "We",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel4: {
    children: "Th",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel5: {
    children: "Fr",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel6: {
    children: "Sa",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel7: {
    children: "Su",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--qfdm",
  },
  container2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--npgy",
  },
  calendarDay: {
    className: "sdn-calendar-day sdn-calendar-day--pobd",
  },
  textLabel8: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel9: {
    children: "1",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted2: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel10: {
    children: "2",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted3: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel11: {
    children: "3",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted4: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel12: {
    children: "4",
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
    children: "5",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted6: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel14: {
    children: "6",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted7: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel15: {
    children: "7",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted8: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel16: {
    children: "8",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDayMuted9: {
    className: "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx",
  },
  textLabel17: {
    children: "9",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay2: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel18: {
    children: "10",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay3: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel19: {
    children: "11",
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
    children: "12",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay5: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel21: {
    children: "13",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay6: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel22: {
    children: "14",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay7: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel23: {
    children: "15",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected: {
    className: "sdn-calendar-day-selected sdn-calendar-day-selected--or9s",
  },
  textLabel24: {
    children: "16",
    className: "sdn-text-label sdn-text-label--fye8",
  },
  calendarDay8: {
    className: "sdn-calendar-day sdn-calendar-day--xk18",
  },
  textLabel25: {
    children: "17",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDaySelected2: {
    className: "sdn-calendar-day-selected sdn-calendar-day-selected--og29",
  },
  textLabel26: {
    children: "18",
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
    children: "19",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay10: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel28: {
    children: "20",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay11: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel29: {
    children: "21",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay12: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel30: {
    children: "22",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay13: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel31: {
    children: "23",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay14: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel32: {
    children: "24",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay15: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel33: {
    children: "25",
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
    children: "26",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay17: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel35: {
    children: "27",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay18: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel36: {
    children: "28",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay19: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel37: {
    children: "29",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay20: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel38: {
    children: "30",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay21: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel39: {
    children: "31",
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
    className: "sdn-frame sdn-frame--h7wy",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8xlb",
  },
  textTitle2: {
    children: "November 2020",
    className: "sdn-text-title sdn-text-title--mo5p",
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
    children: "Mo",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel42: {
    children: "Tu",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel43: {
    children: "We",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel44: {
    children: "Th",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel45: {
    children: "Fr",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel46: {
    children: "Sa",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  textLabel47: {
    children: "Su",
    className: "sdn-text-label sdn-text-label--sxr5",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--qfdm",
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
    children: "1",
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
    children: "2",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay26: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel51: {
    children: "3",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay27: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel52: {
    children: "4",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay28: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel53: {
    children: "5",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay29: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel54: {
    children: "6",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay30: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel55: {
    children: "7",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay31: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel56: {
    children: "8",
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
    children: "9",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay33: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel58: {
    children: "10",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay34: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel59: {
    children: "11",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay35: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel60: {
    children: "12",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay36: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel61: {
    children: "13",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay37: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel62: {
    children: "14",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay38: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel63: {
    children: "15",
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
    children: "16",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay40: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel65: {
    children: "17",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay41: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel66: {
    children: "18",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay42: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel67: {
    children: "19",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay43: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel68: {
    children: "20",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay44: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel69: {
    children: "21",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay45: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel70: {
    children: "22",
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
    children: "23",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay47: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel72: {
    children: "24",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay48: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel73: {
    children: "25",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay49: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel74: {
    children: "26",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay50: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel75: {
    children: "27",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay51: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel76: {
    children: "28",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay52: {
    className: "sdn-calendar-day sdn-calendar-day-grid-cell--iysx",
  },
  textLabel77: {
    children: "29",
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
    children: "30",
    className: "sdn-text-label sdn-text-label--g3ro",
  },
  calendarDay54: {
    className: "sdn-calendar-day sdn-calendar-day--2hoh",
  },
  textLabel79: {
    className: "sdn-text-label sdn-text-label--g3ro",
  },
}

/**
 * Calendar: CalendarRange
 * Level: Module
 * Intent: Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.
 * Tags: calendar, ui, month, date, navigation, selection, range, events
 * Type: Inline
 *
 * Structure:
 *   Frame                      frame
 *     Frame                    frame2
 *       ButtonIconic           buttonIconic
 *         Icon                 icon
 *       TextTitle              textTitle
 *     Container                container
 *       TextLabel              textLabel
 *       TextLabel              textLabel2
 *       TextLabel              textLabel3
 *       TextLabel              textLabel4
 *       TextLabel              textLabel5
 *       TextLabel              textLabel6
 *       TextLabel              textLabel7
 *     Frame                    frame3
 *       Container              container2
 *         CalendarDay          calendarDay
 *           TextLabel          textLabel8
 *         CalendarDayMuted     calendarDayMuted
 *           TextLabel          textLabel9
 *         CalendarDayMuted     calendarDayMuted2
 *           TextLabel          textLabel10
 *         CalendarDayMuted     calendarDayMuted3
 *           TextLabel          textLabel11
 *         CalendarDayMuted     calendarDayMuted4
 *           TextLabel          textLabel12
 *       Container              container3
 *         CalendarDayMuted     calendarDayMuted5
 *           TextLabel          textLabel13
 *         CalendarDayMuted     calendarDayMuted6
 *           TextLabel          textLabel14
 *         CalendarDayMuted     calendarDayMuted7
 *           TextLabel          textLabel15
 *         CalendarDayMuted     calendarDayMuted8
 *           TextLabel          textLabel16
 *         CalendarDayMuted     calendarDayMuted9
 *           TextLabel          textLabel17
 *         CalendarDay          calendarDay2
 *           TextLabel          textLabel18
 *         CalendarDay          calendarDay3
 *           TextLabel          textLabel19
 *       Container              container4
 *         CalendarDay          calendarDay4
 *           TextLabel          textLabel20
 *         CalendarDay          calendarDay5
 *           TextLabel          textLabel21
 *         CalendarDay          calendarDay6
 *           TextLabel          textLabel22
 *         CalendarDay          calendarDay7
 *           TextLabel          textLabel23
 *         CalendarDaySelected  calendarDaySelected
 *           TextLabel          textLabel24
 *         CalendarDay          calendarDay8
 *           TextLabel          textLabel25
 *         CalendarDaySelected  calendarDaySelected2
 *           TextLabel          textLabel26
 *       Container              container5
 *         CalendarDay          calendarDay9
 *           TextLabel          textLabel27
 *         CalendarDay          calendarDay10
 *           TextLabel          textLabel28
 *         CalendarDay          calendarDay11
 *           TextLabel          textLabel29
 *         CalendarDay          calendarDay12
 *           TextLabel          textLabel30
 *         CalendarDay          calendarDay13
 *           TextLabel          textLabel31
 *         CalendarDay          calendarDay14
 *           TextLabel          textLabel32
 *         CalendarDay          calendarDay15
 *           TextLabel          textLabel33
 *       Container              container6
 *         CalendarDay          calendarDay16
 *           TextLabel          textLabel34
 *         CalendarDay          calendarDay17
 *           TextLabel          textLabel35
 *         CalendarDay          calendarDay18
 *           TextLabel          textLabel36
 *         CalendarDay          calendarDay19
 *           TextLabel          textLabel37
 *         CalendarDay          calendarDay20
 *           TextLabel          textLabel38
 *         CalendarDay          calendarDay21
 *           TextLabel          textLabel39
 *         CalendarDay          calendarDay22
 *           TextLabel          textLabel40
 *   Frame                      frame4
 *     Frame                    frame5
 *       TextTitle              textTitle2
 *       ButtonIconic           buttonIconic2
 *         Icon                 icon2
 *     Container                container7
 *       TextLabel              textLabel41
 *       TextLabel              textLabel42
 *       TextLabel              textLabel43
 *       TextLabel              textLabel44
 *       TextLabel              textLabel45
 *       TextLabel              textLabel46
 *       TextLabel              textLabel47
 *     Frame                    frame6
 *       Container              container8
 *         CalendarDay          calendarDay23
 *           TextLabel          textLabel48
 *         CalendarDay          calendarDay24
 *           TextLabel          textLabel49
 *       Container              container9
 *         CalendarDay          calendarDay25
 *           TextLabel          textLabel50
 *         CalendarDay          calendarDay26
 *           TextLabel          textLabel51
 *         CalendarDay          calendarDay27
 *           TextLabel          textLabel52
 *         CalendarDay          calendarDay28
 *           TextLabel          textLabel53
 *         CalendarDay          calendarDay29
 *           TextLabel          textLabel54
 *         CalendarDay          calendarDay30
 *           TextLabel          textLabel55
 *         CalendarDay          calendarDay31
 *           TextLabel          textLabel56
 *       Container              container10
 *         CalendarDay          calendarDay32
 *           TextLabel          textLabel57
 *         CalendarDay          calendarDay33
 *           TextLabel          textLabel58
 *         CalendarDay          calendarDay34
 *           TextLabel          textLabel59
 *         CalendarDay          calendarDay35
 *           TextLabel          textLabel60
 *         CalendarDay          calendarDay36
 *           TextLabel          textLabel61
 *         CalendarDay          calendarDay37
 *           TextLabel          textLabel62
 *         CalendarDay          calendarDay38
 *           TextLabel          textLabel63
 *       Container              container11
 *         CalendarDay          calendarDay39
 *           TextLabel          textLabel64
 *         CalendarDay          calendarDay40
 *           TextLabel          textLabel65
 *         CalendarDay          calendarDay41
 *           TextLabel          textLabel66
 *         CalendarDay          calendarDay42
 *           TextLabel          textLabel67
 *         CalendarDay          calendarDay43
 *           TextLabel          textLabel68
 *         CalendarDay          calendarDay44
 *           TextLabel          textLabel69
 *         CalendarDay          calendarDay45
 *           TextLabel          textLabel70
 *       Container              container12
 *         CalendarDay          calendarDay46
 *           TextLabel          textLabel71
 *         CalendarDay          calendarDay47
 *           TextLabel          textLabel72
 *         CalendarDay          calendarDay48
 *           TextLabel          textLabel73
 *         CalendarDay          calendarDay49
 *           TextLabel          textLabel74
 *         CalendarDay          calendarDay50
 *           TextLabel          textLabel75
 *         CalendarDay          calendarDay51
 *           TextLabel          textLabel76
 *         CalendarDay          calendarDay52
 *           TextLabel          textLabel77
 *       Container              container13
 *         CalendarDay          calendarDay53
 *           TextLabel          textLabel78
 *         CalendarDay          calendarDay54
 *           TextLabel          textLabel79
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
 */
export function CalendarRange({
  className = "",
  frame,
  frame2,
  buttonIconic,
  icon,
  textTitle,
  container,
  textLabel,
  textLabel2,
  textLabel3,
  textLabel4,
  textLabel5,
  textLabel6,
  textLabel7,
  frame3,
  container2,
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
  container3,
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
  container4,
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
  container5,
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
  container6,
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

  frame4,
  frame5,
  textTitle2,
  buttonIconic2,
  icon2,
  container7,
  textLabel41,
  textLabel42,
  textLabel43,
  textLabel44,
  textLabel45,
  textLabel46,
  textLabel47,
  frame6,
  container8,
  calendarDay23,
  textLabel48,
  calendarDay24,
  textLabel49,
  container9,
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
  container10,
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
  container11,
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
  container12,
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
  container13,
  calendarDay53,
  textLabel78,
  calendarDay54,
  textLabel79,

  children,
  seldonRefs,
  ...props
}: CalendarRangeProps) {
  const calendarRangeClassName = combineClassNames("sdn-calendar-range", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const containerProps = mergeSlot(sdn.container, container, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const container2Props = mergeSlot(sdn.container2, container2, seldonRefs)
  const calendarDayProps = mergeOptionalSlot(sdn.calendarDay, calendarDay, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const calendarDayMutedProps = mergeOptionalSlot(
    sdn.calendarDayMuted,
    calendarDayMuted,
    seldonRefs,
  )
  const textLabel9Props = mergeOptionalSlot(sdn.textLabel9, textLabel9, seldonRefs)
  const calendarDayMuted2Props = mergeOptionalSlot(
    sdn.calendarDayMuted2,
    calendarDayMuted2,
    seldonRefs,
  )
  const textLabel10Props = mergeOptionalSlot(sdn.textLabel10, textLabel10, seldonRefs)
  const calendarDayMuted3Props = mergeOptionalSlot(
    sdn.calendarDayMuted3,
    calendarDayMuted3,
    seldonRefs,
  )
  const textLabel11Props = mergeOptionalSlot(sdn.textLabel11, textLabel11, seldonRefs)
  const calendarDayMuted4Props = mergeOptionalSlot(
    sdn.calendarDayMuted4,
    calendarDayMuted4,
    seldonRefs,
  )
  const textLabel12Props = mergeOptionalSlot(sdn.textLabel12, textLabel12, seldonRefs)
  const container3Props = mergeSlot(sdn.container3, container3, seldonRefs)
  const calendarDayMuted5Props = mergeOptionalSlot(
    sdn.calendarDayMuted5,
    calendarDayMuted5,
    seldonRefs,
  )
  const textLabel13Props = mergeOptionalSlot(sdn.textLabel13, textLabel13, seldonRefs)
  const calendarDayMuted6Props = mergeOptionalSlot(
    sdn.calendarDayMuted6,
    calendarDayMuted6,
    seldonRefs,
  )
  const textLabel14Props = mergeOptionalSlot(sdn.textLabel14, textLabel14, seldonRefs)
  const calendarDayMuted7Props = mergeOptionalSlot(
    sdn.calendarDayMuted7,
    calendarDayMuted7,
    seldonRefs,
  )
  const textLabel15Props = mergeOptionalSlot(sdn.textLabel15, textLabel15, seldonRefs)
  const calendarDayMuted8Props = mergeOptionalSlot(
    sdn.calendarDayMuted8,
    calendarDayMuted8,
    seldonRefs,
  )
  const textLabel16Props = mergeOptionalSlot(sdn.textLabel16, textLabel16, seldonRefs)
  const calendarDayMuted9Props = mergeOptionalSlot(
    sdn.calendarDayMuted9,
    calendarDayMuted9,
    seldonRefs,
  )
  const textLabel17Props = mergeOptionalSlot(sdn.textLabel17, textLabel17, seldonRefs)
  const calendarDay2Props = mergeOptionalSlot(sdn.calendarDay2, calendarDay2, seldonRefs)
  const textLabel18Props = mergeOptionalSlot(sdn.textLabel18, textLabel18, seldonRefs)
  const calendarDay3Props = mergeOptionalSlot(sdn.calendarDay3, calendarDay3, seldonRefs)
  const textLabel19Props = mergeOptionalSlot(sdn.textLabel19, textLabel19, seldonRefs)
  const container4Props = mergeSlot(sdn.container4, container4, seldonRefs)
  const calendarDay4Props = mergeOptionalSlot(sdn.calendarDay4, calendarDay4, seldonRefs)
  const textLabel20Props = mergeOptionalSlot(sdn.textLabel20, textLabel20, seldonRefs)
  const calendarDay5Props = mergeOptionalSlot(sdn.calendarDay5, calendarDay5, seldonRefs)
  const textLabel21Props = mergeOptionalSlot(sdn.textLabel21, textLabel21, seldonRefs)
  const calendarDay6Props = mergeOptionalSlot(sdn.calendarDay6, calendarDay6, seldonRefs)
  const textLabel22Props = mergeOptionalSlot(sdn.textLabel22, textLabel22, seldonRefs)
  const calendarDay7Props = mergeOptionalSlot(sdn.calendarDay7, calendarDay7, seldonRefs)
  const textLabel23Props = mergeOptionalSlot(sdn.textLabel23, textLabel23, seldonRefs)
  const calendarDaySelectedProps = mergeOptionalSlot(
    sdn.calendarDaySelected,
    calendarDaySelected,
    seldonRefs,
  )
  const textLabel24Props = mergeOptionalSlot(sdn.textLabel24, textLabel24, seldonRefs)
  const calendarDay8Props = mergeOptionalSlot(sdn.calendarDay8, calendarDay8, seldonRefs)
  const textLabel25Props = mergeOptionalSlot(sdn.textLabel25, textLabel25, seldonRefs)
  const calendarDaySelected2Props = mergeOptionalSlot(
    sdn.calendarDaySelected2,
    calendarDaySelected2,
    seldonRefs,
  )
  const textLabel26Props = mergeOptionalSlot(sdn.textLabel26, textLabel26, seldonRefs)
  const container5Props = mergeSlot(sdn.container5, container5, seldonRefs)
  const calendarDay9Props = mergeOptionalSlot(sdn.calendarDay9, calendarDay9, seldonRefs)
  const textLabel27Props = mergeOptionalSlot(sdn.textLabel27, textLabel27, seldonRefs)
  const calendarDay10Props = mergeOptionalSlot(sdn.calendarDay10, calendarDay10, seldonRefs)
  const textLabel28Props = mergeOptionalSlot(sdn.textLabel28, textLabel28, seldonRefs)
  const calendarDay11Props = mergeOptionalSlot(sdn.calendarDay11, calendarDay11, seldonRefs)
  const textLabel29Props = mergeOptionalSlot(sdn.textLabel29, textLabel29, seldonRefs)
  const calendarDay12Props = mergeOptionalSlot(sdn.calendarDay12, calendarDay12, seldonRefs)
  const textLabel30Props = mergeOptionalSlot(sdn.textLabel30, textLabel30, seldonRefs)
  const calendarDay13Props = mergeOptionalSlot(sdn.calendarDay13, calendarDay13, seldonRefs)
  const textLabel31Props = mergeOptionalSlot(sdn.textLabel31, textLabel31, seldonRefs)
  const calendarDay14Props = mergeOptionalSlot(sdn.calendarDay14, calendarDay14, seldonRefs)
  const textLabel32Props = mergeOptionalSlot(sdn.textLabel32, textLabel32, seldonRefs)
  const calendarDay15Props = mergeOptionalSlot(sdn.calendarDay15, calendarDay15, seldonRefs)
  const textLabel33Props = mergeOptionalSlot(sdn.textLabel33, textLabel33, seldonRefs)
  const container6Props = mergeSlot(sdn.container6, container6, seldonRefs)
  const calendarDay16Props = mergeOptionalSlot(sdn.calendarDay16, calendarDay16, seldonRefs)
  const textLabel34Props = mergeOptionalSlot(sdn.textLabel34, textLabel34, seldonRefs)
  const calendarDay17Props = mergeOptionalSlot(sdn.calendarDay17, calendarDay17, seldonRefs)
  const textLabel35Props = mergeOptionalSlot(sdn.textLabel35, textLabel35, seldonRefs)
  const calendarDay18Props = mergeOptionalSlot(sdn.calendarDay18, calendarDay18, seldonRefs)
  const textLabel36Props = mergeOptionalSlot(sdn.textLabel36, textLabel36, seldonRefs)
  const calendarDay19Props = mergeOptionalSlot(sdn.calendarDay19, calendarDay19, seldonRefs)
  const textLabel37Props = mergeOptionalSlot(sdn.textLabel37, textLabel37, seldonRefs)
  const calendarDay20Props = mergeOptionalSlot(sdn.calendarDay20, calendarDay20, seldonRefs)
  const textLabel38Props = mergeOptionalSlot(sdn.textLabel38, textLabel38, seldonRefs)
  const calendarDay21Props = mergeOptionalSlot(sdn.calendarDay21, calendarDay21, seldonRefs)
  const textLabel39Props = mergeOptionalSlot(sdn.textLabel39, textLabel39, seldonRefs)
  const calendarDay22Props = mergeOptionalSlot(sdn.calendarDay22, calendarDay22, seldonRefs)
  const textLabel40Props = mergeOptionalSlot(sdn.textLabel40, textLabel40, seldonRefs)

  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const textTitle2Props = mergeOptionalSlot(sdn.textTitle2, textTitle2, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const container7Props = mergeSlot(sdn.container7, container7, seldonRefs)
  const textLabel41Props = mergeOptionalSlot(sdn.textLabel41, textLabel41, seldonRefs)
  const textLabel42Props = mergeOptionalSlot(sdn.textLabel42, textLabel42, seldonRefs)
  const textLabel43Props = mergeOptionalSlot(sdn.textLabel43, textLabel43, seldonRefs)
  const textLabel44Props = mergeOptionalSlot(sdn.textLabel44, textLabel44, seldonRefs)
  const textLabel45Props = mergeOptionalSlot(sdn.textLabel45, textLabel45, seldonRefs)
  const textLabel46Props = mergeOptionalSlot(sdn.textLabel46, textLabel46, seldonRefs)
  const textLabel47Props = mergeOptionalSlot(sdn.textLabel47, textLabel47, seldonRefs)
  const frame6Props = mergeSlot(sdn.frame6, frame6, seldonRefs)
  const container8Props = mergeSlot(sdn.container8, container8, seldonRefs)
  const calendarDay23Props = mergeOptionalSlot(sdn.calendarDay23, calendarDay23, seldonRefs)
  const textLabel48Props = mergeOptionalSlot(sdn.textLabel48, textLabel48, seldonRefs)
  const calendarDay24Props = mergeOptionalSlot(sdn.calendarDay24, calendarDay24, seldonRefs)
  const textLabel49Props = mergeOptionalSlot(sdn.textLabel49, textLabel49, seldonRefs)
  const container9Props = mergeSlot(sdn.container9, container9, seldonRefs)
  const calendarDay25Props = mergeOptionalSlot(sdn.calendarDay25, calendarDay25, seldonRefs)
  const textLabel50Props = mergeOptionalSlot(sdn.textLabel50, textLabel50, seldonRefs)
  const calendarDay26Props = mergeOptionalSlot(sdn.calendarDay26, calendarDay26, seldonRefs)
  const textLabel51Props = mergeOptionalSlot(sdn.textLabel51, textLabel51, seldonRefs)
  const calendarDay27Props = mergeOptionalSlot(sdn.calendarDay27, calendarDay27, seldonRefs)
  const textLabel52Props = mergeOptionalSlot(sdn.textLabel52, textLabel52, seldonRefs)
  const calendarDay28Props = mergeOptionalSlot(sdn.calendarDay28, calendarDay28, seldonRefs)
  const textLabel53Props = mergeOptionalSlot(sdn.textLabel53, textLabel53, seldonRefs)
  const calendarDay29Props = mergeOptionalSlot(sdn.calendarDay29, calendarDay29, seldonRefs)
  const textLabel54Props = mergeOptionalSlot(sdn.textLabel54, textLabel54, seldonRefs)
  const calendarDay30Props = mergeOptionalSlot(sdn.calendarDay30, calendarDay30, seldonRefs)
  const textLabel55Props = mergeOptionalSlot(sdn.textLabel55, textLabel55, seldonRefs)
  const calendarDay31Props = mergeOptionalSlot(sdn.calendarDay31, calendarDay31, seldonRefs)
  const textLabel56Props = mergeOptionalSlot(sdn.textLabel56, textLabel56, seldonRefs)
  const container10Props = mergeSlot(sdn.container10, container10, seldonRefs)
  const calendarDay32Props = mergeOptionalSlot(sdn.calendarDay32, calendarDay32, seldonRefs)
  const textLabel57Props = mergeOptionalSlot(sdn.textLabel57, textLabel57, seldonRefs)
  const calendarDay33Props = mergeOptionalSlot(sdn.calendarDay33, calendarDay33, seldonRefs)
  const textLabel58Props = mergeOptionalSlot(sdn.textLabel58, textLabel58, seldonRefs)
  const calendarDay34Props = mergeOptionalSlot(sdn.calendarDay34, calendarDay34, seldonRefs)
  const textLabel59Props = mergeOptionalSlot(sdn.textLabel59, textLabel59, seldonRefs)
  const calendarDay35Props = mergeOptionalSlot(sdn.calendarDay35, calendarDay35, seldonRefs)
  const textLabel60Props = mergeOptionalSlot(sdn.textLabel60, textLabel60, seldonRefs)
  const calendarDay36Props = mergeOptionalSlot(sdn.calendarDay36, calendarDay36, seldonRefs)
  const textLabel61Props = mergeOptionalSlot(sdn.textLabel61, textLabel61, seldonRefs)
  const calendarDay37Props = mergeOptionalSlot(sdn.calendarDay37, calendarDay37, seldonRefs)
  const textLabel62Props = mergeOptionalSlot(sdn.textLabel62, textLabel62, seldonRefs)
  const calendarDay38Props = mergeOptionalSlot(sdn.calendarDay38, calendarDay38, seldonRefs)
  const textLabel63Props = mergeOptionalSlot(sdn.textLabel63, textLabel63, seldonRefs)
  const container11Props = mergeSlot(sdn.container11, container11, seldonRefs)
  const calendarDay39Props = mergeOptionalSlot(sdn.calendarDay39, calendarDay39, seldonRefs)
  const textLabel64Props = mergeOptionalSlot(sdn.textLabel64, textLabel64, seldonRefs)
  const calendarDay40Props = mergeOptionalSlot(sdn.calendarDay40, calendarDay40, seldonRefs)
  const textLabel65Props = mergeOptionalSlot(sdn.textLabel65, textLabel65, seldonRefs)
  const calendarDay41Props = mergeOptionalSlot(sdn.calendarDay41, calendarDay41, seldonRefs)
  const textLabel66Props = mergeOptionalSlot(sdn.textLabel66, textLabel66, seldonRefs)
  const calendarDay42Props = mergeOptionalSlot(sdn.calendarDay42, calendarDay42, seldonRefs)
  const textLabel67Props = mergeOptionalSlot(sdn.textLabel67, textLabel67, seldonRefs)
  const calendarDay43Props = mergeOptionalSlot(sdn.calendarDay43, calendarDay43, seldonRefs)
  const textLabel68Props = mergeOptionalSlot(sdn.textLabel68, textLabel68, seldonRefs)
  const calendarDay44Props = mergeOptionalSlot(sdn.calendarDay44, calendarDay44, seldonRefs)
  const textLabel69Props = mergeOptionalSlot(sdn.textLabel69, textLabel69, seldonRefs)
  const calendarDay45Props = mergeOptionalSlot(sdn.calendarDay45, calendarDay45, seldonRefs)
  const textLabel70Props = mergeOptionalSlot(sdn.textLabel70, textLabel70, seldonRefs)
  const container12Props = mergeSlot(sdn.container12, container12, seldonRefs)
  const calendarDay46Props = mergeOptionalSlot(sdn.calendarDay46, calendarDay46, seldonRefs)
  const textLabel71Props = mergeOptionalSlot(sdn.textLabel71, textLabel71, seldonRefs)
  const calendarDay47Props = mergeOptionalSlot(sdn.calendarDay47, calendarDay47, seldonRefs)
  const textLabel72Props = mergeOptionalSlot(sdn.textLabel72, textLabel72, seldonRefs)
  const calendarDay48Props = mergeOptionalSlot(sdn.calendarDay48, calendarDay48, seldonRefs)
  const textLabel73Props = mergeOptionalSlot(sdn.textLabel73, textLabel73, seldonRefs)
  const calendarDay49Props = mergeOptionalSlot(sdn.calendarDay49, calendarDay49, seldonRefs)
  const textLabel74Props = mergeOptionalSlot(sdn.textLabel74, textLabel74, seldonRefs)
  const calendarDay50Props = mergeOptionalSlot(sdn.calendarDay50, calendarDay50, seldonRefs)
  const textLabel75Props = mergeOptionalSlot(sdn.textLabel75, textLabel75, seldonRefs)
  const calendarDay51Props = mergeOptionalSlot(sdn.calendarDay51, calendarDay51, seldonRefs)
  const textLabel76Props = mergeOptionalSlot(sdn.textLabel76, textLabel76, seldonRefs)
  const calendarDay52Props = mergeOptionalSlot(sdn.calendarDay52, calendarDay52, seldonRefs)
  const textLabel77Props = mergeOptionalSlot(sdn.textLabel77, textLabel77, seldonRefs)
  const container13Props = mergeSlot(sdn.container13, container13, seldonRefs)
  const calendarDay53Props = mergeOptionalSlot(sdn.calendarDay53, calendarDay53, seldonRefs)
  const textLabel78Props = mergeOptionalSlot(sdn.textLabel78, textLabel78, seldonRefs)
  const calendarDay54Props = mergeOptionalSlot(sdn.calendarDay54, calendarDay54, seldonRefs)
  const textLabel79Props = mergeOptionalSlot(sdn.textLabel79, textLabel79, seldonRefs)

  return (
    <Frame className={calendarRangeClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              {buttonIconicProps !== null && (
                <ButtonIconic {...buttonIconicProps} icon={iconProps} />
              )}
              {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            </Frame>
            <Frame {...containerProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
              {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
              {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
              {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
            </Frame>
            <Frame {...frame3Props}>
              <Frame {...container2Props}>
                {calendarDayProps !== null && (
                  <CalendarDay {...calendarDayProps}>
                    {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                  </CalendarDay>
                )}
                {calendarDayMutedProps !== null && (
                  <CalendarDayMuted {...calendarDayMutedProps}>
                    {textLabel9Props !== null && <TextLabel {...textLabel9Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted2Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted2Props}>
                    {textLabel10Props !== null && <TextLabel {...textLabel10Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted3Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted3Props}>
                    {textLabel11Props !== null && <TextLabel {...textLabel11Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted4Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted4Props}>
                    {textLabel12Props !== null && <TextLabel {...textLabel12Props} />}
                  </CalendarDayMuted>
                )}
              </Frame>
              <Frame {...container3Props}>
                {calendarDayMuted5Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted5Props}>
                    {textLabel13Props !== null && <TextLabel {...textLabel13Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted6Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted6Props}>
                    {textLabel14Props !== null && <TextLabel {...textLabel14Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted7Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted7Props}>
                    {textLabel15Props !== null && <TextLabel {...textLabel15Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted8Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted8Props}>
                    {textLabel16Props !== null && <TextLabel {...textLabel16Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDayMuted9Props !== null && (
                  <CalendarDayMuted {...calendarDayMuted9Props}>
                    {textLabel17Props !== null && <TextLabel {...textLabel17Props} />}
                  </CalendarDayMuted>
                )}
                {calendarDay2Props !== null && (
                  <CalendarDay {...calendarDay2Props}>
                    {textLabel18Props !== null && <TextLabel {...textLabel18Props} />}
                  </CalendarDay>
                )}
                {calendarDay3Props !== null && (
                  <CalendarDay {...calendarDay3Props}>
                    {textLabel19Props !== null && <TextLabel {...textLabel19Props} />}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container4Props}>
                {calendarDay4Props !== null && (
                  <CalendarDay {...calendarDay4Props}>
                    {textLabel20Props !== null && <TextLabel {...textLabel20Props} />}
                  </CalendarDay>
                )}
                {calendarDay5Props !== null && (
                  <CalendarDay {...calendarDay5Props}>
                    {textLabel21Props !== null && <TextLabel {...textLabel21Props} />}
                  </CalendarDay>
                )}
                {calendarDay6Props !== null && (
                  <CalendarDay {...calendarDay6Props}>
                    {textLabel22Props !== null && <TextLabel {...textLabel22Props} />}
                  </CalendarDay>
                )}
                {calendarDay7Props !== null && (
                  <CalendarDay {...calendarDay7Props}>
                    {textLabel23Props !== null && <TextLabel {...textLabel23Props} />}
                  </CalendarDay>
                )}
                {calendarDaySelectedProps !== null && (
                  <CalendarDaySelected {...calendarDaySelectedProps}>
                    {textLabel24Props !== null && <TextLabel {...textLabel24Props} />}
                  </CalendarDaySelected>
                )}
                {calendarDay8Props !== null && (
                  <CalendarDay {...calendarDay8Props}>
                    {textLabel25Props !== null && <TextLabel {...textLabel25Props} />}
                  </CalendarDay>
                )}
                {calendarDaySelected2Props !== null && (
                  <CalendarDaySelected {...calendarDaySelected2Props}>
                    {textLabel26Props !== null && <TextLabel {...textLabel26Props} />}
                  </CalendarDaySelected>
                )}
              </Frame>
              <Frame {...container5Props}>
                {calendarDay9Props !== null && (
                  <CalendarDay {...calendarDay9Props}>
                    {textLabel27Props !== null && <TextLabel {...textLabel27Props} />}
                  </CalendarDay>
                )}
                {calendarDay10Props !== null && (
                  <CalendarDay {...calendarDay10Props}>
                    {textLabel28Props !== null && <TextLabel {...textLabel28Props} />}
                  </CalendarDay>
                )}
                {calendarDay11Props !== null && (
                  <CalendarDay {...calendarDay11Props}>
                    {textLabel29Props !== null && <TextLabel {...textLabel29Props} />}
                  </CalendarDay>
                )}
                {calendarDay12Props !== null && (
                  <CalendarDay {...calendarDay12Props}>
                    {textLabel30Props !== null && <TextLabel {...textLabel30Props} />}
                  </CalendarDay>
                )}
                {calendarDay13Props !== null && (
                  <CalendarDay {...calendarDay13Props}>
                    {textLabel31Props !== null && <TextLabel {...textLabel31Props} />}
                  </CalendarDay>
                )}
                {calendarDay14Props !== null && (
                  <CalendarDay {...calendarDay14Props}>
                    {textLabel32Props !== null && <TextLabel {...textLabel32Props} />}
                  </CalendarDay>
                )}
                {calendarDay15Props !== null && (
                  <CalendarDay {...calendarDay15Props}>
                    {textLabel33Props !== null && <TextLabel {...textLabel33Props} />}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container6Props}>
                {calendarDay16Props !== null && (
                  <CalendarDay {...calendarDay16Props}>
                    {textLabel34Props !== null && <TextLabel {...textLabel34Props} />}
                  </CalendarDay>
                )}
                {calendarDay17Props !== null && (
                  <CalendarDay {...calendarDay17Props}>
                    {textLabel35Props !== null && <TextLabel {...textLabel35Props} />}
                  </CalendarDay>
                )}
                {calendarDay18Props !== null && (
                  <CalendarDay {...calendarDay18Props}>
                    {textLabel36Props !== null && <TextLabel {...textLabel36Props} />}
                  </CalendarDay>
                )}
                {calendarDay19Props !== null && (
                  <CalendarDay {...calendarDay19Props}>
                    {textLabel37Props !== null && <TextLabel {...textLabel37Props} />}
                  </CalendarDay>
                )}
                {calendarDay20Props !== null && (
                  <CalendarDay {...calendarDay20Props}>
                    {textLabel38Props !== null && <TextLabel {...textLabel38Props} />}
                  </CalendarDay>
                )}
                {calendarDay21Props !== null && (
                  <CalendarDay {...calendarDay21Props}>
                    {textLabel39Props !== null && <TextLabel {...textLabel39Props} />}
                  </CalendarDay>
                )}
                {calendarDay22Props !== null && (
                  <CalendarDay {...calendarDay22Props}>
                    {textLabel40Props !== null && <TextLabel {...textLabel40Props} />}
                  </CalendarDay>
                )}
              </Frame>
            </Frame>
          </Frame>
          <Frame {...frame4Props}>
            <Frame {...frame5Props}>
              {textTitle2Props !== null && <TextTitle {...textTitle2Props} />}
              {buttonIconic2Props !== null && (
                <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
              )}
            </Frame>
            <Frame {...container7Props}>
              {textLabel41Props !== null && <TextLabel {...textLabel41Props} />}
              {textLabel42Props !== null && <TextLabel {...textLabel42Props} />}
              {textLabel43Props !== null && <TextLabel {...textLabel43Props} />}
              {textLabel44Props !== null && <TextLabel {...textLabel44Props} />}
              {textLabel45Props !== null && <TextLabel {...textLabel45Props} />}
              {textLabel46Props !== null && <TextLabel {...textLabel46Props} />}
              {textLabel47Props !== null && <TextLabel {...textLabel47Props} />}
            </Frame>
            <Frame {...frame6Props}>
              <Frame {...container8Props}>
                {calendarDay23Props !== null && (
                  <CalendarDay {...calendarDay23Props}>
                    {textLabel48Props !== null && <TextLabel {...textLabel48Props} />}
                  </CalendarDay>
                )}
                {calendarDay24Props !== null && (
                  <CalendarDay {...calendarDay24Props}>
                    {textLabel49Props !== null && <TextLabel {...textLabel49Props} />}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container9Props}>
                {calendarDay25Props !== null && (
                  <CalendarDay {...calendarDay25Props}>
                    {textLabel50Props !== null && <TextLabel {...textLabel50Props} />}
                  </CalendarDay>
                )}
                {calendarDay26Props !== null && (
                  <CalendarDay {...calendarDay26Props}>
                    {textLabel51Props !== null && <TextLabel {...textLabel51Props} />}
                  </CalendarDay>
                )}
                {calendarDay27Props !== null && (
                  <CalendarDay {...calendarDay27Props}>
                    {textLabel52Props !== null && <TextLabel {...textLabel52Props} />}
                  </CalendarDay>
                )}
                {calendarDay28Props !== null && (
                  <CalendarDay {...calendarDay28Props}>
                    {textLabel53Props !== null && <TextLabel {...textLabel53Props} />}
                  </CalendarDay>
                )}
                {calendarDay29Props !== null && (
                  <CalendarDay {...calendarDay29Props}>
                    {textLabel54Props !== null && <TextLabel {...textLabel54Props} />}
                  </CalendarDay>
                )}
                {calendarDay30Props !== null && (
                  <CalendarDay {...calendarDay30Props}>
                    {textLabel55Props !== null && <TextLabel {...textLabel55Props} />}
                  </CalendarDay>
                )}
                {calendarDay31Props !== null && (
                  <CalendarDay {...calendarDay31Props}>
                    {textLabel56Props !== null && <TextLabel {...textLabel56Props} />}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container10Props}>
                {calendarDay32Props !== null && (
                  <CalendarDay {...calendarDay32Props}>
                    {textLabel57Props !== null && <TextLabel {...textLabel57Props} />}
                  </CalendarDay>
                )}
                {calendarDay33Props !== null && (
                  <CalendarDay {...calendarDay33Props}>
                    {textLabel58Props !== null && <TextLabel {...textLabel58Props} />}
                  </CalendarDay>
                )}
                {calendarDay34Props !== null && (
                  <CalendarDay {...calendarDay34Props}>
                    {textLabel59Props !== null && <TextLabel {...textLabel59Props} />}
                  </CalendarDay>
                )}
                {calendarDay35Props !== null && (
                  <CalendarDay {...calendarDay35Props}>
                    {textLabel60Props !== null && <TextLabel {...textLabel60Props} />}
                  </CalendarDay>
                )}
                {calendarDay36Props !== null && (
                  <CalendarDay {...calendarDay36Props}>
                    {textLabel61Props !== null && <TextLabel {...textLabel61Props} />}
                  </CalendarDay>
                )}
                {calendarDay37Props !== null && (
                  <CalendarDay {...calendarDay37Props}>
                    {textLabel62Props !== null && <TextLabel {...textLabel62Props} />}
                  </CalendarDay>
                )}
                {calendarDay38Props !== null && (
                  <CalendarDay {...calendarDay38Props}>
                    {textLabel63Props !== null && <TextLabel {...textLabel63Props} />}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container11Props}>
                {calendarDay39Props !== null && (
                  <CalendarDay {...calendarDay39Props}>
                    {textLabel64Props !== null && <TextLabel {...textLabel64Props} />}
                  </CalendarDay>
                )}
                {calendarDay40Props !== null && (
                  <CalendarDay {...calendarDay40Props}>
                    {textLabel65Props !== null && <TextLabel {...textLabel65Props} />}
                  </CalendarDay>
                )}
                {calendarDay41Props !== null && (
                  <CalendarDay {...calendarDay41Props}>
                    {textLabel66Props !== null && <TextLabel {...textLabel66Props} />}
                  </CalendarDay>
                )}
                {calendarDay42Props !== null && (
                  <CalendarDay {...calendarDay42Props}>
                    {textLabel67Props !== null && <TextLabel {...textLabel67Props} />}
                  </CalendarDay>
                )}
                {calendarDay43Props !== null && (
                  <CalendarDay {...calendarDay43Props}>
                    {textLabel68Props !== null && <TextLabel {...textLabel68Props} />}
                  </CalendarDay>
                )}
                {calendarDay44Props !== null && (
                  <CalendarDay {...calendarDay44Props}>
                    {textLabel69Props !== null && <TextLabel {...textLabel69Props} />}
                  </CalendarDay>
                )}
                {calendarDay45Props !== null && (
                  <CalendarDay {...calendarDay45Props}>
                    {textLabel70Props !== null && <TextLabel {...textLabel70Props} />}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container12Props}>
                {calendarDay46Props !== null && (
                  <CalendarDay {...calendarDay46Props}>
                    {textLabel71Props !== null && <TextLabel {...textLabel71Props} />}
                  </CalendarDay>
                )}
                {calendarDay47Props !== null && (
                  <CalendarDay {...calendarDay47Props}>
                    {textLabel72Props !== null && <TextLabel {...textLabel72Props} />}
                  </CalendarDay>
                )}
                {calendarDay48Props !== null && (
                  <CalendarDay {...calendarDay48Props}>
                    {textLabel73Props !== null && <TextLabel {...textLabel73Props} />}
                  </CalendarDay>
                )}
                {calendarDay49Props !== null && (
                  <CalendarDay {...calendarDay49Props}>
                    {textLabel74Props !== null && <TextLabel {...textLabel74Props} />}
                  </CalendarDay>
                )}
                {calendarDay50Props !== null && (
                  <CalendarDay {...calendarDay50Props}>
                    {textLabel75Props !== null && <TextLabel {...textLabel75Props} />}
                  </CalendarDay>
                )}
                {calendarDay51Props !== null && (
                  <CalendarDay {...calendarDay51Props}>
                    {textLabel76Props !== null && <TextLabel {...textLabel76Props} />}
                  </CalendarDay>
                )}
                {calendarDay52Props !== null && (
                  <CalendarDay {...calendarDay52Props}>
                    {textLabel77Props !== null && <TextLabel {...textLabel77Props} />}
                  </CalendarDay>
                )}
              </Frame>
              <Frame {...container13Props}>
                {calendarDay53Props !== null && (
                  <CalendarDay {...calendarDay53Props}>
                    {textLabel78Props !== null && <TextLabel {...textLabel78Props} />}
                  </CalendarDay>
                )}
                {calendarDay54Props !== null && (
                  <CalendarDay {...calendarDay54Props}>
                    {textLabel79Props !== null && <TextLabel {...textLabel79Props} />}
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
