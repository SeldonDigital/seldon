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
 * Panel: PanelComponents
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Frame                   frame                -> componentsPaletteTopBar
 *     Frame                 frame2
 *       TextLabel           textLabel            -> componentsPaletteTitle
 *     ButtonIconic          buttonIconic         -> componentsPaletteClose
 *       Icon                icon
 *   Frame                   frame3               -> componentsPaletteContents
 *     ListStandardCatalog   listStandardCatalog  -> componentsCatalogList
 *       TextSubtitle        textSubtitle         -> componentsCatalogLevel
 *       Container           container
 *         ItemCatalog       itemCatalog          -> componentsCatalogItem
 *           Icon            icon2                -> componentsCatalogImage
 *           Frame           frame4
 *             Text          text                 -> componentsCatalogMetadata
 *             TextTitle     textTitle            -> componentsCatalogName
 *             TextSubtitle  textSubtitle2        -> componentsCatalogVariant
 *         ItemCatalog       itemCatalog2
 *           Icon            icon3
 *           Frame           frame5
 *             TextTitle     textTitle2
 *             TextSubtitle  textSubtitle3
 *         ItemCatalog       itemCatalog3
 *           Icon            icon4
 *           Frame           frame6
 *             TextTitle     textTitle3
 *             TextSubtitle  textSubtitle4
 *         ItemCatalog       itemCatalog4
 *           Icon            icon5
 *           Frame           frame7
 *             TextTitle     textTitle4
 *             TextSubtitle  textSubtitle5
 *   Frame                   frame8               -> componentsPaletteBottomBar
 *     BarFilter             barFilter            -> componentsPaletteFilter
 *       ComboboxField       comboboxField
 *         Icon              icon6
 *         Input             input                -> componentsPaletteFilterInput
 *         ButtonIconic      buttonIconic2        -> componentsPaletteFilterClear
 *           Icon            icon7
 *     Frame                 frame9
 *
 * @example
 * ```vue
 * <PanelComponents
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export default {}
</script>

<script setup lang="ts">
import { computed } from "vue"

import ButtonIconic from "../elements/ButtonIconic.vue"
import ComboboxField from "../elements/ComboboxField.vue"
import ItemCatalog from "../elements/ItemCatalog.vue"
import Frame from "../frames/Frame.vue"
import BarFilter from "../parts/BarFilter.vue"
import ListStandardCatalog from "../parts/ListStandardCatalog.vue"
import Icon from "../primitives/Icon.vue"
import Text from "../primitives/Text.vue"
import TextLabel from "../primitives/TextLabel.vue"
import TextSubtitle from "../primitives/TextSubtitle.vue"
import TextTitle from "../primitives/TextTitle.vue"
import { combineClassNames, mergeOptionalSlot, mergeSlot } from "../utils/class-names"

const props = defineProps<{
  className?: string
  frame?: Record<string, unknown> | null
  frame2?: Record<string, unknown> | null
  textLabel?: Record<string, unknown> | null
  buttonIconic?: Record<string, unknown> | null
  icon?: Record<string, unknown> | null
  frame3?: Record<string, unknown> | null
  listStandardCatalog?: Record<string, unknown> | null
  textSubtitle?: Record<string, unknown> | null
  container?: Record<string, unknown> | null
  itemCatalog?: Record<string, unknown> | null
  icon2?: Record<string, unknown> | null
  frame4?: Record<string, unknown> | null
  text?: Record<string, unknown> | null
  textTitle?: Record<string, unknown> | null
  textSubtitle2?: Record<string, unknown> | null
  itemCatalog2?: Record<string, unknown> | null
  icon3?: Record<string, unknown> | null
  frame5?: Record<string, unknown> | null
  textTitle2?: Record<string, unknown> | null
  textSubtitle3?: Record<string, unknown> | null
  itemCatalog3?: Record<string, unknown> | null
  icon4?: Record<string, unknown> | null
  frame6?: Record<string, unknown> | null
  textTitle3?: Record<string, unknown> | null
  textSubtitle4?: Record<string, unknown> | null
  itemCatalog4?: Record<string, unknown> | null
  icon5?: Record<string, unknown> | null
  frame7?: Record<string, unknown> | null
  textTitle4?: Record<string, unknown> | null
  textSubtitle5?: Record<string, unknown> | null
  frame8?: Record<string, unknown> | null
  barFilter?: Record<string, unknown> | null
  comboboxField?: Record<string, unknown> | null
  icon6?: Record<string, unknown> | null
  input?: Record<string, unknown> | null
  buttonIconic2?: Record<string, unknown> | null
  icon7?: Record<string, unknown> | null
  frame9?: Record<string, unknown> | null
  seldonRefs?: Record<string, Record<string, unknown>>
}>()

//
// Default property values
//
const sdn: Record<string, any> = {
  role: "dialog",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
    "data-seldon-ref": "componentsPaletteTopBar",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jm7o",
  },
  textLabel: {
    children: "Components",
    className: "sdn-text-label sdn-text-label--v0o5",
    "data-seldon-ref": "componentsPaletteTitle",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
    "data-seldon-ref": "componentsPaletteClose",
  },
  icon: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--p4qj",
    "data-seldon-ref": "componentsPaletteContents",
  },
  listStandardCatalog: {
    className: "sdn-list-standard-catalog sdn-list-standard-catalog--qf1j",
    "data-seldon-ref": "componentsCatalogList",
  },
  textSubtitle: {
    children: "Component Level",
    className: "sdn-text-subtitle sdn-text-subtitle--ksct",
    "data-seldon-ref": "componentsCatalogLevel",
  },
  container: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-container sdn-container--x52o",
  },
  itemCatalog: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
    "data-seldon-ref": "componentsCatalogItem",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--mene",
    "data-seldon-ref": "componentsCatalogImage",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  text: {
    children: "Body",
    className: "sdn-text sdn-text-title--ulqm",
    "data-seldon-ref": "componentsCatalogMetadata",
  },
  textTitle: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--r34s",
    "data-seldon-ref": "componentsCatalogName",
  },
  textSubtitle2: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--wcp5",
    "data-seldon-ref": "componentsCatalogVariant",
  },
  itemCatalog2: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon3: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--mene",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle2: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--noun",
  },
  textSubtitle3: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  itemCatalog3: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon4: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--mene",
  },
  frame6: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle3: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--noun",
  },
  textSubtitle4: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  itemCatalog4: {
    className: "sdn-item-catalog sdn-item-catalog--ieif",
  },
  icon5: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--mene",
  },
  frame7: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nhfs",
  },
  textTitle4: {
    children: "Product Name",
    className: "sdn-text-title sdn-text-title--noun",
  },
  textSubtitle5: {
    children: "Details",
    className: "sdn-text-subtitle sdn-text-subtitle--r4ot",
  },
  frame8: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rc9x",
    "data-seldon-ref": "componentsPaletteBottomBar",
  },
  barFilter: {
    className: "sdn-bar-filter sdn-bar-filter--hiy2",
    "data-seldon-ref": "componentsPaletteFilter",
  },
  comboboxField: {
    className: "sdn-combobox-field sdn-combobox-field--f36v",
  },
  icon6: {
    icon: "material-filterList",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Filter...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--krby",
    "data-seldon-ref": "componentsPaletteFilterInput",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--csub",
    "data-seldon-ref": "componentsPaletteFilterClear",
  },
  icon7: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
  },
  frame9: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jm7o",
  },
}

const rootClassName = computed(() => combineClassNames("sdn-panel-palette", props.className))
const rootAttrs = { role: sdn["role"], "aria-hidden": sdn["aria-hidden"] }
const frameProps = computed(() => mergeSlot(sdn.frame, props.frame, props.seldonRefs))
const frame2Props = computed(() => mergeSlot(sdn.frame2, props.frame2, props.seldonRefs))
const textLabelProps = computed(() =>
  mergeOptionalSlot(sdn.textLabel, props.textLabel, props.seldonRefs),
)
const buttonIconicProps = computed(() =>
  mergeOptionalSlot(sdn.buttonIconic, props.buttonIconic, props.seldonRefs),
)
const iconProps = computed(() => mergeSlot(sdn.icon, props.icon, props.seldonRefs))
const frame3Props = computed(() => mergeSlot(sdn.frame3, props.frame3, props.seldonRefs))
const listStandardCatalogProps = computed(() =>
  mergeOptionalSlot(sdn.listStandardCatalog, props.listStandardCatalog, props.seldonRefs),
)
const textSubtitleProps = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle, props.textSubtitle, props.seldonRefs),
)
const containerProps = computed(() => mergeSlot(sdn.container, props.container, props.seldonRefs))
const itemCatalogProps = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog, props.itemCatalog, props.seldonRefs),
)
const icon2Props = computed(() => mergeOptionalSlot(sdn.icon2, props.icon2, props.seldonRefs))
const frame4Props = computed(() => mergeSlot(sdn.frame4, props.frame4, props.seldonRefs))
const textProps = computed(() => mergeOptionalSlot(sdn.text, props.text, props.seldonRefs))
const textTitleProps = computed(() =>
  mergeOptionalSlot(sdn.textTitle, props.textTitle, props.seldonRefs),
)
const textSubtitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle2, props.textSubtitle2, props.seldonRefs),
)
const itemCatalog2Props = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog2, props.itemCatalog2, props.seldonRefs),
)
const icon3Props = computed(() => mergeOptionalSlot(sdn.icon3, props.icon3, props.seldonRefs))
const frame5Props = computed(() => mergeSlot(sdn.frame5, props.frame5, props.seldonRefs))
const textTitle2Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle2, props.textTitle2, props.seldonRefs),
)
const textSubtitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle3, props.textSubtitle3, props.seldonRefs),
)
const itemCatalog3Props = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog3, props.itemCatalog3, props.seldonRefs),
)
const icon4Props = computed(() => mergeOptionalSlot(sdn.icon4, props.icon4, props.seldonRefs))
const frame6Props = computed(() => mergeSlot(sdn.frame6, props.frame6, props.seldonRefs))
const textTitle3Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle3, props.textTitle3, props.seldonRefs),
)
const textSubtitle4Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle4, props.textSubtitle4, props.seldonRefs),
)
const itemCatalog4Props = computed(() =>
  mergeOptionalSlot(sdn.itemCatalog4, props.itemCatalog4, props.seldonRefs),
)
const icon5Props = computed(() => mergeOptionalSlot(sdn.icon5, props.icon5, props.seldonRefs))
const frame7Props = computed(() => mergeSlot(sdn.frame7, props.frame7, props.seldonRefs))
const textTitle4Props = computed(() =>
  mergeOptionalSlot(sdn.textTitle4, props.textTitle4, props.seldonRefs),
)
const textSubtitle5Props = computed(() =>
  mergeOptionalSlot(sdn.textSubtitle5, props.textSubtitle5, props.seldonRefs),
)
const frame8Props = computed(() => mergeSlot(sdn.frame8, props.frame8, props.seldonRefs))
const barFilterProps = computed(() =>
  mergeOptionalSlot(sdn.barFilter, props.barFilter, props.seldonRefs),
)
const comboboxFieldProps = computed(() =>
  mergeOptionalSlot(sdn.comboboxField, props.comboboxField, props.seldonRefs),
)
const icon6Props = computed(() => mergeSlot(sdn.icon6, props.icon6, props.seldonRefs))
const inputProps = computed(() => mergeSlot(sdn.input, props.input, props.seldonRefs))
const buttonIconic2Props = computed(() =>
  mergeSlot(sdn.buttonIconic2, props.buttonIconic2, props.seldonRefs),
)
const icon7Props = computed(() => mergeSlot(sdn.icon7, props.icon7, props.seldonRefs))
const frame9Props = computed(() => mergeSlot(sdn.frame9, props.frame9, props.seldonRefs))
</script>

<template>
  <div :class="rootClassName" v-bind="rootAttrs" data-seldon-ref="componentsPalette">
    <slot>
      <Frame v-bind="frameProps">
        <slot name="componentsPaletteTopBar">
          <Frame v-bind="frame2Props" v-if="frame2Props !== null">
            <TextLabel v-if="textLabelProps !== null" v-bind="textLabelProps" />
          </Frame>
          <ButtonIconic
            v-if="buttonIconicProps !== null"
            v-bind="buttonIconicProps"
            :icon="iconProps"
          />
        </slot>
      </Frame>
      <Frame v-bind="frame3Props" v-if="frame3Props !== null">
        <slot name="componentsPaletteContents">
          <ListStandardCatalog
            v-if="listStandardCatalogProps !== null"
            v-bind="listStandardCatalogProps"
          >
            <TextSubtitle v-if="textSubtitleProps !== null" v-bind="textSubtitleProps" />
            <Frame v-bind="containerProps" v-if="containerProps !== null">
              <ItemCatalog v-if="itemCatalogProps !== null" v-bind="itemCatalogProps">
                <Icon v-if="icon2Props !== null" v-bind="icon2Props" />
                <Frame v-bind="frame4Props" v-if="frame4Props !== null">
                  <Text v-if="textProps !== null" v-bind="textProps" />
                  <TextTitle v-if="textTitleProps !== null" v-bind="textTitleProps" />
                  <TextSubtitle v-if="textSubtitle2Props !== null" v-bind="textSubtitle2Props" />
                </Frame>
              </ItemCatalog>
              <ItemCatalog v-if="itemCatalog2Props !== null" v-bind="itemCatalog2Props">
                <Icon v-if="icon3Props !== null" v-bind="icon3Props" />
                <Frame v-bind="frame5Props" v-if="frame5Props !== null">
                  <TextTitle v-if="textTitle2Props !== null" v-bind="textTitle2Props" />
                  <TextSubtitle v-if="textSubtitle3Props !== null" v-bind="textSubtitle3Props" />
                </Frame>
              </ItemCatalog>
              <ItemCatalog v-if="itemCatalog3Props !== null" v-bind="itemCatalog3Props">
                <Icon v-if="icon4Props !== null" v-bind="icon4Props" />
                <Frame v-bind="frame6Props" v-if="frame6Props !== null">
                  <TextTitle v-if="textTitle3Props !== null" v-bind="textTitle3Props" />
                  <TextSubtitle v-if="textSubtitle4Props !== null" v-bind="textSubtitle4Props" />
                </Frame>
              </ItemCatalog>
              <ItemCatalog v-if="itemCatalog4Props !== null" v-bind="itemCatalog4Props">
                <Icon v-if="icon5Props !== null" v-bind="icon5Props" />
                <Frame v-bind="frame7Props" v-if="frame7Props !== null">
                  <TextTitle v-if="textTitle4Props !== null" v-bind="textTitle4Props" />
                  <TextSubtitle v-if="textSubtitle5Props !== null" v-bind="textSubtitle5Props" />
                </Frame>
              </ItemCatalog>
            </Frame>
          </ListStandardCatalog>
        </slot>
      </Frame>
      <Frame v-bind="frame8Props" v-if="frame8Props !== null">
        <slot name="componentsPaletteBottomBar">
          <BarFilter v-if="barFilterProps !== null" v-bind="barFilterProps">
            <ComboboxField
              v-if="comboboxFieldProps !== null"
              v-bind="comboboxFieldProps"
              :icon="icon6Props"
              :input="inputProps"
              :buttonIconic="buttonIconic2Props"
              :icon2="icon7Props"
            />
          </BarFilter>
          <Frame v-bind="frame9Props" v-if="frame9Props !== null"> </Frame>
        </slot>
      </Frame>
    </slot>
  </div>
</template>
