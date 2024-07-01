import { Request, Response, NextFunction } from "express";
import {HashUtil} from "../utils/HashUtil";
import dotenv from "dotenv";
import {AuthConstants} from "../constants/AuthConstants";

dotenv.config();

// TODO: Will move to database if have more time
const users = [
    {
        username: AuthConstants.AUTH_USERNAME,
        password: AuthConstants.AUTH_PASSWORD_HASH
    }, // Original pass: MyPass
];

export const basicAuthHandler = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader("WWW-Authenticate", "Basic");
        return res.status(401).json({ error: "Authentication required" });
    }

    const [, credentials] = authHeader.split(" ");
    const [username, password] = Buffer.from(credentials, "base64").toString().split(":");

    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }

    const isPasswordMatch = await HashUtil.validate(password, user.password);
    if (!isPasswordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    next();
};