import { mutation, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { Id } from "@/convex/_generated/dataModel";

export const getAllUsers = query({
  args: {
    loggedInUser: v.string(),
    department: v.string(),
    faculty: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("users")
      .withIndex("by_department_faculty", (q) =>
        q.eq("department", args.department).eq("faculty", args.faculty),
      )
      .filter((q) => q.neq(q.field("userId"), args.loggedInUser))
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map((r) => ({
        ...r,
      })),
    };
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
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
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

// helpers
export const getUser = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};
