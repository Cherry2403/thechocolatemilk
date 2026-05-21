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
 * Join table: tracks which user dismissed which feed item, with timestamp.
 * Same dual column+relation pattern as UserLike — see user-like.entity.ts for rationale.
 */
@Entity('user_dislikes')
@Unique(['userId', 'itemId'])
export class UserDislike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'item_id' })
  itemId: string;

  @CreateDateColumn({ name: 'disliked_at' })
  dislikedAt: Date;

  @ManyToOne(() => User, (user) => user.dislikes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FeedItem, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: FeedItem;
}
