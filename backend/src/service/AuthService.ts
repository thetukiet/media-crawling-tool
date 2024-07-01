import { UserResponse } from '../payload/response/UserResponse';
import * as bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import {AuthConstants} from "../constants/AuthConstants";

dotenv.config();

export class AuthService {
    async validateUser(username: string, password: string): Promise<UserResponse | null> {
        if (username !== AuthConstants.AUTH_USERNAME) {
            return null;
        }

        const isValid = await bcrypt.compare(password, AuthConstants.AUTH_PASSWORD_HASH);

        // TODO: Get from database.
        const mockUser: UserResponse = {
            id: AuthConstants.AUTH_USER_ID,
            username: AuthConstants.AUTH_USERNAME,
            fullName: AuthConstants.AUTH_USER_FULL_NAME
        };

        return isValid ? mockUser : null;
    }

    generateToken(username: string, password: string): string {
        return "Basic " + Buffer.from(`${username}:${password}`).toString('base64');
    }
}