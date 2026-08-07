<script setup lang="ts">
import { computed } from "vue"

import FontFamilyRow from "./FontFamilyRow.vue"
import ResourceEntry from "./ResourceEntry.vue"
import { getFontCollectionFamilyRows } from "./font-collection-family-rows"

import type { ResourceRowConfig } from "./helpers/resource-row-config"
import type { Workspace } from "@seldon/core/workspace/types"

const props = withDefaults(
  defineProps<{
    workspace: Workspace
    config: ResourceRowConfig
    entryId: string
    boardKey: string
    parentIsSelected?: boolean
  }>(),
  { parentIsSelected: false },
)

const families = computed(() => getFontCollectionFamilyRows(props.workspace, props.entryId))
</script>

<template>
  <ResourceEntry
    :workspace="workspace"
    :config="config"
    :entry-id="entryId"
    :parent-is-selected="parentIsSelected"
  />
  <FontFamilyRow
    v-for="family in families"
    :key="family.slot"
    :board-key="boardKey"
    :entry-id="entryId"
    :family="family"
    :depth="1"
  />
</template>
