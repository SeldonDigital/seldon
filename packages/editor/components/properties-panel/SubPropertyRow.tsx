import { Text } from "@components/ui/Text"

interface SubPropertyRowProps {
  title: string
  children: React.ReactNode
}

export function SubPropertyRow({ title, children }: SubPropertyRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="label-small" className="text-neutral-100/60 uppercase">
        {title}
      </Text>
      {children}
    </div>
  )
}
