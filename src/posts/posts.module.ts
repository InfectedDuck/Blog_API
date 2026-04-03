import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity.js';
import { PostsService } from './posts.service.js';
import { PostsController } from './posts.controller.js';
import { TagsModule } from '../tags/tags.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), TagsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
