<script setup lang="ts">
import { getCssFromProperties, getNodeProperties } from "@app/core"
import { useSelectionStore } from "@app/workspace/selection-store"
import Specimen from "@seldon/components/modules/Specimen.vue"
import SpecimenSample from "@seldon/components/parts/SpecimenSample.vue"
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

// Every text slot is opt-in, so each must be enabled with an empty object to
// render its default sample content. `SpecimenSample` is the family header (name
// + weights + glyph block); `Specimen` is the per-level ramp.
const SPECIMEN_SAMPLE_SLOTS: Record<string, Record<string, unknown>> = {
  textLabel: {},
  textLabel2: {},
  textDescription: {},
  textDescription2: {},
  textDescription3: {},
  textDescription4: {},
}

const SPECIMEN_LEVEL_SLOTS: Record<string, Record<string, unknown>> = {
  textLabel: {},
  textLabel2: {},
  textDescription: {},
  textLabel3: {},
  textLabel4: {},
  textLabel5: {},
  textLabel6: {},
  textLabel7: {},
  textTagline: {},
  textLabel8: {},
  textLabel9: {},
  textCallout: {},
  textLabel10: {},
  textLabel11: {},
  textSubtitle: {},
  textLabel12: {},
  textLabel13: {},
  textTitle: {},
  textLabel14: {},
  textLabel15: {},
  textSubheading: {},
  textLabel16: {},
  textLabel17: {},
  textHeading: {},
  textLabel18: {},
  textLabel19: {},
  textDisplay: {},
}

interface FontSpecimen {
  entryId: string
  slot: string
  family: FontFamilyEntry
  weightsLabel: string
  included: boolean
}

// Platform font for an excluded (not installed) family, matching the app body
// fallback so the preview reads in whatever the OS provides.
const SYSTEM_FONT_STACK = "system-ui, sans-serif"

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

    return Object.entries(collection.families).flatMap(([slot, family]): FontSpecimen[] => {
      const variants = family.variants ?? []

      if (variants.length === 0) {
        return [{ entryId: variant.id, slot, family, weightsLabel: "", included: true }]
      }

      const enabled = getEnabledVariants(selectionMap[slot], variants)

      // An excluded family (no enabled weights) still produces a specimen so
      // selecting it previews the design, but it is flagged not included.
      if (enabled.length === 0) {
        return [{ entryId: variant.id, slot, family, weightsLabel: "", included: false }]
      }

      return [
        {
          entryId: variant.id,
          slot,
          family,
          weightsLabel: enabled.map(fontVariantDisplayLabel).join(", "),
          included: true,
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
const includedEntries = computed(() =>
  keyed.value.filter((entry) => entry.specimen.included),
)

// A selected family shows only its own specimen. With the board selected (no
// family), stack every included family. Fall back to all entries when none is
// included, so the board never renders empty.
const activeList = computed(() => {
  if (matched.value) return [matched.value]

  return includedEntries.value.length > 0 ? includedEntries.value : keyed.value
})

// No family selection means the board itself is in view: stack a compact preview
// per family. A family selection shows that one specimen in full.
const isStacked = computed(() => !matched.value)

const scopeClass = computed(() =>
  `font-specimen-${boardKey.value}`.replace(/[^a-zA-Z0-9_-]/g, "-"),
)

function slotClassFor(slot: string): string {
  return `${scopeClass.value}-${slot}`.replace(/[^a-zA-Z0-9_-]/g, "-")
}

// The board's theme owns the look: resolve each level's style, size, weight, and
// line height, plus the `*Spec` label strings, from the board's theme.
const themeLooks = computed(() =>
  resolveSpecimenThemeLooks(boardTheme.value, scopeClass.value),
)

// The family header (name + weights). Selecting an excluded family states it is
// not installed in the negative color, matching the platform-font preview.
function buildSampleRefs(specimen: FontSpecimen): Record<string, Record<string, unknown>> {
  const refs: Record<string, Record<string, unknown>> = {
    typeSpecimenName: { children: specimen.family.name },
  }

  if (!specimen.included) {
    refs.typeSpecimenFamilyWeights = {
      children: "Not Included",
      style: { color: "var(--sdn-swatch-negative)", opacity: 1 },
    }
  } else if (specimen.weightsLabel) {
    refs.typeSpecimenFamilyWeights = { children: specimen.weightsLabel }
  }

  return refs
}

// The per-level ramp reads its style, size, weight, and line height from the
// board theme, and each level's `*Spec` label states those resolved values.
const levelRefs = computed(() => {
  const refs: Record<string, Record<string, unknown>> = {}

  for (const [ref, value] of Object.entries(themeLooks.value.specs)) {
    refs[ref] = { children: value }
  }

  return refs
})

const renderSpecimens = computed(() =>
  activeList.value.map(({ specimen, key }) => ({
    key,
    slotClass: slotClassFor(specimen.slot),
    sampleRefs: buildSampleRefs(specimen),
  })),
)

const scopedCss = computed(() => {
  const familyCss = activeList.value
    .map(({ specimen }) => {
      const fontValue = specimen.included
        ? (specimen.family.stack ?? specimen.family.name)
        : SYSTEM_FONT_STACK
      const slotClass = slotClassFor(specimen.slot)

      return `.${slotClass} [data-seldon-ref$="Preview"],
.${slotClass} [data-seldon-ref="typeSpecimenName"],
.${slotClass} [data-seldon-ref="typeSpecimenUppercase"],
.${slotClass} [data-seldon-ref="typeSpecimenLowercase"],
.${slotClass} [data-seldon-ref="typeSpecimenNumbers"] {
  font-family: ${fontValue} !important;
}`
    })
    .join("\n")

  // The specimen labels rest at 0.5 opacity, but the `TextLabel` base rule bumps
  // them to 0.8 on hover and active, which brightens them and reads as an
  // interactive affordance on this static specimen. Hold them at their resting
  // 0.5 within the specimen scope so hover and active make no change.
  const suppressHoverCss = `.${scopeClass.value} .sdn-text-label:hover,
.${scopeClass.value} .sdn-text-label:active {
  opacity: 0.5;
}`

  return `${familyCss}\n${suppressHoverCss}\n${themeLooks.value.previewCss}`
})
</script>

<template>
  <section v-if="activeList.length" class="canvas-board font-specimen-canvas">
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
      <div class="font-specimen-stack" :class="scopeClass">
        <div
          v-for="item in renderSpecimens"
          :key="item.key"
          class="font-specimen-family"
          :class="item.slotClass"
        >
          <SpecimenSample v-bind="SPECIMEN_SAMPLE_SLOTS" :seldon-refs="item.sampleRefs" />
          <Specimen v-if="!isStacked" v-bind="SPECIMEN_LEVEL_SLOTS" :seldon-refs="levelRefs" />
        </div>
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

/* Stacked families (board selected) sit in a column with breathing room; a
   single family (selected) shows just its own block. */
.font-specimen-stack {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

/* One family's blocks (the sample header, then the level ramp when selected)
   stack tightly; the hr at the end of the sample carries the visual divide. */
.font-specimen-family {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
