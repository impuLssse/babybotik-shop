import { Module } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { PrismaModule } from '@core/prisma';

@Module({
    imports: [PrismaModule],
    providers: [ChaptersService],
    exports: [ChaptersService],
})
export class ChaptersModule {}
