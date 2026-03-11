import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const upsertDailyReport = mutation({
	args: {
		date: v.string(),
		totalCost: v.number(),
		totalTokens: v.number(),
		agents: v.array(v.object({
			agent: v.string(),
			cost: v.number(),
			tokens: v.number(),
			sessions: v.number(),
		})),
		history7d: v.array(v.number()),
		tenantId: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		// Find existing report for this date
		const existing = await ctx.db
			.query("costReports")
			.withIndex("by_date", (q) => q.eq("date", args.date))
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, {
				totalCost: args.totalCost,
				totalTokens: args.totalTokens,
				agents: args.agents,
				history7d: args.history7d,
			});
			return existing._id;
		}

		return await ctx.db.insert("costReports", args);
	},
});

export const getLatest = query({
	args: {},
	handler: async (ctx) => {
		const reports = await ctx.db
			.query("costReports")
			.withIndex("by_date")
			.order("desc")
			.take(1);
		return reports[0] ?? null;
	},
});

export const getHistory = query({
	args: { days: v.optional(v.number()) },
	handler: async (ctx, args) => {
		const limit = args.days ?? 30;
		return await ctx.db
			.query("costReports")
			.withIndex("by_date")
			.order("desc")
			.take(limit);
	},
});
