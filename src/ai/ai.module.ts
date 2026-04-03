import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/entities/post.entity.js';
import { NlpService } from './nlp.service.js';
import { OllamaService } from './ollama.service.js';
import { AiAnalysisService } from './ai-analysis.service.js';
import { AiController } from './ai.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [AiController],
  providers: [NlpService, OllamaService, AiAnalysisService],
})
export class AiModule {}
