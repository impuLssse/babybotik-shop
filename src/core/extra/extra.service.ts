import { Injectable } from '@nestjs/common';
import { IContext, IButton, IReplyOrEditOptions } from '@shared/interfaces';
import { Langs, I18nPath } from '@shared/types';
import { TranslateService } from '@core/translate';
import { Buttons, CallbackButton, Keyboard, MakeOptions } from 'telegram-keyboard';

/** Сервис по работе сообщениями
 * * типизурем работу с кнопками
 * * переводим клавиатуру и текстовые фразы на любые указанные языки в `libs/locales`
 * */
@Injectable()
export class ExtraService {
    constructor(private readonly translate: TranslateService) {}

    /** Избавляемся от спама сообщений, путем изменения прошлого текстового сообщения */
    async replyOrEdit(ctx: IContext, lang: Langs, { text, args, extra }: IReplyOrEditOptions) {
        const phrase = this.translate.findPhrase(text, lang, args);

        try {
            return await ctx.editMessageText(phrase, extra);
        } catch (e) {
            return await ctx.sendMessage(phrase, extra);
        }
    }

    /** **Создание типизированой инлайн клавиатуры**
     * * пишем ключ кнопки, например в файл `libs/locales/en/buttons.json`
     * * затем это генерируется - от `libs/shared/types/translate.types.generated.ts`
     * * эта типизация нужна по 2-ум причинам: контракт и перевод
     *
     * @example
     * // можно указывать строками
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard(['buttons.products', 'buttons.back'], 'ru'),
     *   });
     *
     * // либо объектами интерфеса IButton
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard([{ text: 'buttons.products' }, { text: 'buttons.back' }], 'ru'),
     *   });
     *
     * // в два ряда
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard([
     *     [{ text: 'buttons.products' }, { text: 'buttons.admin' }],
     *     [{ text: 'buttons.products' }, { text: 'buttons.back' }]
     * ], 'en'),
     *   });
     *
     * // можно совмещать
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.makeInlineKeyboard([
     *     [{ text: 'buttons.products' }, { text: 'buttons.admin' }],
     *     ['buttons.products', 'buttons.back']
     * ], 'en'),
     *   });
     */
    makeInlineKeyboard(
        raw_buttons: IButton[] | IButton[][] | I18nPath[] | I18nPath[][] | (IButton[] | I18nPath[])[],
        lang?: Langs,
        makeOptions?: MakeOptions,
    ) {
        const parsed_buttons = raw_buttons.map((buttons: string | string[] | IButton | IButton[]) => {
            if (typeof buttons == 'string') {
                return this.toCallbackButton({ text: buttons as I18nPath }, lang);
            }

            if (Array.isArray(buttons)) {
                return buttons
                    .map((button: string | IButton) =>
                        typeof button == 'string' ? this.toCallbackButton({ text: button as I18nPath }, lang) : button,
                    )
                    .map((button) => this.toCallbackButton(button as IButton, lang));
            }

            if (typeof buttons == 'object') {
                return this.toCallbackButton(buttons, lang);
            }
        });

        return Keyboard.inline(parsed_buttons as CallbackButton[], makeOptions);
    }

    /** Создание нетипизированной обычной инлайн клавиатуры (без перевода)
     * @example
     * // можно указывать любые строки (в том числе Key из telegram-keyboard)
     * await ctx.sendMessage(enterPhrase, {
     *       ...extra.simpleInlineKeyboard(['❤ NestJS', '❤ Микросервисы']),
     *   });
     */
    simpleInlineKeyboard(buttons: Buttons, makeOptions?: Partial<MakeOptions>) {
        return Keyboard.inline(buttons, makeOptions as MakeOptions);
    }

    removeKeyboard() {
        return Keyboard.remove();
    }

    private toCallbackButton(button: IButton, lang: Langs): CallbackButton {
        const translatedText = this.translate.findPhrase(button.text, lang, button.args);

        return {
            text: translatedText,
            callback_data: button.callback_data ? button.callback_data : button.text,
            hide: button.hide ? button.hide : false,
        };
    }
}
