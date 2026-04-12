import { Controller, Get, Post, Delete, Param, Headers, BadRequestException } from '@nestjs/common';
import { ProfileService } from './profile.service';

/**
 * Extract userId from x-user-id header.
 * TODO: Replace with JWT-based auth guard in Phase 8.
 */
function getUserId(headers: Record<string, string>): string {
  const id = headers['x-user-id'];
  if (!id) throw new BadRequestException('Missing x-user-id header');
  return id;
}

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@Headers() headers: Record<string, string>) {
    return this.profileService.getProfile(getUserId(headers));
  }

  @Get(':userId/taste')
  getTaste(@Param('userId') userId: string) {
    return this.profileService.getTaste(userId);
  }

  @Get('liked')
  getLikedItems(@Headers() headers: Record<string, string>) {
    return this.profileService.getLikedItems(getUserId(headers));
  }

  @Get('disliked')
  getDislikedItems(@Headers() headers: Record<string, string>) {
    return this.profileService.getDislikedItems(getUserId(headers));
  }

  @Post('like/:itemId')
  likeItem(
    @Headers() headers: Record<string, string>,
    @Param('itemId') itemId: string,
  ) {
    return this.profileService.likeItem(getUserId(headers), itemId);
  }

  @Post('dislike/:itemId')
  dislikeItem(
    @Headers() headers: Record<string, string>,
    @Param('itemId') itemId: string,
  ) {
    return this.profileService.dislikeItem(getUserId(headers), itemId);
  }

  @Delete('like/:itemId')
  removeLike(
    @Headers() headers: Record<string, string>,
    @Param('itemId') itemId: string,
  ) {
    return this.profileService.removeLike(getUserId(headers), itemId);
  }

  @Delete('dislike/:itemId')
  removeDislike(
    @Headers() headers: Record<string, string>,
    @Param('itemId') itemId: string,
  ) {
    return this.profileService.removeDislike(getUserId(headers), itemId);
  }
}
