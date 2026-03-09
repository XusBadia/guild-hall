import { auth } from "./src/lib/auth";

async function seedUser() {
	const email = "xus@badia.me";
	const password = "Fl1xGuild2026!";
	const name = "Xus";

	console.log(`Creating user: ${email}...`);

	try {
		// Use the internal adapter to create the user directly, bypassing sign-up disabled check
		const ctx = await auth.$context;
		
		// Hash the password
		const hashedPassword = await ctx.password.hash(password);
		
		// Create user via internal adapter
		const user = await ctx.internalAdapter.createUser({
			email,
			name,
			emailVerified: true,
		});

		// Create account (email/password credentials)
		await ctx.internalAdapter.linkAccount({
			userId: user.id,
			providerId: "credential",
			accountId: user.id,
			password: hashedPassword,
		});

		console.log(`✅ User created successfully!`);
		console.log(`   ID: ${user.id}`);
		console.log(`   Email: ${email}`);
		console.log(`   Name: ${name}`);
	} catch (error: unknown) {
		if (error instanceof Error && error.message?.includes("UNIQUE")) {
			console.log(`⚠️  User ${email} already exists — skipping.`);
		} else {
			console.error("❌ Failed to create user:", error);
			process.exit(1);
		}
	}
}

seedUser();
