import { Repository } from "typeorm";
import { Link } from "../entity/Link";
import { AppDataSource } from "../configs/database";

export class LinkRepository {
    private repository: Repository<Link>;

    constructor() {
        this.repository = AppDataSource.getRepository(Link);
    }

    async save(link: Link): Promise<Link> {
        return this.repository.save(link);
    }

    async findAll(page: number, limit: number, type: string | null, searchText: string | null): Promise<[Link[], number]> {
        const queryBuilder = this.repository.createQueryBuilder("link");

        if (type) {
            queryBuilder.andWhere("link.type = :type", { type });
        }

        if (searchText && searchText.trim() !== '') {
            queryBuilder.andWhere(
                "(LOWER(link.webUrl) LIKE LOWER(:searchText) OR " +
                "LOWER(link.mediaUrl) LIKE LOWER(:searchText) OR " +
                "LOWER(link.title) LIKE LOWER(:searchText))",
                { searchText: `%${searchText.trim()}%` }
            );
        }

        return queryBuilder
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
    }

    async deleteByWebUrl(webUrl: string): Promise<void> {
        await this.repository.delete({ webUrl });
    }
}