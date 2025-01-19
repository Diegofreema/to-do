import { mutation, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { Id } from "@/convex/_generated/dataModel";
import { paginationOptsValidator } from "convex/server";
import { getUser } from "@/convex/user";

export const getConversations = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("type", (q) => q.eq("type", "single"))
      .filter((q) => q.neq(q.field("lastMessage"), undefined))
      .order("desc")
      .paginate(args.paginationOpts);
    const page = await Promise.all(
      conversations.page
        .filter((m) => m.participants.includes(args.userId))
        .map(async (c) => {
          const user = c.participants.find((p) => p !== args.userId);

          if (!user) {
            throw new Error("No other participant found in conversation");
            // or handle this case differently based on your requirements
          }

          const otherUser = await getUser(ctx, user);

          return {
            id: c._id,
            lastMessage: c.lastMessage,
            lastMessageTime: c.lastMessageTime,
            otherUser,
            lastMessageSenderId: c.lastMessageSenderId,
          };
        }),
    );
    return {
      ...conversations,
      page,
    };
  },
});
export const getGroupConversations = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .withIndex("type", (q) => q.eq("type", "group"))
      .order("desc")
      .paginate(args.paginationOpts);
    const page = await Promise.all(
      conversations.page
        .filter((m) => m.participants.includes(args.userId))
        .map(async (c) => {
          // Make this callback async
          const users = c.participants.filter((item) => item !== args.userId);
          const otherUsers = await Promise.all(
            // Await the array of promises
            users.map(async (u) => await getUser(ctx, u)),
          );

          return {
            id: c._id,
            lastMessage: c.lastMessage,
            name: c.name,
            lastMessageTime: c.lastMessageTime,
            otherUsers, // Now this will be resolved user data
            lastMessageSenderId: c.lastMessageSenderId,
            createdBy: c.createdBy!,
          };
        }),
    );
    return {
      ...conversations,
      page,
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

    const unseenMessages = messages.filter(
      (m) => !m.seenId.includes(args.userId),
    );

    return unseenMessages.length;
  },
});
export const getUnreadAllMessages = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    if (!user) return 0;
    const conversations = await ctx.db.query("conversations").collect();
    if (!conversations) return 0;
    const conversationThatLoggedInUserIsIn = conversations.filter((c) =>
      c.participants.includes(user?._id),
    );
    const messagesThatUserHasNotRead = conversationThatLoggedInUserIsIn.map(
      async (m) => {
        return await getMessagesUnreadCount(ctx, m._id, user?._id);
      },
    );
    const unread = await Promise.all(messagesThatUserHasNotRead);

    return unread.reduce((acc, curr) => acc + curr, 0);
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
export const getGroupConversation = query({
  args: { conversationId: v.id("conversations"), loggedInUser: v.id("users") },
  handler: async (ctx, { conversationId, loggedInUser }) => {
    const conversation = await ctx.db.get(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (!conversation.participants) {
      throw new Error("No participants found");
    }

    const otherUsers = await Promise.all(
      conversation.participants
        .filter((participantId) => participantId !== loggedInUser) // Remove current user
        .map(async (participantId) => {
          return await getUser(ctx, participantId);
        }),
    );

    return {
      ...conversation,
      otherUsers,
    };
  },
});
export const getMessages = query({
  args: {
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId!),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...messages,
      page: messages.page.map((m) => ({
        ...m,
      })),
    };
  },
});
export const getImageUrl = async (ctx: QueryCtx, storageId: Id<"_storage">) => {
  return await ctx.storage.getUrl(storageId);
};
export const getGroupMessages = query({
  args: {
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId!),
      )
      .order("desc")
      .paginate(args.paginationOpts);
    const page = await Promise.all(
      messages.page.map(async (m) => {
        const sender = await getUser(ctx, m.senderId);

        if (!sender) {
          throw new Error("Couldn't get user details");
        }
        const data = {
          ...m,
          image: m.image as string | null,
          senderName: sender.name,
          storageId: undefined,
        };
        if (m.image) {
          const imageUrl = await getImageUrl(ctx, m.image);
          return {
            ...data,
            image: imageUrl,
            storageId: m.image,
          };
        }
        return data;
      }),
    );
    return {
      ...messages,
      page,
    };
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
export const createGroup = mutation({
  args: {
    members: v.array(v.id("users")),
    name: v.string(),
    admin: v.id("users"),
    createdBy: v.string(),
  },
  handler: async (ctx, { members, name, admin, createdBy }) => {
    await ctx.db.insert("conversations", {
      participants: [...members],
      type: "group",
      name: name,
      adminMembers: [admin],
      createdBy,
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
    recipient: v.union(v.id("users"), v.array(v.id("users"))),
    conversationId: v.id("conversations"),
    content: v.string(),
    parentMessageId: v.optional(v.id("messages")),
    contentType: v.union(
      v.literal("image"),
      v.literal("text"),
      v.literal("pdf"),
    ),
    uploadUrl: v.optional(v.string()),
    image: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { uploadUrl, ...rest } = args;
    await ctx.db.insert("messages", {
      ...rest,
      seenId: [args.senderId],
    });
    const lastMessage = args.contentType === "image" ? uploadUrl : args.content;
    await ctx.db.patch(args.conversationId, {
      lastMessage,
      lastMessageTime: Date.now(),
      lastMessageSenderId: args.senderId,
    });
  },
});

export const leaveGroup = mutation({
  args: {
    conversationId: v.id("conversations"),
    loggedInUserId: v.id("users"),
  },
  handler: async (ctx, { conversationId, loggedInUserId }) => {
    const conversation = await ctx.db.get(conversationId);
    if (!conversation) {
      throw new ConvexError("Failed to find group");
    }
    await ctx.db.patch(conversation._id, {
      participants: conversation.participants.filter(
        (p) => p !== loggedInUserId,
      ),
    });
  },
});
// helpers
const getParticipants = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

const getMessagesUnreadCount = async (
  ctx: QueryCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">,
) => {
  const messages = await ctx.db
    .query("messages")
    .filter((q) => q.eq(q.field("conversationId"), conversationId))
    .collect();
  const unreadMessages = messages.filter((m) => !m.seenId.includes(userId));
  return unreadMessages.length || 0;
};
