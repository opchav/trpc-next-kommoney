import { createRouter } from 'server/createRouter';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';

export const userRouter = createRouter()
  .mutation('add', {
    input: z.object({
      id: z.string().uuid().optional(),
      email: z.string().email(),
      password: z.string().min(8),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    }),
    async resolve({ ctx, input }) {
      // TODO hash password
      const post = await ctx.prisma.user.create({ data: input });
      // console.log('>>>', post);
      return post;
    },
  })
  .query('all', {
    async resolve({ ctx }) {
      return ctx.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });
    },
  })
  .query('byId', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { id } = input;
      const user = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user with id '${id}'`,
        });
      }
      return user;
    },
  })
  // update
  .mutation('edit', {
    input: z.object({
      id: z.string().uuid(),
      data: z.object({
        firstName: z.string().min(1).optional(),
        lastName: z.string().min(1).optional(),
        password: z.string().min(8).optional(),
      }),
    }),
    async resolve({ ctx, input }) {
      const { id, data } = input;
      const user = await ctx.prisma.user.update({
        where: { id },
        data,
      });
      return user;
    },
  });
