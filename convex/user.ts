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

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const checkIfUserIsInDb = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      // @ts-ignore
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
