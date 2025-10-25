import { COLORS } from "@lib/ui/colors"
import { cn } from "@lib/utils/cn"
import { motion } from "framer-motion"
import { CSSProperties, ReactNode } from "react"
import { IconId } from "@seldon/core/components/icons"
import { ButtonIconicProps } from "@components/seldon/elements/ButtonIconic"
import { ListItemStandardNode } from "@components/seldon/elements/ListItemStandardNode"
import { IconProps } from "@components/seldon/primitives/Icon"
import { Selectable, SelectableDiv } from "@components/ui/Selectable"
import { useIndentation } from "./contexts/indentation-context"

type ItemProps = {
  icon?: IconId
  children: React.ReactNode
  buttonIconic1Props?: ButtonIconicProps
  buttonIconic1IconProps?: IconProps
  buttonIconic2Props?: ButtonIconicProps
  buttonIconic2IconProps?: IconProps
  overlay?: ReactNode
  expandable?: boolean
  isExpanded?: boolean
  onToggle?: () => void
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  layoutId?: string
} & Omit<SelectableDiv, "onClick" | "as">

export const Item = ({
  icon,
  children,
  buttonIconic1Props,
  buttonIconic1IconProps,
  buttonIconic2Props,
  buttonIconic2IconProps,
  overlay,
  expandable = true,
  isExpanded,
  onToggle,
  onClick,
  layoutId,
  ...selectableProps
}: ItemProps) => {
  // Use indentation context to determine padding for the level
  const indentationLevel = useIndentation()
  const indentationSpace = 16
  const indentationGap = 0
  const indentation = indentationLevel * indentationSpace + indentationGap

  // TODO: Use props instead of styles
  const styles: Record<string, CSSProperties> = {
    selectable: {
      display: "flex",
      flexDirection: "row",
      flexGrow: 1,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.25rem",
      position: "relative",
      paddingRight: "0.25rem",
      paddingLeft: `${indentation}px`,
      height: "fit-content",
    },
    icon: {
      opacity: expandable ? undefined : 0,
      pointerEvents: expandable ? undefined : "none",
      transform: `rotate(${isExpanded ? 90 : 0}deg)`,
      transition: "transform 0.2s ease",
      position: "relative",
      zIndex: 1,
    },
    selection: {
      color:
        selectableProps.state === "selected" ||
        selectableProps.state === "active"
          ? COLORS.blue[500]
          : undefined,
    },
  }

  const ariaExpanded = isExpanded
  const ariaLabel = isExpanded ? "Collapse" : "Expand"
  const onToggleIconClick = expandable ? onToggle : undefined

  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={false}
      transition={{
        layout: {
          type: "spring",
          bounce: 0.15,
          duration: 0.2,
        },
      }}
    >
      <Selectable
        {...selectableProps}
        style={styles.selectable}
        as={"div"}
        onClick={onClick}
        className={cn(
          selectableProps.state !== "static" && "group",
          selectableProps.className,
        )}
      >
        {overlay && <InteractionLayer>{overlay}</InteractionLayer>}
        <ListItemStandardNode
          buttonIconicProps={{
            "aria-expanded": ariaExpanded,
            "aria-label": ariaLabel,
            onClick: (event) => {
              onToggleIconClick?.()
              event.stopPropagation()
            },
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // data-testid is not a valid prop for the Iconic component, though it works
            // @ts-expect-error - data-testid is not a valid prop for the Iconic component, though it works
            "data-testid": "node-toggle-contents-button",
          }}
          buttonIconicIconProps={{
            style: {
              ...styles.icon,
              ...styles.selection,
            },
          }}
          frameIconProps={{
            style: styles.selection,
            icon: icon as IconProps["icon"], // Todo: Remove this cast when we have a proper type for the icon prop
          }}
          frameLabelProps={{
            style: styles.selection,
            children: children as string,
          }}
          buttonIconic1Props={{
            style: { visibility: "hidden" }, // TODO: Fix props
            ...buttonIconic1Props,
          }}
          buttonIconic1IconProps={{
            icon: "seldon-reset",
            ...buttonIconic1IconProps,
          }}
          buttonIconic2Props={{
            style: { visibility: "hidden" }, // TODO: Fix props
            ...buttonIconic2Props,
          }}
          buttonIconic2IconProps={{
            icon: "material-delete",
            ...buttonIconic2IconProps,
          }}
          frame1ButtonIconicProps={{
            // TODO: Use properties and not style
            style: { display: "none" },
          }}
          frame1ButtonIconic1Props={{
            // TODO: Use properties and not style
            style: { display: "none" },
          }}
        />
      </Selectable>
    </motion.div>
  )
}

const InteractionLayer = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="absolute inset-0 flex flex-col"
      style={{ pointerEvents: "none" }}
    >
      <div style={{ pointerEvents: "auto" }}>{children}</div>
    </div>
  )
}
