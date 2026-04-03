import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FollowsService } from './follows.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@ApiTags('Follows')
@Controller('users')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle follow/unfollow a user' })
  toggle(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.followsService.toggle(user.id, id);
  }

  @Get(':id/follow-stats')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get follow stats for a user' })
  getStats(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user?: { id: number },
  ) {
    return this.followsService.getStats(id, user?.id);
  }
}
