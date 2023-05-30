import { PrismaService } from '@core/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChaptersService {
    constructor(private readonly prisma: PrismaService) {}

    async getChapters() {
        return await this.prisma;
    }
}
