import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('feed_items')
export class FeedItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 500, name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'varchar', length: 50 })
  category: string; // 'flower' | 'fashion'

  @Column({ type: 'varchar', length: 100, nullable: true })
  brand: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'product_link',
  })
  productLink: string;

  @Column({ type: 'json', nullable: true })
  tags: string[]; // ["elegant", "minimal", "romantic"]

  @Column({ type: 'json', nullable: true })
  colors: string[]; // ["pink", "white", "navy"]

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
