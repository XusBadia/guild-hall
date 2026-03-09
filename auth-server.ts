import { createServer } from "node:http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/lib/auth";

const PORT = Number(process.env.AUTH_PORT) || 3001;

const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:4173",
	"https://mac-mini-de-xus.tail90936e.ts.net",
];

const handler = toNodeHandler(auth);

const server = createServer((req, res) => {
	const origin = req.headers.origin || "";

	// CORS headers
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Access-Control-Allow-Credentials", "true");
		res.setHeader(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, OPTIONS"
		);
		res.setHeader(
			"Access-Control-Allow-Headers",
			"Content-Type, Authorization"
		);
	}

	// Handle preflight
	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	// All routes go to better-auth
	handler(req, res);
});

server.listen(PORT, () => {
	console.log(`Auth server running on http://localhost:${PORT}`);
});
