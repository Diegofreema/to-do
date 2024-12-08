import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

export const getConversations = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.and(
          q.neq(q.field("lastMessage"), undefined),
          q.eq(q.field("type"), "single"),
        ),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...conversations,
      page: conversations.page.map((c) => {
        return {
          id: c._id,
          lastMessage: c.lastMessage,
          name: c.name,
          lastMessageTime: c.lastMessageTime,
          otherUserId: c.participants.find((p) => p !== args.userId),
          lastMessageSenderId: c.lastMessageSenderId,
        };
      }),
    };
  },
});

export const getUnreadMessages = query({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId_recipient", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .filter((q) => q.neq(q.field("senderId"), args.userId))
      .collect();
    console.log(messages);
    const unseenMessages = messages.filter(
      (m) => !m.seenId.includes(args.userId),
    );

    return unseenMessages.length;
  },
});
export const getOtherUsers = query({
  args: {
    faculty: v.string(),
    department: v.string(),
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("faculty"), args.faculty),
          q.eq(q.field("department"), args.department),
          q.neq(q.field("_id"), args.userId),
        ),
      )
      .paginate(args.paginationOpts);
    const messages = await ctx.db.query("messages").collect();
    const formattedMessage = messages.map((m) => ({
      senderId: m.senderId,
      recipient: m.recipient,
    }));
    const users = result.page.map((u) => ({
      id: u._id,
      name: u.name,
      image: u.image,
      userId: u.userId,
    }));
    const noMessageUsers = users.filter(
      (user) =>
        !formattedMessage.some(
          (message) =>
            message.senderId === user.id || message.recipient === user.id,
        ),
    );
    return {
      ...result,
      page: noMessageUsers,
    };
  },
});
export const getSingleConversationWithMessages = query({
  args: {
    loggedInUserId: v.id("users"),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db.query("conversations").collect();
    if (!conversations) return null;
    console.log(conversations.length);
    const conversation = conversations.find(
      (c) =>
        (c.participants.length === 2 &&
          c.participants[0] === args.loggedInUserId &&
          c.participants[1] === args.otherUserId) ||
        (c.participants[1] === args.loggedInUserId &&
          c.participants[0] === args.otherUserId),
    );

    if (!conversation) return null;
    const otherUser = await getParticipants(ctx, args.otherUserId);
    return { conversation, otherUser };
  },
});
export const getMessages = query({
  args: {
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    if (!args.conversationId) return [];
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId!),
      )
      .take(300);

    if (!messages) return [];
    return messages.reverse() || [];
  },
});
// mutations

export const createSingleConversation = mutation({
  args: {
    loggedInUserId: v.id("users"),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("conversations", {
      participants: [args.loggedInUserId, args.otherUserId],
      type: "single",
    });
  },
});
export const addSeenId = mutation({
  args: {
    messages: v.array(v.id("messages")),
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const updatePromises = args.messages.map(async (m) => {
      const message = await ctx.db.get(m);
      if (!message) return;

      // Use Set to ensure unique IDs
      const uniqueSeenIds = Array.from(new Set([...message.seenId, args.id]));

      await ctx.db.patch(m, {
        seenId: uniqueSeenIds,
      });
    });

    await Promise.all(updatePromises);
  },
});
export const createMessages = mutation({
  args: {
    senderId: v.id("users"),
    recipient: v.id("users"),
    conversationId: v.id("conversations"),
    content: v.string(),
    parentMessageId: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      ...args,
      contentType: "text",
      seenId: [args.senderId],
    });
    await ctx.db.patch(args.conversationId, {
      lastMessage: args.content,
      lastMessageTime: Date.now(),
      lastMessageSenderId: args.senderId,
    });
  },
});

// helpers
const getParticipants = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};
