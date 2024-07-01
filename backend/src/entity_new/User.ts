import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// TODO: Move to folder entity and implement UserRepository
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;
}
