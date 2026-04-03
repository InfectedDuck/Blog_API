import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { NotificationsService } from '../notifications/notifications.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let mockRepository: any;

  const mockComment = {
    id: 1,
    body: 'Great post!',
    author: { id: 1, username: 'user1' },
    post: { id: 1 },
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockResolvedValue(mockComment),
      findOne: jest.fn(),
      findAndCount: jest.fn().mockResolvedValue([[mockComment], 1]),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: mockRepository },
        { provide: NotificationsService, useValue: { create: jest.fn() } },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  describe('findByPost', () => {
    it('should return paginated comments', async () => {
      const result = await service.findByPost(1, 1, 10);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });
  });

  describe('update', () => {
    it('should allow owner to update', async () => {
      mockRepository.findOne.mockResolvedValue(mockComment);
      await service.update(1, { body: 'Updated' }, 1, 'reader');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should forbid non-owner from updating', async () => {
      mockRepository.findOne.mockResolvedValue(mockComment);
      await expect(
        service.update(1, { body: 'Updated' }, 999, 'reader'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException for missing comment', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(
        service.update(999, { body: 'Updated' }, 1, 'reader'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should allow admin to delete any comment', async () => {
      mockRepository.findOne.mockResolvedValue(mockComment);
      await service.remove(1, 999, 'admin');
      expect(mockRepository.remove).toHaveBeenCalled();
    });
  });
});
