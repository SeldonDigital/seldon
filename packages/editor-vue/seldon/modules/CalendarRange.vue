<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
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
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-calendar-range sdn-calendar",
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
    "className": "sdn-text-title sdn-text-title--mo5p"
  },
  "container": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel2": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel3": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel4": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel5": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel6": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel7": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted2": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel10": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted3": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel11": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted4": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel12": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted6": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel14": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted7": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel15": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted8": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel16": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted9": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel17": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay2": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel18": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay3": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel19": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay5": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel21": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay6": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel22": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay7": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel23": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDaySelected": {
    "className": "sdn-calendar-day-selected sdn-calendar-day-selected--or9s"
  },
  "textLabel24": {
    "className": "sdn-text-label sdn-text-label--fye8"
  },
  "calendarDay8": {
    "className": "sdn-calendar-day sdn-calendar-day--xk18"
  },
  "textLabel25": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDaySelected2": {
    "className": "sdn-calendar-day-selected sdn-calendar-day-selected--og29"
  },
  "textLabel26": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay10": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel28": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay11": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel29": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay12": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel30": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay13": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel31": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay14": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel32": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay15": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel33": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay17": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel35": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay18": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel36": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay19": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel37": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay20": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel38": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay21": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel39": {
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
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel42": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel43": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel44": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel45": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel46": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "textLabel47": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay26": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel51": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay27": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel52": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay28": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel53": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay29": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel54": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay30": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel55": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay31": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel56": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay33": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel58": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay34": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel59": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay35": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel60": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay36": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel61": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay37": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel62": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay38": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel63": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay40": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel65": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay41": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel66": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay42": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel67": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay43": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel68": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay44": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel69": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay45": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel70": {
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
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay47": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel72": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay48": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel73": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay49": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel74": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay50": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel75": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay51": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel76": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay52": {
    "className": "sdn-calendar-day sdn-calendar-day-grid-cell--iysx"
  },
  "textLabel77": {
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
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const textTitleProps = computed(() => mergeSlot(sdn.textTitle, props.textTitle))
const containerProps = computed(() => mergeSlot(sdn.container, props.container))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
const textLabel6Props = computed(() => mergeSlot(sdn.textLabel6, props.textLabel6))
const textLabel7Props = computed(() => mergeSlot(sdn.textLabel7, props.textLabel7))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3))
const container2Props = computed(() => mergeSlot(sdn.container2, props.container2))
const calendarDayProps = computed(() => mergeSlot(sdn.calendarDay, props.calendarDay))
const textLabel8Props = computed(() => mergeSlot(sdn.textLabel8, props.textLabel8))
const calendarDayMutedProps = computed(() => mergeSlot(sdn.calendarDayMuted, props.calendarDayMuted))
const textLabel9Props = computed(() => mergeSlot(sdn.textLabel9, props.textLabel9))
const calendarDayMuted2Props = computed(() => mergeSlot(sdn.calendarDayMuted2, props.calendarDayMuted2))
const textLabel10Props = computed(() => mergeSlot(sdn.textLabel10, props.textLabel10))
const calendarDayMuted3Props = computed(() => mergeSlot(sdn.calendarDayMuted3, props.calendarDayMuted3))
const textLabel11Props = computed(() => mergeSlot(sdn.textLabel11, props.textLabel11))
const calendarDayMuted4Props = computed(() => mergeSlot(sdn.calendarDayMuted4, props.calendarDayMuted4))
const textLabel12Props = computed(() => mergeSlot(sdn.textLabel12, props.textLabel12))
const container3Props = computed(() => mergeSlot(sdn.container3, props.container3))
const calendarDayMuted5Props = computed(() => mergeSlot(sdn.calendarDayMuted5, props.calendarDayMuted5))
const textLabel13Props = computed(() => mergeSlot(sdn.textLabel13, props.textLabel13))
const calendarDayMuted6Props = computed(() => mergeSlot(sdn.calendarDayMuted6, props.calendarDayMuted6))
const textLabel14Props = computed(() => mergeSlot(sdn.textLabel14, props.textLabel14))
const calendarDayMuted7Props = computed(() => mergeSlot(sdn.calendarDayMuted7, props.calendarDayMuted7))
const textLabel15Props = computed(() => mergeSlot(sdn.textLabel15, props.textLabel15))
const calendarDayMuted8Props = computed(() => mergeSlot(sdn.calendarDayMuted8, props.calendarDayMuted8))
const textLabel16Props = computed(() => mergeSlot(sdn.textLabel16, props.textLabel16))
const calendarDayMuted9Props = computed(() => mergeSlot(sdn.calendarDayMuted9, props.calendarDayMuted9))
const textLabel17Props = computed(() => mergeSlot(sdn.textLabel17, props.textLabel17))
const calendarDay2Props = computed(() => mergeSlot(sdn.calendarDay2, props.calendarDay2))
const textLabel18Props = computed(() => mergeSlot(sdn.textLabel18, props.textLabel18))
const calendarDay3Props = computed(() => mergeSlot(sdn.calendarDay3, props.calendarDay3))
const textLabel19Props = computed(() => mergeSlot(sdn.textLabel19, props.textLabel19))
const container4Props = computed(() => mergeSlot(sdn.container4, props.container4))
const calendarDay4Props = computed(() => mergeSlot(sdn.calendarDay4, props.calendarDay4))
const textLabel20Props = computed(() => mergeSlot(sdn.textLabel20, props.textLabel20))
const calendarDay5Props = computed(() => mergeSlot(sdn.calendarDay5, props.calendarDay5))
const textLabel21Props = computed(() => mergeSlot(sdn.textLabel21, props.textLabel21))
const calendarDay6Props = computed(() => mergeSlot(sdn.calendarDay6, props.calendarDay6))
const textLabel22Props = computed(() => mergeSlot(sdn.textLabel22, props.textLabel22))
const calendarDay7Props = computed(() => mergeSlot(sdn.calendarDay7, props.calendarDay7))
const textLabel23Props = computed(() => mergeSlot(sdn.textLabel23, props.textLabel23))
const calendarDaySelectedProps = computed(() => mergeSlot(sdn.calendarDaySelected, props.calendarDaySelected))
const textLabel24Props = computed(() => mergeSlot(sdn.textLabel24, props.textLabel24))
const calendarDay8Props = computed(() => mergeSlot(sdn.calendarDay8, props.calendarDay8))
const textLabel25Props = computed(() => mergeSlot(sdn.textLabel25, props.textLabel25))
const calendarDaySelected2Props = computed(() => mergeSlot(sdn.calendarDaySelected2, props.calendarDaySelected2))
const textLabel26Props = computed(() => mergeSlot(sdn.textLabel26, props.textLabel26))
const container5Props = computed(() => mergeSlot(sdn.container5, props.container5))
const calendarDay9Props = computed(() => mergeSlot(sdn.calendarDay9, props.calendarDay9))
const textLabel27Props = computed(() => mergeSlot(sdn.textLabel27, props.textLabel27))
const calendarDay10Props = computed(() => mergeSlot(sdn.calendarDay10, props.calendarDay10))
const textLabel28Props = computed(() => mergeSlot(sdn.textLabel28, props.textLabel28))
const calendarDay11Props = computed(() => mergeSlot(sdn.calendarDay11, props.calendarDay11))
const textLabel29Props = computed(() => mergeSlot(sdn.textLabel29, props.textLabel29))
const calendarDay12Props = computed(() => mergeSlot(sdn.calendarDay12, props.calendarDay12))
const textLabel30Props = computed(() => mergeSlot(sdn.textLabel30, props.textLabel30))
const calendarDay13Props = computed(() => mergeSlot(sdn.calendarDay13, props.calendarDay13))
const textLabel31Props = computed(() => mergeSlot(sdn.textLabel31, props.textLabel31))
const calendarDay14Props = computed(() => mergeSlot(sdn.calendarDay14, props.calendarDay14))
const textLabel32Props = computed(() => mergeSlot(sdn.textLabel32, props.textLabel32))
const calendarDay15Props = computed(() => mergeSlot(sdn.calendarDay15, props.calendarDay15))
const textLabel33Props = computed(() => mergeSlot(sdn.textLabel33, props.textLabel33))
const container6Props = computed(() => mergeSlot(sdn.container6, props.container6))
const calendarDay16Props = computed(() => mergeSlot(sdn.calendarDay16, props.calendarDay16))
const textLabel34Props = computed(() => mergeSlot(sdn.textLabel34, props.textLabel34))
const calendarDay17Props = computed(() => mergeSlot(sdn.calendarDay17, props.calendarDay17))
const textLabel35Props = computed(() => mergeSlot(sdn.textLabel35, props.textLabel35))
const calendarDay18Props = computed(() => mergeSlot(sdn.calendarDay18, props.calendarDay18))
const textLabel36Props = computed(() => mergeSlot(sdn.textLabel36, props.textLabel36))
const calendarDay19Props = computed(() => mergeSlot(sdn.calendarDay19, props.calendarDay19))
const textLabel37Props = computed(() => mergeSlot(sdn.textLabel37, props.textLabel37))
const calendarDay20Props = computed(() => mergeSlot(sdn.calendarDay20, props.calendarDay20))
const textLabel38Props = computed(() => mergeSlot(sdn.textLabel38, props.textLabel38))
const calendarDay21Props = computed(() => mergeSlot(sdn.calendarDay21, props.calendarDay21))
const textLabel39Props = computed(() => mergeSlot(sdn.textLabel39, props.textLabel39))
const calendarDay22Props = computed(() => mergeSlot(sdn.calendarDay22, props.calendarDay22))
const textLabel40Props = computed(() => mergeSlot(sdn.textLabel40, props.textLabel40))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5))
const textTitle2Props = computed(() => mergeSlot(sdn.textTitle2, props.textTitle2))
const buttonIconic2Props = computed(() => mergeSlot(sdn.buttonIconic2, props.buttonIconic2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const container7Props = computed(() => mergeSlot(sdn.container7, props.container7))
const textLabel41Props = computed(() => mergeSlot(sdn.textLabel41, props.textLabel41))
const textLabel42Props = computed(() => mergeSlot(sdn.textLabel42, props.textLabel42))
const textLabel43Props = computed(() => mergeSlot(sdn.textLabel43, props.textLabel43))
const textLabel44Props = computed(() => mergeSlot(sdn.textLabel44, props.textLabel44))
const textLabel45Props = computed(() => mergeSlot(sdn.textLabel45, props.textLabel45))
const textLabel46Props = computed(() => mergeSlot(sdn.textLabel46, props.textLabel46))
const textLabel47Props = computed(() => mergeSlot(sdn.textLabel47, props.textLabel47))
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6))
const container8Props = computed(() => mergeSlot(sdn.container8, props.container8))
const calendarDay23Props = computed(() => mergeSlot(sdn.calendarDay23, props.calendarDay23))
const textLabel48Props = computed(() => mergeSlot(sdn.textLabel48, props.textLabel48))
const calendarDay24Props = computed(() => mergeSlot(sdn.calendarDay24, props.calendarDay24))
const textLabel49Props = computed(() => mergeSlot(sdn.textLabel49, props.textLabel49))
const container9Props = computed(() => mergeSlot(sdn.container9, props.container9))
const calendarDay25Props = computed(() => mergeSlot(sdn.calendarDay25, props.calendarDay25))
const textLabel50Props = computed(() => mergeSlot(sdn.textLabel50, props.textLabel50))
const calendarDay26Props = computed(() => mergeSlot(sdn.calendarDay26, props.calendarDay26))
const textLabel51Props = computed(() => mergeSlot(sdn.textLabel51, props.textLabel51))
const calendarDay27Props = computed(() => mergeSlot(sdn.calendarDay27, props.calendarDay27))
const textLabel52Props = computed(() => mergeSlot(sdn.textLabel52, props.textLabel52))
const calendarDay28Props = computed(() => mergeSlot(sdn.calendarDay28, props.calendarDay28))
const textLabel53Props = computed(() => mergeSlot(sdn.textLabel53, props.textLabel53))
const calendarDay29Props = computed(() => mergeSlot(sdn.calendarDay29, props.calendarDay29))
const textLabel54Props = computed(() => mergeSlot(sdn.textLabel54, props.textLabel54))
const calendarDay30Props = computed(() => mergeSlot(sdn.calendarDay30, props.calendarDay30))
const textLabel55Props = computed(() => mergeSlot(sdn.textLabel55, props.textLabel55))
const calendarDay31Props = computed(() => mergeSlot(sdn.calendarDay31, props.calendarDay31))
const textLabel56Props = computed(() => mergeSlot(sdn.textLabel56, props.textLabel56))
const container10Props = computed(() => mergeSlot(sdn.container10, props.container10))
const calendarDay32Props = computed(() => mergeSlot(sdn.calendarDay32, props.calendarDay32))
const textLabel57Props = computed(() => mergeSlot(sdn.textLabel57, props.textLabel57))
const calendarDay33Props = computed(() => mergeSlot(sdn.calendarDay33, props.calendarDay33))
const textLabel58Props = computed(() => mergeSlot(sdn.textLabel58, props.textLabel58))
const calendarDay34Props = computed(() => mergeSlot(sdn.calendarDay34, props.calendarDay34))
const textLabel59Props = computed(() => mergeSlot(sdn.textLabel59, props.textLabel59))
const calendarDay35Props = computed(() => mergeSlot(sdn.calendarDay35, props.calendarDay35))
const textLabel60Props = computed(() => mergeSlot(sdn.textLabel60, props.textLabel60))
const calendarDay36Props = computed(() => mergeSlot(sdn.calendarDay36, props.calendarDay36))
const textLabel61Props = computed(() => mergeSlot(sdn.textLabel61, props.textLabel61))
const calendarDay37Props = computed(() => mergeSlot(sdn.calendarDay37, props.calendarDay37))
const textLabel62Props = computed(() => mergeSlot(sdn.textLabel62, props.textLabel62))
const calendarDay38Props = computed(() => mergeSlot(sdn.calendarDay38, props.calendarDay38))
const textLabel63Props = computed(() => mergeSlot(sdn.textLabel63, props.textLabel63))
const container11Props = computed(() => mergeSlot(sdn.container11, props.container11))
const calendarDay39Props = computed(() => mergeSlot(sdn.calendarDay39, props.calendarDay39))
const textLabel64Props = computed(() => mergeSlot(sdn.textLabel64, props.textLabel64))
const calendarDay40Props = computed(() => mergeSlot(sdn.calendarDay40, props.calendarDay40))
const textLabel65Props = computed(() => mergeSlot(sdn.textLabel65, props.textLabel65))
const calendarDay41Props = computed(() => mergeSlot(sdn.calendarDay41, props.calendarDay41))
const textLabel66Props = computed(() => mergeSlot(sdn.textLabel66, props.textLabel66))
const calendarDay42Props = computed(() => mergeSlot(sdn.calendarDay42, props.calendarDay42))
const textLabel67Props = computed(() => mergeSlot(sdn.textLabel67, props.textLabel67))
const calendarDay43Props = computed(() => mergeSlot(sdn.calendarDay43, props.calendarDay43))
const textLabel68Props = computed(() => mergeSlot(sdn.textLabel68, props.textLabel68))
const calendarDay44Props = computed(() => mergeSlot(sdn.calendarDay44, props.calendarDay44))
const textLabel69Props = computed(() => mergeSlot(sdn.textLabel69, props.textLabel69))
const calendarDay45Props = computed(() => mergeSlot(sdn.calendarDay45, props.calendarDay45))
const textLabel70Props = computed(() => mergeSlot(sdn.textLabel70, props.textLabel70))
const container12Props = computed(() => mergeSlot(sdn.container12, props.container12))
const calendarDay46Props = computed(() => mergeSlot(sdn.calendarDay46, props.calendarDay46))
const textLabel71Props = computed(() => mergeSlot(sdn.textLabel71, props.textLabel71))
const calendarDay47Props = computed(() => mergeSlot(sdn.calendarDay47, props.calendarDay47))
const textLabel72Props = computed(() => mergeSlot(sdn.textLabel72, props.textLabel72))
const calendarDay48Props = computed(() => mergeSlot(sdn.calendarDay48, props.calendarDay48))
const textLabel73Props = computed(() => mergeSlot(sdn.textLabel73, props.textLabel73))
const calendarDay49Props = computed(() => mergeSlot(sdn.calendarDay49, props.calendarDay49))
const textLabel74Props = computed(() => mergeSlot(sdn.textLabel74, props.textLabel74))
const calendarDay50Props = computed(() => mergeSlot(sdn.calendarDay50, props.calendarDay50))
const textLabel75Props = computed(() => mergeSlot(sdn.textLabel75, props.textLabel75))
const calendarDay51Props = computed(() => mergeSlot(sdn.calendarDay51, props.calendarDay51))
const textLabel76Props = computed(() => mergeSlot(sdn.textLabel76, props.textLabel76))
const calendarDay52Props = computed(() => mergeSlot(sdn.calendarDay52, props.calendarDay52))
const textLabel77Props = computed(() => mergeSlot(sdn.textLabel77, props.textLabel77))
const container13Props = computed(() => mergeSlot(sdn.container13, props.container13))
const calendarDay53Props = computed(() => mergeSlot(sdn.calendarDay53, props.calendarDay53))
const textLabel78Props = computed(() => mergeSlot(sdn.textLabel78, props.textLabel78))
const calendarDay54Props = computed(() => mergeSlot(sdn.calendarDay54, props.calendarDay54))
const textLabel79Props = computed(() => mergeSlot(sdn.textLabel79, props.textLabel79))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <Frame v-bind="frame2Props" v-if="frame2">
            <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
            <TextTitle v-if="textTitle && textTitleProps" v-bind="textTitleProps" />
          </Frame>
          <Frame v-bind="containerProps" v-if="container">
            <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
            <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
            <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
            <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
            <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
            <TextLabel v-if="textLabel6 && textLabel6Props" v-bind="textLabel6Props" />
            <TextLabel v-if="textLabel7 && textLabel7Props" v-bind="textLabel7Props" />
          </Frame>
          <Frame v-bind="frame3Props" v-if="frame3">
            <Frame v-bind="container2Props" v-if="container2">
              <CalendarDay v-if="calendarDay && calendarDayProps" v-bind="calendarDayProps">
                <TextLabel v-if="textLabel8 && textLabel8Props" v-bind="textLabel8Props" />
              </CalendarDay>
              <CalendarDayMuted v-if="calendarDayMuted && calendarDayMutedProps" v-bind="calendarDayMutedProps">
                <TextLabel v-if="textLabel9 && textLabel9Props" v-bind="textLabel9Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted2 && calendarDayMuted2Props" v-bind="calendarDayMuted2Props">
                <TextLabel v-if="textLabel10 && textLabel10Props" v-bind="textLabel10Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted3 && calendarDayMuted3Props" v-bind="calendarDayMuted3Props">
                <TextLabel v-if="textLabel11 && textLabel11Props" v-bind="textLabel11Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted4 && calendarDayMuted4Props" v-bind="calendarDayMuted4Props">
                <TextLabel v-if="textLabel12 && textLabel12Props" v-bind="textLabel12Props" />
              </CalendarDayMuted>
            </Frame>
            <Frame v-bind="container3Props" v-if="container3">
              <CalendarDayMuted v-if="calendarDayMuted5 && calendarDayMuted5Props" v-bind="calendarDayMuted5Props">
                <TextLabel v-if="textLabel13 && textLabel13Props" v-bind="textLabel13Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted6 && calendarDayMuted6Props" v-bind="calendarDayMuted6Props">
                <TextLabel v-if="textLabel14 && textLabel14Props" v-bind="textLabel14Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted7 && calendarDayMuted7Props" v-bind="calendarDayMuted7Props">
                <TextLabel v-if="textLabel15 && textLabel15Props" v-bind="textLabel15Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted8 && calendarDayMuted8Props" v-bind="calendarDayMuted8Props">
                <TextLabel v-if="textLabel16 && textLabel16Props" v-bind="textLabel16Props" />
              </CalendarDayMuted>
              <CalendarDayMuted v-if="calendarDayMuted9 && calendarDayMuted9Props" v-bind="calendarDayMuted9Props">
                <TextLabel v-if="textLabel17 && textLabel17Props" v-bind="textLabel17Props" />
              </CalendarDayMuted>
              <CalendarDay v-if="calendarDay2 && calendarDay2Props" v-bind="calendarDay2Props">
                <TextLabel v-if="textLabel18 && textLabel18Props" v-bind="textLabel18Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay3 && calendarDay3Props" v-bind="calendarDay3Props">
                <TextLabel v-if="textLabel19 && textLabel19Props" v-bind="textLabel19Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container4Props" v-if="container4">
              <CalendarDay v-if="calendarDay4 && calendarDay4Props" v-bind="calendarDay4Props">
                <TextLabel v-if="textLabel20 && textLabel20Props" v-bind="textLabel20Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay5 && calendarDay5Props" v-bind="calendarDay5Props">
                <TextLabel v-if="textLabel21 && textLabel21Props" v-bind="textLabel21Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay6 && calendarDay6Props" v-bind="calendarDay6Props">
                <TextLabel v-if="textLabel22 && textLabel22Props" v-bind="textLabel22Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay7 && calendarDay7Props" v-bind="calendarDay7Props">
                <TextLabel v-if="textLabel23 && textLabel23Props" v-bind="textLabel23Props" />
              </CalendarDay>
              <CalendarDaySelected v-if="calendarDaySelected && calendarDaySelectedProps" v-bind="calendarDaySelectedProps">
                <TextLabel v-if="textLabel24 && textLabel24Props" v-bind="textLabel24Props" />
              </CalendarDaySelected>
              <CalendarDay v-if="calendarDay8 && calendarDay8Props" v-bind="calendarDay8Props">
                <TextLabel v-if="textLabel25 && textLabel25Props" v-bind="textLabel25Props" />
              </CalendarDay>
              <CalendarDaySelected v-if="calendarDaySelected2 && calendarDaySelected2Props" v-bind="calendarDaySelected2Props">
                <TextLabel v-if="textLabel26 && textLabel26Props" v-bind="textLabel26Props" />
              </CalendarDaySelected>
            </Frame>
            <Frame v-bind="container5Props" v-if="container5">
              <CalendarDay v-if="calendarDay9 && calendarDay9Props" v-bind="calendarDay9Props">
                <TextLabel v-if="textLabel27 && textLabel27Props" v-bind="textLabel27Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay10 && calendarDay10Props" v-bind="calendarDay10Props">
                <TextLabel v-if="textLabel28 && textLabel28Props" v-bind="textLabel28Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay11 && calendarDay11Props" v-bind="calendarDay11Props">
                <TextLabel v-if="textLabel29 && textLabel29Props" v-bind="textLabel29Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay12 && calendarDay12Props" v-bind="calendarDay12Props">
                <TextLabel v-if="textLabel30 && textLabel30Props" v-bind="textLabel30Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay13 && calendarDay13Props" v-bind="calendarDay13Props">
                <TextLabel v-if="textLabel31 && textLabel31Props" v-bind="textLabel31Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay14 && calendarDay14Props" v-bind="calendarDay14Props">
                <TextLabel v-if="textLabel32 && textLabel32Props" v-bind="textLabel32Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay15 && calendarDay15Props" v-bind="calendarDay15Props">
                <TextLabel v-if="textLabel33 && textLabel33Props" v-bind="textLabel33Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container6Props" v-if="container6">
              <CalendarDay v-if="calendarDay16 && calendarDay16Props" v-bind="calendarDay16Props">
                <TextLabel v-if="textLabel34 && textLabel34Props" v-bind="textLabel34Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay17 && calendarDay17Props" v-bind="calendarDay17Props">
                <TextLabel v-if="textLabel35 && textLabel35Props" v-bind="textLabel35Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay18 && calendarDay18Props" v-bind="calendarDay18Props">
                <TextLabel v-if="textLabel36 && textLabel36Props" v-bind="textLabel36Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay19 && calendarDay19Props" v-bind="calendarDay19Props">
                <TextLabel v-if="textLabel37 && textLabel37Props" v-bind="textLabel37Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay20 && calendarDay20Props" v-bind="calendarDay20Props">
                <TextLabel v-if="textLabel38 && textLabel38Props" v-bind="textLabel38Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay21 && calendarDay21Props" v-bind="calendarDay21Props">
                <TextLabel v-if="textLabel39 && textLabel39Props" v-bind="textLabel39Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay22 && calendarDay22Props" v-bind="calendarDay22Props">
                <TextLabel v-if="textLabel40 && textLabel40Props" v-bind="textLabel40Props" />
              </CalendarDay>
            </Frame>
          </Frame>
        </Frame>
        <Frame v-bind="frame4Props">
          <Frame v-bind="frame5Props" v-if="frame5">
            <TextTitle v-if="textTitle2 && textTitle2Props" v-bind="textTitle2Props" />
            <ButtonIconic v-if="buttonIconic2 && buttonIconic2Props" v-bind="buttonIconic2Props" :icon="icon2Props" />
          </Frame>
          <Frame v-bind="container7Props" v-if="container7">
            <TextLabel v-if="textLabel41 && textLabel41Props" v-bind="textLabel41Props" />
            <TextLabel v-if="textLabel42 && textLabel42Props" v-bind="textLabel42Props" />
            <TextLabel v-if="textLabel43 && textLabel43Props" v-bind="textLabel43Props" />
            <TextLabel v-if="textLabel44 && textLabel44Props" v-bind="textLabel44Props" />
            <TextLabel v-if="textLabel45 && textLabel45Props" v-bind="textLabel45Props" />
            <TextLabel v-if="textLabel46 && textLabel46Props" v-bind="textLabel46Props" />
            <TextLabel v-if="textLabel47 && textLabel47Props" v-bind="textLabel47Props" />
          </Frame>
          <Frame v-bind="frame6Props" v-if="frame6">
            <Frame v-bind="container8Props" v-if="container8">
              <CalendarDay v-if="calendarDay23 && calendarDay23Props" v-bind="calendarDay23Props">
                <TextLabel v-if="textLabel48 && textLabel48Props" v-bind="textLabel48Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay24 && calendarDay24Props" v-bind="calendarDay24Props">
                <TextLabel v-if="textLabel49 && textLabel49Props" v-bind="textLabel49Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container9Props" v-if="container9">
              <CalendarDay v-if="calendarDay25 && calendarDay25Props" v-bind="calendarDay25Props">
                <TextLabel v-if="textLabel50 && textLabel50Props" v-bind="textLabel50Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay26 && calendarDay26Props" v-bind="calendarDay26Props">
                <TextLabel v-if="textLabel51 && textLabel51Props" v-bind="textLabel51Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay27 && calendarDay27Props" v-bind="calendarDay27Props">
                <TextLabel v-if="textLabel52 && textLabel52Props" v-bind="textLabel52Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay28 && calendarDay28Props" v-bind="calendarDay28Props">
                <TextLabel v-if="textLabel53 && textLabel53Props" v-bind="textLabel53Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay29 && calendarDay29Props" v-bind="calendarDay29Props">
                <TextLabel v-if="textLabel54 && textLabel54Props" v-bind="textLabel54Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay30 && calendarDay30Props" v-bind="calendarDay30Props">
                <TextLabel v-if="textLabel55 && textLabel55Props" v-bind="textLabel55Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay31 && calendarDay31Props" v-bind="calendarDay31Props">
                <TextLabel v-if="textLabel56 && textLabel56Props" v-bind="textLabel56Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container10Props" v-if="container10">
              <CalendarDay v-if="calendarDay32 && calendarDay32Props" v-bind="calendarDay32Props">
                <TextLabel v-if="textLabel57 && textLabel57Props" v-bind="textLabel57Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay33 && calendarDay33Props" v-bind="calendarDay33Props">
                <TextLabel v-if="textLabel58 && textLabel58Props" v-bind="textLabel58Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay34 && calendarDay34Props" v-bind="calendarDay34Props">
                <TextLabel v-if="textLabel59 && textLabel59Props" v-bind="textLabel59Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay35 && calendarDay35Props" v-bind="calendarDay35Props">
                <TextLabel v-if="textLabel60 && textLabel60Props" v-bind="textLabel60Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay36 && calendarDay36Props" v-bind="calendarDay36Props">
                <TextLabel v-if="textLabel61 && textLabel61Props" v-bind="textLabel61Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay37 && calendarDay37Props" v-bind="calendarDay37Props">
                <TextLabel v-if="textLabel62 && textLabel62Props" v-bind="textLabel62Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay38 && calendarDay38Props" v-bind="calendarDay38Props">
                <TextLabel v-if="textLabel63 && textLabel63Props" v-bind="textLabel63Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container11Props" v-if="container11">
              <CalendarDay v-if="calendarDay39 && calendarDay39Props" v-bind="calendarDay39Props">
                <TextLabel v-if="textLabel64 && textLabel64Props" v-bind="textLabel64Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay40 && calendarDay40Props" v-bind="calendarDay40Props">
                <TextLabel v-if="textLabel65 && textLabel65Props" v-bind="textLabel65Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay41 && calendarDay41Props" v-bind="calendarDay41Props">
                <TextLabel v-if="textLabel66 && textLabel66Props" v-bind="textLabel66Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay42 && calendarDay42Props" v-bind="calendarDay42Props">
                <TextLabel v-if="textLabel67 && textLabel67Props" v-bind="textLabel67Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay43 && calendarDay43Props" v-bind="calendarDay43Props">
                <TextLabel v-if="textLabel68 && textLabel68Props" v-bind="textLabel68Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay44 && calendarDay44Props" v-bind="calendarDay44Props">
                <TextLabel v-if="textLabel69 && textLabel69Props" v-bind="textLabel69Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay45 && calendarDay45Props" v-bind="calendarDay45Props">
                <TextLabel v-if="textLabel70 && textLabel70Props" v-bind="textLabel70Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container12Props" v-if="container12">
              <CalendarDay v-if="calendarDay46 && calendarDay46Props" v-bind="calendarDay46Props">
                <TextLabel v-if="textLabel71 && textLabel71Props" v-bind="textLabel71Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay47 && calendarDay47Props" v-bind="calendarDay47Props">
                <TextLabel v-if="textLabel72 && textLabel72Props" v-bind="textLabel72Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay48 && calendarDay48Props" v-bind="calendarDay48Props">
                <TextLabel v-if="textLabel73 && textLabel73Props" v-bind="textLabel73Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay49 && calendarDay49Props" v-bind="calendarDay49Props">
                <TextLabel v-if="textLabel74 && textLabel74Props" v-bind="textLabel74Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay50 && calendarDay50Props" v-bind="calendarDay50Props">
                <TextLabel v-if="textLabel75 && textLabel75Props" v-bind="textLabel75Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay51 && calendarDay51Props" v-bind="calendarDay51Props">
                <TextLabel v-if="textLabel76 && textLabel76Props" v-bind="textLabel76Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay52 && calendarDay52Props" v-bind="calendarDay52Props">
                <TextLabel v-if="textLabel77 && textLabel77Props" v-bind="textLabel77Props" />
              </CalendarDay>
            </Frame>
            <Frame v-bind="container13Props" v-if="container13">
              <CalendarDay v-if="calendarDay53 && calendarDay53Props" v-bind="calendarDay53Props">
                <TextLabel v-if="textLabel78 && textLabel78Props" v-bind="textLabel78Props" />
              </CalendarDay>
              <CalendarDay v-if="calendarDay54 && calendarDay54Props" v-bind="calendarDay54Props">
                <TextLabel v-if="textLabel79 && textLabel79Props" v-bind="textLabel79Props" />
              </CalendarDay>
            </Frame>
          </Frame>
        </Frame>
      </slot>
    </div>
</template>
