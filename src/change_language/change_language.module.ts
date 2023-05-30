import { Module } from '@nestjs/common';
import { ChangeLanguageService } from './change_language.service';
import { ExtraModule } from '@core/extra';
import { TranslateModule } from '@core/translate';
import { ChangeLanguageScene } from './change_language.scene';

@Module({
    imports: [ExtraModule, TranslateModule],
    providers: [ChangeLanguageService, ChangeLanguageScene],
    exports: [ChangeLanguageService, ChangeLanguageScene],
})
export class ChangeLanguageModule {}
