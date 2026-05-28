import { cn } from "@lib/utils/cn"
import { SelectProps as RadixSelectProps } from "@radix-ui/react-select"
import { Fragment } from "react"
import * as RadixSelect from "@components/ui/RadixSelect"

export type Option = {
  value: string
  label: string
  divider?: boolean
}

interface SelectProps extends RadixSelectProps {
  label?: string
  description?: string
  options: Option[]
  className?: string
}

export function Select({
  label,
  description,
  defaultValue,
  options,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <label className="text-sm text-pearl/80">{label}</label>}
      {description && <p className="text-xs text-pearl/50">{description}</p>}
      <RadixSelect.Select name="repo" defaultValue={defaultValue} {...props}>
        <RadixSelect.SelectTrigger>
          <RadixSelect.SelectValue />
        </RadixSelect.SelectTrigger>
        <RadixSelect.SelectContent>
          {options.map((option) => {
            return (
              <Fragment key={option.value}>
                <RadixSelect.SelectItem key={option.value} value={option.value}>
                  {option.label}
                </RadixSelect.SelectItem>
                {option.divider && <RadixSelect.SelectSeparator />}
              </Fragment>
            )
          })}
        </RadixSelect.SelectContent>
      </RadixSelect.Select>
    </div>
  )
}
