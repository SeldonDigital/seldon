import { SVGProps } from "react"
import { ComponentIcon } from "@seldon/core/components/constants"
import { IconInput } from "@seldon/components/custom-icons/Input"
import { IconStub } from "@seldon/components/custom-icons/Stub"
import { IconComponent } from "@seldon/components/custom-icons/Component"
import { IconFrame } from "@seldon/components/custom-icons/Frame"
import { IconFrameBackground } from "@seldon/components/custom-icons/FrameBackground"
import { IconFrameColumns } from "@seldon/components/custom-icons/FrameColumns"
import { IconFrameRows } from "@seldon/components/custom-icons/FrameRows"
import { IconIcon } from "@seldon/components/custom-icons/Icon"
import { IconImage } from "@seldon/components/custom-icons/ImageGlyph"
import { IconText } from "@seldon/components/custom-icons/TextGlyph"

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
