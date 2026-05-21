import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedItem } from './entities/feed-item.entity';
import { FeedQueryDto } from './dto/feed-query.dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(FeedItem)
    private readonly feedRepo: Repository<FeedItem>,
  ) {}

  async findAll(query: FeedQueryDto) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await this.feedRepo.findAndCount({
      order: { createdAt: 'DESC', id: 'ASC' },
      skip,
      take: limit,
    });

    return {
      items: items.map((item) => this.toDto(item)),
      total,
      page,
      limit,
      hasMore: skip + items.length < total,
    };
  }

  async findOne(id: string) {
    const item = await this.feedRepo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Feed item ${id} not found`);
    return this.toDto(item);
  }

  /** Map entity → frontend-compatible DTO shape */
  private toDto(item: FeedItem) {
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.imageUrl,
      category: item.category,
      brand: item.brand,
      productLink: item.productLink,
      tags: item.tags ?? [],
      colors: item.colors ?? [],
      price: item.price ? Number(item.price) : undefined,
      currency: item.currency,
    };
  }
}
