import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
	...authTables,
	agents: defineTable({
		name: v.string(),
		role: v.string(),
		status: v.union(
			v.literal("idle"),
			v.literal("active"),
			v.literal("blocked"),
		),
		level: v.union(v.literal("LEAD"), v.literal("INT"), v.literal("SPC")),
		avatar: v.string(),
		currentTaskId: v.optional(v.id("tasks")),
		sessionKey: v.optional(v.string()),
		systemPrompt: v.optional(v.string()),
		character: v.optional(v.string()),
		lore: v.optional(v.string()),
		orgId: v.optional(v.string()),
		workspaceId: v.optional(v.string()),
		tenantId: v.optional(v.string()),
		// RPG fields
		rpgClass: v.optional(v.string()), // e.g. "Orchestrator", "Research Mage", "QA Ranger"
		rpgLevel: v.optional(v.number()), // 1-100
		rpgXp: v.optional(v.number()), // current XP
		rpgXpToNext: v.optional(v.number()), // XP needed for next level
		rpgEvolution: v.optional(v.number()), // evolution stage (0=base, 1, 2, 3)
		rpgAnimal: v.optional(v.string()), // e.g. "cat", "owl", "fox"
		rpgEmoji: v.optional(v.string()), // e.g. "🙈", "🧙", "🏹"
		rpgZone: v.optional(v.string()), // current zone in guild map
		rpgStats: v.optional(v.object({
			intelligence: v.number(), // INT
			speed: v.number(),        // SPD
			reliability: v.number(),  // REL
			creativity: v.number(),   // CRE
			stealth: v.number(),      // STL
			endurance: v.number(),    // END
		})),
		rpgTasksCompleted: v.optional(v.number()),
		rpgTasksFailed: v.optional(v.number()),
		rpgStreak: v.optional(v.number()), // consecutive successful tasks
		rpgTitle: v.optional(v.string()), // earned title e.g. "Master Forger"
		spriteSheet: v.optional(v.string()), // URL to sprite sheet
	}).index("by_tenant", ["tenantId"]),

	tasks: defineTable({
		title: v.string(),
		description: v.string(),
		status: v.union(
			v.literal("inbox"),
			v.literal("assigned"),
			v.literal("in_progress"),
			v.literal("review"),
			v.literal("done"),
			v.literal("archived"),
		),
		assigneeIds: v.array(v.id("agents")),
		tags: v.array(v.string()),
		borderColor: v.optional(v.string()),
		sessionKey: v.optional(v.string()),
		openclawRunId: v.optional(v.string()),
		startedAt: v.optional(v.number()),
		usedCodingTools: v.optional(v.boolean()),
		orgId: v.optional(v.string()),
		workspaceId: v.optional(v.string()),
		tenantId: v.optional(v.string()),
		// RPG fields
		rpgXpReward: v.optional(v.number()),
		rpgDifficulty: v.optional(v.union(
			v.literal("trivial"),
			v.literal("easy"),
			v.literal("medium"),
			v.literal("hard"),
			v.literal("legendary"),
		)),
		completedAt: v.optional(v.number()),
	}).index("by_tenant", ["tenantId"]),

	messages: defineTable({
		taskId: v.id("tasks"),
		fromAgentId: v.id("agents"),
		content: v.string(),
		attachments: v.array(v.id("documents")),
		orgId: v.optional(v.string()),
		workspaceId: v.optional(v.string()),
		tenantId: v.optional(v.string()),
	})
		.index("by_tenant", ["tenantId"])
		.index("by_tenant_task", ["tenantId", "taskId"]),

	activities: defineTable({
		type: v.string(),
		agentId: v.id("agents"),
		message: v.string(),
		targetId: v.optional(v.id("tasks")),
		orgId: v.optional(v.string()),
		workspaceId: v.optional(v.string()),
		tenantId: v.optional(v.string()),
	})
		.index("by_tenant", ["tenantId"])
		.index("by_tenant_target", ["tenantId", "targetId"]),

	documents: defineTable({
		title: v.string(),
		content: v.string(),
		type: v.string(),
		path: v.optional(v.string()),
		taskId: v.optional(v.id("tasks")),
		createdByAgentId: v.optional(v.id("agents")),
		messageId: v.optional(v.id("messages")),
		orgId: v.optional(v.string()),
		workspaceId: v.optional(v.string()),
		tenantId: v.optional(v.string()),
	})
		.index("by_tenant", ["tenantId"])
		.index("by_tenant_task", ["tenantId", "taskId"]),

	notifications: defineTable({
		mentionedAgentId: v.id("agents"),
		content: v.string(),
		delivered: v.boolean(),
		orgId: v.optional(v.string()),
		workspaceId: v.optional(v.string()),
		tenantId: v.optional(v.string()),
	}),

	apiTokens: defineTable({
		tokenHash: v.string(),
		tokenPrefix: v.string(),
		tenantId: v.optional(v.string()),
		orgId: v.optional(v.string()),
		name: v.optional(v.string()),
		createdAt: v.number(),
		lastUsedAt: v.optional(v.number()),
		revokedAt: v.optional(v.number()),
	})
		.index("by_tokenHash", ["tokenHash"])
		.index("by_tenant", ["tenantId"]),

	tenantSettings: defineTable({
		tenantId: v.string(),
		retentionDays: v.number(),
		onboardingCompletedAt: v.optional(v.number()),
		createdAt: v.number(),
		updatedAt: v.number(),
	}).index("by_tenant", ["tenantId"]),

	rateLimits: defineTable({
		tenantId: v.optional(v.string()),
		orgId: v.optional(v.string()),
		windowStartMs: v.number(),
		count: v.number(),
	}).index("by_tenant", ["tenantId"]),

	// RPG: XP history for charts
	xpEvents: defineTable({
		agentId: v.id("agents"),
		amount: v.number(),
		reason: v.string(),
		taskId: v.optional(v.id("tasks")),
		tenantId: v.optional(v.string()),
	}).index("by_agent", ["agentId"]),

	// RPG: Guild-wide stats
	guildStats: defineTable({
		tenantId: v.string(),
		totalTasksCompleted: v.number(),
		totalXpEarned: v.number(),
		activeAgents: v.number(),
		updatedAt: v.number(),
	}).index("by_tenant", ["tenantId"]),
});
