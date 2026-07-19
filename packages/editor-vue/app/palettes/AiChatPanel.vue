<script setup lang="ts">
import Combobox from "@app/menus/Combobox.vue"
import { useAiChat } from "@app/ai/use-ai-chat"
import { useAiChatStore } from "@app/stores/ai-chat-store"
import { useDebugStore } from "@app/stores/debug-store"
import { usePanelStore } from "@app/stores/panel-store"
import type { ThinkingLevelOption } from "@seldon/ai"
import { storeToRefs } from "pinia"
import { computed, nextTick, ref, watch } from "vue"

const panel = usePanelStore()
const store = useAiChatStore()
const debug = useDebugStore()
const { send, stop, warm, reset, modelOptions, thinkingOptions } = useAiChat()

const { activePanel } = storeToRefs(panel)
const { turns, status, model, thinkingLevel } = storeToRefs(store)
const { noThink, showTools, showOutcome } = storeToRefs(debug)

const isOpen = computed(() => activePanel.value === "ai-chat")
const isPending = computed(() => status.value === "pending")

const draft = ref("")
const composer = ref<HTMLTextAreaElement | null>(null)
const transcript = ref<HTMLElement | null>(null)

watch(isOpen, (open) => {
  if (!open) return
  void warm()
  void nextTick(() => composer.value?.focus())
})

watch(
  turns,
  () => {
    void nextTick(() => {
      const el = transcript.value
      if (el) el.scrollTop = el.scrollHeight
    })
  },
  { deep: true },
)

function submit(): void {
  if (isPending.value) return
  const value = draft.value.trim()
  if (!value) return
  draft.value = ""
  void send(value)
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    submit()
  }
}

function onReset(): void {
  if (!window.confirm("Clear this chat and start a new session?")) return
  reset()
  draft.value = ""
}

function onModel(value: unknown): void {
  store.setModel(String(value))
}

function onThinking(value: unknown): void {
  store.setThinkingLevel(value as ThinkingLevelOption)
}
</script>

<template>
  <div v-if="isOpen" class="ai-chat">
    <header class="ai-chat__bar">
      <span class="ai-chat__title">Hari</span>
      <div class="ai-chat__bar-actions">
        <button
          type="button"
          class="ai-chat__toggle"
          :class="{ 'ai-chat__toggle--on': noThink }"
          title="Clamp thinking"
          @click="debug.toggleNoThink()"
        >
          Clamp
        </button>
        <button
          type="button"
          class="ai-chat__toggle"
          :class="{ 'ai-chat__toggle--on': showTools }"
          title="Show tools"
          @click="debug.toggleShowTools()"
        >
          Tools
        </button>
        <button
          type="button"
          class="ai-chat__toggle"
          :class="{ 'ai-chat__toggle--on': showOutcome }"
          title="Show outcome"
          @click="debug.toggleShowOutcome()"
        >
          Outcome
        </button>
        <button type="button" class="ai-chat__icon" title="Clear" @click="onReset">
          ⟲
        </button>
        <button
          type="button"
          class="ai-chat__icon"
          title="Close"
          @click="panel.closePanel()"
        >
          ×
        </button>
      </div>
    </header>

    <div ref="transcript" class="ai-chat__transcript">
      <p v-if="turns.length === 0" class="ai-chat__empty">
        Describe what you want to do. Hari edits the workspace for you.
      </p>
      <article v-for="turn in turns" :key="turn.id" class="ai-chat__turn">
        <div class="ai-chat__prompt">{{ turn.prompt }}</div>

        <pre v-if="turn.thinking" class="ai-chat__thinking">{{
          turn.thinking
        }}</pre>

        <ul
          v-if="showTools && turn.toolCalls && turn.toolCalls.length > 0"
          class="ai-chat__tools"
        >
          <li
            v-for="(call, index) in turn.toolCalls"
            :key="index"
            :class="{ 'ai-chat__tool--fail': !call.ok }"
          >
            {{ call.name }}
          </li>
        </ul>

        <div v-if="turn.reply" class="ai-chat__reply">{{ turn.reply }}</div>

        <div
          v-if="showOutcome && turn.outcome"
          class="ai-chat__outcome"
          :class="`ai-chat__outcome--${turn.outcome}`"
        >
          {{ turn.outcome }}
        </div>

        <ul
          v-if="turn.changes && turn.changes.length > 0"
          class="ai-chat__changes"
        >
          <li v-for="(change, index) in turn.changes" :key="index">
            {{ change }}
          </li>
        </ul>

        <p
          v-for="(warning, index) in turn.warnings"
          :key="`w${index}`"
          class="ai-chat__warning"
        >
          {{ warning }}
        </p>

        <p v-if="turn.error" class="ai-chat__error">{{ turn.error }}</p>
      </article>
    </div>

    <div class="ai-chat__selectors">
      <Combobox
        v-if="modelOptions.length > 0"
        :model-value="model"
        :options="modelOptions"
        placeholder="Model"
        @select="onModel"
      />
      <Combobox
        v-if="thinkingOptions.length > 0"
        :model-value="thinkingLevel"
        :options="thinkingOptions"
        placeholder="Thinking"
        @select="onThinking"
      />
    </div>

    <div class="ai-chat__composer">
      <textarea
        ref="composer"
        v-model="draft"
        class="ai-chat__input"
        rows="3"
        placeholder="Describe what you want to do…"
        @keydown="onKeydown"
      />
      <button
        v-if="isPending"
        type="button"
        class="ai-chat__send"
        @click="stop"
      >
        Stop
      </button>
      <button
        v-else
        type="button"
        class="ai-chat__send"
        :disabled="!draft.trim()"
        @click="submit"
      >
        Send
      </button>
    </div>
  </div>
</template>

<style scoped>
.ai-chat {
  position: fixed;
  right: 320px;
  bottom: 16px;
  width: 420px;
  height: 480px;
  display: flex;
  flex-direction: column;
  background: #18181b;
  border: 1px solid #3f3f46;
  border-radius: 10px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  z-index: 1500;
  color: #e4e4e7;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.ai-chat__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #27272a;
}
.ai-chat__title {
  font-weight: 600;
  font-size: 0.85rem;
}
.ai-chat__bar-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}
.ai-chat__toggle {
  border: 1px solid #3f3f46;
  background: #27272a;
  color: #a1a1aa;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  cursor: pointer;
}
.ai-chat__toggle--on {
  background: #3730a3;
  border-color: #6366f1;
  color: #fff;
}
.ai-chat__icon {
  border: none;
  background: transparent;
  color: #a1a1aa;
  font-size: 1rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
}
.ai-chat__transcript {
  flex: 1;
  overflow: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.ai-chat__empty {
  color: #71717a;
  font-size: 0.8rem;
}
.ai-chat__turn {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ai-chat__prompt {
  align-self: flex-end;
  max-width: 85%;
  background: #3730a3;
  color: #fff;
  padding: 6px 10px;
  border-radius: 10px 10px 2px 10px;
  font-size: 0.8rem;
  white-space: pre-wrap;
}
.ai-chat__thinking {
  margin: 0;
  color: #71717a;
  font-size: 0.72rem;
  white-space: pre-wrap;
  max-height: 120px;
  overflow: auto;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}
.ai-chat__tools {
  margin: 0;
  padding-left: 1rem;
  color: #a1a1aa;
  font-size: 0.72rem;
}
.ai-chat__tool--fail {
  color: #f87171;
}
.ai-chat__reply {
  font-size: 0.82rem;
  white-space: pre-wrap;
  line-height: 1.4;
}
.ai-chat__outcome {
  align-self: flex-start;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1px 6px;
  border-radius: 999px;
  border: 1px solid #3f3f46;
  color: #a1a1aa;
}
.ai-chat__outcome--applied {
  color: #4ade80;
  border-color: #166534;
}
.ai-chat__outcome--ineffective,
.ai-chat__outcome--none {
  color: #fbbf24;
  border-color: #78350f;
}
.ai-chat__changes {
  margin: 0;
  padding-left: 1rem;
  font-size: 0.75rem;
  color: #a1a1aa;
}
.ai-chat__warning {
  margin: 0;
  font-size: 0.75rem;
  color: #fbbf24;
}
.ai-chat__error {
  margin: 0;
  font-size: 0.78rem;
  color: #f87171;
}
.ai-chat__selectors {
  display: flex;
  gap: 6px;
  padding: 0 0.75rem;
}
.ai-chat__composer {
  display: flex;
  gap: 6px;
  padding: 0.5rem 0.75rem 0.75rem;
  align-items: flex-end;
}
.ai-chat__input {
  flex: 1;
  resize: none;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  padding: 6px 8px;
  color: #fafafa;
  font-size: 0.8rem;
  font-family: inherit;
}
.ai-chat__input:focus {
  outline: none;
  border-color: #6366f1;
}
.ai-chat__send {
  border: 1px solid #6366f1;
  background: #3730a3;
  color: #fff;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 0.8rem;
  cursor: pointer;
}
.ai-chat__send:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
