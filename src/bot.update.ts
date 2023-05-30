import { Start, Ctx, Update } from 'nestjs-telegraf';
import { ExtraService } from '@core/extra';
import { TranslateService } from '@core/translate';
import { ActionContract } from '@shared/decorators';
import { IContext } from '@shared/interfaces';
import { AdminService } from '@admin';

@Update()
export class BotUpdate {
    constructor(
        private readonly extra: ExtraService,
        private readonly translate: TranslateService,
        private readonly adminService: AdminService,
    ) {}

    @Start()
    async start(@Ctx() ctx: IContext) {
        const { extra, translate, adminService } = this;
        const { lang = 'en' } = ctx.session;

        const enterPhrase = translate.findPhrase('phrases.start.enter', lang, { username: ctx.from.username });
        const isAdmin = !adminService.isAdmin(ctx);

        await ctx.reply(enterPhrase, {
            ...extra.makeInlineKeyboard(
                [['buttons.products', 'buttons.change_language'], [{ text: 'buttons.admin', hide: !isAdmin }]],
                lang,
            ),
        });
    }

    @ActionContract('buttons.products')
    async admin(@Ctx() ctx: IContext) {
        await ctx.scene.enter('products');
    }

    @ActionContract('buttons.change_language')
    async changeLanguage(@Ctx() ctx: IContext) {
        await ctx.scene.enter('change_language');
    }
}
