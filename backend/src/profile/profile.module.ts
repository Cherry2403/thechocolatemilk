import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserLike } from './entities/user-like.entity';
import { UserDislike } from './entities/user-dislike.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TasteService } from './taste.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserLike, UserDislike])],
  controllers: [ProfileController],
  providers: [ProfileService, TasteService],
  exports: [TypeOrmModule],
})
export class ProfileModule {}
