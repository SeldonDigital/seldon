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
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { Title, TitleProps } from "../primitives/Title"

export interface HeaderPanelsCloseProps extends HTMLAttributes<HTMLElement> {
  className?: string

  titleProps?: TitleProps
  buttonIconicProps?: ButtonIconicProps
  buttonIconicIconProps?: IconProps
}

export function HeaderPanelsClose({
  className = "",
  titleProps,
  buttonIconicProps,
  buttonIconicIconProps,
  ...props
}: HeaderPanelsCloseProps) {
  return (
    <Frame className={"variant-headerPanels-RDZ3pM " + className} {...props}>
      <Title
        {...{ ...seldon.titleProps, ...titleProps }}
        className={
          "seldon-instance child-title-RLi6-E " + (titleProps?.className ?? "")
        }
      />
      <ButtonIconic
        {...{ ...seldon.buttonIconicProps, ...buttonIconicProps }}
        className={
          "seldon-instance child-button-wHazuV " +
          (buttonIconicProps?.className ?? "")
        }
        iconProps={{
          ...seldon.buttonIconicIconProps,
          ...buttonIconicIconProps,
        }}
      />
    </Frame>
  )
}

const seldon: HeaderPanelsCloseProps = {
  titleProps: {
    children: "Title",
    htmlElement: "h4",
  },
  buttonIconicProps: {},
  buttonIconicIconProps: {
    icon: "material-close",
  },
}
