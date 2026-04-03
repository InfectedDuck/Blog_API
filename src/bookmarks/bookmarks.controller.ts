import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';

@ApiTags('Bookmarks')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post('posts/:postId/bookmark')
  @ApiOperation({ summary: 'Toggle bookmark on a post' })
  toggle(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.bookmarksService.toggle(user.id, postId);
  }

  @Get('posts/:postId/bookmark')
  @ApiOperation({ summary: 'Check if a post is bookmarked' })
  async check(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: { id: number },
  ) {
    const bookmarked = await this.bookmarksService.isBookmarked(user.id, postId);
    return { bookmarked };
  }

  @Get('bookmarks')
  @ApiOperation({ summary: 'Get bookmarked posts' })
  findAll(
    @CurrentUser() user: { id: number },
    @Query() query: PaginationQueryDto,
  ) {
    return this.bookmarksService.findByUser(user.id, query.page, query.limit);
  }
}
