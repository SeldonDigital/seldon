<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
import ItemProperty from "@seldon/components/elements/ItemProperty.vue"
import FloatingMenu from "@app/menus/FloatingMenu.vue"
import ColorField from "@app/menus/ColorField.vue"

type ControlKind = "text" | "option" | "readonly" | "link" | "color"
type Option = { label: string; value: string }

const props = defineProps<{
  label: string
  kind: ControlKind
  value: string
  options?: Option[]
  href?: string
  swatch?: string
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
const query = ref("")
const searchInput = ref<HTMLInputElement | null>(null)

const selectedLabel = computed(() => {
  if (props.kind !== "option") return props.value
  const match = props.options?.find((option) => option.value === props.value)
  return match?.label ?? props.value
})

const filteredOptions = computed(() => {
  const term = query.value.trim().toLowerCase()
  const options = props.options ?? []
  if (!term) return options
  return options.filter((option) => option.label.toLowerCase().includes(term))
})

function openMenu(event: Event): void {
  anchor.value = event.currentTarget as HTMLElement
  menuOpen.value = !menuOpen.value
  query.value = ""
  if (menuOpen.value) void nextTick(() => searchInput.value?.focus())
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
    v-if="kind === 'color'"
    class="property-row property-row--color"
    :class="{ 'property-row--facet': isFacet, 'property-row--dimmed': dimmed }"
  >
    <span class="property-row__name" :title="label">{{ label }}</span>
    <ColorField
      class="property-row__color"
      :value="value"
      :swatch="swatch"
      @commit="emit('commit', $event)"
    />
    <button
      v-if="canReset"
      type="button"
      class="property-row__reset"
      title="Reset to default"
      @click="emit('reset')"
    >
      ↺
    </button>
  </ItemProperty>

  <ItemProperty
    v-else
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
    <input
      ref="searchInput"
      v-model="query"
      type="text"
      class="property-row__search"
      placeholder="Search…"
    />
    <p v-if="filteredOptions.length === 0" class="property-row__empty">
      No matches
    </p>
    <button
      v-for="option in filteredOptions"
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
.property-row--color {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 8px;
}
.property-row__name {
  flex: 0 0 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8rem;
  color: #a1a1aa;
}
.property-row__color {
  flex: 1;
  min-width: 0;
}
.property-row__reset {
  flex: 0 0 auto;
  background: transparent;
  border: none;
  color: #a1a1aa;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 2px 4px;
}
.property-row__search {
  width: 100%;
  box-sizing: border-box;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  padding: 5px 8px;
  color: #fafafa;
  font-size: 0.8rem;
  outline: none;
  margin-bottom: 4px;
}
.property-row__search:focus {
  border-color: #6366f1;
}
.property-row__empty {
  color: #71717a;
  font-size: 0.78rem;
  padding: 6px 8px;
  margin: 0;
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
