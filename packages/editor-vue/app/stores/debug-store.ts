import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Developer toggles. `dispatchLogging` mirrors the React debug store flag that
 * logs each action's payload and before/after workspace to the console.
 */
export const useDebugStore = defineStore("debug", () => {
  const dispatchLogging = ref(false)
  // AI chat debug toggles, mirroring the React debug store: clamp reasoning off
  // for the next turn, and reveal tool calls and the reducer outcome in the
  // transcript.
  const noThink = ref(false)
  const showTools = ref(false)
  const showOutcome = ref(false)

  function setDispatchLogging(value: boolean): void {
    dispatchLogging.value = value
  }

  function toggleNoThink(): void {
    noThink.value = !noThink.value
  }

  function toggleShowTools(): void {
    showTools.value = !showTools.value
  }

  function toggleShowOutcome(): void {
    showOutcome.value = !showOutcome.value
  }

  return {
    dispatchLogging,
    noThink,
    showTools,
    showOutcome,
    setDispatchLogging,
    toggleNoThink,
    toggleShowTools,
    toggleShowOutcome,
  }
})
