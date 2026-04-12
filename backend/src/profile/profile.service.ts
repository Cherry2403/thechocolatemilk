import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserLike } from './entities/user-like.entity';
import { UserDislike } from './entities/user-dislike.entity';
import { TasteService } from './taste.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserLike)
    private readonly likeRepo: Repository<UserLike>,
    @InjectRepository(UserDislike)
    private readonly dislikeRepo: Repository<UserDislike>,
    private readonly tasteService: TasteService,
  ) {}

  /**
   * Get user profile with liked/disliked item IDs.
   * TODO: userId will come from JWT in Phase 8.
   */
  async getProfile(userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');

    const likes = await this.likeRepo.find({
      where: { userId },
      order: { likedAt: 'DESC' },
    });

    const dislikes = await this.dislikeRepo.find({
      where: { userId },
      order: { dislikedAt: 'DESC' },
    });

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      privateAssistantName: user.privateAssistantName,
      liked: likes.map((l) => l.itemId),
      disliked: dislikes.map((d) => d.itemId),
    };
  }

  async getTaste(userId: string) {
    return this.tasteService.computeTaste(userId);
  }

  async likeItem(userId: string, itemId: string) {
    // Remove from dislikes if present
    await this.dislikeRepo.delete({ userId, itemId });

    const existing = await this.likeRepo.findOneBy({ userId, itemId });
    if (existing) throw new ConflictException('Already liked');

    const like = this.likeRepo.create({ userId, itemId });
    await this.likeRepo.save(like);
    return { success: true };
  }

  async dislikeItem(userId: string, itemId: string) {
    // Remove from likes if present
    await this.likeRepo.delete({ userId, itemId });

    const existing = await this.dislikeRepo.findOneBy({ userId, itemId });
    if (existing) throw new ConflictException('Already disliked');

    const dislike = this.dislikeRepo.create({ userId, itemId });
    await this.dislikeRepo.save(dislike);
    return { success: true };
  }

  async removeLike(userId: string, itemId: string) {
    const result = await this.likeRepo.delete({ userId, itemId });
    if (result.affected === 0) throw new NotFoundException('Like not found');
    return { success: true };
  }

  async removeDislike(userId: string, itemId: string) {
    const result = await this.dislikeRepo.delete({ userId, itemId });
    if (result.affected === 0)
      throw new NotFoundException('Dislike not found');
    return { success: true };
  }

  /** Get liked items with full feed item data (for profile timeline) */
  async getLikedItems(userId: string) {
    const likes = await this.likeRepo.find({
      where: { userId },
      relations: ['item'],
      order: { likedAt: 'DESC' },
    });
    return likes
      .filter((l) => l.item)
      .map((l) => ({
        id: l.item.id,
        name: l.item.name,
        description: l.item.description,
        image: l.item.imageUrl,
        category: l.item.category,
        brand: l.item.brand,
        productLink: l.item.productLink,
        tags: l.item.tags ?? [],
        colors: l.item.colors ?? [],
        price: l.item.price ? Number(l.item.price) : undefined,
        currency: l.item.currency,
        likedAt: l.likedAt.toISOString(),
      }));
  }

  /** Get disliked items with full feed item data (for profile timeline) */
  async getDislikedItems(userId: string) {
    const dislikes = await this.dislikeRepo.find({
      where: { userId },
      relations: ['item'],
      order: { dislikedAt: 'DESC' },
    });
    return dislikes
      .filter((d) => d.item)
      .map((d) => ({
        id: d.item.id,
        name: d.item.name,
        description: d.item.description,
        image: d.item.imageUrl,
        category: d.item.category,
        brand: d.item.brand,
        productLink: d.item.productLink,
        tags: d.item.tags ?? [],
        colors: d.item.colors ?? [],
        price: d.item.price ? Number(d.item.price) : undefined,
        currency: d.item.currency,
        dislikedAt: d.dislikedAt.toISOString(),
      }));
  }
}
