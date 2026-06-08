import { IconCatalog } from "@seldon/components/custom-icons/Catalog"
import { IconCircle } from "@seldon/components/custom-icons/Circle"
import { IconCursor } from "@seldon/components/custom-icons/Cursor"
import { IconDraw } from "@seldon/components/custom-icons/Draw"
import { IconElements } from "@seldon/components/custom-icons/Elements"
import { IconFrame } from "@seldon/components/custom-icons/Frame"
import { IconImage } from "@seldon/components/custom-icons/ImageGlyph"
import { IconModules } from "@seldon/components/custom-icons/Modules"
import { IconPanels } from "@seldon/components/custom-icons/Panels"
import { IconParts } from "@seldon/components/custom-icons/Parts"
import { IconPencil } from "@seldon/components/custom-icons/Pencil"
import { IconPhotograph } from "@seldon/components/custom-icons/Photograph"
import { IconPreview } from "@seldon/components/custom-icons/Preview"
import { IconPrimitives } from "@seldon/components/custom-icons/Primitives"
import { IconRectangle } from "@seldon/components/custom-icons/Rectangle"
import { IconScreens } from "@seldon/components/custom-icons/Screens"
import { IconSpark } from "@seldon/components/custom-icons/Spark"
import { IconTextAlt } from "@seldon/components/custom-icons/TextAlt"
import { Selectable } from "@app/ui/Selectable"

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
      className={className}
      style={{
        display: "flex",
        height: "2rem",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--sdn-font-size-large)",
        ...(label
          ? {
              gap: "var(--sdn-gap-compact)",
              paddingLeft: "var(--sdn-padding-compact)",
              paddingRight: "var(--sdn-padding-compact)",
            }
          : { width: "2rem" }),
        // Inline outline beats tldraw's outline rule for the selected state
        ...(isSelected
          ? { outline: "1px solid var(--sdn-swatch-seldon-blue)" }
          : {}),
      }}
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
      {label && (
        <span
          style={{
            fontSize: "var(--sdn-font-size-small)",
            fontWeight: "var(--sdn-font-weight-normal)",
          }}
        >
          {label}
        </span>
      )}
    </Selectable>
  )
}
