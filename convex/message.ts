import { v } from "convex/values";
import { mutation } from "@/convex/_generated/server";

export const editMessage = mutation({
  args: {
    content: v.string(),
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId, content }) => {
    await ctx.db.patch(messageId, {
      content,
    });
  },
});
export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, { messageId }) => {
    await ctx.db.delete(messageId);
  },
});
