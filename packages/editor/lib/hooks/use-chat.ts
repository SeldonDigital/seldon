import { create } from "zustand"

interface ChatState {
  showChat: boolean
  setShowChat: (showChat: boolean) => void
}
const useStore = create<ChatState>((set) => ({
  showChat: false,
  setShowChat: (showChat) => set(() => ({ showChat })),
}))

export function useChat() {
  const { showChat, setShowChat } = useStore()

  return {
    showChat,
    setShowChat,
    toggleChat: () => setShowChat(!showChat),
  }
}
