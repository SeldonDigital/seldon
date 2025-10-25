import { useState } from "react"
import { ThemeCustomSwatchId, ThemeSwatch } from "@seldon/core"
import { IconMaterialDelete } from "@seldon/core/components/icons/IconMaterialDelete"
import { HSLObjectToString } from "@seldon/core/helpers/color/hsl-object-to-string"
import { isValidExactColor } from "@seldon/core/helpers/validation"
import { useSelectionTheme } from "@lib/themes/hooks/use-selection-theme"
import { IconColorValue } from "@components/icons/values/Color"
import { Input } from "@components/ui/Input"
import { LabelInput } from "@components/ui/LabelInput"
import { Text } from "@components/ui/Text"
import { PropertyRow } from "../../PropertyRow"

export function SwatchListItem({
  swatchId,
  swatchValue,
  onValueChange,
  onNameChange,
  onRemoveClick,
}: {
  swatchId: ThemeCustomSwatchId
  swatchValue: ThemeSwatch
  onValueChange: (value: string) => void
  onNameChange: (name: string) => void
  onRemoveClick?: () => void
}) {
  const theme = useSelectionTheme()
  const [isEditing, setIsEditing] = useState(false)

  if (!swatchValue.value) {
    return null
  }

  return (
    <PropertyRow title="Swatch" key={swatchId}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <LabelInput
              initialValue={swatchValue.name}
              onSubmit={(newLabel) => {
                onNameChange(newLabel.trim())
                setIsEditing(false)
              }}
            />
          ) : (
            <Text
              variant="body-small"
              className="truncate text-inherit cursor-text"
              onClick={() => setIsEditing(true)}
            >
              {swatchValue.name}
            </Text>
          )}
        </div>
        <Input
          value={HSLObjectToString(swatchValue.value)}
          placeholder="Enter HSL value"
          iconLeft={
            <IconColorValue color={HSLObjectToString(swatchValue.value)} />
          }
          validate={isValidExactColor}
          onValueChange={onValueChange}
          disabled={theme.id !== "custom"}
          iconRight={onRemoveClick ? <IconMaterialDelete /> : undefined}
          handleClickIconRight={onRemoveClick}
        />
      </div>
    </PropertyRow>
  )
}
