import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity.js';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifRepository: Repository<Notification>,
  ) {}

  async create(data: {
    recipientId: number;
    actorId: number;
    type: string;
    message: string;
    link?: string;
  }): Promise<Notification> {
    if (data.recipientId === data.actorId) return null as any;
    const notif = this.notifRepository.create({
      recipient: { id: data.recipientId } as any,
      actor: { id: data.actorId } as any,
      type: data.type,
      message: data.message,
      link: data.link,
    });
    return this.notifRepository.save(notif);
  }

  async findByUser(userId: number, page = 1, limit = 20) {
    const [notifications, total] = await this.notifRepository.findAndCount({
      where: { recipient: { id: userId } },
      relations: ['actor'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: notifications,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      unreadCount: await this.notifRepository.count({
        where: { recipient: { id: userId }, read: false },
      }),
    };
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notifRepository.count({
      where: { recipient: { id: userId }, read: false },
    });
  }

  async markAllRead(userId: number): Promise<void> {
    await this.notifRepository.update(
      { recipient: { id: userId }, read: false },
      { read: true },
    );
  }

  async markRead(id: number, userId: number): Promise<void> {
    await this.notifRepository.update(
      { id, recipient: { id: userId } },
      { read: true },
    );
  }
}
