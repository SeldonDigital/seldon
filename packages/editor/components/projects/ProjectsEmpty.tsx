import { Button } from "@components/ui/Button"
import { Text } from "@components/ui/Text"

export function ProjectsEmpty() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center antialiased">
      <div className="flex flex-col items-center">
        <img
          src="/projects-empty.png"
          alt="No projects illustration"
          width={623}
          height={321}
          className="-mb-8"
        />
        <Text variant="display" className="mb-2" as="h1">
          Welcome to Seldon
        </Text>
        <Text variant="headline" className="text-pearl/60 mb-6" as="h2">
          Let&apos;s start by creating a new project.
        </Text>
        <Button href="/new-project" as="link">
          Create Project
        </Button>
      </div>
    </div>
  )
}
