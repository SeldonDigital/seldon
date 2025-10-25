/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { HTMLAttributes } from "react"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"

export interface TextEditSearchProps extends HTMLAttributes<HTMLElement> {
  className?: string

  frameProps?: FrameProps
  frameIconProps?: IconProps
  frameInputProps?: InputProps
  frameButtonIconicProps?: ButtonIconicProps
  frameButtonIconicIconProps?: IconProps
}

export function TextEditSearch({
  className = "",
  frameProps,
  frameIconProps,
  frameInputProps,
  frameButtonIconicProps,
  frameButtonIconicIconProps,
  ...props
}: TextEditSearchProps) {
  return (
    <Frame className={"variant-textEdit-cuITdI " + className} {...props}>
      <Frame
        {...{ ...seldon.frameProps, ...frameProps }}
        className={
          "seldon-instance child-frame-ihLr0f " + (frameProps?.className ?? "")
        }
      >
        <Icon
          {...{ ...seldon.frameIconProps, ...frameIconProps }}
          className={
            "seldon-instance child-icon-ylQ7MG " +
            (frameIconProps?.className ?? "")
          }
        />
        <Input
          {...{ ...seldon.frameInputProps, ...frameInputProps }}
          className={
            "seldon-instance child-input-5AJP1N " +
            (frameInputProps?.className ?? "")
          }
        />
        <ButtonIconic
          {...{ ...seldon.frameButtonIconicProps, ...frameButtonIconicProps }}
          className={
            "seldon-instance child-button-wxA0Wo " +
            (frameButtonIconicProps?.className ?? "")
          }
          iconProps={{
            ...seldon.frameButtonIconicIconProps,
            ...frameButtonIconicIconProps,
          }}
        />
      </Frame>
    </Frame>
  )
}

const seldon: TextEditSearchProps = {
  frameProps: {},
  frameIconProps: {
    icon: "material-search",
  },
  frameInputProps: {
    inputType: "text",
  },
  frameButtonIconicProps: {},
  frameButtonIconicIconProps: {
    icon: "material-robot",
  },
}
