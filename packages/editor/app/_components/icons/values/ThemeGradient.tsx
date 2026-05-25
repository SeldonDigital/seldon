import { getColorCSSValue } from "@seldon/factory/styles/css-properties/get-color-css-value"
import { nanoid } from "nanoid"
import { SVGProps, useRef } from "react"
import { GradientType, ThemeGradient, ValueType } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { useSelectionTheme } from "@lib/themes/hooks/use-selection-theme"

interface Props extends Omit<SVGProps<SVGSVGElement>, "color"> {
  gradient: ThemeGradient
}

export function IconThemeGradientValue({ gradient, ...svgProps }: Props) {
  const theme = useSelectionTheme()

  const { parameters } = gradient
  const GradientElement =
    parameters.gradientType &&
    parameters.gradientType.type !== ValueType.EMPTY &&
    parameters.gradientType.value === GradientType.LINEAR
      ? "linearGradient"
      : "radialGradient"
  // random id needed for uniqueness of the gradient
  const randomId = useRef(nanoid(6)).current

  const angle = resolveValue(parameters.angle)
  const startColor = resolveValue(parameters.startColor)
  const startOpacity = resolveValue(parameters.startOpacity)
  const startPosition = resolveValue(parameters.startPosition)
  const startBrightness = resolveValue(parameters.startBrightness)
  const endColor = resolveValue(parameters.endColor)
  const endOpacity = resolveValue(parameters.endOpacity)
  const endPosition = resolveValue(parameters.endPosition)
  const endBrightness = resolveValue(parameters.endBrightness)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...svgProps}
    >
      {/* Transparent background grid pattern */}
      <g fill="#848484" clipPath="url(#clip0_1727_7463)">
        <path d="M5.143 3.429H8.572V6.858H5.143z"></path>
        <path d="M8.572 6.857H12.001V10.286H8.572z"></path>
        <path d="M1.714 13.714H5.143V17.143H1.714z"></path>
        <path d="M5.143 17.143H8.572V20.572H5.143z"></path>
        <path d="M12 10.286H15.429V13.715H12z"></path>
        <path d="M15.428 13.714H18.857V17.143H15.428z"></path>
        <path d="M8.572 20.571H12.001V24H8.572z"></path>
        <path d="M18.857 17.143H22.285999999999998V20.572H18.857z"></path>
        <path d="M1.714 6.857H5.143V10.286H1.714z"></path>
        <path d="M1.714 20.571H5.143V24H1.714z"></path>
        <path d="M12 3.429H15.429V6.858H12z"></path>
        <path d="M18.857 3.429H22.285999999999998V6.858H18.857z"></path>
        <path d="M5.143 10.286H8.572V13.715H5.143z"></path>
        <path d="M15.428 6.857H18.857V10.286H15.428z"></path>
        <path d="M8.572 13.714H12.001V17.143H8.572z"></path>
        <path d="M18.857 10.286H22.285999999999998V13.715H18.857z"></path>
        <path d="M12 17.143H15.429V20.572H12z"></path>
        <path d="M15.428 20.571H18.857V24H15.428z"></path>
      </g>
      <circle cx="12" cy="12" r="10" fill={`url(#${randomId})`} />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10ZM8.186 18.87l11.67-6.733.001-.137a7.857 7.857 0 1 0-11.671 6.87Z"
        clipRule="evenodd"
      />
      <defs>
        <GradientElement
          id={randomId}
          gradientTransform={`rotate(${angle?.value.value ?? 0})`}
        >
          {startColor && (
            <stop
              stopColor={getColorCSSValue({
                color: startColor,
                opacity: startOpacity,
                brightness: startBrightness,
                theme,
              })}
              offset={`${startPosition?.value.value ?? 0}%`}
            />
          )}
          {endColor && (
            <stop
              stopColor={getColorCSSValue({
                color: endColor,
                opacity: endOpacity,
                brightness: endBrightness,
                theme,
              })}
              offset={`${endPosition?.value.value ?? 100}%`}
            />
          )}
        </GradientElement>
        <clipPath id="clip0_1727_7463">
          <rect
            width="17.143"
            height="17.143"
            x="3.428"
            y="3.429"
            fill="#fff"
            rx="8.571"
          ></rect>
        </clipPath>
      </defs>
    </svg>
  )
}
