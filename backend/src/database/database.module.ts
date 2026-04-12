import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { baseDataSourceOptions } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...baseDataSourceOptions,
      autoLoadEntities: true,
      migrationsRun: true, // Auto-run pending migrations on app startup
    }),
  ],
})
export class DatabaseModule {}
