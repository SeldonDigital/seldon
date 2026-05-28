import { cn, cnMerge } from "@lib/utils/cn"
import { FC } from "react"
import { ComponentIcon } from "@seldon/core/components/constants"
import { Icon } from "@components/ui/Icon"
import { Text } from "@components/ui/Text"

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
  return (
    <button
      role="option"
      aria-selected={isSelected}
      disabled={disabled}
      className={cnMerge(
        "group flex items-center rounded-lg border border-transparent px-1 pr-2 text-white h-10",
        "hover:bg-white/10",
        "data-[selected=true]:bg-white/10",
        isSelected && "border-blue bg-blue/20 text-blue",
        disabled && "opacity-50",
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-testid={testId}
    >
      <div className={cn("flex h-8 w-8 items-center justify-center")}>
        <Icon icon={icon} className="text-2xl" />
      </div>
      <div className="flex flex-1 flex-col items-start overflow-hidden gap-0.5">
        <Text
          variant="body-small"
          className={cn(
            "overflow-hidden text-ellipsis whitespace-nowrap",
            isSelected ? "text-blue" : "text-white",
          )}
        >
          {name}
        </Text>
        {description && (
          <Text
            variant="label-small"
            className={cn(
              "overflow-hidden text-ellipsis whitespace-nowrap",
              isSelected ? "text-blue" : "text-pearl/60",
            )}
          >
            {description}
          </Text>
        )}
      </div>
    </button>
  )
}
