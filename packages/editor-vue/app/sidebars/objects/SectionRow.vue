<script setup lang="ts">
import { computed, ref } from "vue"
import ItemSection from "@seldon/components/elements/ItemSection.vue"

const props = defineProps<{ label: string; canAdd?: boolean }>()
const emit = defineEmits<{ (event: "add"): void }>()

const expanded = ref(true)

function toggle(): void {
  expanded.value = !expanded.value
}

const toggleButton = computed(() => ({ onClick: toggle }))
const labelProps = computed(() => ({ children: props.label }))
const addButton = computed(() =>
  props.canAdd ? { onClick: () => emit("add") } : null,
)
</script>

<template>
  <ItemSection
    class="objects-section"
    :button-iconic="toggleButton"
    :form-control-combobox="{}"
    :text-label="labelProps"
    :button-iconic2="addButton"
    :button-iconic3="null"
  />
  <template v-if="expanded">
    <slot />
  </template>
</template>
