import axios from 'axios';
import cheerio from 'cheerio';
import { LinkRepository } from "../repository/LinkRepository";
import { Link } from "../entity/Link";
import { LinkResponse } from "../payload/response/LinkResponse";
import { mapToArray } from "../utils/mapper";

export class LinkService {
    private linkRepository: LinkRepository;

    constructor() {
        this.linkRepository = new LinkRepository();
    }

    async getLinks(pageIndex: number, pageSize: number): Promise<{ links: LinkResponse[], total: number }> {
        const [links, total] = await this.linkRepository.findAll(pageIndex, pageSize);
        return {
            links: mapToArray(LinkResponse, links),
            total
        };
    }

    async processWebUrls(webUrls: string[]): Promise<Link[]> {
        const processedLinks: Link[] = [];

        for (const webUrl of webUrls) {
            // Delete existing records with the same webUrl
            await this.linkRepository.deleteByWebUrl(webUrl);

            // Process new media links
            const mediaLinks = await this.extractMediaLinks(webUrl);
            for (const mediaLink of mediaLinks) {
                const link = new Link();
                link.webUrl = webUrl;
                link.mediaUrl = mediaLink.url;
                link.title = mediaLink.title;
                link.type = mediaLink.type;
                processedLinks.push(await this.linkRepository.save(link));
            }
        }

        return mapToArray(LinkResponse, processedLinks);
    }

    private async extractMediaLinks(webUrl: string): Promise<Array<{ url: string; title: string; type: string }>> {
        try {
            const response = await axios.get(webUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                },
                timeout: 10000, // 10 seconds timeout
            });
            const $ = cheerio.load(response.data);
            const mediaLinks: Array<{ url: string; title: string; type: string }> = [];

            const baseUrl = new URL(webUrl);

            // Get full URL
            const resolveUrl = (relativeUrl: string): string => {
                try {
                    return new URL(relativeUrl, baseUrl.origin).href;
                } catch (error) {
                    return relativeUrl;
                }
            };

            // Extract image links
            $('img').each((_, element) => {
                const src = $(element).attr('src');
                if (src) {
                    const absoluteUrl = resolveUrl(src);
                    const alt = $(element).attr('alt') || '';
                    const title = $(element).attr('title') || alt || 'Untitled Image';
                    mediaLinks.push({ url: absoluteUrl, title, type: 'image' });
                }
            });

            // Extract video links
            $('video').each((_, element) => {
                const $video = $(element);
                const src = $video.find('source').attr('src') || $video.attr('src');
                if (src) {
                    console.log(src);
                    const absoluteUrl = resolveUrl(src);
                    const title = $video.attr('title') || $video.find('track[kind="captions"]').attr('label') || 'Untitled Video';
                    mediaLinks.push({ url: absoluteUrl, title, type: 'video' });
                }
            });

            // Extract embeds links
            $('iframe').each((_, element) => {
                const src = $(element).attr('src');
                if (src) {
                    const absoluteUrl = resolveUrl(src);
                    const title = $(element).attr('title') || 'Embedded Content';
                    if (absoluteUrl.includes('youtube.com') || absoluteUrl.includes('vimeo.com')) {
                        mediaLinks.push({ url: absoluteUrl, title, type: 'video' });
                    }
                }
            });

            return mediaLinks;
        } catch (error) {
            console.error(`Error extracting media links from ${webUrl}:`, error);
            return [];
        }
    }
}