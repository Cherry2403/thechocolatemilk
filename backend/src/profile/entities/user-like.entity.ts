import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { FeedItem } from '../../feed/entities/feed-item.entity';

/**
 * Join table: tracks which user liked which feed item, with timestamp.
 *
 * Design: Each entity has both raw @Column fields (userId, itemId) AND
 * @ManyToOne relations (user, item). This is the standard TypeORM pattern:
 * - Raw columns: used for fast queries without JOINs (e.g. likeRepo.find({ where: { userId } }))
 * - Relations: used when you need the full associated object (e.g. relations: ['item'] to get FeedItem data)
 * Both map to the same DB column via @JoinColumn.
 */
@Entity('user_likes')
@Unique(['userId', 'itemId'])
export class UserLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'item_id' })
  itemId: string;

  @CreateDateColumn({ name: 'liked_at' })
  likedAt: Date;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FeedItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: FeedItem;
}
