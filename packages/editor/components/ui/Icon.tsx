import { SVGProps } from "react"
import { ComponentIcon } from "@seldon/core/components/constants"
import { IconInput } from "@components/icons/Input"
import { IconStub } from "@components/icons/Stub"
import { IconComponent } from "../icons/Component"
import { IconFrame } from "../icons/Frame"
import { IconFrameBackground } from "../icons/FrameBackground"
import { IconFrameColumns } from "../icons/FrameColumns"
import { IconFrameRows } from "../icons/FrameRows"
import { IconIcon } from "../icons/Icon"
import { IconImage } from "../icons/Image"
import { IconText } from "../icons/Text"

type IconProps = {
  icon: ComponentIcon
} & SVGProps<SVGSVGElement>

export function Icon({ icon, ...svgProps }: IconProps) {
  switch (icon) {
    case "seldon-stub":
      return <IconStub {...svgProps} />
    case "seldon-component":
      return <IconComponent {...svgProps} />
    case "seldon-icon":
      return <IconIcon {...svgProps} />
    case "seldon-image":
      return <IconImage {...svgProps} />
    case "seldon-input":
      return <IconInput {...svgProps} />
    case "seldon-text":
      return <IconText {...svgProps} />
    case "seldon-frame":
      return <IconFrame {...svgProps} />
    case "seldon-frameBackground":
      return <IconFrameBackground {...svgProps} />
    case "seldon-frameColumns":
      return <IconFrameColumns {...svgProps} />
    case "seldon-frameRows":
      return <IconFrameRows {...svgProps} />
    default:
      return null
  }
}
