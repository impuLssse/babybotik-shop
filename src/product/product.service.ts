import { PrismaService } from '@core/prisma';
import { IPagination } from '@shared/interfaces';
import { Injectable } from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { Pagination } from '@shared/classes';

@Injectable()
export class ProductService {
    constructor(private readonly prisma: PrismaService) {}

    async createProduct(product: Prisma.ProductCreateInput) {
        return await this.prisma.product.create({ data: product, include: { category: true } });
    }

    async findProducts(options?: IPagination, findBy?: Pick<Product, 'categoryId'>): Promise<Product[]> {
        const { offset, limit } = Pagination.transform({ limit: 15, offset: 4 });
        return await this.prisma.product.findMany({ where: {}, skip: offset, take: limit });
    }

    async findProduct(findBy: Pick<Product, 'name' | 'id'>): Promise<Product> {
        return await this.prisma.product.findUnique({ where: { ...findBy } });
    }
}
