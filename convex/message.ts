import { ConvexError, v } from "convex/values";
import { mutation, query } from "@/convex/_generated/server";
import { getUser } from "@/convex/user";
import { Doc } from "@/convex/_generated/dataModel";

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
    storage: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { messageId, storage }) => {
    await ctx.db.delete(messageId);
    if (storage) {
      await ctx.storage.delete(storage);
    }
  },
});
export const addToGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
    usersToAddIds: v.array(v.id("users")),
  },
  handler: async (ctx, { conversationId, usersToAddIds }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) {
      throw new ConvexError("Failed to find group");
    }
    if (conversation.participants.length === 50) {
      throw new ConvexError("Group is full");
    }
    await ctx.db.patch(conversation._id, {
      participants: [...conversation.participants, ...usersToAddIds],
    });
  },
});

export const makeGroupAdmin = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, { conversationId, userId }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) {
      throw new ConvexError("Failed to find group");
    }
    if (Array.isArray(conversation.adminMembers)) {
      await ctx.db.patch(conversation._id, {
        adminMembers: [...conversation.adminMembers, userId],
      });
    } else {
      await ctx.db.patch(conversationId, {
        adminMembers: [userId],
      });
    }
  },
});
export const closeGroup = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, { conversationId }) => {
    await ctx.db.delete(conversationId);
  },
});
// query

export const getGroupData = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, { conversationId }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }
    const conversationMembers = await Promise.all(
      conversation.participants.map(async (p) => {
        return await getUser(ctx, p);
      }),
    );

    return {
      memberCount: conversationMembers.length,
      members: conversationMembers as Doc<"users">[],
      conversation,
    };
  },
});
