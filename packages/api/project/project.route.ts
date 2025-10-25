import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

import type { PublicAppEnv } from "../types.js"
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProject,
  updateProject,
} from "./project.service.js"

export function makeProjectApp() {
  const projectApp = new Hono<PublicAppEnv>()

  // Get all projects
  projectApp.get("/", async (ctx) => {
    const { requestContext } = ctx.var

    const projects = await getAllProjects(requestContext)

    return ctx.json({ data: projects })
  })

  // Get a project
  projectApp.get("/:projectId", async (ctx) => {
    const { requestContext } = ctx.var
    const { projectId } = ctx.req.param()

    const project = await getProject(requestContext, projectId)

    if (project) {
      return ctx.json({ data: project })
    } else {
      ctx.status(404)
      return ctx.json({ success: false })
    }
  })

  // Patch a project
  projectApp.patch(
    "/:projectId",
    zValidator(
      "json",
      z.object({
        tree: z.record(z.any(), z.any()).optional(),
        name: z.string().optional(),
      }),
    ),
    async (ctx) => {
      const { requestContext } = ctx.var
      const { projectId } = ctx.req.param()
      const input = ctx.req.valid("json")

      const updatedProject = await updateProject(
        requestContext,
        projectId,
        input,
      )

      return ctx.json({ data: updatedProject })
    },
  )

  // Create a project
  projectApp.post(
    "/",
    zValidator(
      "json",
      z.object({
        tree: z.record(z.any(), z.any()),
        name: z.string().optional(),
      }),
    ),
    async (ctx) => {
      const { requestContext } = ctx.var

      try {
        const input = ctx.req.valid("json")

        const project = await createProject(requestContext, input)

        return ctx.json({ data: project })
      } catch (err) {
        ctx.status(400)

        return ctx.json({
          success: false,
          error: err instanceof Error ? err.message : "Unexpected error",
        })
      }
    },
  )

  // Delete a project
  projectApp.delete("/:projectId", async (ctx) => {
    const { requestContext } = ctx.var
    const { projectId } = ctx.req.param()

    const result = await deleteProject(requestContext, projectId)

    if (result) {
      return ctx.json({ success: true })
    } else {
      ctx.status(404)
      return ctx.json({ success: false })
    }
  })

  return projectApp
}
