import { useCallback } from "react"
import { create } from "zustand"

const useStore = create<{
  fonts: string[]
  setFonts: (fonts: string[]) => void
}>((set) => ({
  fonts: [],
  setFonts: (fonts: string[]) => set({ fonts }),
}))

export function useEditorFonts() {
  const { fonts, setFonts } = useStore()

  const addFont = useCallback(
    (font: string) => {
      if (fonts.includes(font)) {
        return
      }
      setFonts([...fonts, font])
    },
    [fonts, setFonts],
  )

  return {
    fonts,
    addFont,
  }
}
