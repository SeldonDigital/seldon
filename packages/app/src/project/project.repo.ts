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
  const count = await prisma.project.count({})

  return count
}

export async function getProjects(
  prisma: PrismaClient,
): Promise<ProjectListItem[]> {
  return await prisma.project.findMany({});
}

export async function findProjectById(
  prisma: PrismaClient,
  projectId: string,
): Promise<Project | null> {
  const result = await prisma.project.findFirst({
    include: {
      tree: true,
    },
    where: {
      id: projectId,
    },
  })

  if (!result) {
    return null
  }

  return {
    ...result,
    tree: (result.tree?.tree as any) || {},
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
