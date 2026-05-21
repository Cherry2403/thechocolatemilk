import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

/**
 * Extract userId from x-user-id header.
 * TODO: Replace with JWT-based auth guard in Phase 8.
 */
function getUserId(headers: Record<string, string>): string {
  const id = headers['x-user-id'];
  if (!id) throw new BadRequestException('Missing x-user-id header');
  return id;
}

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  sendMessage(
    @Headers() headers: Record<string, string>,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(
      getUserId(headers),
      dto.contactId,
      dto.message,
      dto.imageUrl,
    );
  }

  @Get('history')
  getHistory(
    @Headers() headers: Record<string, string>,
    @Query('contactId') contactId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getHistory(
      getUserId(headers),
      contactId,
      before,
      limit ? parseInt(limit, 10) : 30,
    );
  }
}
