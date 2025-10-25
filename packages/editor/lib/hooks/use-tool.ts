import { create } from "zustand"

export type Tool = "select" | "sketch" | "component"

interface ToolState {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
}

const useStore = create<ToolState>((set) => ({
  activeTool: "select",
  setActiveTool: (tool) => set({ activeTool: tool }),
}))

export function useTool() {
  const { activeTool, setActiveTool } = useStore()

  return { activeTool, setActiveTool }
}
