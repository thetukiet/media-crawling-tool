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

    async findAll(page: number, limit: number, type: string | null): Promise<[Link[], number]> {
        const queryBuilder = this.repository.createQueryBuilder("link");

        if (type) {
            queryBuilder.where("link.type = :type", { type });
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