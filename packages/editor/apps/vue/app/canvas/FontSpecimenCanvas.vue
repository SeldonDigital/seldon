<script setup lang="ts">
import { getCssFromProperties, getNodeProperties } from "@app/core"
import { useSelectionStore } from "@app/workspace/selection-store"
import Specimen from "@seldon/components/modules/Specimen.vue"
import { resolveSpecimenThemeLooks } from "@seldon/editor/lib/font-collections/resolve-specimen-theme-looks"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { getEnabledVariants } from "@seldon/core/font-collections"
import { fontVariantDisplayLabel } from "@seldon/core/helpers/utils/font-variant"
import { isFontCollectionBoard } from "@seldon/core/workspace/model/components"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services/font-collection/font-collection.service"
import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

import { formatFontFamilyKey } from "../sidebars/objects/font-collection-family-rows"

import type { Board } from "@seldon/core"
import type { FontFamilyEntry } from "@seldon/core/font-collections/types"
import type { Workspace } from "@seldon/core/workspace/types"

// Every Specimen text slot is opt-in, so each must be enabled with an empty
// object to render its default sample content.
const SPECIMEN_TEXT_SLOTS: Record<string, Record<string, unknown>> = {
  textLabel: {},
  textLabel2: {},
  textDescription: {},
  textDescription2: {},
  textDescription3: {},
  textDescription4: {},
  textLabel3: {},
  textLabel4: {},
  textDescription5: {},
  textLabel5: {},
  textLabel6: {},
  textLabel7: {},
  textLabel8: {},
  textLabel9: {},
  textTagline: {},
  textLabel10: {},
  textLabel11: {},
  textCallout: {},
  textLabel12: {},
  textLabel13: {},
  textSubtitle: {},
  textLabel14: {},
  textLabel15: {},
  textTitle: {},
  textLabel16: {},
  textLabel17: {},
  textSubheading: {},
  textLabel18: {},
  textLabel19: {},
  textHeading: {},
  textLabel20: {},
  textLabel21: {},
  textDisplay: {},
}

interface FontSpecimen {
  entryId: string
  slot: string
  family: FontFamilyEntry
  weightsLabel: string
}

const props = defineProps<{ workspace: Workspace; board: Board }>()

const selection = useSelectionStore()
const { selectedResourceItemKey } = storeToRefs(selection)

const boardKey = computed(() => getComponentKey(props.board))
const boardClassName = computed(() => `board-${boardKey.value}`)

const boardProperties = computed(() => getNodeProperties(props.board, props.workspace))

const boardTheme = computed(() =>
  workspaceThemeService.getObjectTheme(props.board, props.workspace),
)

const boardCss = computed(() => {
  if (!boardProperties.value || !boardTheme.value) return ""

  return getCssFromProperties(
    boardProperties.value,
    {
      theme: boardTheme.value,
      properties: boardProperties.value,
      parentContext: null,
    },
    boardClassName.value,
  )
})

const specimens = computed<FontSpecimen[]>(() => {
  const board = props.board

  if (!isFontCollectionBoard(board)) return []

  return board.variants.flatMap((variant) => {
    const collection = workspaceFontCollectionService.getFontCollection(variant.id, props.workspace)

    if (!collection) return []

    const selectionMap = workspaceFontCollectionService.getVariantSelection(
      variant.id,
      props.workspace,
    )

    return Object.entries(collection.families).flatMap(([slot, family]) => {
      const variants = family.variants ?? []

      if (variants.length === 0) {
        return [{ entryId: variant.id, slot, family, weightsLabel: "" }]
      }

      const enabled = getEnabledVariants(selectionMap[slot], variants)

      if (enabled.length === 0) return []

      return [
        {
          entryId: variant.id,
          slot,
          family,
          weightsLabel: enabled.map(fontVariantDisplayLabel).join(", "),
        },
      ]
    })
  })
})

const keyed = computed(() =>
  specimens.value.map((specimen) => ({
    specimen,
    key: formatFontFamilyKey(boardKey.value, specimen.entryId, specimen.slot),
  })),
)

const matched = computed(() =>
  keyed.value.find((entry) => entry.key === selectedResourceItemKey.value),
)
const active = computed(() => matched.value ?? keyed.value[0])

const fontValue = computed(() => {
  const family = active.value?.specimen.family

  return family ? (family.stack ?? family.name) : ""
})

const scopeClass = computed(() =>
  `font-specimen-${boardKey.value}`.replace(/[^a-zA-Z0-9_-]/g, "-"),
)

// The board's theme owns the look: resolve each level's style, size, weight, and
// line height, plus the `*Spec` label strings, from the board's theme.
const themeLooks = computed(() =>
  resolveSpecimenThemeLooks(boardTheme.value, scopeClass.value),
)

const scopedCss = computed(
  () => `.${scopeClass.value} [data-seldon-ref$="Preview"],
.${scopeClass.value} [data-seldon-ref="typeSpecimenName"],
.${scopeClass.value} [data-seldon-ref="typeSpecimenUppercase"],
.${scopeClass.value} [data-seldon-ref="typeSpecimenLowercase"],
.${scopeClass.value} [data-seldon-ref="typeSpecimenNumbers"] {
  font-family: ${fontValue.value} !important;
}
${themeLooks.value.previewCss}`,
)

const seldonRefs = computed(() => {
  const specimen = active.value?.specimen

  if (!specimen) return {}

  const refs: Record<string, Record<string, unknown>> = {
    typeSpecimenName: { children: specimen.family.name },
  }

  if (specimen.weightsLabel) {
    refs.typeSpecimenFamilySizes = { children: specimen.weightsLabel }
  }

  for (const [ref, value] of Object.entries(themeLooks.value.specs)) {
    refs[ref] = { children: value }
  }

  return refs
})
</script>

<template>
  <section v-if="active" class="canvas-board font-specimen-canvas">
    <Teleport to="head">
      <component :is="'style'">{{ boardCss }}</component>
    </Teleport>
    <Teleport to="head">
      <component :is="'style'">{{ scopedCss }}</component>
    </Teleport>
    <div
      class="font-specimen-board"
      :class="boardClassName"
      :data-board-id="boardKey"
      :data-selection-id="boardKey"
      data-selection-kind="board"
    >
      <div :class="scopeClass">
        <Specimen v-bind="SPECIMEN_TEXT_SLOTS" :seldon-refs="seldonRefs" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Canvas layout only. Background, border, and corners come from the board's own
   component properties through `boardCss`, matching the theme board chrome. */
.font-specimen-board {
  padding: 2rem;
}
</style>
