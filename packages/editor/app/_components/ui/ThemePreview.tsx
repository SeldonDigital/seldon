import { cn } from "@lib/utils/cn"
import { useEffect } from "react"
import { Theme } from "@seldon/core"
import { useEditorFonts } from "@lib/hooks/use-editor-fonts"
import { ThemeSwatches } from "./ThemeSwatches"

interface ThemePreviewProps {
  theme: Theme
}

export const ThemePreview = ({ theme }: ThemePreviewProps) => {
  const { addFont } = useEditorFonts()

  // Add fonts to the editor fonts list
  useEffect(() => {
    const titleFont = theme.font.title.parameters.family.value
    const bodyFont = theme.font.body.parameters.family.value

    if (titleFont && typeof titleFont === "string") {
      addFont(titleFont)
    }
    if (bodyFont && typeof bodyFont === "string") {
      addFont(bodyFont)
    }
  }, [
    addFont,
    theme.font.body.parameters.family.value,
    theme.font.title.parameters.family.value,
  ])

  return (
    <div className={cn("flex items-center gap-[2px]")}>
      <span className={cn("text-[13px] text-white w-[20px]")}>
        <span
          style={{
            fontFamily: theme.font.title.parameters.family.value || undefined,
          }}
        >
          A
        </span>
        <span
          style={{
            fontFamily: theme.font.body.parameters.family.value || undefined,
          }}
        >
          a
        </span>
      </span>
      <ThemeSwatches theme={theme} isSelected={true} />
    </div>
  )
}
