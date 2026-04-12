import { Controller, Get, Param, Query } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedQueryDto } from './dto/feed-query.dto';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  findAll(@Query() query: FeedQueryDto) {
    return this.feedService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.feedService.findOne(id);
  }
}
