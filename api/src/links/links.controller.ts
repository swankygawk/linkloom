import { Controller, Get, Post, Body, Param, Res, ParseFilePipe, HttpStatus } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Links')
@Controller()
export class LinksController {
  constructor(private readonly linkService: LinksService) {}

  @ApiOperation({
    summary: 'Create a new short link',
    description: 'Takes a long URL and generates a unique 7-character short code for it'
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The link was successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The provided URL was invalid.' })
  @Post('links')
  async Create(@Body() createLinkDto: CreateLinkDto) {
    const link = await this.linkService.create(createLinkDto);
    return link;
  }

  @ApiOperation({
    summary: 'Redirect to a long URL',
    description: 'Looks up a short code and performs a redirect to the original long URL',
  })
  @ApiParam({
    name: 'shortCode',
    type: String,
    description: 'The unique 7-character short code for the link',
    example: 'aB3xY7z',
  })
  @ApiResponse({ status: HttpStatus.MOVED_PERMANENTLY, description: 'Successfully redirected to the long URL' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'The requested short code does not exist' })
  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const link = await this.linkService.findOne(shortCode);
    return res.redirect(HttpStatus.MOVED_PERMANENTLY, link.longUrl);
  }
}
