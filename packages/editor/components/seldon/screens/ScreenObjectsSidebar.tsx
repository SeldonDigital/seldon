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
import { Button, ButtonProps } from "../elements/Button"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import {
  ListItemStandardBoard,
  ListItemStandardBoardProps,
} from "../elements/ListItemStandardBoard"
import {
  ListItemStandardNode,
  ListItemStandardNodeProps,
} from "../elements/ListItemStandardNode"
import {
  ListItemStandardSection,
  ListItemStandardSectionProps,
} from "../elements/ListItemStandardSection"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { LabelProps } from "../primitives/Label"
import { Title, TitleProps } from "../primitives/Title"

export interface ScreenObjectsSidebarProps
  extends HTMLAttributes<HTMLDivElement> {
  className?: string

  frameProps?: FrameProps
  frameButtonIconicProps?: ButtonIconicProps
  frameButtonIconicIconProps?: IconProps
  frameTitleProps?: TitleProps
  frameButton1Props?: ButtonProps
  frameButton1IconProps?: IconProps
  frameButton1LabelProps?: LabelProps
  frameButton2Props?: ButtonProps
  frameButton2IconProps?: IconProps
  frameButton2LabelProps?: LabelProps
  listItemStandardSectionProps?: ListItemStandardSectionProps
  listItemStandardSectionButtonIconicProps?: ButtonIconicProps
  listItemStandardSectionButtonIconicIconProps?: IconProps
  listItemStandardSectionFrameProps?: FrameProps
  listItemStandardSectionFrameLabelProps?: LabelProps
  listItemStandardSectionButtonIconic1Props?: ButtonIconicProps
  listItemStandardSectionButtonIconic1IconProps?: IconProps
  listItemStandardBoard1Props?: ListItemStandardBoardProps
  listItemStandardBoard1ButtonIconicProps?: ButtonIconicProps
  listItemStandardBoard1ButtonIconicIconProps?: IconProps
  listItemStandardBoard1FrameProps?: FrameProps
  listItemStandardBoard1FrameIconProps?: IconProps
  listItemStandardBoard1FrameLabelProps?: LabelProps
  listItemStandardBoard1ButtonIconic1Props?: ButtonIconicProps
  listItemStandardBoard1ButtonIconic1IconProps?: IconProps
  listItemStandardBoard1ButtonIconic2Props?: ButtonIconicProps
  listItemStandardBoard1ButtonIconic2IconProps?: IconProps
  listItemStandardNode2Props?: ListItemStandardNodeProps
  listItemStandardNode2ButtonIconicProps?: ButtonIconicProps
  listItemStandardNode2ButtonIconicIconProps?: IconProps
  listItemStandardNode2FrameProps?: FrameProps
  listItemStandardNode2FrameIconProps?: IconProps
  listItemStandardNode2FrameLabelProps?: LabelProps
  listItemStandardNode2ButtonIconic1Props?: ButtonIconicProps
  listItemStandardNode2ButtonIconic1IconProps?: IconProps
  listItemStandardNode2ButtonIconic2Props?: ButtonIconicProps
  listItemStandardNode2ButtonIconic2IconProps?: IconProps
  listItemStandardNode3Props?: ListItemStandardNodeProps
  listItemStandardNode3ButtonIconicProps?: ButtonIconicProps
  listItemStandardNode3ButtonIconicIconProps?: IconProps
  listItemStandardNode3FrameProps?: FrameProps
  listItemStandardNode3FrameIconProps?: IconProps
  listItemStandardNode3FrameLabelProps?: LabelProps
  listItemStandardNode3ButtonIconic1Props?: ButtonIconicProps
  listItemStandardNode3ButtonIconic1IconProps?: IconProps
  listItemStandardNode3ButtonIconic2Props?: ButtonIconicProps
  listItemStandardNode3ButtonIconic2IconProps?: IconProps
  listItemStandardNode4Props?: ListItemStandardNodeProps
  listItemStandardNode4ButtonIconicProps?: ButtonIconicProps
  listItemStandardNode4ButtonIconicIconProps?: IconProps
  listItemStandardNode4FrameProps?: FrameProps
  listItemStandardNode4FrameIconProps?: IconProps
  listItemStandardNode4FrameLabelProps?: LabelProps
  listItemStandardNode4ButtonIconic1Props?: ButtonIconicProps
  listItemStandardNode4ButtonIconic1IconProps?: IconProps
  listItemStandardNode4ButtonIconic2Props?: ButtonIconicProps
  listItemStandardNode4ButtonIconic2IconProps?: IconProps
  listItemStandardNode5Props?: ListItemStandardNodeProps
  listItemStandardNode5ButtonIconicProps?: ButtonIconicProps
  listItemStandardNode5ButtonIconicIconProps?: IconProps
  listItemStandardNode5FrameProps?: FrameProps
  listItemStandardNode5FrameIconProps?: IconProps
  listItemStandardNode5FrameLabelProps?: LabelProps
  listItemStandardNode5ButtonIconic1Props?: ButtonIconicProps
  listItemStandardNode5ButtonIconic1IconProps?: IconProps
  listItemStandardNode5ButtonIconic2Props?: ButtonIconicProps
  listItemStandardNode5ButtonIconic2IconProps?: IconProps
  listItemStandardNode6Props?: ListItemStandardNodeProps
  listItemStandardNode6ButtonIconicProps?: ButtonIconicProps
  listItemStandardNode6ButtonIconicIconProps?: IconProps
  listItemStandardNode6FrameProps?: FrameProps
  listItemStandardNode6FrameIconProps?: IconProps
  listItemStandardNode6FrameLabelProps?: LabelProps
  listItemStandardNode6ButtonIconic1Props?: ButtonIconicProps
  listItemStandardNode6ButtonIconic1IconProps?: IconProps
  listItemStandardNode6ButtonIconic2Props?: ButtonIconicProps
  listItemStandardNode6ButtonIconic2IconProps?: IconProps
  listItemStandardBoard7Props?: ListItemStandardBoardProps
  listItemStandardBoard7ButtonIconicProps?: ButtonIconicProps
  listItemStandardBoard7ButtonIconicIconProps?: IconProps
  listItemStandardBoard7FrameProps?: FrameProps
  listItemStandardBoard7FrameIconProps?: IconProps
  listItemStandardBoard7FrameLabelProps?: LabelProps
  listItemStandardBoard7ButtonIconic1Props?: ButtonIconicProps
  listItemStandardBoard7ButtonIconic1IconProps?: IconProps
  listItemStandardBoard7ButtonIconic2Props?: ButtonIconicProps
  listItemStandardBoard7ButtonIconic2IconProps?: IconProps
  listItemStandardBoard8Props?: ListItemStandardBoardProps
  listItemStandardBoard8ButtonIconicProps?: ButtonIconicProps
  listItemStandardBoard8ButtonIconicIconProps?: IconProps
  listItemStandardBoard8FrameProps?: FrameProps
  listItemStandardBoard8FrameIconProps?: IconProps
  listItemStandardBoard8FrameLabelProps?: LabelProps
  listItemStandardBoard8ButtonIconic1Props?: ButtonIconicProps
  listItemStandardBoard8ButtonIconic1IconProps?: IconProps
  listItemStandardBoard8ButtonIconic2Props?: ButtonIconicProps
  listItemStandardBoard8ButtonIconic2IconProps?: IconProps
  listItemStandardSection9Props?: ListItemStandardSectionProps
  listItemStandardSection9ButtonIconicProps?: ButtonIconicProps
  listItemStandardSection9ButtonIconicIconProps?: IconProps
  listItemStandardSection9FrameProps?: FrameProps
  listItemStandardSection9FrameLabelProps?: LabelProps
  listItemStandardSection9ButtonIconic1Props?: ButtonIconicProps
  listItemStandardSection9ButtonIconic1IconProps?: IconProps
  listItemStandardSection10Props?: ListItemStandardSectionProps
  listItemStandardSection10ButtonIconicProps?: ButtonIconicProps
  listItemStandardSection10ButtonIconicIconProps?: IconProps
  listItemStandardSection10FrameProps?: FrameProps
  listItemStandardSection10FrameLabelProps?: LabelProps
  listItemStandardSection10ButtonIconic1Props?: ButtonIconicProps
  listItemStandardSection10ButtonIconic1IconProps?: IconProps
}

export function ScreenObjectsSidebar({
  className = "",
  frameProps,
  frameButtonIconicProps,
  frameButtonIconicIconProps,
  frameTitleProps,
  frameButton1Props,
  frameButton1IconProps,
  frameButton1LabelProps,
  frameButton2Props,
  frameButton2IconProps,
  frameButton2LabelProps,
  listItemStandardSectionProps,
  listItemStandardSectionButtonIconicProps,
  listItemStandardSectionButtonIconicIconProps,
  listItemStandardSectionFrameProps,
  listItemStandardSectionFrameLabelProps,
  listItemStandardSectionButtonIconic1Props,
  listItemStandardSectionButtonIconic1IconProps,
  listItemStandardBoard1Props,
  listItemStandardBoard1ButtonIconicProps,
  listItemStandardBoard1ButtonIconicIconProps,
  listItemStandardBoard1FrameProps,
  listItemStandardBoard1FrameIconProps,
  listItemStandardBoard1FrameLabelProps,
  listItemStandardBoard1ButtonIconic1Props,
  listItemStandardBoard1ButtonIconic1IconProps,
  listItemStandardBoard1ButtonIconic2Props,
  listItemStandardBoard1ButtonIconic2IconProps,
  listItemStandardNode2Props,
  listItemStandardNode2ButtonIconicProps,
  listItemStandardNode2ButtonIconicIconProps,
  listItemStandardNode2FrameProps,
  listItemStandardNode2FrameIconProps,
  listItemStandardNode2FrameLabelProps,
  listItemStandardNode2ButtonIconic1Props,
  listItemStandardNode2ButtonIconic1IconProps,
  listItemStandardNode2ButtonIconic2Props,
  listItemStandardNode2ButtonIconic2IconProps,
  listItemStandardNode3Props,
  listItemStandardNode3ButtonIconicProps,
  listItemStandardNode3ButtonIconicIconProps,
  listItemStandardNode3FrameProps,
  listItemStandardNode3FrameIconProps,
  listItemStandardNode3FrameLabelProps,
  listItemStandardNode3ButtonIconic1Props,
  listItemStandardNode3ButtonIconic1IconProps,
  listItemStandardNode3ButtonIconic2Props,
  listItemStandardNode3ButtonIconic2IconProps,
  listItemStandardNode4Props,
  listItemStandardNode4ButtonIconicProps,
  listItemStandardNode4ButtonIconicIconProps,
  listItemStandardNode4FrameProps,
  listItemStandardNode4FrameIconProps,
  listItemStandardNode4FrameLabelProps,
  listItemStandardNode4ButtonIconic1Props,
  listItemStandardNode4ButtonIconic1IconProps,
  listItemStandardNode4ButtonIconic2Props,
  listItemStandardNode4ButtonIconic2IconProps,
  listItemStandardNode5Props,
  listItemStandardNode5ButtonIconicProps,
  listItemStandardNode5ButtonIconicIconProps,
  listItemStandardNode5FrameProps,
  listItemStandardNode5FrameIconProps,
  listItemStandardNode5FrameLabelProps,
  listItemStandardNode5ButtonIconic1Props,
  listItemStandardNode5ButtonIconic1IconProps,
  listItemStandardNode5ButtonIconic2Props,
  listItemStandardNode5ButtonIconic2IconProps,
  listItemStandardNode6Props,
  listItemStandardNode6ButtonIconicProps,
  listItemStandardNode6ButtonIconicIconProps,
  listItemStandardNode6FrameProps,
  listItemStandardNode6FrameIconProps,
  listItemStandardNode6FrameLabelProps,
  listItemStandardNode6ButtonIconic1Props,
  listItemStandardNode6ButtonIconic1IconProps,
  listItemStandardNode6ButtonIconic2Props,
  listItemStandardNode6ButtonIconic2IconProps,
  listItemStandardBoard7Props,
  listItemStandardBoard7ButtonIconicProps,
  listItemStandardBoard7ButtonIconicIconProps,
  listItemStandardBoard7FrameProps,
  listItemStandardBoard7FrameIconProps,
  listItemStandardBoard7FrameLabelProps,
  listItemStandardBoard7ButtonIconic1Props,
  listItemStandardBoard7ButtonIconic1IconProps,
  listItemStandardBoard7ButtonIconic2Props,
  listItemStandardBoard7ButtonIconic2IconProps,
  listItemStandardBoard8Props,
  listItemStandardBoard8ButtonIconicProps,
  listItemStandardBoard8ButtonIconicIconProps,
  listItemStandardBoard8FrameProps,
  listItemStandardBoard8FrameIconProps,
  listItemStandardBoard8FrameLabelProps,
  listItemStandardBoard8ButtonIconic1Props,
  listItemStandardBoard8ButtonIconic1IconProps,
  listItemStandardBoard8ButtonIconic2Props,
  listItemStandardBoard8ButtonIconic2IconProps,
  listItemStandardSection9Props,
  listItemStandardSection9ButtonIconicProps,
  listItemStandardSection9ButtonIconicIconProps,
  listItemStandardSection9FrameProps,
  listItemStandardSection9FrameLabelProps,
  listItemStandardSection9ButtonIconic1Props,
  listItemStandardSection9ButtonIconic1IconProps,
  listItemStandardSection10Props,
  listItemStandardSection10ButtonIconicProps,
  listItemStandardSection10ButtonIconicIconProps,
  listItemStandardSection10FrameProps,
  listItemStandardSection10FrameLabelProps,
  listItemStandardSection10ButtonIconic1Props,
  listItemStandardSection10ButtonIconic1IconProps,
  ...props
}: ScreenObjectsSidebarProps) {
  return (
    <HTMLDiv className={"variant-screen-dVtFTK " + className} {...props}>
      <Frame
        {...{ ...seldon.frameProps, ...frameProps }}
        className={
          "seldon-instance child-frame-qXWf63 " + (frameProps?.className ?? "")
        }
      >
        <ButtonIconic
          {...{ ...seldon.frameButtonIconicProps, ...frameButtonIconicProps }}
          className={
            "seldon-instance child-button-EFxApF " +
            (frameButtonIconicProps?.className ?? "")
          }
          iconProps={{
            ...seldon.frameButtonIconicIconProps,
            ...frameButtonIconicIconProps,
          }}
        />
        <Title
          {...{ ...seldon.frameTitleProps, ...frameTitleProps }}
          className={
            "seldon-instance child-title-4SqS8K " +
            (frameTitleProps?.className ?? "")
          }
        />
        <Button
          {...{ ...seldon.frameButton1Props, ...frameButton1Props }}
          className={
            "seldon-instance child-button-IorLXN " +
            (frameButton1Props?.className ?? "")
          }
          iconProps={{
            ...seldon.frameButton1IconProps,
            ...frameButton1IconProps,
          }}
          labelProps={{
            ...seldon.frameButton1LabelProps,
            ...frameButton1LabelProps,
          }}
        />
        <Button
          {...{ ...seldon.frameButton2Props, ...frameButton2Props }}
          className={
            "seldon-instance child-button-pBbdao " +
            (frameButton2Props?.className ?? "")
          }
          iconProps={{
            ...seldon.frameButton2IconProps,
            ...frameButton2IconProps,
          }}
          labelProps={{
            ...seldon.frameButton2LabelProps,
            ...frameButton2LabelProps,
          }}
        />
      </Frame>
      <ListItemStandardSection
        {...{
          ...seldon.listItemStandardSectionProps,
          ...listItemStandardSectionProps,
        }}
        className={
          "seldon-instance child-listItemStandard-wveG_v " +
          (listItemStandardSectionProps?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardSectionButtonIconicProps,
          ...listItemStandardSectionButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardSectionFrameProps,
          ...listItemStandardSectionFrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardSectionButtonIconic1Props,
          ...listItemStandardSectionButtonIconic1Props,
        }}
      />
      <ListItemStandardBoard
        {...{
          ...seldon.listItemStandardBoard1Props,
          ...listItemStandardBoard1Props,
        }}
        className={
          "seldon-instance child-listItemStandard-BH8NFZ " +
          (listItemStandardBoard1Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardBoard1ButtonIconicProps,
          ...listItemStandardBoard1ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardBoard1FrameProps,
          ...listItemStandardBoard1FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardBoard1ButtonIconic1Props,
          ...listItemStandardBoard1ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardBoard1ButtonIconic2Props,
          ...listItemStandardBoard1ButtonIconic2Props,
        }}
      />
      <ListItemStandardNode
        {...{
          ...seldon.listItemStandardNode2Props,
          ...listItemStandardNode2Props,
        }}
        className={
          "seldon-instance child-listItemStandard-wxxR5r " +
          (listItemStandardNode2Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardNode2ButtonIconicProps,
          ...listItemStandardNode2ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardNode2FrameProps,
          ...listItemStandardNode2FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardNode2ButtonIconic1Props,
          ...listItemStandardNode2ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardNode2ButtonIconic2Props,
          ...listItemStandardNode2ButtonIconic2Props,
        }}
      />
      <ListItemStandardNode
        {...{
          ...seldon.listItemStandardNode3Props,
          ...listItemStandardNode3Props,
        }}
        className={
          "seldon-instance child-listItemStandard-P2a6Kq " +
          (listItemStandardNode3Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardNode3ButtonIconicProps,
          ...listItemStandardNode3ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardNode3FrameProps,
          ...listItemStandardNode3FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardNode3ButtonIconic1Props,
          ...listItemStandardNode3ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardNode3ButtonIconic2Props,
          ...listItemStandardNode3ButtonIconic2Props,
        }}
      />
      <ListItemStandardNode
        {...{
          ...seldon.listItemStandardNode4Props,
          ...listItemStandardNode4Props,
        }}
        className={
          "seldon-instance child-listItemStandard-FrQzmv " +
          (listItemStandardNode4Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardNode4ButtonIconicProps,
          ...listItemStandardNode4ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardNode4FrameProps,
          ...listItemStandardNode4FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardNode4ButtonIconic1Props,
          ...listItemStandardNode4ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardNode4ButtonIconic2Props,
          ...listItemStandardNode4ButtonIconic2Props,
        }}
      />
      <ListItemStandardNode
        {...{
          ...seldon.listItemStandardNode5Props,
          ...listItemStandardNode5Props,
        }}
        className={
          "seldon-instance child-listItemStandard-zhsVtB " +
          (listItemStandardNode5Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardNode5ButtonIconicProps,
          ...listItemStandardNode5ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardNode5FrameProps,
          ...listItemStandardNode5FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardNode5ButtonIconic1Props,
          ...listItemStandardNode5ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardNode5ButtonIconic2Props,
          ...listItemStandardNode5ButtonIconic2Props,
        }}
      />
      <ListItemStandardNode
        {...{
          ...seldon.listItemStandardNode6Props,
          ...listItemStandardNode6Props,
        }}
        className={
          "seldon-instance child-listItemStandard-2xdyFw " +
          (listItemStandardNode6Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardNode6ButtonIconicProps,
          ...listItemStandardNode6ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardNode6FrameProps,
          ...listItemStandardNode6FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardNode6ButtonIconic1Props,
          ...listItemStandardNode6ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardNode6ButtonIconic2Props,
          ...listItemStandardNode6ButtonIconic2Props,
        }}
      />
      <ListItemStandardBoard
        {...{
          ...seldon.listItemStandardBoard7Props,
          ...listItemStandardBoard7Props,
        }}
        className={
          "seldon-instance child-listItemStandard-QZ_rh5 " +
          (listItemStandardBoard7Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardBoard7ButtonIconicProps,
          ...listItemStandardBoard7ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardBoard7FrameProps,
          ...listItemStandardBoard7FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardBoard7ButtonIconic1Props,
          ...listItemStandardBoard7ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardBoard7ButtonIconic2Props,
          ...listItemStandardBoard7ButtonIconic2Props,
        }}
      />
      <ListItemStandardBoard
        {...{
          ...seldon.listItemStandardBoard8Props,
          ...listItemStandardBoard8Props,
        }}
        className={
          "seldon-instance child-listItemStandard-vdivfp " +
          (listItemStandardBoard8Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardBoard8ButtonIconicProps,
          ...listItemStandardBoard8ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardBoard8FrameProps,
          ...listItemStandardBoard8FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardBoard8ButtonIconic1Props,
          ...listItemStandardBoard8ButtonIconic1Props,
        }}
        buttonIconic2Props={{
          ...seldon.listItemStandardBoard8ButtonIconic2Props,
          ...listItemStandardBoard8ButtonIconic2Props,
        }}
      />
      <ListItemStandardSection
        {...{
          ...seldon.listItemStandardSection9Props,
          ...listItemStandardSection9Props,
        }}
        className={
          "seldon-instance child-listItemStandard-r8kl3i " +
          (listItemStandardSection9Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardSection9ButtonIconicProps,
          ...listItemStandardSection9ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardSection9FrameProps,
          ...listItemStandardSection9FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardSection9ButtonIconic1Props,
          ...listItemStandardSection9ButtonIconic1Props,
        }}
      />
      <ListItemStandardSection
        {...{
          ...seldon.listItemStandardSection10Props,
          ...listItemStandardSection10Props,
        }}
        className={
          "seldon-instance child-listItemStandard-WCQbge " +
          (listItemStandardSection10Props?.className ?? "")
        }
        buttonIconicProps={{
          ...seldon.listItemStandardSection10ButtonIconicProps,
          ...listItemStandardSection10ButtonIconicProps,
        }}
        frameProps={{
          ...seldon.listItemStandardSection10FrameProps,
          ...listItemStandardSection10FrameProps,
        }}
        buttonIconic1Props={{
          ...seldon.listItemStandardSection10ButtonIconic1Props,
          ...listItemStandardSection10ButtonIconic1Props,
        }}
      />
    </HTMLDiv>
  )
}

const seldon: ScreenObjectsSidebarProps = {
  frameProps: {},
  frameButtonIconicProps: {},
  frameButtonIconicIconProps: {
    icon: "material-chevronDoubleLeft",
  },
  frameTitleProps: {
    children: "Project Name",
    htmlElement: "h4",
  },
  frameButton1Props: {},
  frameButton1IconProps: {
    icon: "seldon-component",
  },
  frameButton1LabelProps: {
    children: "Add",
    htmlElement: "span",
  },
  frameButton2Props: {},
  frameButton2IconProps: {
    icon: "material-bolt",
  },
  frameButton2LabelProps: {
    children: "Build",
    htmlElement: "span",
  },
  listItemStandardSectionProps: {},
  listItemStandardSectionButtonIconicProps: {},
  listItemStandardSectionButtonIconicIconProps: {
    icon: "seldon-icon",
  },
  listItemStandardSectionFrameProps: {},
  listItemStandardSectionFrameLabelProps: {
    children: "Section Name",
    htmlElement: "span",
  },
  listItemStandardSectionButtonIconic1Props: {},
  listItemStandardSectionButtonIconic1IconProps: {
    icon: "material-unfoldLess",
  },
  listItemStandardBoard1Props: {},
  listItemStandardBoard1ButtonIconicProps: {},
  listItemStandardBoard1ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardBoard1FrameProps: {},
  listItemStandardBoard1FrameIconProps: {
    icon: "seldon-component",
  },
  listItemStandardBoard1FrameLabelProps: {
    children: "Board Name",
    htmlElement: "span",
  },
  listItemStandardBoard1ButtonIconic1Props: {},
  listItemStandardBoard1ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardBoard1ButtonIconic2Props: {},
  listItemStandardBoard1ButtonIconic2IconProps: {
    icon: "material-add",
  },
  listItemStandardNode2Props: {},
  listItemStandardNode2ButtonIconicProps: {},
  listItemStandardNode2ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardNode2FrameProps: {},
  listItemStandardNode2FrameIconProps: {
    icon: "seldon-componentDefault",
  },
  listItemStandardNode2FrameLabelProps: {
    children: "Component Name",
    htmlElement: "span",
  },
  listItemStandardNode2ButtonIconic1Props: {},
  listItemStandardNode2ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardNode2ButtonIconic2Props: {},
  listItemStandardNode2ButtonIconic2IconProps: {
    icon: "material-delete",
  },
  listItemStandardNode3Props: {},
  listItemStandardNode3ButtonIconicProps: {},
  listItemStandardNode3ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardNode3FrameProps: {},
  listItemStandardNode3FrameIconProps: {
    icon: "seldon-componentVariant",
  },
  listItemStandardNode3FrameLabelProps: {
    children: "Component Name",
    htmlElement: "span",
  },
  listItemStandardNode3ButtonIconic1Props: {},
  listItemStandardNode3ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardNode3ButtonIconic2Props: {},
  listItemStandardNode3ButtonIconic2IconProps: {
    icon: "material-delete",
  },
  listItemStandardNode4Props: {},
  listItemStandardNode4ButtonIconicProps: {},
  listItemStandardNode4ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardNode4FrameProps: {},
  listItemStandardNode4FrameIconProps: {
    icon: "seldon-componentVariant",
  },
  listItemStandardNode4FrameLabelProps: {
    children: "Component Name",
    htmlElement: "span",
  },
  listItemStandardNode4ButtonIconic1Props: {},
  listItemStandardNode4ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardNode4ButtonIconic2Props: {},
  listItemStandardNode4ButtonIconic2IconProps: {
    icon: "material-delete",
  },
  listItemStandardNode5Props: {},
  listItemStandardNode5ButtonIconicProps: {},
  listItemStandardNode5ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardNode5FrameProps: {},
  listItemStandardNode5FrameIconProps: {
    icon: "seldon-componentVariant",
  },
  listItemStandardNode5FrameLabelProps: {
    children: "Component Name",
    htmlElement: "span",
  },
  listItemStandardNode5ButtonIconic1Props: {},
  listItemStandardNode5ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardNode5ButtonIconic2Props: {},
  listItemStandardNode5ButtonIconic2IconProps: {
    icon: "material-delete",
  },
  listItemStandardNode6Props: {},
  listItemStandardNode6ButtonIconicProps: {},
  listItemStandardNode6ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardNode6FrameProps: {},
  listItemStandardNode6FrameIconProps: {
    icon: "seldon-componentVariant",
  },
  listItemStandardNode6FrameLabelProps: {
    children: "Component Name",
    htmlElement: "span",
  },
  listItemStandardNode6ButtonIconic1Props: {},
  listItemStandardNode6ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardNode6ButtonIconic2Props: {},
  listItemStandardNode6ButtonIconic2IconProps: {
    icon: "material-delete",
  },
  listItemStandardBoard7Props: {},
  listItemStandardBoard7ButtonIconicProps: {},
  listItemStandardBoard7ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardBoard7FrameProps: {},
  listItemStandardBoard7FrameIconProps: {
    icon: "seldon-component",
  },
  listItemStandardBoard7FrameLabelProps: {
    children: "Board Name",
    htmlElement: "span",
  },
  listItemStandardBoard7ButtonIconic1Props: {},
  listItemStandardBoard7ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardBoard7ButtonIconic2Props: {},
  listItemStandardBoard7ButtonIconic2IconProps: {
    icon: "material-add",
  },
  listItemStandardBoard8Props: {},
  listItemStandardBoard8ButtonIconicProps: {},
  listItemStandardBoard8ButtonIconicIconProps: {
    icon: "material-chevronRight",
  },
  listItemStandardBoard8FrameProps: {},
  listItemStandardBoard8FrameIconProps: {
    icon: "seldon-component",
  },
  listItemStandardBoard8FrameLabelProps: {
    children: "Board Name",
    htmlElement: "span",
  },
  listItemStandardBoard8ButtonIconic1Props: {},
  listItemStandardBoard8ButtonIconic1IconProps: {
    icon: "seldon-reset",
  },
  listItemStandardBoard8ButtonIconic2Props: {},
  listItemStandardBoard8ButtonIconic2IconProps: {
    icon: "material-add",
  },
  listItemStandardSection9Props: {},
  listItemStandardSection9ButtonIconicProps: {},
  listItemStandardSection9ButtonIconicIconProps: {
    icon: "seldon-icon",
  },
  listItemStandardSection9FrameProps: {},
  listItemStandardSection9FrameLabelProps: {
    children: "Section Name",
    htmlElement: "span",
  },
  listItemStandardSection9ButtonIconic1Props: {},
  listItemStandardSection9ButtonIconic1IconProps: {
    icon: "material-unfoldMore",
  },
  listItemStandardSection10Props: {},
  listItemStandardSection10ButtonIconicProps: {},
  listItemStandardSection10ButtonIconicIconProps: {
    icon: "seldon-icon",
  },
  listItemStandardSection10FrameProps: {},
  listItemStandardSection10FrameLabelProps: {
    children: "Section Name",
    htmlElement: "span",
  },
  listItemStandardSection10ButtonIconic1Props: {},
  listItemStandardSection10ButtonIconic1IconProps: {
    icon: "material-unfoldMore",
  },
}
