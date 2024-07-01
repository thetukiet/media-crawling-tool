import 'reflect-metadata';
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./configs/database";
import linkRoutes from "./routes/linkRoutes";
import authRoutes from "./routes/authRoutes";
import { loggingMiddleware, errorLoggingMiddleware } from "./middleware/logging";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Routing
app.use("/api/links", linkRoutes);
app.use("/api/auth", authRoutes);

// Logging
app.use(loggingMiddleware);
app.use(errorLoggingMiddleware);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err);
    });

