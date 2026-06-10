import { SVGProps } from "react"
import type { ComponentIcon } from "@seldon/core/components/constants"
import {
  IconSeldonComponent,
  IconSeldonFrame,
  IconSeldonFrameBackground,
  IconSeldonFrameColumns,
  IconSeldonFrameRows,
  IconSeldonIcon,
  IconSeldonImage,
  IconSeldonInput,
  IconSeldonStub,
  IconSeldonText,
} from "@seldon/components/icons"

type IconProps = {
  icon: ComponentIcon
} & SVGProps<SVGSVGElement>

export function Icon({ icon, ...svgProps }: IconProps) {
  switch (icon) {
    case "seldon-stub":
      return <IconSeldonStub {...svgProps} />
    case "seldon-component":
      return <IconSeldonComponent {...svgProps} />
    case "seldon-icon":
      return <IconSeldonIcon {...svgProps} />
    case "seldon-image":
      return <IconSeldonImage {...svgProps} />
    case "seldon-input":
      return <IconSeldonInput {...svgProps} />
    case "seldon-text":
      return <IconSeldonText {...svgProps} />
    case "seldon-frame":
      return <IconSeldonFrame {...svgProps} />
    case "seldon-frameBackground":
      return <IconSeldonFrameBackground {...svgProps} />
    case "seldon-frameColumns":
      return <IconSeldonFrameColumns {...svgProps} />
    case "seldon-frameRows":
      return <IconSeldonFrameRows {...svgProps} />
    default:
      return null
  }
}
