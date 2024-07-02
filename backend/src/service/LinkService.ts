import { LinkRepository } from "../repository/LinkRepository";
import { Link } from "../entity/Link";
import { LinkResponse } from "../payload/response/LinkResponse";
import { mapToArray } from "../utils/mapper";
import puppeteer from 'puppeteer-extra';
import {ThumbnailUtil} from "../utils/ThumbnailUtil";

const fs = require('fs');
const path = require('path');

export class LinkService {
    private linkRepository: LinkRepository;

    constructor() {
        this.linkRepository = new LinkRepository();
    }

    async getLinks(pageIndex: number, pageSize: number, type: string | null): Promise<{ links: LinkResponse[]; total: number }> {
        const [links, total] = await this.linkRepository.findAll(pageIndex, pageSize, type);
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
                link.thumbnail = mediaLink.thumbnail;
                processedLinks.push(await this.linkRepository.save(link));
            }
        }

        return mapToArray(LinkResponse, processedLinks);
    }

    private async extractMediaLinks(webUrl: string): Promise<Array<{ url: string; title: string; type: string; thumbnail: string }>> {
        let browser;
        try {
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.setViewport({ width: 1280, height: 800 });

            await page.goto(webUrl, {
                waitUntil: 'networkidle2',
                timeout: 60000
            });

            // Wait until the images and videos displayed
            await page.waitForSelector('img, video, iframe', { timeout: 60000 });

            const mediaLinks: Array<{ url: string; title: string; type: string }> = await page.evaluate(() => {
                const links: Array<{ url: string; title: string; type: string }> = [];
                const resolveUrl = (url: string) => new URL(url, window.location.origin).href;

                // Extract image links
                document.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src) {
                        const absoluteUrl = resolveUrl(src);
                        const alt = img.getAttribute('alt') || '';
                        const title = img.getAttribute('title') || alt || 'Untitled Image';
                        // TODO: Search for thumbnail
                        links.push({ url: absoluteUrl, title, type: 'image'});
                    }
                });

                // Extract video links
                document.querySelectorAll('video').forEach(video => {
                    const src = video.querySelector('source')?.getAttribute('src') || video.getAttribute('src');
                    if (src) {
                        const absoluteUrl = resolveUrl(src);
                        const title = video.getAttribute('title') || video.querySelector('track[kind="captions"]')?.getAttribute('label') || 'Untitled Video';
                        // TODO: Still have some issue
                        //const thumbnail = ThumbnailUtil.generateThumbnailBase64(absoluteUrl);
                        links.push({ url: absoluteUrl, title, type: 'video' });
                    }
                });

                // Extract embeds links
                document.querySelectorAll('iframe').forEach(iframe => {
                    const src = iframe.getAttribute('src');
                    if (src) {
                        const absoluteUrl = resolveUrl(src);
                        const title = iframe.getAttribute('title') || 'Embedded Content';
                        if (absoluteUrl.includes('youtube.com') || absoluteUrl.includes('vimeo.com')) {
                            // TODO: Search for thumbnail
                            links.push({ url: absoluteUrl, title, type: 'video' });
                        }
                    }
                });

                return links;
            });

            return mediaLinks;
        } catch (error) {
            console.error(`Error extracting media links from ${webUrl}:`, error);
            return [];
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    private async extractMediaLinks2(webUrl: string): Promise<Array<{ url: string; title: string; type: string }>> {
        let browser;
        try {
            browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            await page.goto(webUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            const mediaLinks: Array<{ url: string; title: string; type: string }> = await page.evaluate(() => {
                const links: Array<{ url: string; title: string; type: string }> = [];
                const resolveUrl = (url: string) => new URL(url, window.location.origin).href;

                // Extract image links
                document.querySelectorAll('img').forEach(img => {
                    const src = img.getAttribute('src');
                    if (src) {
                        const absoluteUrl = resolveUrl(src);
                        const alt = img.getAttribute('alt') || '';
                        const title = img.getAttribute('title') || alt || 'Untitled Image';
                        links.push({ url: absoluteUrl, title, type: 'image' });
                    }
                });

                // Extract video links
                document.querySelectorAll('video').forEach(video => {
                    const src = video.querySelector('source')?.getAttribute('src') || video.getAttribute('src');
                    if (src) {
                        const absoluteUrl = resolveUrl(src);
                        const title = video.getAttribute('title') || video.querySelector('track[kind="captions"]')?.getAttribute('label') || 'Untitled Video';
                        links.push({ url: absoluteUrl, title, type: 'video' });
                    }
                });

                // Extract embeds links
                document.querySelectorAll('iframe').forEach(iframe => {
                    const src = iframe.getAttribute('src');
                    if (src) {
                        const absoluteUrl = resolveUrl(src);
                        const title = iframe.getAttribute('title') || 'Embedded Content';
                        if (absoluteUrl.includes('youtube.com') || absoluteUrl.includes('vimeo.com')) {
                            links.push({ url: absoluteUrl, title, type: 'video' });
                        }
                    }
                });

                return links;
            });

            return mediaLinks;
        } catch (error) {
            console.error(`Error extracting media links from ${webUrl}:`, error);
            return [];
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
}
