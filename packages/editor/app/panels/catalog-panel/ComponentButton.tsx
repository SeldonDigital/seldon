import { CSSProperties, FC, useState } from "react"
import { ComponentIcon } from "@seldon/core/components/constants"
import { Icon } from "@app/ui/Icon"
import { Text } from "@app/ui/Text"

export type ComponentButtonProps = {
  name: string
  icon: ComponentIcon
  description?: string
  onClick: () => void
  onDoubleClick: () => void
  disabled?: boolean
  isSelected?: boolean
  testId?: string
}

export const ComponentButton: FC<ComponentButtonProps> = ({
  name,
  icon,
  description,
  onClick,
  onDoubleClick,
  disabled,
  isSelected,
  testId,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const backgroundColor = isHovered
    ? "hsl(0 0% 100% / 0.1)"
    : isSelected
      ? "color-mix(in srgb, var(--sdn-swatch-seldon-blue) 20%, transparent)"
      : undefined

  const buttonStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    borderRadius: "var(--sdn-corners-compact)",
    border: `1px solid ${isSelected ? "var(--sdn-swatch-seldon-blue)" : "transparent"}`,
    paddingLeft: "var(--sdn-padding-tight)",
    paddingRight: "var(--sdn-padding-compact)",
    height: "2.5rem",
    color: isSelected ? "var(--sdn-swatch-seldon-blue)" : "var(--sdn-swatch-white)",
    opacity: disabled ? 0.5 : undefined,
    backgroundColor,
  }

  return (
    <button
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      style={buttonStyle}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-testid={testId}
    >
      <div
        style={{
          display: "flex",
          height: "2rem",
          width: "2rem",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon icon={icon} style={{ fontSize: "1.25rem" }} />
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "flex-start",
          overflow: "hidden",
          gap: "0.125rem",
        }}
      >
        <Text
          variant="body-small"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: isSelected ? "var(--color-blue)" : "#fff",
          }}
        >
          {name}
        </Text>
        {description && (
          <Text
            variant="label-small"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              color: isSelected ? "var(--color-blue)" : "rgba(245, 245, 245, 0.6)",
            }}
          >
            {description}
          </Text>
        )}
      </div>
    </button>
  )
}
