import * as bcrypt from 'bcryptjs';

export class HashUtil {
    private static readonly SALT_ROUNDS = 10;

    public static async hash(plainText: string): Promise<string> {
        return bcrypt.hash(plainText, this.SALT_ROUNDS);
    }

    public static async validate(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash);
    }
}