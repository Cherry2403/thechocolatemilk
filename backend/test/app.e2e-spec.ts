import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

/**
 * End-to-end tests for THE_CHOCOLATE_MILK backend.
 *
 * These tests run against a real PostgreSQL database (thechocolatemilk_dev).
 * Seed data must be present — run `npm run seed` before running tests.
 *
 * Tests are grouped by module and executed in a defined order since
 * some depend on state created by earlier tests (e.g. like → taste).
 */
describe('THE_CHOCOLATE_MILK API (e2e)', () => {
  let app: INestApplication;
  let userId: string;
  let feedItemId: string;
  let secondFeedItemId: string;
  let friendId: string;
  let connectionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();

    // Discover seeded user + feed item IDs from the database
    const ds = app.get(DataSource);
    const [user] = await ds.query(
      `SELECT id FROM users WHERE username = 'diep' LIMIT 1`,
    );
    const feedItems = await ds.query(
      `SELECT id FROM feed_items ORDER BY created_at LIMIT 2`,
    );
    const [friend] = await ds.query(
      `SELECT id FROM users WHERE username = 'sarah.bloom' LIMIT 1`,
    );

    userId = user.id;
    feedItemId = feedItems[0].id;
    secondFeedItemId = feedItems[1].id;
    friendId = friend.id;
  });

  afterAll(async () => {
    await app.close();
  });

  /* ════════════════════════════════════════════
   *  FEED MODULE
   * ════════════════════════════════════════════ */

  describe('Feed', () => {
    it('GET /api/feed — returns paginated feed items', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/feed?page=1&limit=5')
        .expect(200);

      expect(res.body).toHaveProperty('items');
      expect(res.body).toHaveProperty('hasMore');
      expect(Array.isArray(res.body.items)).toBe(true);
      expect(res.body.items.length).toBeLessThanOrEqual(5);

      // Each item has required fields
      const item = res.body.items[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('image');
      expect(item).toHaveProperty('category');
    });

    it('GET /api/feed — page 2 returns different items', async () => {
      const page1 = await request(app.getHttpServer())
        .get('/api/feed?page=1&limit=5')
        .expect(200);
      const page2 = await request(app.getHttpServer())
        .get('/api/feed?page=2&limit=5')
        .expect(200);

      const ids1 = page1.body.items.map((i: { id: string }) => i.id);
      const ids2 = page2.body.items.map((i: { id: string }) => i.id);
      // No overlap between pages
      const overlap = ids1.filter((id: string) => ids2.includes(id));
      expect(overlap).toHaveLength(0);
    });

    it('GET /api/feed/:id — returns a single feed item', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/feed/${feedItemId}`)
        .expect(200);

      expect(res.body).toHaveProperty('id', feedItemId);
      expect(res.body).toHaveProperty('name');
      expect(res.body).toHaveProperty('image');
    });

    it('GET /api/feed/:id — 404 for non-existent item', async () => {
      await request(app.getHttpServer())
        .get('/api/feed/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  /* ════════════════════════════════════════════
   *  PROFILE MODULE
   * ════════════════════════════════════════════ */

  describe('Profile', () => {
    it('GET /api/profile — returns user profile with x-user-id', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/profile')
        .set('x-user-id', userId)
        .expect(200);

      expect(res.body).toHaveProperty('id', userId);
      expect(res.body).toHaveProperty('username', 'diep');
      expect(res.body).toHaveProperty('liked');
      expect(res.body).toHaveProperty('disliked');
    });

    it('GET /api/profile — 400 without x-user-id header', async () => {
      await request(app.getHttpServer())
        .get('/api/profile')
        .expect(400);
    });

    it('POST /api/profile/like/:itemId — likes an item', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/profile/like/${feedItemId}`)
        .set('x-user-id', userId)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
    });

    it('POST /api/profile/like/:itemId — idempotent (duplicate like)', async () => {
      // Second like on same item should not fail
      const res = await request(app.getHttpServer())
        .post(`/api/profile/like/${feedItemId}`)
        .set('x-user-id', userId);

      // Either 201 (re-created) or 409 (conflict) depending on impl
      expect([201, 409]).toContain(res.status);
    });

    it('POST /api/profile/dislike/:itemId — dislikes an item', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/profile/dislike/${secondFeedItemId}`)
        .set('x-user-id', userId)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
    });

    it('GET /api/profile/liked — returns liked items', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/profile/liked')
        .set('x-user-id', userId)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/profile/disliked — returns disliked items', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/profile/disliked')
        .set('x-user-id', userId)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('GET /api/profile/:userId/taste — returns computed taste profile', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/profile/${userId}/taste`)
        .expect(200);

      expect(res.body).toHaveProperty('userId', userId);
      expect(res.body).toHaveProperty('topColors');
      expect(res.body).toHaveProperty('topStyles');
      expect(res.body).toHaveProperty('topBrands');
      expect(res.body).toHaveProperty('topCategories');
      expect(res.body).toHaveProperty('likedCount');
      expect(res.body).toHaveProperty('dislikedCount');
      expect(res.body.likedCount).toBeGreaterThanOrEqual(1);
    });

    it('DELETE /api/profile/like/:itemId — removes a like', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/profile/like/${feedItemId}`)
        .set('x-user-id', userId)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
    });

    it('DELETE /api/profile/dislike/:itemId — removes a dislike', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/profile/dislike/${secondFeedItemId}`)
        .set('x-user-id', userId)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
    });
  });

  /* ════════════════════════════════════════════
   *  CONNECTIONS MODULE
   * ════════════════════════════════════════════ */

  describe('Connections', () => {
    it('GET /api/connections — returns connection list', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/connections')
        .set('x-user-id', userId)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      // Seeded data should have connections for user diep
      expect(res.body.length).toBeGreaterThan(0);

      const conn = res.body[0];
      expect(conn).toHaveProperty('id');
      expect(conn).toHaveProperty('friendUsername');
      expect(conn).toHaveProperty('status');
    });

    it('GET /api/connections — 400 without x-user-id header', async () => {
      await request(app.getHttpServer())
        .get('/api/connections')
        .expect(400);
    });

    it('GET /api/connections/search?username= — searches users', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/connections/search?username=lily')
        .set('x-user-id', userId)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      // Should find lily.chen
      const found = res.body.find(
        (u: { username: string }) => u.username === 'lily.chen',
      );
      expect(found).toBeDefined();
      expect(found).toHaveProperty('username');
      expect(found).toHaveProperty('privateAssistantName');
    });

    it('POST /api/connections — creates a connection request', async () => {
      // Find a user we're not already connected to (rosa.lin is unconnected in seed)
      const ds = app.get(DataSource);
      const [target] = await ds.query(
        `SELECT id FROM users WHERE username = 'rosa.lin' LIMIT 1`,
      );

      const res = await request(app.getHttpServer())
        .post('/api/connections')
        .set('x-user-id', userId)
        .send({ friendId: target.id })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('status', 'pending');
      connectionId = res.body.id;
    });

    it('POST /api/connections — 400 missing friendId', async () => {
      await request(app.getHttpServer())
        .post('/api/connections')
        .set('x-user-id', userId)
        .send({})
        .expect(400);
    });

    it('PATCH /api/connections/:id/accept — accepts a pending connection', async () => {
      // The user we sent to now accepts
      const ds = app.get(DataSource);
      const [target] = await ds.query(
        `SELECT id FROM users WHERE username = 'rosa.lin' LIMIT 1`,
      );

      const res = await request(app.getHttpServer())
        .patch(`/api/connections/${connectionId}/accept`)
        .set('x-user-id', target.id)
        .expect(200);

      expect(res.body).toHaveProperty('status', 'accepted');
    });

    it('GET /api/connections/:id/taste — returns friend ID for taste lookup', async () => {
      // Use an accepted connection (from seed: diep ↔ sarah.bloom)
      const res = await request(app.getHttpServer())
        .get('/api/connections')
        .set('x-user-id', userId)
        .expect(200);

      const accepted = res.body.find(
        (c: { status: string }) => c.status === 'accepted',
      );
      expect(accepted).toBeDefined();

      const tasteRes = await request(app.getHttpServer())
        .get(`/api/connections/${accepted.id}/taste`)
        .set('x-user-id', userId)
        .expect(200);

      // Endpoint validates connection & returns friendId (taste computed by ProfileModule)
      expect(tasteRes.body).toHaveProperty('friendId');
      expect(typeof tasteRes.body.friendId).toBe('string');
    });

    it('DELETE /api/connections/:id — removes a connection', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/connections/${connectionId}`)
        .set('x-user-id', userId)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
    });
  });

  /* ════════════════════════════════════════════
   *  CHAT MODULE
   * ════════════════════════════════════════════ */

  describe('Chat', () => {
    let chatContactId: string;

    beforeAll(() => {
      chatContactId = friendId; // sarah.bloom
    });

    it('POST /api/chat — sends a message and gets AI response', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/chat')
        .set('x-user-id', userId)
        .send({
          contactId: chatContactId,
          message: 'What flowers would Sarah like for her birthday?',
        })
        .expect(201);

      expect(res.body).toHaveProperty('userMessage');
      expect(res.body).toHaveProperty('assistantMessage');
      expect(res.body.userMessage).toHaveProperty('role', 'user');
      expect(res.body.assistantMessage).toHaveProperty('role', 'assistant');
      expect(res.body.assistantMessage.content).toBeTruthy();
    });

    it('POST /api/chat — 400 without x-user-id', async () => {
      await request(app.getHttpServer())
        .post('/api/chat')
        .send({
          contactId: chatContactId,
          message: 'hello',
        })
        .expect(400);
    });

    it('POST /api/chat — 400 missing required fields', async () => {
      await request(app.getHttpServer())
        .post('/api/chat')
        .set('x-user-id', userId)
        .send({})
        .expect(400);
    });

    it('GET /api/chat/history — returns chat history for a contact', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/chat/history?contactId=${chatContactId}`)
        .set('x-user-id', userId)
        .expect(200);

      expect(res.body).toHaveProperty('messages');
      expect(res.body).toHaveProperty('hasMore');
      expect(Array.isArray(res.body.messages)).toBe(true);
      expect(res.body.messages.length).toBeGreaterThanOrEqual(2); // user + assistant

      // Messages should be ordered by timestamp (mapped from createdAt in toDto)
      const timestamps = res.body.messages.map(
        (m: { timestamp: string }) => new Date(m.timestamp).getTime(),
      );
      for (let i = 1; i < timestamps.length; i++) {
        expect(timestamps[i]).toBeGreaterThanOrEqual(timestamps[i - 1]);
      }
    });

    it('GET /api/chat/history — respects limit param', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/chat/history?contactId=${chatContactId}&limit=1`)
        .set('x-user-id', userId)
        .expect(200);

      expect(res.body.messages.length).toBeLessThanOrEqual(1);
    });

    it('GET /api/chat/history — 400 without x-user-id', async () => {
      await request(app.getHttpServer())
        .get(`/api/chat/history?contactId=${chatContactId}`)
        .expect(400);
    });
  });

  /* ════════════════════════════════════════════
   *  UPLOAD MODULE
   * ════════════════════════════════════════════ */

  describe('Upload', () => {
    it('POST /api/upload/image — 400 with no file', async () => {
      await request(app.getHttpServer())
        .post('/api/upload/image')
        .expect(400);
    });

    it('POST /api/upload/image — uploads an image successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/upload/image')
        .attach('file', Buffer.from('fake-png-data'), {
          filename: 'test.png',
          contentType: 'image/png',
        })
        .expect(201);

      expect(res.body).toHaveProperty('url');
      expect(res.body.url).toMatch(/^\/api\/upload\/file\//);
      expect(res.body).toHaveProperty('originalName', 'test.png');
      expect(res.body).toHaveProperty('mimeType', 'image/png');
    });

    it('POST /api/upload/image — rejects non-image file type', async () => {
      await request(app.getHttpServer())
        .post('/api/upload/image')
        .attach('file', Buffer.from('not-an-image'), {
          filename: 'test.txt',
          contentType: 'text/plain',
        })
        .expect(400);
    });

    it('GET /api/upload/file/:filename — 404 for non-existent file', async () => {
      await request(app.getHttpServer())
        .get('/api/upload/file/nonexistent.png')
        .expect(404);
    });
  });

  /* ════════════════════════════════════════════
   *  VALIDATION & EDGE CASES
   * ════════════════════════════════════════════ */

  describe('Validation & Edge Cases', () => {
    it('rejects unknown properties (forbidNonWhitelisted)', async () => {
      await request(app.getHttpServer())
        .post('/api/chat')
        .set('x-user-id', userId)
        .send({
          contactId: friendId,
          message: 'hello',
          hackerField: 'malicious',
        })
        .expect(400);
    });

    it('404 for unknown route', async () => {
      await request(app.getHttpServer())
        .get('/api/nonexistent')
        .expect(404);
    });
  });
});
