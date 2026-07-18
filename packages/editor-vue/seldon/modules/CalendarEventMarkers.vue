<script setup lang="ts">
import { computed } from "vue"
import { combineClassNames, mergeSlot } from "../utils/class-names"
import Frame from "../frames/Frame.vue"
import ButtonIconic from "../elements/ButtonIconic.vue"
import CalendarDay from "../elements/CalendarDay.vue"
import CalendarDayMuted from "../elements/CalendarDayMuted.vue"
import CalendarDaySelected from "../elements/CalendarDaySelected.vue"
import TextLabel from "../primitives/TextLabel.vue"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  container?: Record<string, unknown> | null
  textLabel2?: Record<string, unknown> | null
  textLabel3?: Record<string, unknown> | null
  textLabel4?: Record<string, unknown> | null
  textLabel5?: Record<string, unknown> | null
  textLabel6?: Record<string, unknown> | null
  textLabel7?: Record<string, unknown> | null
  textLabel8?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  container2?: Record<string, unknown> | null
  calendarDayMuted?: Record<string, unknown> | null
  textLabel9?: Record<string, unknown> | null
  calendarDaySelected?: Record<string, unknown> | null
  textLabel10?: Record<string, unknown> | null
  textLabel11?: Record<string, unknown> | null
  calendarDay?: Record<string, unknown> | null
  textLabel12?: Record<string, unknown> | null
  calendarDay2?: Record<string, unknown> | null
  textLabel13?: Record<string, unknown> | null
  calendarDay3?: Record<string, unknown> | null
  textLabel14?: Record<string, unknown> | null
  calendarDay4?: Record<string, unknown> | null
  textLabel15?: Record<string, unknown> | null
  calendarDayMuted2?: Record<string, unknown> | null
  textLabel16?: Record<string, unknown> | null
  container3?: Record<string, unknown> | null
  calendarDayMuted3?: Record<string, unknown> | null
  textLabel17?: Record<string, unknown> | null
  calendarDayMuted4?: Record<string, unknown> | null
  textLabel18?: Record<string, unknown> | null
  calendarDayMuted5?: Record<string, unknown> | null
  textLabel19?: Record<string, unknown> | null
  calendarDayMuted6?: Record<string, unknown> | null
  textLabel20?: Record<string, unknown> | null
  calendarDayMuted7?: Record<string, unknown> | null
  textLabel21?: Record<string, unknown> | null
  calendarDayMuted8?: Record<string, unknown> | null
  textLabel22?: Record<string, unknown> | null
  calendarDayMuted9?: Record<string, unknown> | null
  textLabel23?: Record<string, unknown> | null
  container4?: Record<string, unknown> | null
  calendarDayMuted10?: Record<string, unknown> | null
  textLabel24?: Record<string, unknown> | null
  calendarDayMuted11?: Record<string, unknown> | null
  textLabel25?: Record<string, unknown> | null
  calendarDayMuted12?: Record<string, unknown> | null
  textLabel26?: Record<string, unknown> | null
  calendarDayMuted13?: Record<string, unknown> | null
  textLabel27?: Record<string, unknown> | null
  calendarDayMuted14?: Record<string, unknown> | null
  textLabel28?: Record<string, unknown> | null
  calendarDayMuted15?: Record<string, unknown> | null
  textLabel29?: Record<string, unknown> | null
  calendarDayMuted16?: Record<string, unknown> | null
  textLabel30?: Record<string, unknown> | null
  container5?: Record<string, unknown> | null
  calendarDayMuted17?: Record<string, unknown> | null
  textLabel31?: Record<string, unknown> | null
  calendarDayMuted18?: Record<string, unknown> | null
  textLabel32?: Record<string, unknown> | null
  calendarDayMuted19?: Record<string, unknown> | null
  textLabel33?: Record<string, unknown> | null
  calendarDayMuted20?: Record<string, unknown> | null
  textLabel34?: Record<string, unknown> | null
  calendarDayMuted21?: Record<string, unknown> | null
  textLabel35?: Record<string, unknown> | null
  calendarDayMuted22?: Record<string, unknown> | null
  textLabel36?: Record<string, unknown> | null
  calendarDayMuted23?: Record<string, unknown> | null
  textLabel37?: Record<string, unknown> | null
  container6?: Record<string, unknown> | null
  calendarDayMuted24?: Record<string, unknown> | null
  textLabel38?: Record<string, unknown> | null
  calendarDayMuted25?: Record<string, unknown> | null
  textLabel39?: Record<string, unknown> | null
  calendarDay5?: Record<string, unknown> | null
  textLabel40?: Record<string, unknown> | null
}>()

const sdn: Record<string, any> = {
  "aria-hidden": "false",
  "className": "sdn-calendar",
  "frame": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--8xlb"
  },
  "textLabel": {
    "className": "sdn-text-label sdn-text-label--ulqg"
  },
  "buttonIconic": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon": {
    "icon": "material-chevronLeft",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--fgqd"
  },
  "buttonIconic2": {
    "className": "sdn-button-iconic sdn-button-iconic--8tzd"
  },
  "icon2": {
    "icon": "material-chevronRight",
    "aria-hidden": "true",
    "className": "sdn-icon sdn-icon--fgqd"
  },
  "container": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
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
  "textLabel8": {
    "className": "sdn-text-label sdn-text-label--sxr5"
  },
  "frame2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-frame sdn-frame--xyjz"
  },
  "container2": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel9": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDaySelected": {
    "className": "sdn-calendar-day-selected sdn-calendar-day-muted--tzv7"
  },
  "textLabel10": {
    "className": "sdn-text-label sdn-text-label--fye8"
  },
  "textLabel11": {
    "className": "sdn-text-label sdn-text-label--yw9b"
  },
  "calendarDay": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel12": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDay2": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel13": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDay3": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel14": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDay4": {
    "className": "sdn-calendar-day sdn-calendar-day-muted--tzv7"
  },
  "textLabel15": {
    "className": "sdn-text-label sdn-text-label--bwn4"
  },
  "calendarDayMuted2": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel16": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container3": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted3": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel17": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted4": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel18": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted5": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel19": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted6": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel20": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted7": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel21": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted8": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel22": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted9": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel23": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container4": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted10": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel24": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted11": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel25": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted12": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel26": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted13": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel27": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted14": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel28": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted15": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel29": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted16": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel30": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container5": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted17": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel31": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted18": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel32": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted19": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel33": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted20": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel34": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted21": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel35": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted22": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel36": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted23": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel37": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "container6": {
    "wrapperElement": "div",
    "aria-hidden": "false",
    "className": "sdn-container sdn-container--npgy"
  },
  "calendarDayMuted24": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel38": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDayMuted25": {
    "className": "sdn-calendar-day-muted sdn-calendar-day-muted--tzv7"
  },
  "textLabel39": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  },
  "calendarDay5": {
    "className": "sdn-calendar-day sdn-calendar-day--i3zq"
  },
  "textLabel40": {
    "className": "sdn-text-label sdn-text-label--g3ro"
  }
}

const rootClassName = computed(() => combineClassNames("sdn-calendar", props.className))
const rootAttrs = { "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame))
const textLabelProps = computed(() => mergeSlot(sdn.textLabel, props.textLabel))
const buttonIconicProps = computed(() => mergeSlot(sdn.buttonIconic, props.buttonIconic))
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon))
const buttonIconic2Props = computed(() => mergeSlot(sdn.buttonIconic2, props.buttonIconic2))
const icon2Props = computed(() => mergeSlot(sdn.icon2, props.icon2))
const containerProps = computed(() => mergeSlot(sdn.container, props.container))
const textLabel2Props = computed(() => mergeSlot(sdn.textLabel2, props.textLabel2))
const textLabel3Props = computed(() => mergeSlot(sdn.textLabel3, props.textLabel3))
const textLabel4Props = computed(() => mergeSlot(sdn.textLabel4, props.textLabel4))
const textLabel5Props = computed(() => mergeSlot(sdn.textLabel5, props.textLabel5))
const textLabel6Props = computed(() => mergeSlot(sdn.textLabel6, props.textLabel6))
const textLabel7Props = computed(() => mergeSlot(sdn.textLabel7, props.textLabel7))
const textLabel8Props = computed(() => mergeSlot(sdn.textLabel8, props.textLabel8))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2))
const container2Props = computed(() => mergeSlot(sdn.container2, props.container2))
const calendarDayMutedProps = computed(() => mergeSlot(sdn.calendarDayMuted, props.calendarDayMuted))
const textLabel9Props = computed(() => mergeSlot(sdn.textLabel9, props.textLabel9))
const calendarDaySelectedProps = computed(() => mergeSlot(sdn.calendarDaySelected, props.calendarDaySelected))
const textLabel10Props = computed(() => mergeSlot(sdn.textLabel10, props.textLabel10))
const textLabel11Props = computed(() => mergeSlot(sdn.textLabel11, props.textLabel11))
const calendarDayProps = computed(() => mergeSlot(sdn.calendarDay, props.calendarDay))
const textLabel12Props = computed(() => mergeSlot(sdn.textLabel12, props.textLabel12))
const calendarDay2Props = computed(() => mergeSlot(sdn.calendarDay2, props.calendarDay2))
const textLabel13Props = computed(() => mergeSlot(sdn.textLabel13, props.textLabel13))
const calendarDay3Props = computed(() => mergeSlot(sdn.calendarDay3, props.calendarDay3))
const textLabel14Props = computed(() => mergeSlot(sdn.textLabel14, props.textLabel14))
const calendarDay4Props = computed(() => mergeSlot(sdn.calendarDay4, props.calendarDay4))
const textLabel15Props = computed(() => mergeSlot(sdn.textLabel15, props.textLabel15))
const calendarDayMuted2Props = computed(() => mergeSlot(sdn.calendarDayMuted2, props.calendarDayMuted2))
const textLabel16Props = computed(() => mergeSlot(sdn.textLabel16, props.textLabel16))
const container3Props = computed(() => mergeSlot(sdn.container3, props.container3))
const calendarDayMuted3Props = computed(() => mergeSlot(sdn.calendarDayMuted3, props.calendarDayMuted3))
const textLabel17Props = computed(() => mergeSlot(sdn.textLabel17, props.textLabel17))
const calendarDayMuted4Props = computed(() => mergeSlot(sdn.calendarDayMuted4, props.calendarDayMuted4))
const textLabel18Props = computed(() => mergeSlot(sdn.textLabel18, props.textLabel18))
const calendarDayMuted5Props = computed(() => mergeSlot(sdn.calendarDayMuted5, props.calendarDayMuted5))
const textLabel19Props = computed(() => mergeSlot(sdn.textLabel19, props.textLabel19))
const calendarDayMuted6Props = computed(() => mergeSlot(sdn.calendarDayMuted6, props.calendarDayMuted6))
const textLabel20Props = computed(() => mergeSlot(sdn.textLabel20, props.textLabel20))
const calendarDayMuted7Props = computed(() => mergeSlot(sdn.calendarDayMuted7, props.calendarDayMuted7))
const textLabel21Props = computed(() => mergeSlot(sdn.textLabel21, props.textLabel21))
const calendarDayMuted8Props = computed(() => mergeSlot(sdn.calendarDayMuted8, props.calendarDayMuted8))
const textLabel22Props = computed(() => mergeSlot(sdn.textLabel22, props.textLabel22))
const calendarDayMuted9Props = computed(() => mergeSlot(sdn.calendarDayMuted9, props.calendarDayMuted9))
const textLabel23Props = computed(() => mergeSlot(sdn.textLabel23, props.textLabel23))
const container4Props = computed(() => mergeSlot(sdn.container4, props.container4))
const calendarDayMuted10Props = computed(() => mergeSlot(sdn.calendarDayMuted10, props.calendarDayMuted10))
const textLabel24Props = computed(() => mergeSlot(sdn.textLabel24, props.textLabel24))
const calendarDayMuted11Props = computed(() => mergeSlot(sdn.calendarDayMuted11, props.calendarDayMuted11))
const textLabel25Props = computed(() => mergeSlot(sdn.textLabel25, props.textLabel25))
const calendarDayMuted12Props = computed(() => mergeSlot(sdn.calendarDayMuted12, props.calendarDayMuted12))
const textLabel26Props = computed(() => mergeSlot(sdn.textLabel26, props.textLabel26))
const calendarDayMuted13Props = computed(() => mergeSlot(sdn.calendarDayMuted13, props.calendarDayMuted13))
const textLabel27Props = computed(() => mergeSlot(sdn.textLabel27, props.textLabel27))
const calendarDayMuted14Props = computed(() => mergeSlot(sdn.calendarDayMuted14, props.calendarDayMuted14))
const textLabel28Props = computed(() => mergeSlot(sdn.textLabel28, props.textLabel28))
const calendarDayMuted15Props = computed(() => mergeSlot(sdn.calendarDayMuted15, props.calendarDayMuted15))
const textLabel29Props = computed(() => mergeSlot(sdn.textLabel29, props.textLabel29))
const calendarDayMuted16Props = computed(() => mergeSlot(sdn.calendarDayMuted16, props.calendarDayMuted16))
const textLabel30Props = computed(() => mergeSlot(sdn.textLabel30, props.textLabel30))
const container5Props = computed(() => mergeSlot(sdn.container5, props.container5))
const calendarDayMuted17Props = computed(() => mergeSlot(sdn.calendarDayMuted17, props.calendarDayMuted17))
const textLabel31Props = computed(() => mergeSlot(sdn.textLabel31, props.textLabel31))
const calendarDayMuted18Props = computed(() => mergeSlot(sdn.calendarDayMuted18, props.calendarDayMuted18))
const textLabel32Props = computed(() => mergeSlot(sdn.textLabel32, props.textLabel32))
const calendarDayMuted19Props = computed(() => mergeSlot(sdn.calendarDayMuted19, props.calendarDayMuted19))
const textLabel33Props = computed(() => mergeSlot(sdn.textLabel33, props.textLabel33))
const calendarDayMuted20Props = computed(() => mergeSlot(sdn.calendarDayMuted20, props.calendarDayMuted20))
const textLabel34Props = computed(() => mergeSlot(sdn.textLabel34, props.textLabel34))
const calendarDayMuted21Props = computed(() => mergeSlot(sdn.calendarDayMuted21, props.calendarDayMuted21))
const textLabel35Props = computed(() => mergeSlot(sdn.textLabel35, props.textLabel35))
const calendarDayMuted22Props = computed(() => mergeSlot(sdn.calendarDayMuted22, props.calendarDayMuted22))
const textLabel36Props = computed(() => mergeSlot(sdn.textLabel36, props.textLabel36))
const calendarDayMuted23Props = computed(() => mergeSlot(sdn.calendarDayMuted23, props.calendarDayMuted23))
const textLabel37Props = computed(() => mergeSlot(sdn.textLabel37, props.textLabel37))
const container6Props = computed(() => mergeSlot(sdn.container6, props.container6))
const calendarDayMuted24Props = computed(() => mergeSlot(sdn.calendarDayMuted24, props.calendarDayMuted24))
const textLabel38Props = computed(() => mergeSlot(sdn.textLabel38, props.textLabel38))
const calendarDayMuted25Props = computed(() => mergeSlot(sdn.calendarDayMuted25, props.calendarDayMuted25))
const textLabel39Props = computed(() => mergeSlot(sdn.textLabel39, props.textLabel39))
const calendarDay5Props = computed(() => mergeSlot(sdn.calendarDay5, props.calendarDay5))
const textLabel40Props = computed(() => mergeSlot(sdn.textLabel40, props.textLabel40))
</script>

<template>
    <div :class="rootClassName" v-bind="rootAttrs">
      <slot>
        <Frame v-bind="frameProps">
          <TextLabel v-if="textLabel && textLabelProps" v-bind="textLabelProps" />
          <ButtonIconic v-if="buttonIconic && buttonIconicProps" v-bind="buttonIconicProps" :icon="iconProps" />
          <ButtonIconic v-if="buttonIconic2 && buttonIconic2Props" v-bind="buttonIconic2Props" :icon="icon2Props" />
        </Frame>
        <Frame v-bind="containerProps">
          <TextLabel v-if="textLabel2 && textLabel2Props" v-bind="textLabel2Props" />
          <TextLabel v-if="textLabel3 && textLabel3Props" v-bind="textLabel3Props" />
          <TextLabel v-if="textLabel4 && textLabel4Props" v-bind="textLabel4Props" />
          <TextLabel v-if="textLabel5 && textLabel5Props" v-bind="textLabel5Props" />
          <TextLabel v-if="textLabel6 && textLabel6Props" v-bind="textLabel6Props" />
          <TextLabel v-if="textLabel7 && textLabel7Props" v-bind="textLabel7Props" />
          <TextLabel v-if="textLabel8 && textLabel8Props" v-bind="textLabel8Props" />
        </Frame>
        <Frame v-bind="frame2Props">
          <Frame v-bind="container2Props" v-if="container2">
            <CalendarDayMuted v-if="calendarDayMuted && calendarDayMutedProps" v-bind="calendarDayMutedProps">
              <TextLabel v-if="textLabel9 && textLabel9Props" v-bind="textLabel9Props" />
            </CalendarDayMuted>
            <CalendarDaySelected v-if="calendarDaySelected && calendarDaySelectedProps" v-bind="calendarDaySelectedProps">
              <TextLabel v-if="textLabel10 && textLabel10Props" v-bind="textLabel10Props" />
              <TextLabel v-if="textLabel11 && textLabel11Props" v-bind="textLabel11Props" />
            </CalendarDaySelected>
            <CalendarDay v-if="calendarDay && calendarDayProps" v-bind="calendarDayProps">
              <TextLabel v-if="textLabel12 && textLabel12Props" v-bind="textLabel12Props" />
            </CalendarDay>
            <CalendarDay v-if="calendarDay2 && calendarDay2Props" v-bind="calendarDay2Props">
              <TextLabel v-if="textLabel13 && textLabel13Props" v-bind="textLabel13Props" />
            </CalendarDay>
            <CalendarDay v-if="calendarDay3 && calendarDay3Props" v-bind="calendarDay3Props">
              <TextLabel v-if="textLabel14 && textLabel14Props" v-bind="textLabel14Props" />
            </CalendarDay>
            <CalendarDay v-if="calendarDay4 && calendarDay4Props" v-bind="calendarDay4Props">
              <TextLabel v-if="textLabel15 && textLabel15Props" v-bind="textLabel15Props" />
            </CalendarDay>
            <CalendarDayMuted v-if="calendarDayMuted2 && calendarDayMuted2Props" v-bind="calendarDayMuted2Props">
              <TextLabel v-if="textLabel16 && textLabel16Props" v-bind="textLabel16Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container3Props" v-if="container3">
            <CalendarDayMuted v-if="calendarDayMuted3 && calendarDayMuted3Props" v-bind="calendarDayMuted3Props">
              <TextLabel v-if="textLabel17 && textLabel17Props" v-bind="textLabel17Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted4 && calendarDayMuted4Props" v-bind="calendarDayMuted4Props">
              <TextLabel v-if="textLabel18 && textLabel18Props" v-bind="textLabel18Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted5 && calendarDayMuted5Props" v-bind="calendarDayMuted5Props">
              <TextLabel v-if="textLabel19 && textLabel19Props" v-bind="textLabel19Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted6 && calendarDayMuted6Props" v-bind="calendarDayMuted6Props">
              <TextLabel v-if="textLabel20 && textLabel20Props" v-bind="textLabel20Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted7 && calendarDayMuted7Props" v-bind="calendarDayMuted7Props">
              <TextLabel v-if="textLabel21 && textLabel21Props" v-bind="textLabel21Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted8 && calendarDayMuted8Props" v-bind="calendarDayMuted8Props">
              <TextLabel v-if="textLabel22 && textLabel22Props" v-bind="textLabel22Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted9 && calendarDayMuted9Props" v-bind="calendarDayMuted9Props">
              <TextLabel v-if="textLabel23 && textLabel23Props" v-bind="textLabel23Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container4Props" v-if="container4">
            <CalendarDayMuted v-if="calendarDayMuted10 && calendarDayMuted10Props" v-bind="calendarDayMuted10Props">
              <TextLabel v-if="textLabel24 && textLabel24Props" v-bind="textLabel24Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted11 && calendarDayMuted11Props" v-bind="calendarDayMuted11Props">
              <TextLabel v-if="textLabel25 && textLabel25Props" v-bind="textLabel25Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted12 && calendarDayMuted12Props" v-bind="calendarDayMuted12Props">
              <TextLabel v-if="textLabel26 && textLabel26Props" v-bind="textLabel26Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted13 && calendarDayMuted13Props" v-bind="calendarDayMuted13Props">
              <TextLabel v-if="textLabel27 && textLabel27Props" v-bind="textLabel27Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted14 && calendarDayMuted14Props" v-bind="calendarDayMuted14Props">
              <TextLabel v-if="textLabel28 && textLabel28Props" v-bind="textLabel28Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted15 && calendarDayMuted15Props" v-bind="calendarDayMuted15Props">
              <TextLabel v-if="textLabel29 && textLabel29Props" v-bind="textLabel29Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted16 && calendarDayMuted16Props" v-bind="calendarDayMuted16Props">
              <TextLabel v-if="textLabel30 && textLabel30Props" v-bind="textLabel30Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container5Props" v-if="container5">
            <CalendarDayMuted v-if="calendarDayMuted17 && calendarDayMuted17Props" v-bind="calendarDayMuted17Props">
              <TextLabel v-if="textLabel31 && textLabel31Props" v-bind="textLabel31Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted18 && calendarDayMuted18Props" v-bind="calendarDayMuted18Props">
              <TextLabel v-if="textLabel32 && textLabel32Props" v-bind="textLabel32Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted19 && calendarDayMuted19Props" v-bind="calendarDayMuted19Props">
              <TextLabel v-if="textLabel33 && textLabel33Props" v-bind="textLabel33Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted20 && calendarDayMuted20Props" v-bind="calendarDayMuted20Props">
              <TextLabel v-if="textLabel34 && textLabel34Props" v-bind="textLabel34Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted21 && calendarDayMuted21Props" v-bind="calendarDayMuted21Props">
              <TextLabel v-if="textLabel35 && textLabel35Props" v-bind="textLabel35Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted22 && calendarDayMuted22Props" v-bind="calendarDayMuted22Props">
              <TextLabel v-if="textLabel36 && textLabel36Props" v-bind="textLabel36Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted23 && calendarDayMuted23Props" v-bind="calendarDayMuted23Props">
              <TextLabel v-if="textLabel37 && textLabel37Props" v-bind="textLabel37Props" />
            </CalendarDayMuted>
          </Frame>
          <Frame v-bind="container6Props" v-if="container6">
            <CalendarDayMuted v-if="calendarDayMuted24 && calendarDayMuted24Props" v-bind="calendarDayMuted24Props">
              <TextLabel v-if="textLabel38 && textLabel38Props" v-bind="textLabel38Props" />
            </CalendarDayMuted>
            <CalendarDayMuted v-if="calendarDayMuted25 && calendarDayMuted25Props" v-bind="calendarDayMuted25Props">
              <TextLabel v-if="textLabel39 && textLabel39Props" v-bind="textLabel39Props" />
            </CalendarDayMuted>
            <CalendarDay v-if="calendarDay5 && calendarDay5Props" v-bind="calendarDay5Props">
              <TextLabel v-if="textLabel40 && textLabel40Props" v-bind="textLabel40Props" />
            </CalendarDay>
          </Frame>
        </Frame>
      </slot>
    </div>
</template>
