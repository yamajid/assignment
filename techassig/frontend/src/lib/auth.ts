import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

// Database path - works for both local dev and Docker
const dbPath = process.env.DATABASE_PATH || "./dev.db";
const db = new Database(dbPath);

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  database: db,
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
  trustedOrigins: [process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"],
});