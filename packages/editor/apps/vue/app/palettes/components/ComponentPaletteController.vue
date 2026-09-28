<script setup lang="ts">
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { usePanelStore } from "@app/editor/panel-store"
import FloatingPanel from "@app/windows/FloatingPanel.vue"
import ItemCatalog from "@seldon/components/elements/ItemCatalog.vue"
import PanelPalette from "@seldon/components/modules/PanelPalette.vue"
import BarFilter from "@seldon/components/parts/BarFilter.vue"
import ListStandardCatalog from "@seldon/components/parts/ListStandardCatalog.vue"
import TextSubtitle from "@seldon/components/primitives/TextSubtitle.vue"
import TextTitle from "@seldon/components/primitives/TextTitle.vue"
import { storeToRefs } from "pinia"

import { useCatalogDialog } from "../../dialogs/use-catalog-dialog"

import type { CSSProperties } from "vue"

const INITIAL_HEIGHT = 520
const INITIAL_WIDTH = 420
const styles: Record<string, CSSProperties> = {
  panel: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
  },
  content: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
  },
}

const config = useEditorConfigStore()
const panel = usePanelStore()
const { componentPaletteOpen } = storeToRefs(panel)
const { componentPaletteRect } = storeToRefs(config)
const { categories, query } = useCatalogDialog(
  () => true,
  () => true,
)

function close(): void {
  panel.closeComponentPalette()
}

function onQueryChange(event: Event): void {
  query.value = (event.target as HTMLInputElement).value
}

function clearQuery(): void {
  query.value = ""
}

function startComponentDrag(event: DragEvent, componentId: string, variantId?: string): void {
  const payload = variantId ? { kind: "authored", variantId } : { componentId, kind: "catalog" }

  event.dataTransfer?.setData("application/x-seldon-component", JSON.stringify(payload))
}
</script>

<template>
  <FloatingPanel
    v-if="componentPaletteOpen"
    :initial-width="INITIAL_WIDTH"
    :initial-height="INITIAL_HEIGHT"
    :on-close="close"
    palette-id="component-palette"
    test-id="component-palette"
    :rect="componentPaletteRect"
    :on-rect-change="config.setComponentPaletteRect"
    #default="{ startDrag }"
  >
    <PanelPalette
      :button-iconic="null"
      :button-iconic2="{}"
      :frame3="{ style: styles.content }"
      :style="styles.panel"
      :seldon-refs="{
        paletteTopBar: { onPointerdown: startDrag },
        paletteClose: { onClick: close },
      }"
    >
      <template #frame2>
        <TextTitle>Components</TextTitle>
      </template>
      <template #frame5>
        <BarFilter
          :combobox-field="{}"
          :button-iconic="{}"
          :input="{ value: query, onInput: onQueryChange }"
          :seldon-refs="{ filterFieldClear: { onClick: clearQuery } }"
        />
      </template>
      <template #frame3>
        <ListStandardCatalog v-for="category in categories" :key="category.category">
          <TextSubtitle>{{ category.category }}</TextSubtitle>
          <ItemCatalog
            v-for="item in category.items"
            :key="item.id"
            draggable="true"
            :icon="{}"
            :text-title="{}"
            :text-subtitle="{}"
            :seldon-refs="{
              catalogIcon: { icon: item.icon },
              catalogLabel: { children: item.name },
              catalogVariant: { children: item.description },
            }"
            @dragstart="startComponentDrag($event, item.componentId, item.variantId)"
          />
        </ListStandardCatalog>
      </template>
    </PanelPalette>
  </FloatingPanel>
</template>
