import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	// In dev, Vite proxies /api/auth/* to the auth server
	// In prod, set VITE_AUTH_URL to the auth server URL
	baseURL: import.meta.env.VITE_AUTH_URL || window.location.origin,
});

export const { signIn, signOut, useSession } = authClient;
