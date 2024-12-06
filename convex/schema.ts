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
  type: v.string(),
  lastMessage: v.optional(v.string()),
  participants: v.array(v.id("users")),
};

export const Message = {
  senderId: v.id("users"),
  recipient: v.id("users"),
  conversationId: v.id("conversations"),
  isEdited: v.boolean(),
  content: v.string(),
  contentType: v.string(),
  seenId: v.array(v.id("users")),
  parentMessageId: v.optional(v.id("messages")),
};

export default defineSchema({
  users: defineTable(User)
    .index("by_department_faculty", ["department", "faculty"])
    .index("by_name", ["name"])
    .index("by_userId", ["userId"]),
  conversations: defineTable(Conversation),
  messages: defineTable(Message),
  conversationParticipants: defineTable(ConversationParticipants),
});
