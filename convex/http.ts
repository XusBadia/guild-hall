import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// OpenClaw webhook endpoint
http.route({
	path: "/openclaw/event",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const body = await request.json();
		await ctx.runMutation(api.openclaw.receiveAgentEvent, body);
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}),
});

// Cost report webhook endpoint
http.route({
	path: "/costs/report",
	method: "POST",
	handler: httpAction(async (ctx, request) => {
		const body = await request.json();
		await ctx.runMutation(api.costs.upsertDailyReport, {
			date: body.date,
			totalCost: body.total_cost,
			totalTokens: body.total_tokens,
			agents: body.agents.map((a: { agent: string; cost: number; tokens: number; sessions: number }) => ({
				agent: a.agent,
				cost: a.cost,
				tokens: a.tokens,
				sessions: a.sessions,
			})),
			history7d: body.history_7d || [],
		});
		return new Response(JSON.stringify({ ok: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}),
});

export default http;
