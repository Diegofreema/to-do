import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllUsers = query({
  args: {
    loggedInUser: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("_id"), args.loggedInUser))
      .collect();
  },
});
export const searchUsers = query({
  args: {
    search: v.string(),
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withSearchIndex("searchName", (q) => q.search("name", args.search))
      .filter((q) => q.neq(q.field("_id"), args.id))
      .collect();
  },
});
export const getUserConvexId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});
export const setUserToOffline = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      isOnline: false,
    });
  },
});
export const setUserToOnline = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.id))
      .first();
    if (!user) return;
    await ctx.db.patch(user._id, {
      isOnline: true,
    });
  },
});
export const getUserById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    console.log(user, "back");
    return user;
  },
});

export const checkIfUserIsInDb = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.id))
      .first();

    return user ? "found" : "not found";
  },
});

export const addUserToDb = mutation({
  args: {
    name: v.string(),
    image: v.string(),
    department: v.string(),
    faculty: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      ...args,
      pushToken: null,
      isOnline: true,
    });
  },
});
