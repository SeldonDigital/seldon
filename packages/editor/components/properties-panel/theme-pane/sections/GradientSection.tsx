import { useCustomTheme } from "@lib/themes/use-custom-theme"
import {
  GradientType,
  Theme,
  ThemeGradientId,
  ThemeSwatchKey,
  Unit,
  ValueType,
} from "@seldon/core"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { stringifyValue } from "@seldon/core/helpers/properties/stringify-value"
import { isNumber, isPercentage } from "@seldon/core/helpers/validation"
import { getPresetOptions } from "@seldon/core/properties/schemas"
import { IconPosition } from "@components/icons/Position"
import { IconBorderColorValue } from "@components/icons/values/BorderColor"
import { IconBrightnessValue } from "@components/icons/values/Brightness"
import { IconGradientValue } from "@components/icons/values/Gradient"
import { IconOpacityValue } from "@components/icons/values/Opacity"
import { IconRotationValue } from "@components/icons/values/Rotation"
import { IconThemeColorValue } from "@components/icons/values/ThemeColor"
import { Input } from "@components/ui/Input"
import { Combobox } from "@components/ui/combobox"
import { SubPropertyRow } from "../../SubPropertyRow"
import { getColorDropdownOptions } from "../../helpers/get-color-dropdown-options"
import { ThemeSection } from "../ThemeSection"
import { ThemeSubSection } from "../ThemeSubSection"

type GradientSectionProps = {
  theme: Theme
}

export function GradientSection({ theme }: GradientSectionProps) {
  const { setGradientValue } = useCustomTheme()

  return (
    <ThemeSection title="Gradient">
      {Object.entries(theme.gradient).map(([key, gradientValue]) => (
        <ThemeSubSection title={gradientValue.name} key={key}>
          <SubPropertyRow title="Type">
            <Combobox
              value={stringifyValue(gradientValue.parameters.gradientType)}
              placeholder={stringifyValue(
                gradientValue.parameters.gradientType,
              )}
              renderIcon={<IconGradientValue />}
              options={getPresetOptions("gradientType")}
              onValueChange={(value) => {
                if (!value) return

                setGradientValue(key as ThemeGradientId, {
                  gradientType: {
                    type: ValueType.PRESET,
                    value: value as GradientType,
                  },
                })
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Angle">
            <Input
              validate={(value) => isNumber(value)}
              value={stringifyValue(gradientValue.parameters.angle)}
              iconLeft={<IconRotationValue />}
              placeholder={stringifyValue(gradientValue.parameters.angle)}
              onValueChange={(value) => {
                if (!value) return

                setGradientValue(key as ThemeGradientId, {
                  angle: {
                    type: ValueType.EXACT,
                    value: {
                      unit: Unit.DEGREES,
                      value: parseFloat(value),
                    },
                  },
                })
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Start position">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={stringifyValue(gradientValue.parameters.startPosition)}
              iconLeft={<IconPosition />}
              placeholder={stringifyValue(
                gradientValue.parameters.startPosition,
              )}
              onValueChange={(value) => {
                if (!value) return

                setGradientValue(key as ThemeGradientId, {
                  startPosition: {
                    type: ValueType.EXACT,
                    value: {
                      value: parseFloat(value),
                      unit: Unit.PERCENT,
                    },
                  },
                })
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Start color">
            <Combobox
              value={stringifyValue(gradientValue.parameters.startColor)}
              placeholder={stringifyValue(gradientValue.parameters.startColor)}
              renderIcon={(option) => {
                if (option) {
                  const isSwatch = option.value.startsWith("@swatch.")

                  if (isSwatch && option.color) {
                    return (
                      <IconThemeColorValue
                        color={HSLObjectToString(option.color)}
                      />
                    )
                  }
                }

                return <IconBorderColorValue />
              }}
              options={getColorDropdownOptions({
                theme,
              })}
              onValueChange={(value) => {
                if (!value) return

                setGradientValue(key as ThemeGradientId, {
                  startColor: {
                    type: ValueType.THEME_CATEGORICAL,
                    value: value as ThemeSwatchKey,
                  },
                })
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Start brightness">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={stringifyValue(gradientValue.parameters.startBrightness)}
              iconLeft={<IconBrightnessValue />}
              placeholder={`${gradientValue.parameters.startBrightness?.value?.value ?? 0}%`}
              onValueChange={(value) => {
                if (value) {
                  setGradientValue(key as ThemeGradientId, {
                    startBrightness: {
                      type: ValueType.EXACT,
                      value: {
                        value: parseFloat(value),
                        unit: Unit.PERCENT,
                      },
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="Start opacity">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={stringifyValue(gradientValue.parameters.startOpacity)}
              iconLeft={<IconOpacityValue />}
              placeholder={stringifyValue(
                gradientValue.parameters.startOpacity,
              )}
              onValueChange={(value) => {
                if (value) {
                  setGradientValue(key as ThemeGradientId, {
                    startOpacity: {
                      type: ValueType.EXACT,
                      value: {
                        value: parseFloat(value),
                        unit: Unit.PERCENT,
                      },
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="End position">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={stringifyValue(gradientValue.parameters.endPosition)}
              iconLeft={<IconPosition />}
              placeholder={stringifyValue(gradientValue.parameters.endPosition)}
              onValueChange={(value) => {
                if (!value) return

                setGradientValue(key as ThemeGradientId, {
                  endPosition: {
                    type: ValueType.EXACT,
                    value: {
                      value: parseFloat(value),
                      unit: Unit.PERCENT,
                    },
                  },
                })
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="End color">
            <Combobox
              value={stringifyValue(gradientValue.parameters.endColor)}
              placeholder={stringifyValue(gradientValue.parameters.endColor)}
              renderIcon={(option) => {
                if (option) {
                  const isSwatch = option.value.startsWith("@swatch.")

                  if (isSwatch && option.color) {
                    return (
                      <IconThemeColorValue
                        color={HSLObjectToString(option.color)}
                      />
                    )
                  }
                }

                return <IconBorderColorValue />
              }}
              options={getColorDropdownOptions({
                theme,
              })}
              onValueChange={(value) => {
                if (!value) return

                setGradientValue(key as ThemeGradientId, {
                  endColor: {
                    type: ValueType.THEME_CATEGORICAL,
                    value: value as ThemeSwatchKey,
                  },
                })
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="End brightness">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={stringifyValue(gradientValue.parameters.endBrightness)}
              iconLeft={<IconBrightnessValue />}
              placeholder={`${gradientValue.parameters.endBrightness?.value?.value ?? 0}%`}
              onValueChange={(value) => {
                if (value) {
                  setGradientValue(key as ThemeGradientId, {
                    endBrightness: {
                      type: ValueType.EXACT,
                      value: {
                        value: parseFloat(value),
                        unit: Unit.PERCENT,
                      },
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
          <SubPropertyRow title="End opacity">
            <Input
              validate={(value) => isNumber(value) || isPercentage(value)}
              value={stringifyValue(gradientValue.parameters.endOpacity)}
              iconLeft={<IconOpacityValue />}
              placeholder={stringifyValue(gradientValue.parameters.endOpacity)}
              onValueChange={(value) => {
                if (value) {
                  setGradientValue(key as ThemeGradientId, {
                    endOpacity: {
                      type: ValueType.EXACT,
                      value: {
                        value: parseFloat(value),
                        unit: Unit.PERCENT,
                      },
                    },
                  })
                }
              }}
              disabled={theme.id !== "custom"}
            />
          </SubPropertyRow>
        </ThemeSubSection>
      ))}
    </ThemeSection>
  )
}
