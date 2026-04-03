import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LikesService } from './likes.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('Likes')
@Controller('posts')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle like on a post' })
  toggle(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.likesService.toggle(postId, user.id);
  }

  @Get(':postId/likes')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get like count and status for a post' })
  getLikes(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user?: { id: number },
  ) {
    return this.likesService.getLikesForPost(postId, user?.id);
  }
}
