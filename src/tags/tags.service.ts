import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity.js';
import slugify from 'slugify';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({ order: { name: 'ASC' } });
  }

  async findByIds(ids: number[]): Promise<Tag[]> {
    if (!ids || ids.length === 0) return [];
    return this.tagsRepository.findBy({ id: In(ids) });
  }

  async create(name: string): Promise<Tag> {
    const slug = slugify(name, { lower: true, strict: true });
    const existing = await this.tagsRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException('Tag already exists');
    }
    const tag = this.tagsRepository.create({ name, slug });
    return this.tagsRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag not found');
    await this.tagsRepository.remove(tag);
  }
}
