import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linkService: LinksService) {}

  @ApiOperation({
    summary: 'Create a new short link',
    description: 'Takes a long URL and generates a unique 7-character short code for it'
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The link was successfully created' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The provided URL was invalid' })
  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    const link = await this.linkService.create(createLinkDto);
    return link;
  }

  @ApiOperation({
    summary: 'Retrieve a paginated list of links',
    description: 'Fetches a list of all created links, sorted by creation date in descending order. Supports pagination',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    default: 1,
    example: 5,
    description: 'The page number to retrieve'
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    default: 10,
    example: 7,
    description: 'The number of items per page'
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'A paginated list of links has been successfully retrieved' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'The query parameters are not valid integers' })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return await this.linkService.findAll({ page, pageSize });
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
