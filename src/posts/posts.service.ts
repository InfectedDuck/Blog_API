import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Post } from './entities/post.entity.js';
import { CreatePostDto } from './dto/create-post.dto.js';
import { UpdatePostDto } from './dto/update-post.dto.js';
import { PostQueryDto } from './dto/post-query.dto.js';
import { TagsService } from '../tags/tags.service.js';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private tagsService: TagsService,
  ) {}

  async findAll(query: PostQueryDto, userId?: number, userRole?: string) {
    const { page = 1, limit = 10, search, tag, authorId, status } = query;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tag');

    // Non-admin/author users can only see published posts
    if (!userRole || userRole === 'reader') {
      qb.andWhere('post.status = :status', { status: 'published' });
    } else if (status) {
      qb.andWhere('post.status = :status', { status });
    }

    if (search) {
      qb.andWhere('(post.title LIKE :search OR post.content LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (tag) {
      qb.andWhere('tag.slug = :tag', { tag });
    }

    if (authorId) {
      qb.andWhere('post.authorId = :authorId', { authorId });
    }

    qb.orderBy('post.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [posts, total] = await qb.getManyAndCount();

    return {
      data: posts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'comments', 'comments.author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async create(dto: CreatePostDto, authorId: number): Promise<Post> {
    const slug = await this.generateUniqueSlug(dto.title);
    const tags = dto.tagIds ? await this.tagsService.findByIds(dto.tagIds) : [];

    const post = this.postsRepository.create({
      title: dto.title,
      slug,
      content: dto.content,
      excerpt: dto.excerpt,
      status: dto.status || 'draft',
      publishedAt: dto.status === 'published' ? new Date() : undefined,
      author: { id: authorId } as any,
      tags,
    });

    return this.postsRepository.save(post);
  }

  async update(
    id: number,
    dto: UpdatePostDto,
    userId: number,
    userRole: string,
  ): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'tags'],
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only edit your own posts');
    }

    if (dto.title) {
      post.title = dto.title;
      post.slug = await this.generateUniqueSlug(dto.title, id);
    }
    if (dto.content !== undefined) post.content = dto.content;
    if (dto.excerpt !== undefined) post.excerpt = dto.excerpt;
    if (dto.status) {
      post.status = dto.status;
      if (dto.status === 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }
    if (dto.tagIds) {
      post.tags = await this.tagsService.findByIds(dto.tagIds);
    }

    return this.postsRepository.save(post);
  }

  async remove(id: number, userId: number, userRole: string): Promise<void> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.author.id !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only delete your own posts');
    }
    await this.postsRepository.remove(post);
  }

  private async generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true });
    const qb = this.postsRepository
      .createQueryBuilder('post')
      .where('post.slug = :slug', { slug });

    if (excludeId) {
      qb.andWhere('post.id != :id', { id: excludeId });
    }

    const existing = await qb.getOne();
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    return slug;
  }
}
