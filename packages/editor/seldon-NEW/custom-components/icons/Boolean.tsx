/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/
import { SVGProps } from "react"

interface Props extends Omit<SVGProps<SVGSVGElement>, "enabled"> {
  enabled?: boolean
}

export function IconCustomBooleanValue({
  enabled = false,
  ...svgProps
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      {...svgProps}
    >
      <rect
        width={14}
        height={14}
        x={1}
        y={1}
        fill="#fff"
        fillOpacity={0.1}
        rx={3}
      />
      {enabled && (
        <path
          fill="currentColor"
          d="m7.009 10.991 4.99-4.99-.99-.992-4 4L4.99 6.99 4 7.982l3.009 3.009Z"
        />
      )}
    </svg>
  )
}
