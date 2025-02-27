// server/api/routers/user.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Update user role
  updateRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        isFreelancer: z.boolean(),
        isClient: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user is updating their own profile
      if (ctx.auth.userId !== input.userId) {
        throw new Error("Unauthorized");
      }

      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isFreelancer: input.isFreelancer,
          isClient: input.isClient,
        },
      });
    }),

  // Switch user role
  switchRole: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user is updating their own profile
      if (ctx.auth.userId !== input.userId) {
        throw new Error("Unauthorized");
      }

      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Toggle roles (if both are true, prioritize freelancer)
      const isFreelancer = user.isFreelancer && user.isClient ? false : !user.isFreelancer;
      const isClient = !isFreelancer;

      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          isFreelancer,
          isClient,
        },
      });
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        username: z.string().min(3).max(30),
        about: z.string().optional(),
        skills: z.array(z.string()).optional(),
        socialLinks: z.array(z.string()).optional(),
        contactInfo: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the user is updating their own profile
      if (ctx.auth.userId !== input.userId) {
        throw new Error("Unauthorized");
      }

      // Check if username is already taken by another user
      const existingUser = await ctx.db.user.findFirst({
        where: {
          username: input.username,
          id: { not: input.userId },
        },
      });

      if (existingUser) {
        throw new Error("Username already taken");
      }

      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          username: input.username,
          about: input.about,
          skills: input.skills || [],
          socialLinks: input.socialLinks || [],
          contactInfo: input.contactInfo || [],
        },
      });
    }),

  // Get user profile
  getProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
        include: {
          portfolioProjects: true,
        },
      });
    }),
});