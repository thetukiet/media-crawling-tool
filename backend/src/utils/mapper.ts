import { plainToClass } from 'class-transformer';

export function mapTo<T>(cls: new () => T, plain: Object): T {
    return plainToClass(cls, plain, { excludeExtraneousValues: true });
}

export function mapToArray<T>(cls: new () => T, plain: Object[]): T[] {
    return plainToClass(cls, plain, { excludeExtraneousValues: true });
}