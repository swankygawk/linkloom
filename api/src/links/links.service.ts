import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { nanoid } from 'nanoid';
import { CreateLinkDto } from './dto/create-link.dto';

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLinkDto: CreateLinkDto) {
    const shortCode = nanoid(7)

    const newLink = await this.prisma.link.create({
      data: {
        longUrl: createLinkDto.longUrl,
        shortCode: shortCode,
      },
    });

    return newLink;
  }

  async findOne(shortCode: string) {
    const link = await this.prisma.link.findUnique({
      where: { shortCode },
    });

    if (!link) {
      throw new NotFoundException(`Link not found`);
    }

    return link;
  }
}
