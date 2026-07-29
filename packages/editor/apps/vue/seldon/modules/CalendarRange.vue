<script lang="ts">
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
 * ```vue
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
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot, mergeOptionalSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import CalendarDay from "../elements/CalendarDay.vue"
import CalendarDayMuted from "../elements/CalendarDayMuted.vue"
import CalendarDaySelected from "../elements/CalendarDaySelected.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextTitle from "../primitives/TextTitle.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  container?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  container2?: Record<string, unknown> | null
  calendarDay?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  calendarDayMuted?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  calendarDayMuted2?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  calendarDayMuted3?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  calendarDayMuted4?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  container3?: Record<string, unknown> | null
  calendarDayMuted5?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  calendarDayMuted6?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  calendarDayMuted7?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  calendarDayMuted8?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  calendarDayMuted9?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  calendarDay2?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  calendarDay3?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  container4?: Record<string, unknown> | null
  calendarDay4?: Record<string, unknown> | null
  textLabel20?: Record<string, unknown> | null
  calendarDay5?: Record<string, unknown> | null
  textLabel21?: Record<string, unknown> | null
  calendarDay6?: Record<string, unknown> | null
  textLabel22?: Record<string, unknown> | null
  calendarDay7?: Record<string, unknown> | null
  textLabel23?: Record<string, unknown> | null
  calendarDaySelected?: Record<string, unknown> | null
  textLabel24?: Record<string, unknown> | null
  calendarDay8?: Record<string, unknown> | null
  textLabel25?: Record<string, unknown> | null
  calendarDaySelected2?: Record<string, unknown> | null
  textLabel26?: Record<string, unknown> | null
  container5?: Record<string, unknown> | null
  calendarDay9?: Record<string, unknown> | null
  textLabel27?: Record<string, unknown> | null
  calendarDay10?: Record<string, unknown> | null
  textLabel28?: Record<string, unknown> | null
  calendarDay11?: Record<string, unknown> | null
  textLabel29?: Record<string, unknown> | null
  calendarDay12?: Record<string, unknown> | null
  textLabel30?: Record<string, unknown> | null
  calendarDay13?: Record<string, unknown> | null
  textLabel31?: Record<string, unknown> | null
  calendarDay14?: Record<string, unknown> | null
  textLabel32?: Record<string, unknown> | null
  calendarDay15?: Record<string, unknown> | null
  textLabel33?: Record<string, unknown> | null
  container6?: Record<string, unknown> | null
  calendarDay16?: Record<string, unknown> | null
  textLabel34?: Record<string, unknown> | null
  calendarDay17?: Record<string, unknown> | null
  textLabel35?: Record<string, unknown> | null
  calendarDay18?: Record<string, unknown> | null
  textLabel36?: Record<string, unknown> | null
  calendarDay19?: Record<string, unknown> | null
  textLabel37?: Record<string, unknown> | null
  calendarDay20?: Record<string, unknown> | null
  textLabel38?: Record<string, unknown> | null
  calendarDay21?: Record<string, unknown> | null
  textLabel39?: Record<string, unknown> | null
  calendarDay22?: Record<string, unknown> | null
  textLabel40?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  textTitle2?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  container7?: Record<string, unknown> | null
  textLabel41?: Record<string, unknown> | null
  textLabel42?: Record<string, unknown> | null
  textLabel43?: Record<string, unknown> | null
  textLabel44?: Record<string, unknown> | null
  textLabel45?: Record<string, unknown> | null
  textLabel46?: Record<string, unknown> | null
  textLabel47?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  container8?: Record<string, unknown> | null
  calendarDay23?: Record<string, unknown> | null
  textLabel48?: Record<string, unknown> | null
  calendarDay24?: Record<string, unknown> | null
  textLabel49?: Record<string, unknown> | null
  container9?: Record<string, unknown> | null
  calendarDay25?: Record<string, unknown> | null
  textLabel50?: Record<string, unknown> | null
  calendarDay26?: Record<string, unknown> | null
  textLabel51?: Record<string, unknown> | null
  calendarDay27?: Record<string, unknown> | null
  textLabel52?: Record<string, unknown> | null
  calendarDay28?: Record<string, unknown> | null
  textLabel53?: Record<string, unknown> | null
  calendarDay29?: Record<string, unknown> | null
  textLabel54?: Record<string, unknown> | null
  calendarDay30?: Record<string, unknown> | null
  textLabel55?: Record<string, unknown> | null
  calendarDay31?: Record<string, unknown> | null
  textLabel56?: Record<string, unknown> | null
  container10?: Record<string, unknown> | null
  calendarDay32?: Record<string, unknown> | null
  textLabel57?: Record<string, unknown> | null
  calendarDay33?: Record<string, unknown> | null
  textLabel58?: Record<string, unknown> | null
  calendarDay34?: Record<string, unknown> | null
  textLabel59?: Record<string, unknown> | null
  calendarDay35?: Record<string, unknown> | null
  textLabel60?: Record<string, unknown> | null
  calendarDay36?: Record<string, unknown> | null
  textLabel61?: Record<string, unknown> | null
  calendarDay37?: Record<string, unknown> | null
  textLabel62?: Record<string, unknown> | null
  calendarDay38?: Record<string, unknown> | null
  textLabel63?: Record<string, unknown> | null
  container11?: Record<string, unknown> | null
  calendarDay39?: Record<string, unknown> | null
  textLabel64?: Record<string, unknown> | null
  calendarDay40?: Record<string, unknown> | null
  textLabel65?: Record<string, unknown> | null
  calendarDay41?: Record<string, unknown> | null
  textLabel66?: Record<string, unknown> | null
  calendarDay42?: Record<string, unknown> | null
  textLabel67?: Record<string, unknown> | null
  calendarDay43?: Record<string, unknown> | null
  textLabel68?: Record<string, unknown> | null
  calendarDay44?: Record<string, unknown> | null
  textLabel69?: Record<string, unknown> | null
  calendarDay45?: Record<string, unknown> | null
  textLabel70?: Record<string, unknown> | null
  container12?: Record<string, unknown> | null
  calendarDay46?: Record<string, unknown> | null
  textLabel71?: Record<string, unknown> | null
  calendarDay47?: Record<string, unknown> | null
  textLabel72?: Record<string, unknown> | null
  calendarDay48?: Record<string, unknown> | null
  textLabel73?: Record<string, unknown> | null
  calendarDay49?: Record<string, unknown> | null
  textLabel74?: Record<string, unknown> | null
  calendarDay50?: Record<string, unknown> | null
  textLabel75?: Record<string, unknown> | null
  calendarDay51?: Record<string, unknown> | null
  textLabel76?: Record<string, unknown> | null
  calendarDay52?: Record<string, unknown> | null
  textLabel77?: Record<string, unknown> | null
  container13?: Record<string, unknown> | null
  calendarDay53?: Record<string, unknown> | null
  textLabel78?: Record<string, unknown> | null
  calendarDay54?: Record<string, unknown> | null
  textLabel79?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--h7wy"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--8xlb"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon": {
    "icon": "material-chevronLeft",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--nlt7"
  },
  "textTitle": {
    "children": "October 2020",
    "className": "sdn-text-title sdn-text-title--mo5p"
  },
  "container": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "textLabel": {
    "children": "Mo",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel2": {
    "children": "Tu",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel3": {
    "children": "We",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel4": {
    "children": "Th",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel5": {
    "children": "Fr",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel6": {
    "children": "Sa",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel7": {
    "children": "Su",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "frame3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--qfdm"
  },
  "container2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay": {
    "className": "sdn-calendar-day sdn-calendar-day--pobd"
  },
  "textLabel8": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel9": {
    "children": "1",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted2": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel10": {
    "children": "2",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted3": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel11": {
    "children": "3",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted4": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel12": {
    "children": "4",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted5": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel13": {
    "children": "5",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted6": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel14": {
    "children": "6",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted7": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel15": {
    "children": "7",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted8": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel16": {
    "children": "8",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted9": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel17": {
    "children": "9",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay2": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel18": {
    "children": "10",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay3": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel19": {
    "children": "11",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay4": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel20": {
    "children": "12",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay5": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel21": {
    "children": "13",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay6": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel22": {
    "children": "14",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay7": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel23": {
    "children": "15",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDaySelected": {
    "className": "sdn-calendar-day-selected sdn-calendar-day-selected--or9s"
  },
  "textLabel24": {
    "children": "16",
    "className": "sdn-text-label sdn-text-label--fye8"
  },
  "calendarDay8": {
    "className": "sdn-calendar-day sdn-calendar-day--xk18"
  },
  "textLabel25": {
    "children": "17",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDaySelected2": {
    "className": "sdn-calendar-day-selected sdn-calendar-day-selected--og29"
  },
  "textLabel26": {
    "children": "18",
    "className": "sdn-text-label sdn-text-label--fye8"
  },
  "container5": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay9": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel27": {
    "children": "19",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay10": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel28": {
    "children": "20",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay11": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel29": {
    "children": "21",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay12": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel30": {
    "children": "22",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay13": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel31": {
    "children": "23",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay14": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel32": {
    "children": "24",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay15": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel33": {
    "children": "25",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container6": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay16": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel34": {
    "children": "26",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay17": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel35": {
    "children": "27",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay18": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel36": {
    "children": "28",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay19": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel37": {
    "children": "29",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay20": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel38": {
    "children": "30",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay21": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel39": {
    "children": "31",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay22": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel40": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "frame4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--h7wy"
  },
  "frame5": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--8xlb"
  },
  "textTitle2": {
    "children": "November 2020",
    "className": "sdn-text-title sdn-text-title--mo5p"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon2": {
    "icon": "material-chevronRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--nlt7"
  },
  "container7": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "textLabel41": {
    "children": "Mo",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel42": {
    "children": "Tu",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel43": {
    "children": "We",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel44": {
    "children": "Th",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel45": {
    "children": "Fr",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel46": {
    "children": "Sa",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel47": {
    "children": "Su",
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "frame6": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--qfdm"
  },
  "container8": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay23": {
    "className": "sdn-calendar-day sdn-calendar-day--2hoh"
  },
  "textLabel48": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay24": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel49": {
    "children": "1",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container9": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay25": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel50": {
    "children": "2",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay26": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel51": {
    "children": "3",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay27": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel52": {
    "children": "4",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay28": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel53": {
    "children": "5",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay29": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel54": {
    "children": "6",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay30": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel55": {
    "children": "7",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay31": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel56": {
    "children": "8",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container10": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay32": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel57": {
    "children": "9",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay33": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel58": {
    "children": "10",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay34": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel59": {
    "children": "11",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay35": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel60": {
    "children": "12",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay36": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel61": {
    "children": "13",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay37": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel62": {
    "children": "14",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay38": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel63": {
    "children": "15",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container11": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay39": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel64": {
    "children": "16",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay40": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel65": {
    "children": "17",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay41": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel66": {
    "children": "18",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay42": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel67": {
    "children": "19",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay43": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel68": {
    "children": "20",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay44": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel69": {
    "children": "21",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay45": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel70": {
    "children": "22",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container12": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay46": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel71": {
    "children": "23",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay47": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel72": {
    "children": "24",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay48": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel73": {
    "children": "25",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay49": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel74": {
    "children": "26",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay50": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel75": {
    "children": "27",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay51": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel76": {
    "children": "28",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay52": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel77": {
    "children": "29",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container13": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDay53": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel78": {
    "children": "30",
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay54": {
    "className": "sdn-calendar-day sdn-calendar-day--2hoh"
  },
  "textLabel79": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar-range", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const buttonIconicProps = computed(() => mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const textTitleProps = computed(() => mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs))
const containerProps = computed(() => mergeSlot(sdn.container, props.container, props.seldonRefs))
const textLabelProps = computed(() => mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs))
const textLabel2Props = computed(() => mergeOptionalSlot(sdn.textLabel2, props.textLabel2, props.seldonRefs))
const textLabel3Props = computed(() => mergeOptionalSlot(sdn.textLabel3, props.textLabel3, props.seldonRefs))
const textLabel4Props = computed(() => mergeOptionalSlot(sdn.textLabel4, props.textLabel4, props.seldonRefs))
const textLabel5Props = computed(() => mergeOptionalSlot(sdn.textLabel5, props.textLabel5, props.seldonRefs))
const textLabel6Props = computed(() => mergeOptionalSlot(sdn.textLabel6, props.textLabel6, props.seldonRefs))
const textLabel7Props = computed(() => mergeOptionalSlot(sdn.textLabel7, props.textLabel7, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const container2Props = computed(() => mergeSlot(sdn.container2, props.container2, props.seldonRefs))
const calendarDayProps = computed(() => mergeOptionalSlot(sdn.calendarDay, props.calendarDay, props.seldonRefs))
const textLabel8Props = computed(() => mergeOptionalSlot(sdn.textLabel8, props.textLabel8, props.seldonRefs))
const calendarDayMutedProps = computed(() => mergeOptionalSlot(sdn.calendarDayMuted, props.calendarDayMuted, props.seldonRefs))
const textLabel9Props = computed(() => mergeOptionalSlot(sdn.textLabel9, props.textLabel9, props.seldonRefs))
const calendarDayMuted2Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted2, props.calendarDayMuted2, props.seldonRefs))
const textLabel10Props = computed(() => mergeOptionalSlot(sdn.textLabel10, props.textLabel10, props.seldonRefs))
const calendarDayMuted3Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted3, props.calendarDayMuted3, props.seldonRefs))
const textLabel11Props = computed(() => mergeOptionalSlot(sdn.textLabel11, props.textLabel11, props.seldonRefs))
const calendarDayMuted4Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted4, props.calendarDayMuted4, props.seldonRefs))
const textLabel12Props = computed(() => mergeOptionalSlot(sdn.textLabel12, props.textLabel12, props.seldonRefs))
const container3Props = computed(() => mergeSlot(sdn.container3, props.container3, props.seldonRefs))
const calendarDayMuted5Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted5, props.calendarDayMuted5, props.seldonRefs))
const textLabel13Props = computed(() => mergeOptionalSlot(sdn.textLabel13, props.textLabel13, props.seldonRefs))
const calendarDayMuted6Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted6, props.calendarDayMuted6, props.seldonRefs))
const textLabel14Props = computed(() => mergeOptionalSlot(sdn.textLabel14, props.textLabel14, props.seldonRefs))
const calendarDayMuted7Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted7, props.calendarDayMuted7, props.seldonRefs))
const textLabel15Props = computed(() => mergeOptionalSlot(sdn.textLabel15, props.textLabel15, props.seldonRefs))
const calendarDayMuted8Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted8, props.calendarDayMuted8, props.seldonRefs))
const textLabel16Props = computed(() => mergeOptionalSlot(sdn.textLabel16, props.textLabel16, props.seldonRefs))
const calendarDayMuted9Props = computed(() => mergeOptionalSlot(sdn.calendarDayMuted9, props.calendarDayMuted9, props.seldonRefs))
const textLabel17Props = computed(() => mergeOptionalSlot(sdn.textLabel17, props.textLabel17, props.seldonRefs))
const calendarDay2Props = computed(() => mergeOptionalSlot(sdn.calendarDay2, props.calendarDay2, props.seldonRefs))
const textLabel18Props = computed(() => mergeOptionalSlot(sdn.textLabel18, props.textLabel18, props.seldonRefs))
const calendarDay3Props = computed(() => mergeOptionalSlot(sdn.calendarDay3, props.calendarDay3, props.seldonRefs))
const textLabel19Props = computed(() => mergeOptionalSlot(sdn.textLabel19, props.textLabel19, props.seldonRefs))
const container4Props = computed(() => mergeSlot(sdn.container4, props.container4, props.seldonRefs))
const calendarDay4Props = computed(() => mergeOptionalSlot(sdn.calendarDay4, props.calendarDay4, props.seldonRefs))
const textLabel20Props = computed(() => mergeOptionalSlot(sdn.textLabel20, props.textLabel20, props.seldonRefs))
const calendarDay5Props = computed(() => mergeOptionalSlot(sdn.calendarDay5, props.calendarDay5, props.seldonRefs))
const textLabel21Props = computed(() => mergeOptionalSlot(sdn.textLabel21, props.textLabel21, props.seldonRefs))
const calendarDay6Props = computed(() => mergeOptionalSlot(sdn.calendarDay6, props.calendarDay6, props.seldonRefs))
const textLabel22Props = computed(() => mergeOptionalSlot(sdn.textLabel22, props.textLabel22, props.seldonRefs))
const calendarDay7Props = computed(() => mergeOptionalSlot(sdn.calendarDay7, props.calendarDay7, props.seldonRefs))
const textLabel23Props = computed(() => mergeOptionalSlot(sdn.textLabel23, props.textLabel23, props.seldonRefs))
const calendarDaySelectedProps = computed(() => mergeOptionalSlot(sdn.calendarDaySelected, props.calendarDaySelected, props.seldonRefs))
const textLabel24Props = computed(() => mergeOptionalSlot(sdn.textLabel24, props.textLabel24, props.seldonRefs))
const calendarDay8Props = computed(() => mergeOptionalSlot(sdn.calendarDay8, props.calendarDay8, props.seldonRefs))
const textLabel25Props = computed(() => mergeOptionalSlot(sdn.textLabel25, props.textLabel25, props.seldonRefs))
const calendarDaySelected2Props = computed(() => mergeOptionalSlot(sdn.calendarDaySelected2, props.calendarDaySelected2, props.seldonRefs))
const textLabel26Props = computed(() => mergeOptionalSlot(sdn.textLabel26, props.textLabel26, props.seldonRefs))
const container5Props = computed(() => mergeSlot(sdn.container5, props.container5, props.seldonRefs))
const calendarDay9Props = computed(() => mergeOptionalSlot(sdn.calendarDay9, props.calendarDay9, props.seldonRefs))
const textLabel27Props = computed(() => mergeOptionalSlot(sdn.textLabel27, props.textLabel27, props.seldonRefs))
const calendarDay10Props = computed(() => mergeOptionalSlot(sdn.calendarDay10, props.calendarDay10, props.seldonRefs))
const textLabel28Props = computed(() => mergeOptionalSlot(sdn.textLabel28, props.textLabel28, props.seldonRefs))
const calendarDay11Props = computed(() => mergeOptionalSlot(sdn.calendarDay11, props.calendarDay11, props.seldonRefs))
const textLabel29Props = computed(() => mergeOptionalSlot(sdn.textLabel29, props.textLabel29, props.seldonRefs))
const calendarDay12Props = computed(() => mergeOptionalSlot(sdn.calendarDay12, props.calendarDay12, props.seldonRefs))
const textLabel30Props = computed(() => mergeOptionalSlot(sdn.textLabel30, props.textLabel30, props.seldonRefs))
const calendarDay13Props = computed(() => mergeOptionalSlot(sdn.calendarDay13, props.calendarDay13, props.seldonRefs))
const textLabel31Props = computed(() => mergeOptionalSlot(sdn.textLabel31, props.textLabel31, props.seldonRefs))
const calendarDay14Props = computed(() => mergeOptionalSlot(sdn.calendarDay14, props.calendarDay14, props.seldonRefs))
const textLabel32Props = computed(() => mergeOptionalSlot(sdn.textLabel32, props.textLabel32, props.seldonRefs))
const calendarDay15Props = computed(() => mergeOptionalSlot(sdn.calendarDay15, props.calendarDay15, props.seldonRefs))
const textLabel33Props = computed(() => mergeOptionalSlot(sdn.textLabel33, props.textLabel33, props.seldonRefs))
const container6Props = computed(() => mergeSlot(sdn.container6, props.container6, props.seldonRefs))
const calendarDay16Props = computed(() => mergeOptionalSlot(sdn.calendarDay16, props.calendarDay16, props.seldonRefs))
const textLabel34Props = computed(() => mergeOptionalSlot(sdn.textLabel34, props.textLabel34, props.seldonRefs))
const calendarDay17Props = computed(() => mergeOptionalSlot(sdn.calendarDay17, props.calendarDay17, props.seldonRefs))
const textLabel35Props = computed(() => mergeOptionalSlot(sdn.textLabel35, props.textLabel35, props.seldonRefs))
const calendarDay18Props = computed(() => mergeOptionalSlot(sdn.calendarDay18, props.calendarDay18, props.seldonRefs))
const textLabel36Props = computed(() => mergeOptionalSlot(sdn.textLabel36, props.textLabel36, props.seldonRefs))
const calendarDay19Props = computed(() => mergeOptionalSlot(sdn.calendarDay19, props.calendarDay19, props.seldonRefs))
const textLabel37Props = computed(() => mergeOptionalSlot(sdn.textLabel37, props.textLabel37, props.seldonRefs))
const calendarDay20Props = computed(() => mergeOptionalSlot(sdn.calendarDay20, props.calendarDay20, props.seldonRefs))
const textLabel38Props = computed(() => mergeOptionalSlot(sdn.textLabel38, props.textLabel38, props.seldonRefs))
const calendarDay21Props = computed(() => mergeOptionalSlot(sdn.calendarDay21, props.calendarDay21, props.seldonRefs))
const textLabel39Props = computed(() => mergeOptionalSlot(sdn.textLabel39, props.textLabel39, props.seldonRefs))
const calendarDay22Props = computed(() => mergeOptionalSlot(sdn.calendarDay22, props.calendarDay22, props.seldonRefs))
const textLabel40Props = computed(() => mergeOptionalSlot(sdn.textLabel40, props.textLabel40, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const textTitle2Props = computed(() => mergeOptionalSlot(sdn.textTitle2, props.textTitle2, props.seldonRefs))
const buttonIconic2Props = computed(() => mergeOptionalSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2, props.seldonRefs))
const container7Props = computed(() => mergeSlot(sdn.container7, props.container7, props.seldonRefs))
const textLabel41Props = computed(() => mergeOptionalSlot(sdn.textLabel41, props.textLabel41, props.seldonRefs))
const textLabel42Props = computed(() => mergeOptionalSlot(sdn.textLabel42, props.textLabel42, props.seldonRefs))
const textLabel43Props = computed(() => mergeOptionalSlot(sdn.textLabel43, props.textLabel43, props.seldonRefs))
const textLabel44Props = computed(() => mergeOptionalSlot(sdn.textLabel44, props.textLabel44, props.seldonRefs))
const textLabel45Props = computed(() => mergeOptionalSlot(sdn.textLabel45, props.textLabel45, props.seldonRefs))
const textLabel46Props = computed(() => mergeOptionalSlot(sdn.textLabel46, props.textLabel46, props.seldonRefs))
const textLabel47Props = computed(() => mergeOptionalSlot(sdn.textLabel47, props.textLabel47, props.seldonRefs))
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const container8Props = computed(() => mergeSlot(sdn.container8, props.container8, props.seldonRefs))
const calendarDay23Props = computed(() => mergeOptionalSlot(sdn.calendarDay23, props.calendarDay23, props.seldonRefs))
const textLabel48Props = computed(() => mergeOptionalSlot(sdn.textLabel48, props.textLabel48, props.seldonRefs))
const calendarDay24Props = computed(() => mergeOptionalSlot(sdn.calendarDay24, props.calendarDay24, props.seldonRefs))
const textLabel49Props = computed(() => mergeOptionalSlot(sdn.textLabel49, props.textLabel49, props.seldonRefs))
const container9Props = computed(() => mergeSlot(sdn.container9, props.container9, props.seldonRefs))
const calendarDay25Props = computed(() => mergeOptionalSlot(sdn.calendarDay25, props.calendarDay25, props.seldonRefs))
const textLabel50Props = computed(() => mergeOptionalSlot(sdn.textLabel50, props.textLabel50, props.seldonRefs))
const calendarDay26Props = computed(() => mergeOptionalSlot(sdn.calendarDay26, props.calendarDay26, props.seldonRefs))
const textLabel51Props = computed(() => mergeOptionalSlot(sdn.textLabel51, props.textLabel51, props.seldonRefs))
const calendarDay27Props = computed(() => mergeOptionalSlot(sdn.calendarDay27, props.calendarDay27, props.seldonRefs))
const textLabel52Props = computed(() => mergeOptionalSlot(sdn.textLabel52, props.textLabel52, props.seldonRefs))
const calendarDay28Props = computed(() => mergeOptionalSlot(sdn.calendarDay28, props.calendarDay28, props.seldonRefs))
const textLabel53Props = computed(() => mergeOptionalSlot(sdn.textLabel53, props.textLabel53, props.seldonRefs))
const calendarDay29Props = computed(() => mergeOptionalSlot(sdn.calendarDay29, props.calendarDay29, props.seldonRefs))
const textLabel54Props = computed(() => mergeOptionalSlot(sdn.textLabel54, props.textLabel54, props.seldonRefs))
const calendarDay30Props = computed(() => mergeOptionalSlot(sdn.calendarDay30, props.calendarDay30, props.seldonRefs))
const textLabel55Props = computed(() => mergeOptionalSlot(sdn.textLabel55, props.textLabel55, props.seldonRefs))
const calendarDay31Props = computed(() => mergeOptionalSlot(sdn.calendarDay31, props.calendarDay31, props.seldonRefs))
const textLabel56Props = computed(() => mergeOptionalSlot(sdn.textLabel56, props.textLabel56, props.seldonRefs))
const container10Props = computed(() => mergeSlot(sdn.container10, props.container10, props.seldonRefs))
const calendarDay32Props = computed(() => mergeOptionalSlot(sdn.calendarDay32, props.calendarDay32, props.seldonRefs))
const textLabel57Props = computed(() => mergeOptionalSlot(sdn.textLabel57, props.textLabel57, props.seldonRefs))
const calendarDay33Props = computed(() => mergeOptionalSlot(sdn.calendarDay33, props.calendarDay33, props.seldonRefs))
const textLabel58Props = computed(() => mergeOptionalSlot(sdn.textLabel58, props.textLabel58, props.seldonRefs))
const calendarDay34Props = computed(() => mergeOptionalSlot(sdn.calendarDay34, props.calendarDay34, props.seldonRefs))
const textLabel59Props = computed(() => mergeOptionalSlot(sdn.textLabel59, props.textLabel59, props.seldonRefs))
const calendarDay35Props = computed(() => mergeOptionalSlot(sdn.calendarDay35, props.calendarDay35, props.seldonRefs))
const textLabel60Props = computed(() => mergeOptionalSlot(sdn.textLabel60, props.textLabel60, props.seldonRefs))
const calendarDay36Props = computed(() => mergeOptionalSlot(sdn.calendarDay36, props.calendarDay36, props.seldonRefs))
const textLabel61Props = computed(() => mergeOptionalSlot(sdn.textLabel61, props.textLabel61, props.seldonRefs))
const calendarDay37Props = computed(() => mergeOptionalSlot(sdn.calendarDay37, props.calendarDay37, props.seldonRefs))
const textLabel62Props = computed(() => mergeOptionalSlot(sdn.textLabel62, props.textLabel62, props.seldonRefs))
const calendarDay38Props = computed(() => mergeOptionalSlot(sdn.calendarDay38, props.calendarDay38, props.seldonRefs))
const textLabel63Props = computed(() => mergeOptionalSlot(sdn.textLabel63, props.textLabel63, props.seldonRefs))
const container11Props = computed(() => mergeSlot(sdn.container11, props.container11, props.seldonRefs))
const calendarDay39Props = computed(() => mergeOptionalSlot(sdn.calendarDay39, props.calendarDay39, props.seldonRefs))
const textLabel64Props = computed(() => mergeOptionalSlot(sdn.textLabel64, props.textLabel64, props.seldonRefs))
const calendarDay40Props = computed(() => mergeOptionalSlot(sdn.calendarDay40, props.calendarDay40, props.seldonRefs))
const textLabel65Props = computed(() => mergeOptionalSlot(sdn.textLabel65, props.textLabel65, props.seldonRefs))
const calendarDay41Props = computed(() => mergeOptionalSlot(sdn.calendarDay41, props.calendarDay41, props.seldonRefs))
const textLabel66Props = computed(() => mergeOptionalSlot(sdn.textLabel66, props.textLabel66, props.seldonRefs))
const calendarDay42Props = computed(() => mergeOptionalSlot(sdn.calendarDay42, props.calendarDay42, props.seldonRefs))
const textLabel67Props = computed(() => mergeOptionalSlot(sdn.textLabel67, props.textLabel67, props.seldonRefs))
const calendarDay43Props = computed(() => mergeOptionalSlot(sdn.calendarDay43, props.calendarDay43, props.seldonRefs))
const textLabel68Props = computed(() => mergeOptionalSlot(sdn.textLabel68, props.textLabel68, props.seldonRefs))
const calendarDay44Props = computed(() => mergeOptionalSlot(sdn.calendarDay44, props.calendarDay44, props.seldonRefs))
const textLabel69Props = computed(() => mergeOptionalSlot(sdn.textLabel69, props.textLabel69, props.seldonRefs))
const calendarDay45Props = computed(() => mergeOptionalSlot(sdn.calendarDay45, props.calendarDay45, props.seldonRefs))
const textLabel70Props = computed(() => mergeOptionalSlot(sdn.textLabel70, props.textLabel70, props.seldonRefs))
const container12Props = computed(() => mergeSlot(sdn.container12, props.container12, props.seldonRefs))
const calendarDay46Props = computed(() => mergeOptionalSlot(sdn.calendarDay46, props.calendarDay46, props.seldonRefs))
const textLabel71Props = computed(() => mergeOptionalSlot(sdn.textLabel71, props.textLabel71, props.seldonRefs))
const calendarDay47Props = computed(() => mergeOptionalSlot(sdn.calendarDay47, props.calendarDay47, props.seldonRefs))
const textLabel72Props = computed(() => mergeOptionalSlot(sdn.textLabel72, props.textLabel72, props.seldonRefs))
const calendarDay48Props = computed(() => mergeOptionalSlot(sdn.calendarDay48, props.calendarDay48, props.seldonRefs))
const textLabel73Props = computed(() => mergeOptionalSlot(sdn.textLabel73, props.textLabel73, props.seldonRefs))
const calendarDay49Props = computed(() => mergeOptionalSlot(sdn.calendarDay49, props.calendarDay49, props.seldonRefs))
const textLabel74Props = computed(() => mergeOptionalSlot(sdn.textLabel74, props.textLabel74, props.seldonRefs))
const calendarDay50Props = computed(() => mergeOptionalSlot(sdn.calendarDay50, props.calendarDay50, props.seldonRefs))
const textLabel75Props = computed(() => mergeOptionalSlot(sdn.textLabel75, props.textLabel75, props.seldonRefs))
const calendarDay51Props = computed(() => mergeOptionalSlot(sdn.calendarDay51, props.calendarDay51, props.seldonRefs))
const textLabel76Props = computed(() => mergeOptionalSlot(sdn.textLabel76, props.textLabel76, props.seldonRefs))
const calendarDay52Props = computed(() => mergeOptionalSlot(sdn.calendarDay52, props.calendarDay52, props.seldonRefs))
const textLabel77Props = computed(() => mergeOptionalSlot(sdn.textLabel77, props.textLabel77, props.seldonRefs))
const container13Props = computed(() => mergeSlot(sdn.container13, props.container13, props.seldonRefs))
const calendarDay53Props = computed(() => mergeOptionalSlot(sdn.calendarDay53, props.calendarDay53, props.seldonRefs))
const textLabel78Props = computed(() => mergeOptionalSlot(sdn.textLabel78, props.textLabel78, props.seldonRefs))
const calendarDay54Props = computed(() => mergeOptionalSlot(sdn.calendarDay54, props.calendarDay54, props.seldonRefs))
const textLabel79Props = computed(() => mergeOptionalSlot(sdn.textLabel79, props.textLabel79, props.seldonRefs))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <Frame v-bind="frame2Props" v-if="frame2Props !== null">
            <ButtonIconic v-if="buttonIconicProps !== null" v-bind="buttonIconicProps" :icon="iconProps" />
            <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
          </Frame>
          <Frame v-bind="containerProps" v-if="containerProps !== null">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
            <TextLabel v-if="textLabel2Props !== null" v-bind="textLabel2Props" />
            <TextLabel v-if="textLabel3Props !== null" v-bind="textLabel3Props" />
            <TextLabel v-if="textLabel4Props !== null" v-bind="textLabel4Props" />
            <TextLabel v-if="textLabel5Props !== null" v-bind="textLabel5Props" />
            <TextLabel v-if="textLabel6Props !== null" v-bind="textLabel6Props" />
            <TextLabel v-if="textLabel7Props !== null" v-bind="textLabel7Props" />
          </Frame>
          <Frame v-bind="frame3Props" v-if="frame3Props !== null">
            <Frame v-bind="container2Props" v-if="container2Props !== null">
              <CalendarDay v-if="calendarDayProps !== null" v-bind="calendarDayProps">
                <TextLabel v-if="textLabel8Props !== null" v-bind="textLabel8Props" />
              </CalendarDay>
              <CalendarDayMuted v-if="calendarDayMutedProps !== null" v-bind="calendarDayMutedProps">
                <TextLabel v-if="textLabel9Props !== null" v-bind="textLabel9Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted2Props !== null" v-bind="calendarDayMuted2Props">
                <TextLabel v-if="textLabel10Props !== null" v-bind="textLabel10Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted3Props !== null" v-bind="calendarDayMuted3Props">
                <TextLabel v-if="textLabel11Props !== null" v-bind="textLabel11Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted4Props !== null" v-bind="calendarDayMuted4Props">
                <TextLabel v-if="textLabel12Props !== null" v-bind="textLabel12Props" />
              </CalendarDayMuted>
            </Frame>
            <Frame v-bind="container3Props" v-if="container3Props !== null">
              <CalendarDayMuted v-if="calendarDayMuted5Props !== null" v-bind="calendarDayMuted5Props">
                <TextLabel v-if="textLabel13Props !== null" v-bind="textLabel13Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted6Props !== null" v-bind="calendarDayMuted6Props">
                <TextLabel v-if="textLabel14Props !== null" v-bind="textLabel14Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted7Props !== null" v-bind="calendarDayMuted7Props">
                <TextLabel v-if="textLabel15Props !== null" v-bind="textLabel15Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted8Props !== null" v-bind="calendarDayMuted8Props">
                <TextLabel v-if="textLabel16Props !== null" v-bind="textLabel16Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted9Props !== null" v-bind="calendarDayMuted9Props">
                <TextLabel v-if="textLabel17Props !== null" v-bind="textLabel17Props" />
              </CalendarDayMuted>
              <CalendarDay v-if="calendarDay2Props !== null" v-bind="calendarDay2Props">
                <TextLabel v-if="textLabel18Props !== null" v-bind="textLabel18Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay3Props !== null" v-bind="calendarDay3Props">
                <TextLabel v-if="textLabel19Props !== null" v-bind="textLabel19Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container4Props" v-if="container4Props !== null">
              <CalendarDay v-if="calendarDay4Props !== null" v-bind="calendarDay4Props">
                <TextLabel v-if="textLabel20Props !== null" v-bind="textLabel20Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay5Props !== null" v-bind="calendarDay5Props">
                <TextLabel v-if="textLabel21Props !== null" v-bind="textLabel21Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay6Props !== null" v-bind="calendarDay6Props">
                <TextLabel v-if="textLabel22Props !== null" v-bind="textLabel22Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay7Props !== null" v-bind="calendarDay7Props">
                <TextLabel v-if="textLabel23Props !== null" v-bind="textLabel23Props" />
              </CalendarDay>
              <CalendarDaySelected v-if="calendarDaySelectedProps !== null" v-bind="calendarDaySelectedProps">
                <TextLabel v-if="textLabel24Props !== null" v-bind="textLabel24Props" />
              </CalendarDaySelected>
              <CalendarDay v-if="calendarDay8Props !== null" v-bind="calendarDay8Props">
                <TextLabel v-if="textLabel25Props !== null" v-bind="textLabel25Props" />
              </CalendarDay>
              <CalendarDaySelected v-if="calendarDaySelected2Props !== null" v-bind="calendarDaySelected2Props">
                <TextLabel v-if="textLabel26Props !== null" v-bind="textLabel26Props" />
              </CalendarDaySelected>
            </Frame>
            <Frame v-bind="container5Props" v-if="container5Props !== null">
              <CalendarDay v-if="calendarDay9Props !== null" v-bind="calendarDay9Props">
                <TextLabel v-if="textLabel27Props !== null" v-bind="textLabel27Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay10Props !== null" v-bind="calendarDay10Props">
                <TextLabel v-if="textLabel28Props !== null" v-bind="textLabel28Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay11Props !== null" v-bind="calendarDay11Props">
                <TextLabel v-if="textLabel29Props !== null" v-bind="textLabel29Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay12Props !== null" v-bind="calendarDay12Props">
                <TextLabel v-if="textLabel30Props !== null" v-bind="textLabel30Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay13Props !== null" v-bind="calendarDay13Props">
                <TextLabel v-if="textLabel31Props !== null" v-bind="textLabel31Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay14Props !== null" v-bind="calendarDay14Props">
                <TextLabel v-if="textLabel32Props !== null" v-bind="textLabel32Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay15Props !== null" v-bind="calendarDay15Props">
                <TextLabel v-if="textLabel33Props !== null" v-bind="textLabel33Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container6Props" v-if="container6Props !== null">
              <CalendarDay v-if="calendarDay16Props !== null" v-bind="calendarDay16Props">
                <TextLabel v-if="textLabel34Props !== null" v-bind="textLabel34Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay17Props !== null" v-bind="calendarDay17Props">
                <TextLabel v-if="textLabel35Props !== null" v-bind="textLabel35Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay18Props !== null" v-bind="calendarDay18Props">
                <TextLabel v-if="textLabel36Props !== null" v-bind="textLabel36Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay19Props !== null" v-bind="calendarDay19Props">
                <TextLabel v-if="textLabel37Props !== null" v-bind="textLabel37Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay20Props !== null" v-bind="calendarDay20Props">
                <TextLabel v-if="textLabel38Props !== null" v-bind="textLabel38Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay21Props !== null" v-bind="calendarDay21Props">
                <TextLabel v-if="textLabel39Props !== null" v-bind="textLabel39Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay22Props !== null" v-bind="calendarDay22Props">
                <TextLabel v-if="textLabel40Props !== null" v-bind="textLabel40Props" />
              </CalendarDay>
            </Frame>
          </Frame>
        </Frame>
        <Frame v-bind="frame4Props">
          <Frame v-bind="frame5Props" v-if="frame5Props !== null">
            <TextTitle v-if="textTitle2Props !== null" v-bind="textTitle2Props" />
            <ButtonIconic v-if="buttonIconic2Props !== null" v-bind="buttonIconic2Props" :icon="icon2Props" />
          </Frame>
          <Frame v-bind="container7Props" v-if="container7Props !== null">
            <TextLabel v-if="textLabel41Props !== null" v-bind="textLabel41Props" />
            <TextLabel v-if="textLabel42Props !== null" v-bind="textLabel42Props" />
            <TextLabel v-if="textLabel43Props !== null" v-bind="textLabel43Props" />
            <TextLabel v-if="textLabel44Props !== null" v-bind="textLabel44Props" />
            <TextLabel v-if="textLabel45Props !== null" v-bind="textLabel45Props" />
            <TextLabel v-if="textLabel46Props !== null" v-bind="textLabel46Props" />
            <TextLabel v-if="textLabel47Props !== null" v-bind="textLabel47Props" />
          </Frame>
          <Frame v-bind="frame6Props" v-if="frame6Props !== null">
            <Frame v-bind="container8Props" v-if="container8Props !== null">
              <CalendarDay v-if="calendarDay23Props !== null" v-bind="calendarDay23Props">
                <TextLabel v-if="textLabel48Props !== null" v-bind="textLabel48Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay24Props !== null" v-bind="calendarDay24Props">
                <TextLabel v-if="textLabel49Props !== null" v-bind="textLabel49Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container9Props" v-if="container9Props !== null">
              <CalendarDay v-if="calendarDay25Props !== null" v-bind="calendarDay25Props">
                <TextLabel v-if="textLabel50Props !== null" v-bind="textLabel50Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay26Props !== null" v-bind="calendarDay26Props">
                <TextLabel v-if="textLabel51Props !== null" v-bind="textLabel51Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay27Props !== null" v-bind="calendarDay27Props">
                <TextLabel v-if="textLabel52Props !== null" v-bind="textLabel52Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay28Props !== null" v-bind="calendarDay28Props">
                <TextLabel v-if="textLabel53Props !== null" v-bind="textLabel53Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay29Props !== null" v-bind="calendarDay29Props">
                <TextLabel v-if="textLabel54Props !== null" v-bind="textLabel54Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay30Props !== null" v-bind="calendarDay30Props">
                <TextLabel v-if="textLabel55Props !== null" v-bind="textLabel55Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay31Props !== null" v-bind="calendarDay31Props">
                <TextLabel v-if="textLabel56Props !== null" v-bind="textLabel56Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container10Props" v-if="container10Props !== null">
              <CalendarDay v-if="calendarDay32Props !== null" v-bind="calendarDay32Props">
                <TextLabel v-if="textLabel57Props !== null" v-bind="textLabel57Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay33Props !== null" v-bind="calendarDay33Props">
                <TextLabel v-if="textLabel58Props !== null" v-bind="textLabel58Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay34Props !== null" v-bind="calendarDay34Props">
                <TextLabel v-if="textLabel59Props !== null" v-bind="textLabel59Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay35Props !== null" v-bind="calendarDay35Props">
                <TextLabel v-if="textLabel60Props !== null" v-bind="textLabel60Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay36Props !== null" v-bind="calendarDay36Props">
                <TextLabel v-if="textLabel61Props !== null" v-bind="textLabel61Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay37Props !== null" v-bind="calendarDay37Props">
                <TextLabel v-if="textLabel62Props !== null" v-bind="textLabel62Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay38Props !== null" v-bind="calendarDay38Props">
                <TextLabel v-if="textLabel63Props !== null" v-bind="textLabel63Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container11Props" v-if="container11Props !== null">
              <CalendarDay v-if="calendarDay39Props !== null" v-bind="calendarDay39Props">
                <TextLabel v-if="textLabel64Props !== null" v-bind="textLabel64Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay40Props !== null" v-bind="calendarDay40Props">
                <TextLabel v-if="textLabel65Props !== null" v-bind="textLabel65Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay41Props !== null" v-bind="calendarDay41Props">
                <TextLabel v-if="textLabel66Props !== null" v-bind="textLabel66Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay42Props !== null" v-bind="calendarDay42Props">
                <TextLabel v-if="textLabel67Props !== null" v-bind="textLabel67Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay43Props !== null" v-bind="calendarDay43Props">
                <TextLabel v-if="textLabel68Props !== null" v-bind="textLabel68Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay44Props !== null" v-bind="calendarDay44Props">
                <TextLabel v-if="textLabel69Props !== null" v-bind="textLabel69Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay45Props !== null" v-bind="calendarDay45Props">
                <TextLabel v-if="textLabel70Props !== null" v-bind="textLabel70Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container12Props" v-if="container12Props !== null">
              <CalendarDay v-if="calendarDay46Props !== null" v-bind="calendarDay46Props">
                <TextLabel v-if="textLabel71Props !== null" v-bind="textLabel71Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay47Props !== null" v-bind="calendarDay47Props">
                <TextLabel v-if="textLabel72Props !== null" v-bind="textLabel72Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay48Props !== null" v-bind="calendarDay48Props">
                <TextLabel v-if="textLabel73Props !== null" v-bind="textLabel73Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay49Props !== null" v-bind="calendarDay49Props">
                <TextLabel v-if="textLabel74Props !== null" v-bind="textLabel74Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay50Props !== null" v-bind="calendarDay50Props">
                <TextLabel v-if="textLabel75Props !== null" v-bind="textLabel75Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay51Props !== null" v-bind="calendarDay51Props">
                <TextLabel v-if="textLabel76Props !== null" v-bind="textLabel76Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay52Props !== null" v-bind="calendarDay52Props">
                <TextLabel v-if="textLabel77Props !== null" v-bind="textLabel77Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container13Props" v-if="container13Props !== null">
              <CalendarDay v-if="calendarDay53Props !== null" v-bind="calendarDay53Props">
                <TextLabel v-if="textLabel78Props !== null" v-bind="textLabel78Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay54Props !== null" v-bind="calendarDay54Props">
                <TextLabel v-if="textLabel79Props !== null" v-bind="textLabel79Props" />
              </CalendarDay>
            </Frame>
          </Frame>
        </Frame>
      </slot>
    </div>
</template>
