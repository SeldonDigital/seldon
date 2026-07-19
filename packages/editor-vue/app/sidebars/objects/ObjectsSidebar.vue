<script setup lang="ts">
import { Workspace } from "@app/core"
import { usePanelStore, type PanelType } from "@app/editor/panel-store"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useWorkspaceSaveStore } from "@app/persistence/workspace-save-store"
import { getCurrentWorkspace } from "@app/workspace/history-store"
import { useObjectsSections } from "@app/sidebars/use-objects-sections"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import type { BoardSection } from "@seldon/editor/lib/sidebars/get-board-sections"
import { storeToRefs } from "pinia"
import { computed, toRef } from "vue"
import SidebarObjects from "@seldon/components/modules/SidebarObjects.vue"
import ComboboxFieldProject from "@seldon/components/elements/ComboboxFieldProject.vue"
import ButtonToggle from "@seldon/components/elements/ButtonToggle.vue"
import Frame from "@seldon/components/frames/Frame.vue"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import SectionRow from "./SectionRow.vue"
import BoardRow from "./BoardRow.vue"

const props = defineProps<{ workspace: Workspace }>()

const selection = useSelectionStore()
const panel = usePanelStore()
const config = useEditorConfigStore()
const save = useWorkspaceSaveStore()

const { workspaceSelected } = storeToRefs(selection)
const { objectsView } = storeToRefs(config)
const { record } = storeToRefs(save)

const sections = useObjectsSections(toRef(props, "workspace"))

const workspaceName = computed(() => record.value?.name ?? "Workspace")

type ResourceKind = "theme" | "fontCollection" | "iconSet" | "media"

const RESOURCE_KIND_BY_LEVEL: Partial<Record<BoardSection["level"], ResourceKind>> =
  {
    THEME: "theme",
    FONT_COLLECTION: "fontCollection",
    ICON_SET: "iconSet",
    MEDIA: "media",
  }

const ADD_PANEL_BY_LEVEL: Partial<Record<BoardSection["level"], PanelType>> = {
  THEME: "add-theme",
  FONT_COLLECTION: "add-font-collection",
  ICON_SET: "add-icon-set",
}

function resourceKind(level: BoardSection["level"]): ResourceKind | undefined {
  return RESOURCE_KIND_BY_LEVEL[level]
}

function canAdd(level: BoardSection["level"]): boolean {
  return level !== "MEDIA"
}

function addToSection(level: BoardSection["level"]): void {
  const resourcePanel = ADD_PANEL_BY_LEVEL[level]
  panel.openPanel(resourcePanel ?? "add-board")
}

function boardKey(board: unknown): string {
  return getComponentKey(board as never)
}

const componentsActive = computed(() => objectsView.value === "components")
const resourcesActive = computed(() => objectsView.value === "resources")

const projectField = computed(() => ({
  "aria-selected": workspaceSelected.value || undefined,
  onClick: selectWorkspace,
}))
const projectInput = computed(() => ({
  value: workspaceName.value,
  readonly: true,
}))
const projectActions = { onClick: forceSave }
const componentsToggle = computed(() => ({
  class: componentsActive.value ? "sdn-state-activated" : undefined,
  title: "Components",
  onClick: () => (config.objectsView = "components"),
}))
const resourcesToggle = computed(() => ({
  class: resourcesActive.value ? "sdn-state-activated" : undefined,
  title: "Resources",
  onClick: () => (config.objectsView = "resources"),
}))
const componentsIcon = { icon: "seldon-component" }
const resourcesIcon = { icon: "seldon-theme" }

function selectWorkspace(): void {
  selection.selectWorkspace(null)
}

function forceSave(): void {
  void save.saveNow(getCurrentWorkspace())
}
</script>

<template>
  <SidebarObjects class="objects-sidebar">
    <Frame class="objects-sidebar__header">
      <ComboboxFieldProject
        v-bind="projectField"
        :input="projectInput"
        :button-iconic="projectActions"
      />
      <Frame class="objects-sidebar__toggles">
        <ButtonToggle v-bind="componentsToggle" :icon="componentsIcon" />
        <ButtonToggle v-bind="resourcesToggle" :icon="resourcesIcon" />
      </Frame>
    </Frame>

    <Frame class="objects-sidebar__scroll">
      <SectionRow
        v-for="section in sections"
        :key="section.level"
        :label="section.label"
        :can-add="canAdd(section.level)"
        @add="addToSection(section.level)"
      >
        <BoardRow
          v-for="board in section.boards"
          :key="boardKey(board)"
          :workspace="workspace"
          :board="(board as unknown as Record<string, unknown>)"
          :resource-kind="resourceKind(section.level)"
        />
        <ItemNode
          v-if="section.boards.length === 0"
          class="objects-sidebar__empty"
          aria-disabled="true"
          :button-iconic="null"
          :combobox-field="{}"
          :icon2="null"
          :input="{ value: `No ${section.label.toLowerCase()}`, readonly: true }"
          :button-iconic2="null"
          :button-iconic3="null"
        />
      </SectionRow>
    </Frame>
  </SidebarObjects>
</template>

<style scoped>
.objects-sidebar {
  width: 260px;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.objects-sidebar__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
}
.objects-sidebar__toggles {
  display: flex;
  gap: 4px;
}
.objects-sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.objects-sidebar__empty {
  opacity: 0.5;
}
</style>
