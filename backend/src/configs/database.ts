import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

// DATABASE_URL=postgres://admin:admin123@localhost:5432/media
export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "admin123",
    database: "media",
    url: process.env.DATABASE_URL,
    synchronize: false,
    logging: false,
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
    subscribers: ["src/subscribers/**/*.ts"],
});