<script setup lang="ts">
// Shared property tree rendered by both the docked `PropertiesSidebar` and the
// floating `PanelPropertyController`. It groups the current selection's rows into
// category sections and renders each section's header plus its expandable body,
// so both shells frame the exact same tree. Vue port of the React `PropertiesTree`.
import { useToastStore } from "@app/toaster/toast-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import Frame from "@seldon/components/frames/Frame.vue"
import { getIconRowCategory } from "@seldon/editor/lib/properties/inspector/icon-set-properties-data"
import { getPropertiesSubjectId } from "@seldon/editor/lib/properties/inspector/properties-data"

import { isThemeCustomTokenSection } from "@seldon/core"

import Category from "./Category.vue"
import CssBlock from "./CssBlock.vue"
import Property from "./Property.vue"
import FramerExpandable from "@app/sidebars/FramerExpandable.vue"
import { buildSectionActions } from "./helpers/build-section-actions"
import { useBorderSideVisibilityStore } from "./hooks/use-border-side-visibility"
import { usePropertyExpansionStore } from "./property-expansion-store"
import { providePropertyEditNavigation } from "./use-property-edit-navigation"

import type { PropertySection } from "./types"
import type { PropertiesSidebarTree } from "./hooks/use-properties-sidebar"
import type { MenuEntry } from "@app/menus/types"
import type {
  FontCollectionEditingContext,
  IconSetEditingContext,
} from "@seldon/editor/lib/properties/inspector/editing-contexts"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

const props = defineProps<{
  tree: PropertiesSidebarTree
  sections: PropertySection[]
}>()

providePropertyEditNavigation()

const dispatch = useDispatch()
const toast = useToastStore()
const borderSides = useBorderSideVisibilityStore()
const expansion = usePropertyExpansionStore()

function isCssSection(section: PropertySection): boolean {
  return section.category === "css"
}

function isFamiliesSection(section: PropertySection): boolean {
  return section.category === "families"
}

function isIconCategorySection(section: PropertySection): boolean {
  return Boolean(props.tree.iconProperties) && getIconRowCategory(`icon.${section.category}`) !== null
}

function rowAllProperties(section: PropertySection): FlatProperty[] {
  if (isFamiliesSection(section) && props.tree.familyProperties) {
    return props.tree.familyProperties
  }

  if (isIconCategorySection(section) && props.tree.iconProperties) {
    return props.tree.iconProperties
  }

  return props.tree.allProperties
}

function rowFontContext(section: PropertySection): FontCollectionEditingContext | null {
  return isFamiliesSection(section) ? (props.tree.fontCollectionEditingContext ?? null) : null
}

function rowIconContext(section: PropertySection): IconSetEditingContext | null {
  return isIconCategorySection(section) ? (props.tree.iconSetEditingContext ?? null) : null
}

function sectionActions(section: PropertySection): MenuEntry[] | undefined {
  const inEditingContext =
    Boolean(props.tree.themeEditingContext?.isThemeEditing) ||
    Boolean(props.tree.fontCollectionEditingContext?.isFontCollectionEditing) ||
    Boolean(props.tree.iconSetEditingContext?.isIconSetEditing)

  return buildSectionActions({
    section,
    node: props.tree.node,
    workspace: props.tree.workspace,
    cssStrings: props.tree.cssStrings,
    cssSelector: props.tree.cssSelector,
    inEditingContext,
    shownBorderSides: borderSides.revealed(getPropertiesSubjectId(props.tree.node)),
    toggleBorderSide: (subjectId, side) => borderSides.toggle(subjectId, side),
    dispatch: (action) => dispatch(action as never),
    addToast: toast.addToast,
  })
}

function sectionAddCustom(section: PropertySection): (() => void) | undefined {
  const themeCtx = props.tree.themeEditingContext

  if (!themeCtx?.isThemeEditing || !themeCtx.canAddCustom) return undefined
  if (!isThemeCustomTokenSection(section.category)) return undefined
  const target = section.category

  return () => themeCtx.addCustomToken(target)
}
</script>

<template>
  <Frame class="property-tree__scroll">
    <Frame class="property-tree__body">
      <template v-for="section in sections" :key="section.category">
        <Category
          :section="section"
          :actions="sectionActions(section)"
          :on-add-custom="sectionAddCustom(section)"
        />
        <FramerExpandable :is-expanded="expansion.isCategoryExpanded(section.category)">
          <CssBlock v-if="isCssSection(section)" :css-properties="tree.cssStrings" />
          <template v-else>
            <Property
              v-for="property in section.properties"
              :key="property.key"
              :property="property"
              :workspace="tree.workspace"
              :node="tree.node"
              :theme="tree.theme"
              :all-properties="rowAllProperties(section)"
              :theme-editing-context="tree.themeEditingContext"
              :font-collection-editing-context="rowFontContext(section)"
              :icon-set-editing-context="rowIconContext(section)"
            />
          </template>
        </FramerExpandable>
      </template>
    </Frame>
  </Frame>
</template>

<style scoped>
.property-tree__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.property-tree__body {
  padding: var(--sdn-paddings-tight) 0 var(--sdn-paddings-cozy) 0;
  display: flex;
  flex-direction: column;
  gap: var(--sdn-gaps-tight);
}
</style>
