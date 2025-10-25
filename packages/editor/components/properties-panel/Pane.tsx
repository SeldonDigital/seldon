import { cn } from "@lib/utils/cn"
import { IconChevronDown } from "@components/icons/ChevronDown"
import { IconChevronRight } from "@components/icons/ChevronRight"
import { Text } from "@components/ui/Text"

interface PanelProps {
  title: string
  headerContents?: React.ReactNode
  expanded: boolean
  setExpanded: (expanded: boolean) => void
  children: React.ReactNode
}

export const Pane = ({
  title,
  headerContents,
  expanded,
  setExpanded,
  children,
}: PanelProps) => {
  return (
    <>
      <button
        className={cn(
          "flex h-12 w-full flex-shrink-0 items-center gap-2 bg-background px-[18px]",
          "border-t border-t-neutral-950",
          "hover:bg-white/10",
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <Text variant="callout" className="mr-auto uppercase text-pearl">
          {title}
        </Text>
        {headerContents}
        {expanded ? (
          <IconChevronDown className="text-neutral-100/60" />
        ) : (
          <IconChevronRight className="text-neutral-100/60" />
        )}
      </button>
      {expanded && children}
    </>
  )
}
