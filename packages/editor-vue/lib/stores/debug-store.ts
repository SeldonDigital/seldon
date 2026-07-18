import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * Developer toggles. `dispatchLogging` mirrors the React debug store flag that
 * logs each action's payload and before/after workspace to the console.
 */
export const useDebugStore = defineStore("debug", () => {
  const dispatchLogging = ref(false)

  function setDispatchLogging(value: boolean): void {
    dispatchLogging.value = value
  }

  return { dispatchLogging, setDispatchLogging }
})
