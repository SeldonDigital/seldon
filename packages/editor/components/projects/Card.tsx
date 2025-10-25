import { useAddToast } from "@components/toaster/use-add-toast"
import { cn } from "@lib/utils/cn"
import { ReactNode } from "react"
import { Link } from "wouter"

import { Dropdown, DropdownMenuItem } from "./Dropdown"

type Props = {
  testId?: string
  dropdownMenuItems?: DropdownMenuItem[]
  isLoading?: boolean
  to?: string
  title: ReactNode
  disclaimer?: string
  subtitle: ReactNode
  image?: {
    src: string
    alt: string
  }
}

export function Card({
  dropdownMenuItems,
  testId,
  isLoading,
  to,
  title,
  disclaimer,
  subtitle,
  image,
  ...props
}: Props) {
  const addToast = useAddToast()

  return (
    <div
      data-testid={testId}
      className={cn(
        "group relative opacity-100 transition-opacity duration-150",
        isLoading && "opacity-50",
      )}
      {...props}
    >
      <div className="flex h-full flex-col gap-2">
        <MaybeLink
          to={to}
          onClick={() => {
            if (!to) {
              addToast("This feature is coming soon")
            }
          }}
        >
          <div
            className={cn(
              "duration-colors group/link flex aspect-video w-full items-center justify-center rounded-xl bg-black duration-150 overflow-hidden h-[200px] ",
              !image && "border border-gray",
              "hover:border-black",
            )}
            style={
              image
                ? {
                    boxShadow:
                      "0px 2.733px 0px 0px rgba(255, 255, 255, 0.10) inset, 0px 5.467px 5.467px 0px rgba(0, 0, 0, 0.75)",
                  }
                : undefined
            }
          >
            {image ? (
              <img
                src={image.src}
                alt={image.alt}
                className="object-cover relative w-full h-full outline outline-1 outline-white/10 -outline-offset-1 rounded-xl"
                width={300}
                height={162}
              />
            ) : (
              <img
                className="transition-transform duration-150 group-hover/link:scale-105 cover "
                src={"/logo.svg"}
                alt={"Seldon logo"}
                width={56}
                height={56}
              />
            )}
          </div>
        </MaybeLink>
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex w-full flex-col gap-1">
            <div className="flex h-6 items-center">
              <span className="text-sm font-semibold">{title}</span>
            </div>
            <small className="block text-sm opacity-50">{subtitle}</small>
          </div>
          {dropdownMenuItems && (
            <Dropdown menuItems={dropdownMenuItems} testId="dropdown-menu" />
          )}
        </div>
      </div>
    </div>
  )
}

const MaybeLink = ({
  to,
  children,
  onClick,
}: {
  to?: string
  children: ReactNode
  onClick?: () => void
}) => {
  const className = "block cursor-pointer"

  if (!to)
    return (
      <div className={className} onClick={onClick}>
        {children}
      </div>
    )
  return (
    <Link href={to} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
