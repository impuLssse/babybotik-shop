import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminScene } from './admin.scene';
import { ExtraModule } from '@core/extra';
import { TranslateModule } from '@core/translate';
import { PrismaModule } from '@core/prisma';

@Module({
    imports: [ExtraModule, TranslateModule, PrismaModule],
    providers: [AdminService, AdminScene],
    exports: [AdminService, AdminScene],
})
export class AdminModule {}
