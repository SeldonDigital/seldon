<script setup lang="ts">
// View-model for the Hari chat transcript. Each structured turn from the chat
// store maps to the generated Message* blocks: the prompt, the model's reasoning,
// the tools it called, the applied changes, the markdown reply, and any rejection
// or error. Tool activity renders as one collapsible header plus a line per entry,
// so the turn reads as a single "Tools Applied" section. Assistant replies render
// through HariMarkdown. Vue port of the React `HariTranscript`.
//
// Each block's ref map is its own named value, so the bindings scanner resolves
// every ref back to the property it drives.
import { useDebugStore } from "@app/editor/debug-store"
import MessageAssistant from "@seldon/components/elements/MessageAssistant.vue"
import MessageError from "@seldon/components/elements/MessageError.vue"
import MessageOutcome from "@seldon/components/elements/MessageOutcome.vue"
import MessageStatus from "@seldon/components/elements/MessageStatus.vue"
import MessageUser from "@seldon/components/elements/MessageUser.vue"
import { storeToRefs } from "pinia"
import { computed } from "vue"

import { HariMarkdown } from "./HariMarkdown"
import HariThinking from "./HariThinking.vue"
import HariTools from "./HariTools.vue"

import type { ToolUsed } from "./tools-used"
import type { HariTurn } from "@app/ai/ai-chat-store"
import type { CSSProperties } from "vue"

const props = defineProps<{
  turns: HariTurn[]
  /** Re-runs a turn's prompt from the error block's retry button. */
  onRetry?: (prompt: string) => void
}>()

const { showTools, showOutcome } = storeToRefs(useDebugStore())

const preWrapStyle: CSSProperties = { whiteSpace: "pre-wrap" }

/** Icon, label, and fallback line for each reducer-truth outcome badge. */
const OUTCOME_META: Record<
  NonNullable<HariTurn["outcome"]>,
  { icon: string; label: string; description: string }
> = {
  applied: {
    icon: "material-checkCircle",
    label: "Applied",
    description: "Changes applied to the workspace.",
  },
  ineffective: {
    icon: "material-warning",
    label: "No effective change",
    description: "The edit matched nothing, so the workspace is unchanged.",
  },
  none: {
    icon: "material-removeCircle",
    label: "No changes applied",
    description: "The turn produced no accepted edit.",
  },
}

/**
 * Every tool-activity line for a turn, in reading order: the tools the model
 * called, then the deterministic shape repairs, the vocabulary warnings, and the
 * rejections. Each line carries its own status icon and label. A failed call is
 * marked in its text, since a failed edit attempt is the signal that a change was
 * tried and missed and must not read as a silent success.
 */
function collectToolsUsed(turn: HariTurn): ToolUsed[] {
  const used: ToolUsed[] = []

  ;(turn.toolCalls ?? []).forEach((call, index) => {
    used.push({
      key: `call-${index}`,
      icon: call.ok ? "material-checkCircle" : "material-error",
      text: call.ok ? call.name : `${call.name} (failed)`,
    })
  })
  ;(turn.repairs ?? []).forEach((repair, index) => {
    used.push({
      key: `repair-${index}`,
      icon: "material-warning",
      text: `repair: ${repair.actionType}.${repair.propertyKey} — ${repair.reason}`,
    })
  })
  ;(turn.warnings ?? []).forEach((warning, index) => {
    used.push({
      key: `warning-${index}`,
      icon: "material-warning",
      text: warning,
    })
  })
  ;(turn.rejected ?? []).forEach((item, index) => {
    used.push({
      key: `rejected-${index}`,
      icon: "material-error",
      text: `rejected: ${item.type} — ${item.reason}`,
    })
  })

  return used
}

/** Show Tools gates the block, and a turn with no activity renders nothing. */
function toolsUsed(turn: HariTurn): ToolUsed[] {
  return showTools.value ? collectToolsUsed(turn) : []
}

function showThinking(turn: HariTurn): boolean {
  return Boolean(turn.thinking || turn.clamped)
}

/** Show Output gates the outcome badge, and only a done turn has one. */
function showOutcomeBadge(turn: HariTurn): boolean {
  return showOutcome.value && turn.status === "done" && turn.outcome !== undefined
}

function showError(turn: HariTurn): boolean {
  return Boolean(turn.error) || turn.status === "error"
}

/**
 * While a turn streams its reply is provisional, so it renders in the in-progress
 * treatment until the turn finishes.
 */
function replyClass(turn: HariTurn): string | undefined {
  return turn.status === "pending" ? "hari-assistant-streaming" : undefined
}

function userRefs(turn: HariTurn) {
  return { hariUserText: { children: turn.prompt } }
}

const workingRefs = { hariStatusLabel: { children: "Working..." } }

const stoppedRefs = { hariStatusLabel: { children: "Stopped." } }

/**
 * An applied turn lists its full per-target changes; every other outcome shows
 * its one-line description.
 */
function outcomeRefs(turn: HariTurn) {
  const meta = OUTCOME_META[turn.outcome!]
  const detail =
    turn.outcome === "applied" && (turn.changes?.length ?? 0) > 0
      ? (turn.changes ?? []).join("\n")
      : meta.description

  return {
    hariOutcomeIcon: { icon: meta.icon },
    hariOutcomeLabel: { children: meta.label },
    hariOutcomeText: { children: detail, style: preWrapStyle },
  }
}

function errorRefs(turn: HariTurn) {
  const text =
    turn.error ?? (turn.rejected ?? []).map((item) => `${item.type}: ${item.reason}`).join("; ")

  return {
    hariErrorText: { children: text },
    hariErrorRetry: props.onRetry ? { onClick: () => props.onRetry?.(turn.prompt) } : {},
  }
}

// The retry button only exists when the transcript was given a retry handler, and
// a ref override cannot turn a slot on, so its presence stays a positional
// decision while its handler comes through `hariErrorRetry`.
const retrySlot = computed(() => (props.onRetry ? {} : null))
</script>

<template>
  <template v-for="turn in turns" :key="turn.id">
    <MessageUser :text-description="{}" :seldon-refs="userRefs(turn)" />

    <HariThinking
      v-if="showThinking(turn)"
      :text="turn.thinking ?? ''"
      :duration-ms="turn.thinkingMs"
      :clamped="turn.clamped"
    />

    <HariTools v-if="toolsUsed(turn).length > 0" :tools="toolsUsed(turn)" :default-open="true" />

    <MessageOutcome
      v-if="showOutcomeBadge(turn)"
      :icon="{}"
      :text-label="{}"
      :text-description="{}"
      :seldon-refs="outcomeRefs(turn)"
    />

    <MessageAssistant v-if="turn.reply" :class="replyClass(turn)">
      <HariMarkdown :content="turn.reply" />
    </MessageAssistant>

    <MessageStatus
      v-if="turn.status === 'pending'"
      class="hari-status-working"
      :text-label="{}"
      :seldon-refs="workingRefs"
    />

    <MessageStatus v-if="turn.status === 'stopped'" :text-label="{}" :seldon-refs="stoppedRefs" />

    <MessageError
      v-if="showError(turn)"
      :icon="{}"
      :text-description="{}"
      :button-simple="retrySlot"
      :text-label="retrySlot"
      :seldon-refs="errorRefs(turn)"
    />
  </template>
</template>
