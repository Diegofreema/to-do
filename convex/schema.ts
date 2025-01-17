import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = {
  name: v.string(),
  isOnline: v.boolean(),
  image: v.string(),
  pushToken: v.optional(v.union(v.string(), v.null())),
  lastSeen: v.optional(v.string()),
  department: v.string(),
  faculty: v.string(),
  userId: v.string(),
};
export const ConversationParticipants = {
  conversationId: v.id("conversations"),
  userId: v.id("users"),
  joinedAt: v.string(),
  role: v.string(),
};
export const Conversation = {
  name: v.optional(v.string()),
  type: v.union(v.literal("single"), v.literal("group")),
  lastMessage: v.optional(v.string()),
  participants: v.array(v.id("users")),
  lastMessageTime: v.optional(v.number()),
  lastMessageSenderId: v.optional(v.id("users")),
  adminMembers: v.optional(v.array(v.id("users"))),
  createdBy: v.optional(v.string()),
};

export const Message = {
  senderId: v.id("users"),
  recipient: v.union(v.id("users"), v.array(v.id("users"))),
  conversationId: v.id("conversations"),
  isEdited: v.optional(v.boolean()),
  content: v.string(),
  image: v.optional(v.id("_storage")),
  contentType: v.union(v.literal("image"), v.literal("text"), v.literal("pdf")),
  seenId: v.array(v.id("users")),
  parentMessageId: v.optional(v.id("messages")),
};

export default defineSchema({
  users: defineTable(User)
    .index("by_department_faculty", ["department", "faculty"])
    .index("by_name", ["name"])
    .index("by_userId", ["userId"])
    .searchIndex("searchName", {
      searchField: "name",
    }),
  conversations: defineTable(Conversation).index("type", ["type"]),
  messages: defineTable(Message)
    .index("by_conversationId", ["conversationId"])
    .index("by_conversationId_recipient", ["conversationId", "recipient"]),
  conversationParticipants: defineTable(ConversationParticipants),
});
