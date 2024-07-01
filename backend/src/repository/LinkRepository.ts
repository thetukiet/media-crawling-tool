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

    async findAll(page: number, limit: number): Promise<[Link[], number]> {
        return this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
    }

    async deleteByWebUrl(webUrl: string): Promise<void> {
        await this.repository.delete({ webUrl });
    }
}