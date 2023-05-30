import { ExtraService } from '@core/extra';
import { TranslateService } from '@core/translate';
import { IContext } from '@libs/shared/interfaces';
import { I18nPath, Langs } from '@libs/shared/types';
import { ActionContract, SceneContract } from '@shared/decorators';
import { Ctx, SceneEnter } from 'nestjs-telegraf';

@SceneContract('change_language')
export class ChangeLanguageScene {
    constructor(private readonly extra: ExtraService, private readonly translate: TranslateService) {}

    @SceneEnter()
    async enter(@Ctx() ctx: IContext) {
        const { extra, translate } = this;
        const { lang } = ctx.session;

        this.extra.replyOrEdit(ctx, lang, {
            text: 'phrases.change_language.enter',
            extra: {
                ...extra.makeInlineKeyboard(['languages.en', 'languages.ru']),
            },
        });
    }

    @ActionContract(['languages.ru', 'languages.en'])
    async switchLanguage(@Ctx() ctx: IContext) {
        const lang: Langs = ctx.callbackQuery.data.split('.')[1] as Langs;
        ctx.session.lang = lang;

        await ctx.scene.reenter();
    }
}
