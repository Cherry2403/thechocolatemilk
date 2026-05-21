import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';

/**
 * Chat service — handles message persistence and mock AI responses.
 *
 * In Phase 9 the mock response logic will be replaced with an OpenAI
 * API call that includes the user's (or friend's) taste profile as
 * system context.
 */
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly msgRepo: Repository<ChatMessage>,
  ) {}

  /**
   * Send a message and return a mock AI response.
   * Both the user message and the AI response are persisted.
   */
  async sendMessage(
    userId: string,
    contactId: string,
    content: string,
    imageUrl?: string,
  ) {
    // 1. Save user message
    const userMsg = this.msgRepo.create({
      userId,
      contactId,
      role: 'user',
      content,
      imageUrl: imageUrl ?? undefined,
    });
    await this.msgRepo.save(userMsg);

    // 2. Generate mock AI response
    const aiContent = this.generateMockResponse(content);

    const aiMsg = this.msgRepo.create({
      userId,
      contactId,
      role: 'assistant',
      content: aiContent,
    });
    await this.msgRepo.save(aiMsg);

    return {
      userMessage: this.toDto(userMsg),
      assistantMessage: this.toDto(aiMsg),
    };
  }

  /**
   * Cursor-based pagination: returns messages older than the cursor.
   * Messages are returned in ascending order (oldest → newest)
   * so the frontend can append naturally.
   */
  async getHistory(
    userId: string,
    contactId: string,
    before?: string,
    limit: number = 30,
  ) {
    const qb = this.msgRepo
      .createQueryBuilder('msg')
      .where('msg.user_id = :userId', { userId })
      .andWhere('msg.contact_id = :contactId', { contactId })
      .orderBy('msg.created_at', 'DESC')
      .take(limit + 1); // fetch one extra to determine hasMore

    if (before) {
      qb.andWhere('msg.created_at < :before', { before: new Date(before) });
    }

    const messages = await qb.getMany();

    const hasMore = messages.length > limit;
    if (hasMore) messages.pop(); // remove the extra sentinel

    // Reverse to ascending order for the client
    messages.reverse();

    return {
      messages: messages.map((m) => this.toDto(m)),
      hasMore,
      cursor: messages.length > 0 ? messages[0].createdAt.toISOString() : null,
    };
  }

  /** Simple keyword-based mock response. Swap for OpenAI in Phase 9. */
  private generateMockResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();

    if (msg.match(/\b(hi|hello|hey)\b/))
      return "Hello! 🌸 I'm your style assistant. Ask me about flowers, fashion, or gifts for friends!";

    if (msg.match(/\b(flower|bouquet|roses?|peony|tulip)\b/))
      return "I love flowers! Based on your taste, I'd suggest looking at elegant arrangements with soft pinks and whites. Would you like something for a specific occasion?";

    if (msg.match(/\b(fashion|outfit|style|dress|wear)\b/))
      return "Fashion is all about expressing yourself! What's the occasion? I can help find something that matches your personal style.";

    if (msg.match(/\b(friend|birthday|gift|present)\b/))
      return "What a thoughtful friend you are! Tell me who it's for and I'll check their taste profile to find the perfect match.";

    if (msg.match(/\b(rate|think|opinion)\b/))
      return "I'd give that a solid 8/10 based on your taste profile! The colors align well with what you usually like.";

    if (msg.match(/\b(budget|cheap|expensive|price)\b/))
      return "I can work with any budget! What range are you thinking? I'll find the best options in that price point.";

    if (msg.match(/\b(thanks?|thank you|perfect)\b/))
      return "You're welcome! Happy to help anytime. Let me know if you need anything else! 🌿";

    if (msg.match(/\b(my style|my taste|what do i like)\b/))
      return "Based on your likes, you tend to gravitate toward elegant, minimal pieces with soft color palettes — lots of pinks, whites, and greens. You have great taste!";

    if (msg.match(/\b(help|what can you)\b/))
      return "I can help you with:\n• Finding flowers and gifts\n• Style recommendations\n• Gift ideas for connected friends\n• Rating items based on your taste\n• Budget-friendly suggestions\n\nJust ask away!";

    return "That's interesting! Could you tell me more about what you're looking for? I can help with flowers, fashion, gifts, or style advice.";
  }

  private toDto(msg: ChatMessage) {
    return {
      id: msg.id,
      userId: msg.userId,
      role: msg.role,
      content: msg.content,
      image: msg.imageUrl ?? undefined,
      timestamp: msg.createdAt.toISOString(),
    };
  }
}
