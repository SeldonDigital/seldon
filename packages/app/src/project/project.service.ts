import { $repeatable } from "../db.js"
import { logger } from "../logger.js"
import type { ProtectedRequestContext } from "../types.js"
import * as repo from "./project.repo.js"
import type {
  NewProjectInput,
  Project,
  ProjectListItem,
  UpdateProjectInput,
} from "./project.type.js"

export async function getAllProjects(
  ctx: ProtectedRequestContext,
): Promise<ProjectListItem[]> {
  const { userId } = ctx

  const projects = await repo.getUserProjects(ctx.prisma, userId)

  return projects
}

export async function getProject(
  ctx: ProtectedRequestContext,
  projectId: string,
) {
  const { userId } = ctx

  const project = await repo.findProjectById(ctx.prisma, projectId, userId)

  if (!project) {
    logger.info(`Project not found: ${projectId}`)
    return null
  }

  return project
}

export async function updateProject(
  ctx: ProtectedRequestContext,
  projectId: string,
  input: UpdateProjectInput,
) {
  const { userId } = ctx

  const project = await repo.findProjectById(ctx.prisma, projectId, userId)

  await repo.updateProject(ctx.prisma, projectId, input)

  return project
}

export async function createProject(
  ctx: ProtectedRequestContext,
  input: NewProjectInput,
): Promise<Project> {
  const { userId, prisma, priviledgedUser } = ctx

  const currentCount = await repo.getUserProjects(prisma, userId)

  if (!priviledgedUser && currentCount.length >= 5) {
    throw new Error("You can create maximum of 5 projects")
  }

  return $repeatable(prisma, async (tx) => {
    const newProject = await repo.createProject(tx, input)

    return newProject
  })
}

export async function deleteProject(
  ctx: ProtectedRequestContext,
  projectId: string,
): Promise<boolean> {
  const { prisma, userId } = ctx

  await $repeatable(prisma, async (tx) => {
    await repo.deleteProject(tx, projectId)
  })

  return true
}
