import { Controller, Post, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { AiAnalysisService } from './ai-analysis.service.js';
import { AnalyzeDto } from './dto/analyze.dto.js';
import { Post as PostEntity } from '../posts/entities/post.entity.js';

@ApiTags('AI Analysis')
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiAnalysisService: AiAnalysisService,
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Analyze a blog post with AI (NLP + Ollama)' })
  async analyze(@Body() dto: AnalyzeDto) {
    const post = await this.postRepository.findOne({ where: { id: dto.postId } });
    if (!post) throw new NotFoundException('Post not found');

    return this.aiAnalysisService.analyzePost(post.content, dto.mode);
  }
}
