import { ListItemStandardSection } from "@components/seldon/elements/ListItemStandardSection"

export type SectionHeaderProps = {
  children: React.ReactNode
  isExpanded?: boolean
  onClick?: () => void
}

export function SectionHeader({
  children,
  isExpanded,
  onClick,
}: SectionHeaderProps) {
  const ariaExpanded = isExpanded
  const ariaLabel = isExpanded ? "Collapse" : "Expand"
  const iconState = isExpanded ? "material-unfoldLess" : "material-unfoldMore"

  return (
    <ListItemStandardSection
      buttonIconicProps={{}}
      buttonIconicIconProps={{}}
      frameLabelProps={{
        children: children as string,
      }}
      buttonIconic1Props={{}}
      buttonIconic1IconProps={{
        icon: iconState,
        "aria-expanded": ariaExpanded,
        "aria-label": ariaLabel,
      }}
      onClick={onClick}
    />
  )
}
