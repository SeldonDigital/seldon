<script setup lang="ts">
import { computed, ref } from "vue"
import ItemProperty from "@seldon/components/elements/ItemProperty.vue"
import FloatingMenu from "@app/menus/FloatingMenu.vue"

type ControlKind = "text" | "option" | "readonly" | "link"
type Option = { label: string; value: string }

const props = defineProps<{
  label: string
  kind: ControlKind
  value: string
  options?: Option[]
  href?: string
  canReset?: boolean
  isFacet?: boolean
  dimmed?: boolean
}>()

const emit = defineEmits<{
  (event: "commit", raw: string): void
  (event: "reset"): void
}>()

const menuOpen = ref(false)
const anchor = ref<HTMLElement | null>(null)

const selectedLabel = computed(() => {
  if (props.kind !== "option") return props.value
  const match = props.options?.find((option) => option.value === props.value)
  return match?.label ?? props.value
})

function openMenu(event: Event): void {
  anchor.value = event.currentTarget as HTMLElement
  menuOpen.value = !menuOpen.value
}

function choose(option: Option): void {
  menuOpen.value = false
  emit("commit", option.value)
}

function onInput(event: Event): void {
  emit("commit", (event.target as HTMLInputElement).value)
}

const nameProps = computed(() => ({
  value: props.label,
  readonly: true,
  title: props.label,
}))
const valueProps = computed(() => {
  if (props.kind === "text") return { value: props.value, onChange: onInput }
  return { value: selectedLabel.value, readonly: true }
})
const valueMenuButton = computed(() =>
  props.kind === "option" ? { onClick: openMenu } : null,
)
const valueChevron = computed(() =>
  props.kind === "option" ? {} : null,
)
const resetButton = computed(() =>
  props.canReset ? { onClick: () => emit("reset"), title: "Reset to default" } : null,
)
const resetIcon = { icon: "material-replay" }
</script>

<template>
  <ItemProperty
    class="property-row"
    :class="{ 'property-row--facet': isFacet, 'property-row--dimmed': dimmed }"
    :button-iconic="null"
    :input="nameProps"
    :combobox-field="{}"
    :icon2="null"
    :input2="valueProps"
    :button-iconic2="valueMenuButton"
    :icon3="valueChevron"
    :button-iconic3="resetButton"
    :icon4="resetIcon"
  />
  <FloatingMenu :open="menuOpen" :anchor="anchor" @close="menuOpen = false">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      class="property-row__option"
      :class="{ 'property-row__option--active': option.value === value }"
      @click="choose(option)"
    >
      {{ option.label }}
    </button>
  </FloatingMenu>
</template>

<style scoped>
.property-row--facet {
  padding-left: 12px;
}
.property-row--dimmed {
  opacity: 0.55;
}
.property-row__option {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: #e4e4e7;
  padding: 6px 10px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}
.property-row__option:hover {
  background: #3730a3;
  color: #fff;
}
.property-row__option--active {
  color: #a5b4fc;
}
</style>
