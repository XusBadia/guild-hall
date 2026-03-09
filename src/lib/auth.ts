import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
	database: new Database("./auth.db"),
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3001",
	secret:
		process.env.BETTER_AUTH_SECRET ||
		"guild-hall-secret-key-change-in-production-min32chars!",
	emailAndPassword: {
		enabled: true,
		disableSignUp: true,
	},
	trustedOrigins: [
		"http://localhost:5173",
		"http://localhost:4173",
		"https://mac-mini-de-xus.tail90936e.ts.net",
	],
	session: {
		expiresIn: 60 * 60 * 24 * 30, // 30 days
		updateAge: 60 * 60 * 24, // 1 day
	},
});
