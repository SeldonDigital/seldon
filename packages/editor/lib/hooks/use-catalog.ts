import { create } from "zustand"

export type Tab =
  | "frames"
  | "primitives"
  | "elements"
  | "parts"
  | "modules"
  | "screens"
  | "all"

interface CatalogState {
  activeTab: null | Tab
  setActiveTab: (tab: null | Tab) => void
}
const useStore = create<CatalogState>((set) => ({
  activeTab: null,
  setActiveTab: (tab) => set(() => ({ activeTab: tab })),
}))

export function useCatalog() {
  const { activeTab, setActiveTab } = useStore()

  return { activeTab, setActiveTab, close: () => setActiveTab(null) }
}
