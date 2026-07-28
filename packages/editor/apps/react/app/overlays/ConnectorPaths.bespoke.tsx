// BESPOKE-VIEW: hand-authored SVG overlay layer. Raw svg markup, not a generated
// View. Elbow connectors are one path per line, which no Frame-based primitive
// can express.
import type { CSSProperties } from "react"

/**
 * One connector line and the dot at its origin, fully resolved. The caller does
 * the geometry so this view only draws.
 */
export interface ConnectorShape {
  key: string
  d: string
  stroke: string
  strokeWidth: number
  strokeOpacity: number
  anchorX: number
  anchorY: number
  strokeDasharray?: string
}

interface ConnectorPathsProps {
  shapes: ConnectorShape[]
  width: number
  height: number
  style?: CSSProperties
}

/** An SVG layer drawing a set of connector lines in the coordinate space given. */
export function ConnectorPaths({ shapes, width, height, style }: ConnectorPathsProps) {
  return (
    <svg style={style} width={width} height={height}>
      {shapes.map((shape) => (
        <g key={shape.key}>
          <path
            d={shape.d}
            fill="none"
            stroke={shape.stroke}
            strokeWidth={shape.strokeWidth}
            strokeOpacity={shape.strokeOpacity}
            strokeDasharray={shape.strokeDasharray}
          />
          <circle
            cx={shape.anchorX}
            cy={shape.anchorY}
            r={2}
            fill={shape.stroke}
            fillOpacity={shape.strokeOpacity}
          />
        </g>
      ))}
    </svg>
  )
}
