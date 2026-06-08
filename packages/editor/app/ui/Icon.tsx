import { SVGProps } from "react"
import { ComponentIcon } from "@seldon/core/components/constants"
import { IconSeldonComponent } from "@seldon/components/icons/IconSeldonComponent"
import { IconSeldonFrame } from "@seldon/components/icons/IconSeldonFrame"
import { IconSeldonFrameBackground } from "@seldon/components/icons/IconSeldonFrameBackground"
import { IconSeldonFrameColumns } from "@seldon/components/icons/IconSeldonFrameColumns"
import { IconSeldonFrameRows } from "@seldon/components/icons/IconSeldonFrameRows"
import { IconSeldonIcon } from "@seldon/components/icons/IconSeldonIcon"
import { IconSeldonImage } from "@seldon/components/icons/IconSeldonImage"
import { IconSeldonInput } from "@seldon/components/icons/IconSeldonInput"
import { IconSeldonStub } from "@seldon/components/icons/IconSeldonStub"
import { IconSeldonText } from "@seldon/components/icons/IconSeldonText"

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
