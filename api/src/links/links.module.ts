import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';

@Module({
  controllers: [LinksController],
  providers: [PrismaService, LinksService],
})
export class LinksModule {}
