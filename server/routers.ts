import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  photos: router({
    // Get all approved photos
    listApproved: publicProcedure.query(() => db.getApprovedPhotos()),
    
    // Get pending photos (admin only)
    listPending: adminProcedure.query(() => db.getPendingPhotos()),
    
    // Get single photo by ID
    getById: publicProcedure.input(z.number()).query(({ input }) => db.getPhotoById(input)),
    
    // Upload a photo (requires login)
    upload: protectedProcedure
      .input(z.object({
        photoUrl: z.string().url(),
        title: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(({ ctx, input }) => db.uploadPhoto({
        uploaderId: ctx.user.id,
        photoUrl: input.photoUrl,
        title: input.title,
        description: input.description,
        approvalStatus: "pending",
      })),
    
    // Approve photo (admin only)
    approve: adminProcedure
      .input(z.number())
      .mutation(({ input }) => db.approvePhoto(input)),
    
    // Reject photo (admin only)
    reject: adminProcedure
      .input(z.number())
      .mutation(({ input }) => db.rejectPhoto(input)),
  }),
  
  comments: router({
    // Get comments for a photo
    list: publicProcedure
      .input(z.number())
      .query(({ input }) => db.getPhotoComments(input)),
    
    // Add a comment (requires login)
    add: protectedProcedure
      .input(z.object({
        photoId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(({ ctx, input }) => db.addComment({
        photoId: input.photoId,
        userId: ctx.user.id,
        content: input.content,
      })),
  }),
  
  likes: router({
    // Toggle like on a photo (requires login)
    toggle: protectedProcedure
      .input(z.number())
      .mutation(({ ctx, input }) => db.toggleLike(input, ctx.user.id)),
    
    // Get like count for a photo (admin only)
    getCount: adminProcedure
      .input(z.number())
      .query(({ input }) => db.getLikeCount(input)),
    
    // Check if current user liked a photo
    getUserStatus: protectedProcedure
      .input(z.number())
      .query(({ ctx, input }) => db.getUserLikeStatus(input, ctx.user.id)),
  }),
});

export type AppRouter = typeof appRouter;
