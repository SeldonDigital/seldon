<script setup lang="ts">
import MenuController from "@app/menus/MenuController.vue"
import FramerExpandable from "@app/sidebars/FramerExpandable.vue"
import { useToastStore } from "@app/toaster/toast-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import Frame from "@seldon/components/frames/Frame.vue"
import SidebarProperties from "@seldon/components/modules/SidebarProperties.vue"
import { filterPropertySections } from "@seldon/editor/lib/properties/inspector/filter-property-sections"
import { getIconRowCategory } from "@seldon/editor/lib/properties/inspector/icon-set-properties-data"
import { getPropertiesSubjectId } from "@seldon/editor/lib/properties/inspector/properties-data"
import { computed, ref } from "vue"

import { isThemeCustomTokenSection } from "@seldon/core"

import Category from "./Category.vue"
import CssBlock from "./CssBlock.vue"
import Property from "./Property.vue"
import { buildSectionActions } from "./helpers/build-section-actions"
import { useBoardStateMenu } from "./hooks/use-board-state-menu"
import { useBorderSideVisibilityStore } from "./hooks/use-border-side-visibility"
import { useFilterInput } from "./hooks/use-filter-input"
import { usePropertiesSidebar } from "./hooks/use-properties-sidebar"
import { usePropertyExpansionStore } from "./property-expansion-store"
import { providePropertyEditNavigation } from "./use-property-edit-navigation"

import type { PropertySection } from "./types"
import type { MenuEntry } from "@app/menus/types"
import type { Workspace } from "@seldon/core"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

defineProps<{ workspace?: Workspace }>()

providePropertyEditNavigation()

const state = usePropertiesSidebar()
const filter = useFilterInput()
const stateMenu = useBoardStateMenu()
const dispatch = useDispatch()
const toast = useToastStore()
const borderSides = useBorderSideVisibilityStore()
const expansion = usePropertyExpansionStore()

const tree = computed(() => (state.value.kind === "tree" ? state.value.tree : null))
const isEmpty = computed(() => state.value.kind === "empty")

const filteredSections = computed<PropertySection[]>(() =>
  tree.value ? filterPropertySections(tree.value.sections, filter.query.value) : [],
)

// ---- Header State menu ----
const stateMenuOpen = ref(false)
const stateMenuAnchor = ref<HTMLElement | null>(null)
function openStateMenu(event: MouseEvent): void {
  stateMenuAnchor.value = event.currentTarget as HTMLElement
  stateMenuOpen.value = !stateMenuOpen.value
}
function closeStateMenu(): void {
  stateMenuOpen.value = false
}
const boardStateSlot = computed(() => ({
  onClick: openStateMenu,
  disabled: stateMenu.value.disabled,
  "data-testid": "board-state-trigger",
}))
const boardStateLabelSlot = computed(() => ({ children: stateMenu.value.label }))

// Drive every header slot through its stable workspace ref. The filter field, the
// State trigger, and its label are conditional slots, so they keep a positional
// `{}` enabler to render; their data flows through `seldonRefs`. The tree frame is
// grown only when it holds a tree, so the no-selection shell keeps its own height;
// its sections ride the generated `propertiesTree` slot.
const seldonRefs = computed(() => ({
  propertyFilterField: filter.comboboxField.value,
  propertyFilter: filter.input.value,
  propertyFilterClear: filter.buttonIconic.value ?? {},
  boardState: boardStateSlot.value,
  boardStateLabel: boardStateLabelSlot.value,
  propertiesTree: isEmpty.value
    ? {}
    : {
        style: {
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        },
      },
}))

// ---- Per-section helpers ----
function isCssSection(section: PropertySection): boolean {
  return section.category === "css"
}
function isFamiliesSection(section: PropertySection): boolean {
  return section.category === "families"
}
function isIconCategorySection(section: PropertySection): boolean {
  return (
    Boolean(tree.value?.iconProperties) && getIconRowCategory(`icon.${section.category}`) !== null
  )
}

function rowAllProperties(section: PropertySection): FlatProperty[] {
  const current = tree.value
  if (!current) return []
  if (isFamiliesSection(section) && current.familyProperties) {
    return current.familyProperties
  }
  if (isIconCategorySection(section) && current.iconProperties) {
    return current.iconProperties
  }
  return current.allProperties
}
function rowFontContext(section: PropertySection): FontCollectionEditingContext | null {
  return isFamiliesSection(section) ? (tree.value?.fontCollectionEditingContext ?? null) : null
}
function rowIconContext(section: PropertySection): IconSetEditingContext | null {
  return isIconCategorySection(section) ? (tree.value?.iconSetEditingContext ?? null) : null
}

function sectionActions(section: PropertySection): MenuEntry[] | undefined {
  const current = tree.value
  if (!current) return undefined
  const inEditingContext =
    Boolean(current.themeEditingContext?.isThemeEditing) ||
    Boolean(current.fontCollectionEditingContext?.isFontCollectionEditing) ||
    Boolean(current.iconSetEditingContext?.isIconSetEditing)
  return buildSectionActions({
    section,
    node: current.node,
    workspace: current.workspace,
    cssStrings: current.cssStrings,
    cssSelector: current.cssSelector,
    inEditingContext,
    shownBorderSides: borderSides.revealed(getPropertiesSubjectId(current.node)),
    toggleBorderSide: (subjectId, side) => borderSides.toggle(subjectId, side),
    dispatch: (action) => dispatch(action as never),
    addToast: toast.addToast,
  })
}

function sectionAddCustom(section: PropertySection): (() => void) | undefined {
  const themeCtx = tree.value?.themeEditingContext
  if (!themeCtx?.isThemeEditing || !themeCtx.canAddCustom) return undefined
  if (!isThemeCustomTokenSection(section.category)) return undefined
  const target = section.category
  return () => themeCtx.addCustomToken(target)
}
</script>

<template>
  <SidebarProperties
    class="properties-sidebar"
    data-testid="properties-sidebar"
    :seldon-refs="seldonRefs"
    :combobox-field-filter="{}"
    :button-menu="{}"
    :text-label="{}"
  >
    <template v-if="!isEmpty" #propertiesTree>
      <Frame class="properties-sidebar__scroll">
        <Frame class="properties-sidebar__tree">
          <template v-for="section in filteredSections" :key="section.category">
            <Category
              :section="section"
              :actions="sectionActions(section)"
              :on-add-custom="sectionAddCustom(section)"
            />
            <FramerExpandable :is-expanded="expansion.isCategoryExpanded(section.category)">
              <CssBlock v-if="isCssSection(section)" :css-properties="tree!.cssStrings" />
              <template v-else>
                <Property
                  v-for="property in section.properties"
                  :key="property.key"
                  :property="property"
                  :workspace="tree!.workspace"
                  :node="tree!.node"
                  :theme="tree!.theme"
                  :all-properties="rowAllProperties(section)"
                  :theme-editing-context="tree!.themeEditingContext"
                  :font-collection-editing-context="rowFontContext(section)"
                  :icon-set-editing-context="rowIconContext(section)"
                />
              </template>
            </FramerExpandable>
          </template>
        </Frame>
      </Frame>
    </template>
  </SidebarProperties>

  <MenuController
    :open="stateMenuOpen"
    :anchor="stateMenuAnchor"
    :items="stateMenu.items"
    align="end"
    @close="closeStateMenu"
  />
</template>

<style scoped>
.properties-sidebar {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.properties-sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.properties-sidebar__tree {
  padding: var(--sdn-paddings-tight) 0 var(--sdn-paddings-cozy) 0;
  display: flex;
  flex-direction: column;
  gap: var(--sdn-gaps-tight);
}
</style>
