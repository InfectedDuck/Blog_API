import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity.js';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private bookmarksRepository: Repository<Bookmark>,
  ) {}

  async toggle(userId: number, postId: number) {
    const existing = await this.bookmarksRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existing) {
      await this.bookmarksRepository.remove(existing);
      return { bookmarked: false };
    }

    const bookmark = this.bookmarksRepository.create({
      user: { id: userId } as any,
      post: { id: postId } as any,
    });
    await this.bookmarksRepository.save(bookmark);
    return { bookmarked: true };
  }

  async isBookmarked(userId: number, postId: number): Promise<boolean> {
    const b = await this.bookmarksRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
    return !!b;
  }

  async findByUser(userId: number, page = 1, limit = 10) {
    const [bookmarks, total] = await this.bookmarksRepository.findAndCount({
      where: { user: { id: userId } },
      relations: ['post', 'post.author', 'post.tags'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: bookmarks.map((b) => b.post),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
