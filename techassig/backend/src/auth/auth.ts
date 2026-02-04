import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import * as path from "path";

// Database path - works for both local dev and Docker
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../../../frontend/dev.db");
const db = new Database(dbPath);

export const auth = betterAuth({ 
  baseURL: process.env.FRONTEND_URL || "http://localhost:3000",
  database: db as any,
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
});
