import { Expose } from 'class-transformer';

export class UserResponse {
    @Expose()
    id: string;

    @Expose()
    username: string;

    @Expose()
    fullName: string;

}