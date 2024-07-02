export interface MediaLink {
    id: string;
    webUrl: string;
    mediaUrl: string;
    thumbnail: string;
    title: string;
    type: 'image' | 'video';
}