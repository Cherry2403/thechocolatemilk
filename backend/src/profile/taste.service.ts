import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLike } from './entities/user-like.entity';
import { UserDislike } from './entities/user-dislike.entity';
import { FeedItem } from '../feed/entities/feed-item.entity';

export interface TasteProfile {
  userId: string;
  topColors: string[];
  topStyles: string[];
  topBrands: string[];
  topCategories: string[];
  likedCount: number;
  dislikedCount: number;
}

@Injectable()
export class TasteService {
  constructor(
    @InjectRepository(UserLike)
    private readonly likeRepo: Repository<UserLike>,
    @InjectRepository(UserDislike)
    private readonly dislikeRepo: Repository<UserDislike>,
  ) {}

  async computeTaste(userId: string): Promise<TasteProfile> {
    const likes = await this.likeRepo.find({
      where: { userId },
      relations: ['item'],
    });

    const dislikes = await this.dislikeRepo.find({
      where: { userId },
    });

    const items = likes
      .map((l) => l.item)
      .filter((item): item is FeedItem => !!item);

    return {
      userId,
      topColors: this.topN(items.flatMap((i) => i.colors ?? []), 5),
      topStyles: this.topN(items.flatMap((i) => i.tags ?? []), 5),
      topBrands: this.topN(
        items.map((i) => i.brand).filter(Boolean),
        5,
      ),
      topCategories: this.topN(
        items.map((i) => i.category).filter(Boolean),
        3,
      ),
      likedCount: likes.length,
      dislikedCount: dislikes.length,
    };
  }

  /** Returns the top N most-frequent strings from an array. */
  private topN(arr: string[], n: number): string[] {
    const freq = new Map<string, number>();
    for (const val of arr) {
      freq.set(val, (freq.get(val) ?? 0) + 1);
    }
    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key]) => key);
  }
}
