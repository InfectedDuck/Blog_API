import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow)
    private followsRepository: Repository<Follow>,
    private notificationsService: NotificationsService,
  ) {}

  async toggle(followerId: number, followingId: number) {
    if (followerId === followingId) {
      return { following: false, followersCount: await this.countFollowers(followingId) };
    }

    const existing = await this.followsRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existing) {
      await this.followsRepository.remove(existing);
      return { following: false, followersCount: await this.countFollowers(followingId) };
    }

    const follow = this.followsRepository.create({
      follower: { id: followerId } as any,
      following: { id: followingId } as any,
    });
    await this.followsRepository.save(follow);

    await this.notificationsService.create({
      recipientId: followingId,
      actorId: followerId,
      type: 'follow',
      message: 'started following you',
      link: `/profile/`,
    });

    return { following: true, followersCount: await this.countFollowers(followingId) };
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const f = await this.followsRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    return !!f;
  }

  async countFollowers(userId: number): Promise<number> {
    return this.followsRepository.count({ where: { following: { id: userId } } });
  }

  async countFollowing(userId: number): Promise<number> {
    return this.followsRepository.count({ where: { follower: { id: userId } } });
  }

  async getStats(userId: number, currentUserId?: number) {
    const followersCount = await this.countFollowers(userId);
    const followingCount = await this.countFollowing(userId);
    const isFollowing = currentUserId ? await this.isFollowing(currentUserId, userId) : false;
    return { followersCount, followingCount, isFollowing };
  }

  async getFollowedUserIds(userId: number): Promise<number[]> {
    const follows = await this.followsRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
    return follows.map((f) => f.following.id);
  }
}
