import { Controller, Get, Post, Body, Param, Res, ParseFilePipe, HttpStatus } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import type { Response } from 'express';

@Controller()
export class LinksController {
  constructor(private readonly linkService: LinksService) {}

  @Post('links')
  async Create(@Body() createLinkDto: CreateLinkDto) {
    const link = await this.linkService.create(createLinkDto);
    return link;
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const link = await this.linkService.findOne(shortCode);
    return res.redirect(HttpStatus.PERMANENT_REDIRECT, link.longUrl);
  }
}
