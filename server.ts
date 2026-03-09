import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./src/lib/auth";

const PORT = Number(process.env.PORT) || 5173;
const DIST = join(import.meta.dirname, "dist");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".webp": "image/webp",
};

const allowedOrigins = [
  "http://localhost:5173",
  "https://mac-mini-de-xus.tail90936e.ts.net",
  `https://mac-mini-de-xus.tail90936e.ts.net:${PORT}`,
];

const authHandler = toNodeHandler(auth);

const server = createServer((req, res) => {
  const origin = req.headers.origin || "";
  
  // CORS
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url || "/";

  // Auth routes → better-auth
  if (url.startsWith("/api/auth")) {
    authHandler(req, res);
    return;
  }

  // Static files from dist/
  let filePath = join(DIST, url === "/" ? "index.html" : url);
  
  if (!existsSync(filePath)) {
    // SPA fallback
    filePath = join(DIST, "index.html");
  }

  try {
    const data = readFileSync(filePath);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🏰 Guild Hall running on http://0.0.0.0:${PORT}`);
});
