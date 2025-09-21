import * as dotenv from "dotenv";
import { resolve } from "path";

// Cargar variables desde api/config/.env
dotenv.config({ path: resolve(__dirname, ".env") });

export const env = {
  port: process.env["PORT"] ?? "3000",
  apiPrefix: process.env["API_PREFIX"] ?? "/api",

  userServiceUrl: process.env["USER_SERVICE_URL"] ?? "http://localhost:1882",
  itemServiceUrl: process.env["ITEM_SERVICE_URL"] ?? "http://localhost:1882",

  corsOrigin: process.env["CORS_ORIGIN"]?.split(",") ?? ["http://localhost:4200"],

  db: {
    host: process.env["DB_HOST"] ?? "localhost",
    port: Number(process.env["DB_PORT"] ?? 5432),
    user: process.env["DB_USER"] ?? "admin",
    password: process.env["DB_PASSWORD"] ?? "secret",
    name: process.env["DB_NAME"] ?? "auction_db",
  },

  jwt: {
    secret: process.env["JWT_SECRET"] ?? "default_secret",
    expiresIn: process.env["JWT_EXPIRES_IN"] ?? "1h",
  },
};
