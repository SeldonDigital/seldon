import { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { PropertyControl } from "./PropertyControl"
import { FlatProperty } from "./helpers/properties-data"
import { getPropertyDisplayColor } from "./helpers/property-styling"

interface PropertyRowProps {
  property: FlatProperty
  workspace: Workspace
  node: Variant | Instance | Board
  theme?: Theme
}

export function PropertyRow({
  property,
  workspace: _workspace,
  node: _node,
  theme,
}: PropertyRowProps) {
  const { debugModeEnabled } = useDebugMode()
  const getRowColor = () => getPropertyDisplayColor(property, debugModeEnabled)

  return (
    <div
      className={`pr-1 py-0.5 ${property.isSubProperty ? "ml-4 bg-neutral-900/30" : ""} ${getRowColor()}`}
    >
      <div className="flex items-center">
        <div className="flex items-center" style={{ width: "35%" }}>
          <label
            className={`font-medium truncate ${property.isDimmed ? "opacity-50" : ""}`}
            style={{
              fontFamily: "IBM Plex Sans",
              fontSize: "0.75rem",
              lineHeight: 1.15,
              letterSpacing: "0.1px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {property.label}
          </label>
        </div>
        <div className="flex-1">
          <PropertyControl property={property} theme={theme} />
        </div>
      </div>
      {debugModeEnabled && (
        <div
          className="mb-0.5"
          style={{ fontFamily: "IBM Plex Sans", fontSize: "0.75rem" }}
        >
          {property.valueType} | {property.status} |{" "}
          {property.controlType || "none"}
        </div>
      )}
    </div>
  )
}
