import type {
  NewProjectInput,
  Project,
  ProjectListItem,
  UpdateProjectInput,
} from "#shared/project.type.js"

import { $repeatable } from "../db.js"
import { logger } from "../logger.js"
import type { RequestContext } from "../types.js"
import * as repo from "./project.repo.js"

export async function getAllProjects(
  ctx: RequestContext,
): Promise<ProjectListItem[]> {
  const projects = await repo.getProjects(ctx.prisma)

  return projects
}

export async function getProject(ctx: RequestContext, projectId: string) {
  const project = await repo.findProjectById(ctx.prisma, projectId)

  if (!project) {
    logger.info(`Project not found: ${projectId}`)
    return null
  }

  return project
}

export async function updateProject(
  ctx: RequestContext,
  projectId: string,
  input: UpdateProjectInput,
) {
  const project = await repo.findProjectById(ctx.prisma, projectId)

  await repo.updateProject(ctx.prisma, projectId, input)

  return project
}

export async function createProject(
  ctx: RequestContext,
  input: NewProjectInput,
): Promise<Project> {
  const { prisma } = ctx

  return $repeatable(prisma, async (tx) => {
    const newProject = await repo.createProject(tx, input)

    return newProject
  })
}

export async function deleteProject(
  ctx: RequestContext,
  projectId: string,
): Promise<boolean> {
  const { prisma } = ctx

  await $repeatable(prisma, async (tx) => {
    await repo.deleteProject(tx, projectId)
  })

  return true
}
