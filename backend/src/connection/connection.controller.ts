import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { CreateConnectionDto } from './dto/connection.dto';

/**
 * Extract userId from x-user-id header.
 * TODO: Replace with JWT-based auth guard in Phase 8.
 */
function getUserId(headers: Record<string, string>): string {
  const id = headers['x-user-id'];
  if (!id) throw new BadRequestException('Missing x-user-id header');
  return id;
}

@Controller('connections')
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  findAll(@Headers() headers: Record<string, string>) {
    return this.connectionService.findAll(getUserId(headers));
  }

  @Get('search')
  searchUsers(
    @Headers() headers: Record<string, string>,
    @Query('username') username: string,
  ) {
    return this.connectionService.searchUsers(getUserId(headers), username);
  }

  @Post()
  create(
    @Headers() headers: Record<string, string>,
    @Body() dto: CreateConnectionDto,
  ) {
    return this.connectionService.create(getUserId(headers), dto.friendId);
  }

  @Patch(':id/accept')
  accept(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ) {
    return this.connectionService.accept(getUserId(headers), id);
  }

  @Delete(':id')
  remove(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ) {
    return this.connectionService.remove(getUserId(headers), id);
  }

  @Get(':id/taste')
  getFriendTaste(
    @Headers() headers: Record<string, string>,
    @Param('id') id: string,
  ) {
    return this.connectionService.getFriendTaste(getUserId(headers), id);
  }
}
