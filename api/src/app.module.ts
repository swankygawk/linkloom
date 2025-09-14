import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';
import { LinksController } from './links/links.controller';
import { LinksService } from './links/links.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [LinksModule],
  controllers: [AppController, LinksController],
  providers: [AppService, PrismaService, LinksService],
})
export class AppModule {}
