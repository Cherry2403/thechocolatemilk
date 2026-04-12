import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../profile/entities/user.entity';
import { FeedItem } from '../feed/entities/feed-item.entity';
import { UserLike } from '../profile/entities/user-like.entity';
import { UserDislike } from '../profile/entities/user-dislike.entity';
import { Connection } from '../connection/entities/connection.entity';
import { ChatMessage } from '../chat/entities/chat-message.entity';

/**
 * Shared database connection options — single source of truth.
 *
 * Used by:
 * - DatabaseModule (NestJS app runtime — adds autoLoadEntities + migrationsRun)
 * - TypeORM CLI (migration:generate, migration:run, migration:revert)
 * - Seed script
 */
export const baseDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'thelotusunion',
  password: process.env.DB_PASSWORD ?? 'thelotusunion',
  database: process.env.DB_DATABASE ?? 'thelotusunion_dev',
  entities: [User, FeedItem, UserLike, UserDislike, Connection, ChatMessage],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
};

/** Standalone DataSource for TypeORM CLI and seed script. */
export const AppDataSource = new DataSource(baseDataSourceOptions);
