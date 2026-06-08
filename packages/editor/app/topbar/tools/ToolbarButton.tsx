import {
  IconSeldonCatalog,
  IconSeldonCursor,
  IconSeldonElements,
  IconSeldonFrame,
  IconSeldonImage,
  IconSeldonModules,
  IconSeldonPanels,
  IconSeldonParts,
  IconSeldonPhotograph,
  IconSeldonPreview,
  IconSeldonPrimitives,
  IconSeldonScreen,
  IconSeldonSketchCircle,
  IconSeldonSketchPencil,
  IconSeldonSketchRectangle,
  IconSeldonSketchText,
  IconSeldonSpark,
  IconSeldonToolSketch,
} from "@seldon/components/icons"
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
