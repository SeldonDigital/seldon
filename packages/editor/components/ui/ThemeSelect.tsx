import { Theme, ThemeId, invariant } from "@seldon/core"
import { useThemes } from "@lib/themes/hooks/use-themes"
import * as Radix from "./RadixSelect"
import { ThemeListItem } from "./ThemeListItem"

export interface ThemeSelectProps {
  activeThemeId: ThemeId | null
  onValueChange: (newValue: ThemeId | null) => void
  allowUnsetTheme: boolean
}

export function ThemeSelect({
  activeThemeId,
  onValueChange,
  allowUnsetTheme,
}: ThemeSelectProps) {
  const themes = useThemes()
  const activeTheme = activeThemeId
    ? themes.find((theme) => theme.id === activeThemeId)
    : null

  if (!activeTheme && !allowUnsetTheme) {
    invariant(false, "Active theme is required")
  }

  return (
    <Radix.Select
      value={activeThemeId ?? "none"}
      onValueChange={handleValueChange}
    >
      <Radix.SelectTrigger>
        <Radix.SelectValue>
          {activeTheme ? (
            <ThemeListItem isSelected theme={activeTheme} />
          ) : (
            <span>Inherit</span>
          )}
        </Radix.SelectValue>
      </Radix.SelectTrigger>
      <Radix.SelectContent>
        {allowUnsetTheme && (
          <Radix.SelectItem value="none">
            <div className="flex items-center gap-1.5">
              <div className="text-sm">Inherit</div>
            </div>
          </Radix.SelectItem>
        )}
        {themes.map(renderItem)}
      </Radix.SelectContent>
    </Radix.Select>
  )

  function handleValueChange(value: string) {
    onValueChange(value === "none" ? null : (value as ThemeId))
  }
}

function renderItem(theme: Theme) {
  return (
    <Radix.SelectItem value={theme.id} key={theme.id}>
      <div className="flex items-center gap-1.5">
        <div className="text-base">
          <ThemeListItem theme={theme} />
        </div>
        <div className="text-sm">{theme.name}</div>
      </div>
    </Radix.SelectItem>
  )
}
