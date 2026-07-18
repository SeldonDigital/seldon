import { defineStore } from "pinia"
import { ref } from "vue"

export type Tool = "select" | "component"

/** Active canvas tool. Mirrors the React `use-tool` store. */
export const useToolStore = defineStore("tool", () => {
  const activeTool = ref<Tool>("select")

  function setActiveTool(tool: Tool): void {
    activeTool.value = tool
  }

  return { activeTool, setActiveTool }
})
