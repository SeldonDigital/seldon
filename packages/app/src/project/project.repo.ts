import { randomUUID } from "node:crypto"

import { PrismaClient } from "#db"

import type { PrismaTSClient } from "../db.js"
import type {
  NewProjectInput,
  Project,
  ProjectListItem,
  UpdateProjectInput,
} from "./project.type.js"

export async function getProjectsCount(
  prisma: PrismaClient,
  userId: string,
): Promise<number> {
  const count = await prisma.projectAccess.count({
    where: {
      userId,
    },
  })

  return count
}

export async function getUserProjects(
  prisma: PrismaClient,
  userId: string,
): Promise<ProjectListItem[]> {
  const projects = await prisma.projectAccess.findMany({
    include: {
      project: true,
    },
    where: {
      userId,
    },
  })

  if (projects.length === 0) {
    return []
  }

  return projects.map(({ project }) => project)
}

export async function findProjectById(
  prisma: PrismaClient,
  projectId: string,
  userId: string,
): Promise<Project | null> {
  const result = await prisma.projectAccess.findFirst({
    where: {
      projectId,
      userId,
    },
    include: {
      project: {
        include: {
          tree: true,
        },
      },
    },
  })

  if (!result) {
    return null
  }

  return {
    ...result.project,
    tree: (result.project.tree?.tree as any) || {},
  }
}

export async function updateProject(
  prisma: PrismaClient,
  projectId: string,
  input: UpdateProjectInput,
) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: input.name,
      tree: input.tree ? { update: { tree: input.tree } } : undefined,
    },
  })
}

export async function createProject(
  prisma: PrismaTSClient,
  input: NewProjectInput,
): Promise<Project> {
  const project = await prisma.project.create({
    data: {
      id: randomUUID(),
      name: input.name || "Untitled Project",
      tree: { create: { tree: input.tree } },
    },
  })

  return {
    ...project,
    tree: input.tree || {},
  }
}

export async function deleteProject(
  prisma: PrismaTSClient,
  projectId: string,
): Promise<boolean> {
  await prisma.projectTree.deleteMany({
    where: { id: projectId },
  })

  const result = await prisma.project.delete({
    where: { id: projectId },
  })

  return !!result
}
