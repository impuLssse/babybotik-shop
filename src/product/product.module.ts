import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { CoreModule } from '@core';
import { ProductScene, CreateProductScene } from './scenes';

@Module({
    imports: [CoreModule],
    providers: [ProductService, ProductScene, CreateProductScene],
    exports: [ProductService, ProductScene, CreateProductScene],
})
export class ProductModule {}
