import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { nanoid } from 'nanoid';
import { CreateLinkDto } from './dto/create-link.dto';

export interface FindAllLinksOptions {
  page: number;
  pageSize: number;
}

@Injectable()
export class LinksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createLinkDto: CreateLinkDto) {
    const shortCode = nanoid(7);

    return this.prisma.link.create({
      data: {
        longUrl: createLinkDto.longUrl,
        shortCode: shortCode,
      },
    });
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

  async findAll(options: FindAllLinksOptions) {
    const { page, pageSize } = options;
    const skip = (page - 1) * pageSize;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.link.findMany({
        skip: skip,
        take: pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.link.count(),
    ]);

    return { items, total };
  }

  async delete(id: number) {
    const link = await this.prisma.link.findUnique({ where: { id } });
    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }

    return this.prisma.link.delete({
      where: { id },
    });
  }
}
