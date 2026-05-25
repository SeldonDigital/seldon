"use client"

import { Button } from "./Button"
import { Text } from "./Text"

export const ErrorPage = ({
  title,
  description,
  reloadButtonLabel = "Try Again",
  error,
}: {
  title: string
  description: string | React.ReactNode
  error?: string
  reloadButtonLabel?: string
}) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <div className="text-center">
        <Text variant="headline" className="mb-2">
          {title}
        </Text>
        <Text variant="body" className="text-neutral-200">
          {description}
        </Text>
        {error && (
          <Text variant="body" className="text-white/70 text-xs mt-4">
            Error: {error}
          </Text>
        )}
      </div>
      <Button
        variant="primary"
        icon="refresh"
        onClick={() => window.location.reload()}
      >
        {reloadButtonLabel}
      </Button>
    </div>
  )
}
