import { IContext } from '@shared/interfaces';
import { Ctx, SceneEnter } from 'nestjs-telegraf';
import { SceneContract } from '@shared/decorators';
import { ActionContract } from '@shared/decorators/action.decorator';
import { ExtraService } from '@core/extra';
import { TranslateService } from '@core/translate';

@SceneContract('admin')
export class AdminScene {
    constructor(private readonly extra: ExtraService, private readonly translate: TranslateService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        const {
            extra: { replyOrEdit, makeInlineKeyboard },
        } = this;
        const { lang } = ctx.session;
        // const enterPhrase = this.translate.findPhrase('phrases.admin.enter');

        await replyOrEdit(ctx, lang, {
            text: 'phrases.admin.enter',
            extra: {
                ...makeInlineKeyboard([
                    ['buttons.products', 'buttons.change_language'],
                    [{ text: 'buttons.admin', hide: false }],
                ]),
            },
        });
    }

    @ActionContract('buttons.products')
    async toProducts(@Ctx() ctx: IContext) {
        await ctx.scene.enter('products');
    }

    @ActionContract('buttons.back')
    async back(@Ctx() ctx: IContext) {
        await ctx.scene.enter('start');
    }
}
