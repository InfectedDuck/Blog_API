import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { TagsService } from '../tags/tags.service';

describe('PostsService', () => {
  let service: PostsService;
  let mockRepository: any;
  let tagsService: any;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    slug: 'test-post',
    content: 'Test content',
    status: 'published',
    views: 0,
    author: { id: 1, username: 'author' },
    tags: [],
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(mockPost),
      findOne: jest.fn(),
      remove: jest.fn(),
      increment: jest.fn().mockResolvedValue(undefined),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
        getManyAndCount: jest.fn().mockResolvedValue([[mockPost], 1]),
      })),
    };

    tagsService = {
      findByIds: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockRepository },
        { provide: TagsService, useValue: tagsService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('findBySlug', () => {
    it('should return a post', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);
      const result = await service.findBySlug('test-post');
      expect(result.title).toBe('Test Post');
    });

    it('should throw NotFoundException if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.findBySlug('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a post', async () => {
      const result = await service.create(
        { title: 'Test Post', content: 'Test content' },
        1,
      );
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should allow owner to delete', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);
      await service.remove(1, 1, 'author');
      expect(mockRepository.remove).toHaveBeenCalled();
    });

    it('should allow admin to delete any post', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);
      await service.remove(1, 999, 'admin');
      expect(mockRepository.remove).toHaveBeenCalled();
    });

    it('should forbid non-owner from deleting', async () => {
      mockRepository.findOne.mockResolvedValue(mockPost);
      await expect(service.remove(1, 999, 'reader')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException if post not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.remove(999, 1, 'admin')).rejects.toThrow(NotFoundException);
    });
  });
});
