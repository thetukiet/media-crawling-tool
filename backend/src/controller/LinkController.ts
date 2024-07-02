import { Request, Response } from "express";
import { LinkService } from "../service/LinkService";

export class LinkController {
    private linkService: LinkService;

    constructor() {
        this.linkService = new LinkService();
    }

    async processWebUrls(req: Request, res: Response): Promise<void> {
        try {
            const { urls } = req.body;
            const processedLinks = await this.linkService.processWebUrls(urls);
            res.json({ message: "Web URLs processed successfully", links: processedLinks });
        } catch (error) {
            res.status(500).json({ error: "An error occurred while processing web URLs" });
        }
    }

    async getLinks(req: Request, res: Response): Promise<void> {
        try {
            const pageIndex = parseInt(req.query.pageIndex as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const type = req.query.type as string || null;

            const {links, total} = await this.linkService.getLinks(pageIndex, pageSize, type);

            console.log(links);
            res.json({
                data: links,
                meta: {
                    totalRecords: total,
                    totalPages: Math.ceil(total / pageSize)
                },
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "An error occurred while processing links" });
        }
    }
}