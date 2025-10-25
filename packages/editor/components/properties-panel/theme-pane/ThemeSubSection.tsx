import React, { CSSProperties, useState } from "react"
import { ListItemStandard } from "@components/seldon/elements/ListItemStandard"
import { Frame } from "@components/seldon/frames/Frame"

type Props = {
  title: string
  children: React.ReactNode
  isInitiallyOpen?: boolean
}

export function ThemeSubSection({
  title,
  children,
  isInitiallyOpen = false,
}: Props) {
  const [open, setIsOpen] = useState(isInitiallyOpen)

  // TODO: Use props instead of styles
  const styles: Record<string, CSSProperties> = {
    icon: {
      transform: `rotate(${open ? 90 : 0}deg)`,
      transition: "transform 0.2s ease",
    },
    frame: {
      padding: 4,
      flexDirection: "column",
    },
  }

  return (
    <>
      <style jsx global>{`
        .theme-sub-section-button {
          cursor: pointer;
        }
      `}</style>
      <ListItemStandard
        frameIconProps={{
          // Todo: Remove this cast when we have a proper type for the icon prop
          style: { display: "none" },
        }}
        frameLabelProps={{
          children: title,
        }}
        buttonIconicIconProps={{
          style: styles.icon,
          "aria-expanded": open,
          "aria-label": title,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          "data-testid": "node-toggle-contents-button", // data-testid is not a valid prop for the Iconic component, though it works
          onClick: () => setIsOpen(!open),
        }}
        buttonIconic1Props={{
          // TODO: Use properties and not style
          style: { display: "none" },
        }}
        buttonIconic2Props={{
          // TODO: Use properties and not style
          style: { display: "none" },
        }}
        className="theme-sub-section-button"
        onClick={() => setIsOpen(!open)}
      />
      {open && <Frame style={styles.frame}>{children}</Frame>}
    </>
  )
}
