import { SVGProps } from "react"
import { ComponentIcon } from "@seldon/core/components/constants"
import { IconInput } from "@components/seldon/custom-icons/Input"
import { IconStub } from "@components/seldon/custom-icons/Stub"
import { IconComponent } from "@components/seldon/custom-icons/Component"
import { IconFrame } from "@components/seldon/custom-icons/Frame"
import { IconFrameBackground } from "@components/seldon/custom-icons/FrameBackground"
import { IconFrameColumns } from "@components/seldon/custom-icons/FrameColumns"
import { IconFrameRows } from "@components/seldon/custom-icons/FrameRows"
import { IconIcon } from "@components/seldon/custom-icons/Icon"
import { IconImage } from "@components/seldon/custom-icons/ImageGlyph"
import { IconText } from "@components/seldon/custom-icons/TextGlyph"

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
