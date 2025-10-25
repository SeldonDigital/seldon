import { Text } from "@components/ui/Text"

interface PropertyRowProps {
  title: string
  children: React.ReactNode
}

export function PropertyRow({ title, children }: PropertyRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <Text variant="callout" className="text-neutral-100 uppercase">
        {title}
      </Text>
      {children}
    </div>
  )
}
