import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity.js';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async toggle(postId: number, userId: number) {
    const existing = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (existing) {
      await this.likesRepository.remove(existing);
      const totalLikes = await this.countByPost(postId);
      return { liked: false, totalLikes };
    }

    const like = this.likesRepository.create({
      post: { id: postId } as any,
      user: { id: userId } as any,
    });
    await this.likesRepository.save(like);
    const totalLikes = await this.countByPost(postId);
    return { liked: true, totalLikes };
  }

  async countByPost(postId: number): Promise<number> {
    return this.likesRepository.count({
      where: { post: { id: postId } },
    });
  }

  async isLikedByUser(postId: number, userId: number): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });
    return !!like;
  }

  async getLikesForPost(postId: number, userId?: number) {
    const totalLikes = await this.countByPost(postId);
    const isLiked = userId ? await this.isLikedByUser(postId, userId) : false;
    return { totalLikes, isLiked };
  }
}
