import { cn } from "@lib/utils/cn"
import { IconCatalog } from "@components/icons/Catalog"
import { IconCircle } from "@components/icons/Circle"
import { IconCursor } from "@components/icons/Cursor"
import { IconDraw } from "@components/icons/Draw"
import { IconElements } from "@components/icons/Elements"
import { IconFrame } from "@components/icons/Frame"
import { IconImage } from "@components/icons/Image"
import { IconModules } from "@components/icons/Modules"
import { IconPanels } from "@components/icons/Panels"
import { IconParts } from "@components/icons/Parts"
import { IconPencil } from "@components/icons/Pencil"
import { IconPhotograph } from "@components/icons/Photograph"
import { IconPreview } from "@components/icons/Preview"
import { IconPrimitives } from "@components/icons/Primitives"
import { IconRectangle } from "@components/icons/Rectangle"
import { IconScreens } from "@components/icons/Screens"
import { IconSpark } from "@components/icons/Spark"
import { IconTextAlt } from "@components/icons/TextAlt"
import { Selectable } from "@components/ui/Selectable"

export type Icon =
  | "catalog"
  | "circle"
  | "cursor"
  | "draw"
  | "elements"
  | "frame"
  | "image"
  | "modules"
  | "panels"
  | "parts"
  | "pencil"
  | "photograph"
  | "preview"
  | "primitives"
  | "rectangle"
  | "spark"
  | "screens"
  | "text"

interface IconButtonProps {
  title: string
  isSelected?: boolean
  label?: string
  icon: Icon
  onClick: () => void
  className?: string
  testId?: string
}

export function ToolbarButton({
  title,
  isSelected = false,
  label,
  icon,
  onClick,
  className,
  testId,
}: IconButtonProps) {
  return (
    <Selectable
      as="button"
      title={title}
      onClick={onClick}
      state={isSelected ? "selected" : "default"}
      className={cn(
        `flex h-8 items-center justify-center text-2xl`,
        label ? "gap-2 px-2" : "w-8",
        // Needed because tldraw overrides the outline style
        isSelected && "!outline !outline-1 !outline-blue",
        className,
      )}
      data-testid={testId}
      data-is-selected={isSelected}
    >
      {icon === "catalog" && <IconCatalog />}
      {icon === "circle" && <IconCircle />}
      {icon === "cursor" && <IconCursor />}
      {icon === "draw" && <IconDraw />}
      {icon === "elements" && <IconElements />}
      {icon === "frame" && <IconFrame />}
      {icon === "image" && <IconImage />}
      {icon === "modules" && <IconModules />}
      {icon === "panels" && <IconPanels />}
      {icon === "parts" && <IconParts />}
      {icon === "pencil" && <IconPencil />}
      {icon === "preview" && <IconPreview />}
      {icon === "photograph" && <IconPhotograph />}
      {icon === "primitives" && <IconPrimitives />}
      {icon === "rectangle" && <IconRectangle />}
      {icon === "spark" && <IconSpark />}
      {icon === "screens" && <IconScreens />}
      {icon === "text" && <IconTextAlt />}
      {label && <span className="text-[14px] font-normal">{label}</span>}
    </Selectable>
  )
}
