import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("links")
export class Link {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name:"web_url"})
    webUrl: string;

    @Column({name:"media_url"})
    mediaUrl: string;

    @Column()
    thumbnail: string;

    @Column()
    title: string;

    @Column()
    type: string;
}