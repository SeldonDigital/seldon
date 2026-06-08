import { IconSeldonCatalog } from "@seldon/components/icons/IconSeldonCatalog"
import { IconSeldonCursor } from "@seldon/components/icons/IconSeldonCursor"
import { IconSeldonElements } from "@seldon/components/icons/IconSeldonElements"
import { IconSeldonFrame } from "@seldon/components/icons/IconSeldonFrame"
import { IconSeldonImage } from "@seldon/components/icons/IconSeldonImage"
import { IconSeldonModules } from "@seldon/components/icons/IconSeldonModules"
import { IconSeldonPanels } from "@seldon/components/icons/IconSeldonPanels"
import { IconSeldonParts } from "@seldon/components/icons/IconSeldonParts"
import { IconSeldonPhotograph } from "@seldon/components/icons/IconSeldonPhotograph"
import { IconSeldonPreview } from "@seldon/components/icons/IconSeldonPreview"
import { IconSeldonPrimitives } from "@seldon/components/icons/IconSeldonPrimitives"
import { IconSeldonScreen } from "@seldon/components/icons/IconSeldonScreen"
import { IconSeldonSketchCircle } from "@seldon/components/icons/IconSeldonSketchCircle"
import { IconSeldonSketchPencil } from "@seldon/components/icons/IconSeldonSketchPencil"
import { IconSeldonSketchRectangle } from "@seldon/components/icons/IconSeldonSketchRectangle"
import { IconSeldonSketchText } from "@seldon/components/icons/IconSeldonSketchText"
import { IconSeldonSpark } from "@seldon/components/icons/IconSeldonSpark"
import { IconSeldonToolSketch } from "@seldon/components/icons/IconSeldonToolSketch"
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
      {icon === "circle" && <IconSeldonSketchCircle />}
      {icon === "cursor" && <IconSeldonCursor />}
      {icon === "draw" && <IconSeldonToolSketch />}
      {icon === "elements" && <IconSeldonElements />}
      {icon === "frame" && <IconSeldonFrame />}
      {icon === "image" && <IconSeldonImage />}
      {icon === "modules" && <IconSeldonModules />}
      {icon === "panels" && <IconSeldonPanels />}
      {icon === "parts" && <IconSeldonParts />}
      {icon === "pencil" && <IconSeldonSketchPencil />}
      {icon === "preview" && <IconSeldonPreview />}
      {icon === "photograph" && <IconSeldonPhotograph />}
      {icon === "primitives" && <IconSeldonPrimitives />}
      {icon === "rectangle" && <IconSeldonSketchRectangle />}
      {icon === "spark" && <IconSeldonSpark />}
      {icon === "screens" && <IconSeldonScreen />}
      {icon === "text" && <IconSeldonSketchText />}
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
