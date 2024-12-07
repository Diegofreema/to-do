import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";

export const getConversations = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db.query("conversations").take(100);
    if (!conversations) return [];

    const userConversations = conversations.filter((c) =>
      c.participants.includes(args.userId),
    );

    return Promise.all(
      userConversations.map(async (c) => {
        const userInfo = await Promise.all(
          c.participants
            .filter((p) => p !== args.userId)
            .map((p) => getParticipants(ctx, p)),
        );

        return {
          ...c,
          userInfo,
        };
      }),
    );
  },
});

const getParticipants = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};
