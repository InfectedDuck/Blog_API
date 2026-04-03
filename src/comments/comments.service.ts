import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private notificationsService: NotificationsService,
  ) {}

  async findByPost(postId: number, page = 1, limit = 10) {
    const [comments, total] = await this.commentsRepository.findAndCount({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: comments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async create(postId: number, dto: CreateCommentDto, authorId: number): Promise<Comment> {
    const comment = this.commentsRepository.create({
      body: dto.body,
      post: { id: postId } as any,
      author: { id: authorId } as any,
    });
    const saved = await this.commentsRepository.save(comment);
    // Notify post author
    const commentWithPost = await this.commentsRepository.findOne({
      where: { id: saved.id },
      relations: ['post', 'post.author'],
    });
    if (commentWithPost?.post?.author) {
      await this.notificationsService.create({
        recipientId: commentWithPost.post.author.id,
        actorId: authorId,
        type: 'comment',
        message: 'commented on your post',
        link: `/blog/${commentWithPost.post.slug}`,
      });
    }
    return this.commentsRepository.findOne({
      where: { id: saved.id },
      relations: ['author'],
    }) as Promise<Comment>;
  }

  async update(
    id: number,
    dto: UpdateCommentDto,
    userId: number,
    userRole: string,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only edit your own comments');
    }

    comment.body = dto.body;
    return this.commentsRepository.save(comment);
  }

  async remove(id: number, userId: number, userRole: string): Promise<void> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.author.id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own comments');
    }
    await this.commentsRepository.remove(comment);
  }
}
