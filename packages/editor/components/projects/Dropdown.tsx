import { cn } from "@lib/utils/cn"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { IconMore } from "@components/icons/More"

export type DropdownMenuItem = {
  label: string
  action: () => void
  testId?: string
}

type DropdownProps = {
  menuItems: DropdownMenuItem[]
  testId?: string
}

export function Dropdown({ menuItems, testId }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-[4px] transition-colors duration-150",
            "focus:outline-none",
            "hover:bg-white/10",
            "data-[state=open]:bg-white/10",
          )}
          data-testid={testId}
        >
          <IconMore />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="overflow-hidden rounded-[4px] bg-gray text-white z-10"
          align="end"
          sideOffset={5}
        >
          {menuItems.map((item) => (
            <DropdownMenu.Item
              className={cn(
                "min-w-[150px] px-2 py-3 text-[13px]",
                "focus:outline-none",
                "data-[highlighted]:bg-white/10",
              )}
              key={item.label}
              onClick={item.action}
              data-testid={item.testId}
            >
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
