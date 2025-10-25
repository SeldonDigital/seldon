"use client"

import { HasProjects } from "../HasProjects"
import { ImportProjectButton } from "../ImportProjectButton"
import { NewProjectButton } from "../NewProjectButton"

export const HeroSection = ({ firstName }: { firstName: string }) => {
  return (
    <div className="flex flex-col gap-6 items-center z-10 max-w-[640px] mx-auto pt-8">
      <h1 className="text-5xl text-center text-white font-semibold">
        Welcome to Seldon, {firstName}
      </h1>
      <h2 className="text-2xl text-neutral-400 text-center text-white/60 font-regular">
        Find designs and component libraries in the marketplace, browse design
        systems, or tell Hari what you want to build.
      </h2>

      <HasProjects inverted>
        <div className="flex flex-row items-center gap-2">
          <NewProjectButton />
          <ImportProjectButton />
        </div>
      </HasProjects>
    </div>
  )
}
