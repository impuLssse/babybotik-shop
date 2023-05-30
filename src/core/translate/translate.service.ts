import { I18nPath, I18nTranslations } from '@shared/types';
import { Injectable } from '@nestjs/common';
import { Langs } from '@shared/types';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class TranslateService {
    constructor(private readonly locales: I18nService<I18nTranslations>) {}

    findPhrase(phrase: I18nPath, lang: Langs = 'en', args?: any) {
        return this.locales.translate<I18nPath>(phrase, { lang, args }).toString();
    }
}
