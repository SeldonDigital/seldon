import { cn } from "@lib/utils/cn"
import { useEffect } from "react"
import { Theme, ThemeSwatchKey } from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { useEditorFonts } from "@lib/hooks/use-editor-fonts"

interface ThemeListItemProps {
  theme: Theme
  isSelected?: boolean
}

export const ThemeListItem = ({
  theme,
  isSelected = false,
}: ThemeListItemProps) => {
  const swatches: ThemeSwatchKey[] = [
    "@swatch.primary",
    "@swatch.swatch1",
    "@swatch.swatch2",
    "@swatch.swatch3",
    "@swatch.swatch4",
  ]
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
    <>
      <div className={cn("flex items-center gap-[2px]")}>
        <span
          className={cn(
            "text-[13px] text-white",
            isSelected ? "w-[20px]" : "w-[14px]",
          )}
        >
          <span
            style={{
              fontFamily: theme.font.title.parameters.family.value || undefined,
            }}
          >
            A
          </span>
          {isSelected && (
            <span
              style={{
                fontFamily:
                  theme.font.body.parameters.family.value || undefined,
              }}
            >
              a
            </span>
          )}
        </span>
        <div className="relative flex">
          {swatches.map((swatch, i) => renderSwatch(swatch, i, isSelected))}
        </div>
      </div>
    </>
  )

  function renderSwatch(value: ThemeSwatchKey, i: number, isSelected: boolean) {
    const themeValue = getThemeOption(value, theme)

    return (
      <span
        key={i}
        style={{
          zIndex: 5 - i,
          backgroundColor: HSLObjectToString(themeValue.value),
        }}
        className={cn(
          "block h-3 w-3 rounded-full bg-blue shadow-dieter-rams-button",
          i < 4 ? (isSelected ? "-mr-[7px]" : "-mr-[10px]") : "",
        )}
      />
    )
  }
}
