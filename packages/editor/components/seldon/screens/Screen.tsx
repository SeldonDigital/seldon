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
import { HTMLDiv } from "../native-react/HTML.Div"
import { Title, TitleProps } from "../primitives/Title"

export interface ScreenProps extends HTMLAttributes<HTMLDivElement> {
  className?: string

  titleProps?: TitleProps
}

export function Screen({ className = "", titleProps, ...props }: ScreenProps) {
  return (
    <HTMLDiv className={"variant-screen-default " + className} {...props}>
      <Title
        {...{ ...seldon.titleProps, ...titleProps }}
        className={
          "seldon-instance child-title-YQmEtT " + (titleProps?.className ?? "")
        }
      />
    </HTMLDiv>
  )
}

const seldon: ScreenProps = {
  titleProps: {
    children: "Seldon Interface Tests",
    htmlElement: "h4",
  },
}
