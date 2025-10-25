import { useCustomTheme } from "@lib/themes/use-custom-theme"
import defaultTheme from "@seldon/core/themes/default"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { Button } from "@components/seldon/elements/Button"
import { Text } from "@components/ui/Text"
import { areThemesEqual } from "./helpers/are-themes-equal"
import { BackgroundSection } from "./sections/BackgroundSection"
import { BorderSection } from "./sections/BorderSection"
import { CoreSection } from "./sections/CoreSection"
import { FontSection } from "./sections/FontSection"
import { GradientSection } from "./sections/GradientSection"
import { LineHeightSection } from "./sections/LineHeightSection"
import { ModulationValueSection } from "./sections/ModulationValueSection"
import { ScrollbarSection } from "./sections/ScrollbarSection"
import { ShadowSection } from "./sections/ShadowSection"
import { SwatchSection } from "./sections/SwatchSection"

export function ThemePane() {
  const { selection } = useSelection()
  const { workspace } = useWorkspace()
  const { reset } = useCustomTheme()

  if (!selection)
    return (
      <div className="border-t border-t-neutral-950 p-4">
        <span className="w-5/12 truncate text-sm text-neutral-100/60">
          Nothing selected
        </span>
      </div>
    )

  const theme = themeService.getTheme(selection.theme || "default", workspace)
  const showResetButton =
    theme.id === "custom" ? !areThemesEqual(theme, defaultTheme) : false

  return (
    <div className="scrollbar-gutter-stable h-full overflow-y-auto border-t border-t-neutral-950 p-2 text-white scrollbar-thin">
      <Text
        variant="label-small"
        className="px-1 py-2 font-normal text-neutral-100/60"
      >
        Current theme: <strong>{theme.name}</strong>
      </Text>
      <CoreSection theme={theme} />
      <SwatchSection theme={theme} />
      <ModulationValueSection
        theme={theme}
        title="Size"
        section="size"
        subProperties={Object.entries(theme.size).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <ModulationValueSection
        theme={theme}
        title="Dimension"
        section="dimension"
        subProperties={Object.entries(theme.dimension).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <ModulationValueSection
        theme={theme}
        title="Margin"
        section="margin"
        subProperties={Object.entries(theme.margin).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <ModulationValueSection
        theme={theme}
        title="Padding"
        section="padding"
        subProperties={Object.entries(theme.padding).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <ModulationValueSection
        theme={theme}
        title="Gap"
        section="gap"
        subProperties={Object.entries(theme.gap).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <BackgroundSection theme={theme} />
      <BorderSection theme={theme} />
      <ModulationValueSection
        theme={theme}
        title="Border Width"
        section="borderWidth"
        subProperties={Object.entries(theme.borderWidth).map(
          ([key, value]) => ({
            key,
            name: value.name,
            // @ts-expect-error: The borderWidth option hairline is giving us trouble here, but it's not a big deal
            parameters: value.parameters,
          }),
        )}
      />
      <ModulationValueSection
        theme={theme}
        title="Corners"
        section="corners"
        subProperties={Object.entries(theme.corners).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <FontSection theme={theme} />
      <ModulationValueSection
        theme={theme}
        title="Font Size"
        section="fontSize"
        subProperties={Object.entries(theme.fontSize).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <LineHeightSection theme={theme} />
      <GradientSection theme={theme} />
      <ShadowSection theme={theme} />
      <ModulationValueSection
        theme={theme}
        title="Blur"
        section="blur"
        subProperties={Object.entries(theme.blur).map(([key, value]) => ({
          key,
          name: value.name,
          parameters: value.parameters,
        }))}
      />
      <ScrollbarSection theme={theme} />
      <style jsx global>{`
        .reset-theme-button {
          margin-top: 1rem;
          margin-bottom: 1rem;
        }
      `}</style>
      {showResetButton && (
        <Button
          onClick={reset}
          iconProps={{ icon: "material-delete" }}
          labelProps={{ children: "Reset custom theme" }}
          className="reset-theme-button"
        />
      )}
    </div>
  )
}
