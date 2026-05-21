import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../profile/entities/user.entity';

/**
 * A single chat message (from user or assistant) in a conversation.
 *
 * Design: userId column + user ManyToOne relation both point to the same DB column.
 * - userId (raw UUID): for fast queries — WHERE user_id = ? AND contact_id = ?
 * - user (relation): for JOINs when you need the full User object
 * The @JoinColumn tells TypeORM they share the same underlying column.
 *
 * contactId determines which conversation this message belongs to:
 * - For user's own assistant: contactId = userId (talking to yourself)
 * - For a friend's assistant: contactId = friendId
 */
@Entity('chat_messages')
@Index(['userId', 'contactId', 'createdAt'])
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  /**
   * The contact this conversation belongs to.
   * For the user's own assistant: contactId = userId.
   * For a friend's assistant: contactId = friendId.
   */
  @Column({ type: 'uuid', name: 'contact_id' })
  contactId: string;

  @Column({ type: 'varchar', length: 20 })
  role: string; // 'user' | 'assistant'

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'image_url' })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
