<script setup lang="ts">
import { catalog } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import {
  authoredBoardKeyFromName,
  authoredExportNameFromName,
} from "@seldon/core/workspace/helpers/components/authored-board-key"
import type { EntryNodeLevel } from "@seldon/core/workspace/model/entry-node"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { usePanelStore } from "@app/editor/panel-store"
import { useWorkspace } from "@app/workspace/use-workspace"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"

type AuthoredRootKind = "container" | "frame"

const AUTHORED_LEVEL_OPTIONS: ReadonlyArray<{
  value: EntryNodeLevel
  label: string
}> = [
  { value: "element", label: "Element" },
  { value: "part", label: "Part" },
  { value: "module", label: "Module" },
  { value: "screen", label: "Screen" },
]

const CATALOG_COMPONENT_NAMES = new Set<string>(
  Object.values(catalog)
    .flat()
    .map((schema) => schema.name),
)

const panel = usePanelStore()
const { activePanel } = storeToRefs(panel)
const { workspace } = useWorkspace()
const { addAuthoredComponent } = useAddRemoveCommands()

const isOpen = computed(() => activePanel.value === "create-component")

const name = ref("")
const rootKind = ref<AuthoredRootKind>("frame")
const level = ref<EntryNodeLevel>("element")
const intent = ref("")
const tags = ref("")

const nameInput = ref<HTMLInputElement | null>(null)

const trimmedName = computed(() => name.value.trim())
const boardKey = computed(() =>
  trimmedName.value ? authoredBoardKeyFromName(trimmedName.value) : "",
)
const exportName = computed(() =>
  trimmedName.value ? authoredExportNameFromName(trimmedName.value) : "",
)

const nameError = computed<string | null>(() => {
  if (!trimmedName.value) return null
  if (!boardKey.value) return "Name must contain a letter or number."
  if (workspace.value.boards[boardKey.value] !== undefined) {
    return "A component with this name already exists in this workspace."
  }
  if (isComponentId(boardKey.value)) {
    return `Name collides with the catalog component "${boardKey.value}".`
  }
  if (CATALOG_COMPONENT_NAMES.has(exportName.value)) {
    return `Name collides with the catalog component "${exportName.value}".`
  }
  return null
})

const canSubmit = computed(
  () => trimmedName.value.length > 0 && boardKey.value.length > 0 && !nameError.value,
)

function reset(): void {
  name.value = ""
  rootKind.value = "frame"
  level.value = "element"
  intent.value = ""
  tags.value = ""
}

function close(): void {
  reset()
  panel.closePanel()
}

function save(): void {
  if (!canSubmit.value) return
  const parsedTags = tags.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
  const trimmedIntent = intent.value.trim()
  addAuthoredComponent({
    name: trimmedName.value,
    rootKind: rootKind.value,
    level: level.value,
    intent: trimmedIntent || undefined,
    tags: parsedTags.length > 0 ? parsedTags : undefined,
  })
  close()
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") close()
}

watch(isOpen, (open) => {
  if (open) requestAnimationFrame(() => nameInput.value?.focus())
})
</script>

<template>
  <div v-if="isOpen" class="dialog-overlay" @click="close" @keydown="onKeydown">
    <div class="dialog" role="dialog" aria-modal="true" @click.stop>
      <header class="dialog__header">
        <span class="dialog__title">Create component</span>
        <button type="button" class="dialog__close" @click="close">×</button>
      </header>

      <div class="dialog__body">
        <label class="field">
          <span class="field__label">Name</span>
          <input
            ref="nameInput"
            v-model="name"
            class="field__input"
            :aria-invalid="Boolean(nameError)"
            @keydown="onKeydown"
          />
          <span v-if="nameError" class="field__error">{{ nameError }}</span>
        </label>

        <div class="field">
          <span class="field__label">Root</span>
          <div class="field__radios">
            <label class="radio">
              <input type="radio" value="frame" v-model="rootKind" />
              <span>Frame</span>
            </label>
            <label class="radio">
              <input type="radio" value="container" v-model="rootKind" />
              <span>Container</span>
            </label>
          </div>
        </div>

        <label class="field">
          <span class="field__label">Level</span>
          <select v-model="level" class="field__input">
            <option
              v-for="option in AUTHORED_LEVEL_OPTIONS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </label>

        <label class="field">
          <span class="field__label">Intent (optional)</span>
          <input v-model="intent" class="field__input" @keydown="onKeydown" />
        </label>

        <label class="field">
          <span class="field__label">Tags (comma separated, optional)</span>
          <input v-model="tags" class="field__input" @keydown="onKeydown" />
        </label>
      </div>

      <footer class="dialog__footer">
        <button type="button" class="btn" @click="close">Cancel</button>
        <button
          type="button"
          class="btn btn--primary"
          :disabled="!canSubmit"
          @click="save"
        >
          Create component
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  z-index: 100;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.dialog {
  width: 440px;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}
.dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #27272a;
}
.dialog__title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fafafa;
}
.dialog__close {
  border: none;
  background: transparent;
  color: #a1a1aa;
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}
.dialog__body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.field__label {
  font-size: 0.72rem;
  color: #a1a1aa;
}
.field__input {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fafafa;
  font-size: 0.82rem;
}
.field__input:focus {
  outline: none;
  border-color: #6366f1;
}
.field__input[aria-invalid="true"] {
  border-color: #ef4444;
}
.field__error {
  font-size: 0.72rem;
  color: #f87171;
}
.field__radios {
  display: flex;
  gap: 1rem;
}
.radio {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #e4e4e7;
}
.dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #27272a;
}
.btn {
  background: #27272a;
  border: 1px solid #3f3f46;
  color: #d4d4d8;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.8rem;
  cursor: pointer;
}
.btn--primary {
  background: #4338ca;
  border-color: #6366f1;
  color: #fff;
}
.btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
