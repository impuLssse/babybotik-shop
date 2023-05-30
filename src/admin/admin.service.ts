import { PrismaService } from '@core/prisma';
import { IContext } from '@libs/shared/interfaces';
import { Injectable } from '@nestjs/common';
import { Admin } from '@prisma/client';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    async isAdmin(ctx: IContext): Promise<Admin> {
        const res = await this.findAdmin(ctx);
        console.log(res);

        return res;
    }

    async findAdmin(ctx: IContext) {
        return await this.prisma.admin.findUnique({ where: { userId: ctx.from.id } });
    }
}
