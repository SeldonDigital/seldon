import { IconCatalog } from "@components/seldon/custom-icons/Catalog"
import { IconCircle } from "@components/seldon/custom-icons/Circle"
import { IconCursor } from "@components/seldon/custom-icons/Cursor"
import { IconDraw } from "@components/seldon/custom-icons/Draw"
import { IconElements } from "@components/seldon/custom-icons/Elements"
import { IconFrame } from "@components/seldon/custom-icons/Frame"
import { IconImage } from "@components/seldon/custom-icons/ImageGlyph"
import { IconModules } from "@components/seldon/custom-icons/Modules"
import { IconPanels } from "@components/seldon/custom-icons/Panels"
import { IconParts } from "@components/seldon/custom-icons/Parts"
import { IconPencil } from "@components/seldon/custom-icons/Pencil"
import { IconPhotograph } from "@components/seldon/custom-icons/Photograph"
import { IconPreview } from "@components/seldon/custom-icons/Preview"
import { IconPrimitives } from "@components/seldon/custom-icons/Primitives"
import { IconRectangle } from "@components/seldon/custom-icons/Rectangle"
import { IconScreens } from "@components/seldon/custom-icons/Screens"
import { IconSpark } from "@components/seldon/custom-icons/Spark"
import { IconTextAlt } from "@components/seldon/custom-icons/TextAlt"
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
