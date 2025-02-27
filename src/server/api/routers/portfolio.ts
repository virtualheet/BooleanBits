// server/api/routers/portfolio.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const portfolioRouter = createTRPCRouter({
  // Create a new portfolio project
  createProject: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        link: z.string().url().optional().or(z.literal("")),
        images: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user is adding to their own portfolio
      if (ctx.auth.userId !== input.userId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.portfolioProject.create({
        data: {
          title: input.title,
          description: input.description,
          link: input.link || null,
          images: input.images || [],
          user: {
            connect: {
              id: input.userId,
            },
          },
        },
      });
    }),

  // Update a portfolio project
  updateProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        title: z.string().min(1),
        description: z.string().min(1),
        link: z.string().url().optional().or(z.literal("")),
        images: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user owns the project
      const project = await ctx.db.portfolioProject.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (!project || project.userId !== input.userId) {
        throw new Error("Unauthorized or project not found");
      }

      return ctx.db.portfolioProject.update({
        where: {
          id: input.projectId,
        },
        data: {
          title: input.title,
          description: input.description,
          link: input.link || null,
          images: input.images || [],
        },
      });
    }),

  // Delete a portfolio project
  deleteProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user owns the project
      const project = await ctx.db.portfolioProject.findUnique({
        where: {
          id: input.projectId,
        },
      });

      if (!project || project.userId !== input.userId) {
        throw new Error("Unauthorized or project not found");
      }

      return ctx.db.portfolioProject.delete({
        where: {
          id: input.projectId,
        },
      });
    }),

  // Get all portfolio projects for a user
  getProjects: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.portfolioProject.findMany({
        where: {
          userId: input.userId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),
});