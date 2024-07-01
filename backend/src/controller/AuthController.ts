import { Request, Response } from 'express';
import {AuthService} from "../service/AuthService";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await this.authService.validateUser(username, password);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = this.authService.generateToken(username, password);

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.fullName
            }
        });
    };
}