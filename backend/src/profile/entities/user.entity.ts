import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLike } from './user-like.entity';
import { UserDislike } from './user-dislike.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'private_assistant_name',
  })
  privateAssistantName: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserLike, (like) => like.user)
  likes: UserLike[];

  @OneToMany(() => UserDislike, (dislike) => dislike.user)
  dislikes: UserDislike[];
}
