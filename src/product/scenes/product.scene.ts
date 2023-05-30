import { SceneContract } from '@shared/decorators';
import { IContext } from '@libs/shared/interfaces';
import { Ctx, SceneEnter } from 'nestjs-telegraf';
import { ProductService } from '../product.service';
import { TranslateService } from '@core/translate';
import { ExtraService } from '@core/extra';

@SceneContract('products')
export class ProductScene {
    constructor(
        private readonly productService: ProductService,
        private readonly translate: TranslateService,
        private readonly extra: ExtraService,
    ) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        const { extra, translate, productService } = this;
        const { lang } = ctx.session;

        const notFoundPhrase = translate.findPhrase('phrases.products_not-found.enter');
        const products = await productService.findProducts();
        const productPhrases = products.length > 1 ? products.map((product) => product.name) : [notFoundPhrase];

        await extra.replyOrEdit(ctx, lang, {
            text: 'phrases.products.enter',
            extra: {
                ...extra.simpleInlineKeyboard([productPhrases], {
                    columns: 2,
                }),
            },
        });
    }
}
