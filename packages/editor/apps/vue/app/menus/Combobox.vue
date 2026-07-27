<script setup lang="ts">
import FloatingMenu from "@app/menus/FloatingMenu.vue"
import { useMenu } from "@app/menus/use-menu"
import { computed, nextTick, ref } from "vue"

type Option = { label: string; value: unknown }

const props = withDefaults(
  defineProps<{
    modelValue: unknown
    options: Option[]
    placeholder?: string
  }>(),
  { placeholder: "—" },
)

const emit = defineEmits<{ (event: "select", value: unknown): void }>()

const menu = useMenu()
const trigger = ref<HTMLButtonElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const query = ref("")
const activeIndex = ref(0)

const selectedOption = computed(() =>
  props.options.find((option) => sameValue(option.value, props.modelValue)),
)

const displayLabel = computed(
  () => selectedOption.value?.label ?? props.placeholder,
)

const filteredOptions = computed(() => {
  const term = query.value.trim().toLowerCase()
  if (!term) return props.options
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(term),
  )
})

function sameValue(a: unknown, b: unknown): boolean {
  return a === b || String(a) === String(b)
}

function open(): void {
  menu.show(trigger.value)
  query.value = ""
  const selectedIndex = props.options.findIndex((option) =>
    sameValue(option.value, props.modelValue),
  )
  activeIndex.value = selectedIndex >= 0 ? selectedIndex : 0
  void nextTick(() => searchInput.value?.focus())
}

function toggle(): void {
  if (menu.open.value) menu.hide()
  else open()
}

function choose(option: Option): void {
  emit("select", option.value)
  menu.hide()
}

function onSearchKeydown(event: KeyboardEvent): void {
  const options = filteredOptions.value
  if (event.key === "ArrowDown") {
    event.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, options.length - 1)
    return
  }
  if (event.key === "ArrowUp") {
    event.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, 0)
    return
  }
  if (event.key === "Enter") {
    event.preventDefault()
    const option = options[activeIndex.value]
    if (option) choose(option)
    return
  }
  if (event.key === "Escape") {
    event.preventDefault()
    menu.hide()
  }
}
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="combobox__trigger"
    @click="toggle"
  >
    <span class="combobox__value">{{ displayLabel }}</span>
    <span class="combobox__chevron">▾</span>
  </button>

  <FloatingMenu
    :open="menu.open.value"
    :anchor="menu.anchor.value"
    @close="menu.hide()"
  >
    <input
      ref="searchInput"
      v-model="query"
      class="combobox__search"
      type="text"
      placeholder="Search…"
      @keydown="onSearchKeydown"
    />
    <div class="combobox__list">
      <p v-if="filteredOptions.length === 0" class="combobox__empty">
        No matches
      </p>
      <button
        v-for="(option, index) in filteredOptions"
        :key="index"
        type="button"
        class="combobox__option"
        :class="{
          'combobox__option--active': index === activeIndex,
          'combobox__option--selected': sameValue(option.value, modelValue),
        }"
        @mouseenter="activeIndex = index"
        @click="choose(option)"
      >
        {{ option.label }}
      </button>
    </div>
  </FloatingMenu>
</template>

<style scoped>
.combobox__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  width: 100%;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fafafa;
  font-size: 0.8rem;
  cursor: pointer;
  text-align: left;
}
.combobox__trigger:hover {
  border-color: #52525b;
}
.combobox__value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.combobox__chevron {
  color: #71717a;
  font-size: 0.7rem;
}
.combobox__search {
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
.combobox__search:focus {
  border-color: #6366f1;
}
.combobox__list {
  max-height: 260px;
  overflow: auto;
  min-width: 180px;
}
.combobox__empty {
  color: #71717a;
  font-size: 0.78rem;
  padding: 6px 8px;
  margin: 0;
}
.combobox__option {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  color: #e4e4e7;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
}
.combobox__option--active {
  background: #3f3f46;
}
.combobox__option--selected {
  color: #a5b4fc;
}
.combobox__option--active.combobox__option--selected {
  background: #3730a3;
  color: #fff;
}
</style>
