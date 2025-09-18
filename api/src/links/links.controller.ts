import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';

import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Links')
@Controller('links')
export class LinksController {
  constructor(private readonly linkService: LinksService) {}

  @ApiOperation({
    summary: 'Create a new short link',
    description:
      'Takes a long URL and generates a unique 7-character short code for it',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The link was successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The provided URL was invalid',
  })
  @Post()
  async create(@Body() createLinkDto: CreateLinkDto) {
    return await this.linkService.create(createLinkDto);
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
    description: 'The page number to retrieve',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    default: 10,
    example: 7,
    description: 'The number of items per page',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A paginated list of links has been successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The query parameters are not valid integers',
  })
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ) {
    return await this.linkService.findAll({ page, pageSize });
  }

  @ApiOperation({
    summary: 'Retrieve a single link by its short code',
    description: 'Looks up a short code and returns the full link object',
  })
  @ApiParam({
    name: 'shortCode',
    type: String,
    description: 'The unique 7-character short code for the link',
    example: 'aB3xY7z',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The link was successfully retrieved',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The requested short code does not exist',
  })
  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string) {
    return await this.linkService.findOne(shortCode);
  }
}
