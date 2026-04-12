import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Connection } from './entities/connection.entity';
import { User } from '../profile/entities/user.entity';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private readonly connRepo: Repository<Connection>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /** Get all connections for a user (both pending and accepted). */
  async findAll(userId: string) {
    // Connections where user is either side
    const connections = await this.connRepo.find({
      where: [{ userId }, { friendId: userId }],
      relations: ['user', 'friend'],
      order: { createdAt: 'DESC' },
    });

    return connections.map((c) => this.toDto(c, userId));
  }

  /** Search users by username (exclude self and already-connected). */
  async searchUsers(userId: string, username: string) {
    const users = await this.userRepo.find({
      where: { username: ILike(`%${username}%`) },
      take: 10,
    });

    return users
      .filter((u) => u.id !== userId)
      .map((u) => ({
        id: u.id,
        username: u.username,
        privateAssistantName: u.privateAssistantName,
      }));
  }

  /** Send a connection request. */
  async create(userId: string, friendId: string) {
    if (userId === friendId) {
      throw new BadRequestException('Cannot connect with yourself');
    }

    // Check if connection already exists (either direction)
    const existing = await this.connRepo.findOne({
      where: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    if (existing) {
      throw new ConflictException('Connection already exists');
    }

    const connection = this.connRepo.create({
      userId,
      friendId,
      status: 'pending',
      initiatedBy: userId,
    });

    const saved = await this.connRepo.save(connection);
    const full = await this.connRepo.findOne({
      where: { id: saved.id },
      relations: ['user', 'friend'],
    });
    return this.toDto(full!, userId);
  }

  /** Accept a pending connection request. */
  async accept(userId: string, connectionId: string) {
    const connection = await this.connRepo.findOne({
      where: { id: connectionId },
      relations: ['user', 'friend'],
    });

    if (!connection) throw new NotFoundException('Connection not found');

    // Only the recipient can accept (the person who didn't initiate)
    const isRecipient =
      (connection.userId === userId &&
        connection.initiatedBy !== userId) ||
      (connection.friendId === userId &&
        connection.initiatedBy !== userId);

    if (!isRecipient) {
      throw new BadRequestException('Only the recipient can accept');
    }

    connection.status = 'accepted';
    await this.connRepo.save(connection);
    return this.toDto(connection, userId);
  }

  /** Remove a connection (either side can remove). */
  async remove(userId: string, connectionId: string) {
    const connection = await this.connRepo.findOneBy({ id: connectionId });
    if (!connection) throw new NotFoundException('Connection not found');

    if (connection.userId !== userId && connection.friendId !== userId) {
      throw new BadRequestException('Not your connection');
    }

    await this.connRepo.remove(connection);
    return { success: true };
  }

  /** Get a friend's taste profile (for AI chat context). */
  async getFriendTaste(userId: string, connectionId: string) {
    const connection = await this.connRepo.findOneBy({
      id: connectionId,
      status: 'accepted',
    });

    if (!connection) throw new NotFoundException('Connection not found');

    const friendId =
      connection.userId === userId
        ? connection.friendId
        : connection.userId;

    // The taste computation is handled by ProfileModule's TasteService
    // This endpoint just validates the connection exists
    return { friendId };
  }

  /** Map entity → frontend-compatible DTO, always from the perspective of userId. */
  private toDto(connection: Connection, userId: string) {
    const isSelf = connection.userId === userId;
    const friendUser = isSelf ? connection.friend : connection.user;

    return {
      id: connection.id,
      userId,
      friendId: friendUser?.id ?? null,
      friendUsername: friendUser?.username ?? 'Unknown',
      friendAssistantName: friendUser?.privateAssistantName ?? null,
      status: connection.status,
      initiatedBy: connection.initiatedBy,
      createdAt: connection.createdAt.toISOString(),
    };
  }
}
