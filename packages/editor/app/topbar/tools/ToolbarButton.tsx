import { IconCircle } from "@seldon/components/custom-icons/Circle"
import { IconCursor } from "@seldon/components/custom-icons/Cursor"
import { IconDraw } from "@seldon/components/custom-icons/Draw"
import { IconFrame } from "@seldon/components/custom-icons/Frame"
import { IconImage } from "@seldon/components/custom-icons/ImageGlyph"
import { IconPencil } from "@seldon/components/custom-icons/Pencil"
import { IconRectangle } from "@seldon/components/custom-icons/Rectangle"
import { IconScreens } from "@seldon/components/custom-icons/Screens"
import { IconTextAlt } from "@seldon/components/custom-icons/TextAlt"
import { IconSeldonCatalog } from "@seldon/components/icons/IconSeldonCatalog"
import { IconSeldonElements } from "@seldon/components/icons/IconSeldonElements"
import { IconSeldonModules } from "@seldon/components/icons/IconSeldonModules"
import { IconSeldonPanels } from "@seldon/components/icons/IconSeldonPanels"
import { IconSeldonParts } from "@seldon/components/icons/IconSeldonParts"
import { IconSeldonPhotograph } from "@seldon/components/icons/IconSeldonPhotograph"
import { IconSeldonPreview } from "@seldon/components/icons/IconSeldonPreview"
import { IconSeldonPrimitives } from "@seldon/components/icons/IconSeldonPrimitives"
import { IconSeldonSpark } from "@seldon/components/icons/IconSeldonSpark"
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
      {icon === "catalog" && <IconSeldonCatalog />}
      {icon === "circle" && <IconCircle />}
      {icon === "cursor" && <IconCursor />}
      {icon === "draw" && <IconDraw />}
      {icon === "elements" && <IconSeldonElements />}
      {icon === "frame" && <IconFrame />}
      {icon === "image" && <IconImage />}
      {icon === "modules" && <IconSeldonModules />}
      {icon === "panels" && <IconSeldonPanels />}
      {icon === "parts" && <IconSeldonParts />}
      {icon === "pencil" && <IconPencil />}
      {icon === "preview" && <IconSeldonPreview />}
      {icon === "photograph" && <IconSeldonPhotograph />}
      {icon === "primitives" && <IconSeldonPrimitives />}
      {icon === "rectangle" && <IconRectangle />}
      {icon === "spark" && <IconSeldonSpark />}
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
