import { Expose } from 'class-transformer';

export class LinkResponse {
    @Expose()
    id: string;

    @Expose()
    webUrl: string;

    @Expose()
    mediaUrl: string;

    @Expose()
    thumbnail: string;

    @Expose()
    title: string;

    @Expose()
    type: string;
}