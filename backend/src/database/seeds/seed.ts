import { DataSource } from 'typeorm';
import { baseDataSourceOptions } from '../data-source';
import { User } from '../../profile/entities/user.entity';
import { FeedItem } from '../../feed/entities/feed-item.entity';
import { Connection } from '../../connection/entities/connection.entity';

/**
 * Seed script — populates the database with demo data matching
 * the frontend mock files. Run with:
 *   npm run seed
 *
 * Runs pending migrations automatically before seeding.
 */

async function seed() {
  const ds = new DataSource(baseDataSourceOptions);

  await ds.initialize();
  console.log('🌱 Connected to database.');

  // Run pending migrations so tables exist before seeding
  const pendingMigrations = await ds.runMigrations();
  if (pendingMigrations.length > 0) {
    console.log(`  ✓ Ran ${pendingMigrations.length} migration(s)`);
  } else {
    console.log('  ✓ All migrations already applied');
  }

  console.log('🌱 Seeding…');

  const userRepo = ds.getRepository(User);
  const feedRepo = ds.getRepository(FeedItem);
  const connRepo = ds.getRepository(Connection);

  // ── Clear existing data ──
  await ds.query('TRUNCATE TABLE chat_messages, user_dislikes, user_likes, connections, feed_items, users CASCADE');

  // ── Users ──
  const users = await userRepo.save([
    {
      email: 'diep@thelotusunion.com',
      passwordHash: '$placeholder',
      username: 'diep',
      privateAssistantName: 'Lotus',
    },
    {
      email: 'sarah@example.com',
      passwordHash: '$placeholder',
      username: 'sarah.bloom',
      privateAssistantName: 'Petal',
    },
    {
      email: 'alex@example.com',
      passwordHash: '$placeholder',
      username: 'alex.k',
      privateAssistantName: 'Sage',
    },
    {
      email: 'maya@example.com',
      passwordHash: '$placeholder',
      username: 'maya.rose',
      privateAssistantName: 'Ivy',
    },
    {
      email: 'j@example.com',
      passwordHash: '$placeholder',
      username: 'j.winter',
      privateAssistantName: 'Fern',
    },
    {
      email: 'lily@example.com',
      passwordHash: '$placeholder',
      username: 'lily.chen',
      privateAssistantName: 'Dahlia',
    },
    {
      email: 'emma@example.com',
      passwordHash: '$placeholder',
      username: 'emma.wood',
      privateAssistantName: 'Clover',
    },
    {
      email: 'noah@example.com',
      passwordHash: '$placeholder',
      username: 'noah.park',
      privateAssistantName: 'Birch',
    },
    {
      email: 'chloe@example.com',
      passwordHash: '$placeholder',
      username: 'chloe.tan',
      privateAssistantName: 'Willow',
    },
    {
      email: 'lucas@example.com',
      passwordHash: '$placeholder',
      username: 'lucas.rei',
      privateAssistantName: 'Cedar',
    },
    // Extra users for search results
    {
      email: 'rosa@example.com',
      passwordHash: '$placeholder',
      username: 'rosa.lin',
      privateAssistantName: 'Peony',
    },
    {
      email: 'kai@example.com',
      passwordHash: '$placeholder',
      username: 'kai.morgan',
      privateAssistantName: 'Moss',
    },
    {
      email: 'ava@example.com',
      passwordHash: '$placeholder',
      username: 'ava.stone',
      privateAssistantName: 'Flora',
    },
  ]);

  const [diep, sarah, alex, maya, jwinter, lily, emma, noah, chloe, lucas] =
    users;

  console.log(`  ✓ Created ${users.length} users (main user: ${diep.id})`);

  // ── Feed Items (24 items matching frontend mock) ──
  const feedData = [
    { name: 'Spring Peony Bouquet', description: 'Lush pink peonies arranged with eucalyptus and baby\'s breath.', imageUrl: '/images/flower_image_1.jpg', category: 'flower', brand: 'Bloom & Wild', productLink: '#', tags: ['romantic', 'elegant', 'spring'], colors: ['pink', 'white', 'green'], price: 65, currency: 'USD' },
    { name: 'White Lily Arrangement', description: 'Pure white Oriental lilies in a ceramic vase.', imageUrl: '/images/flower_image_2.jpg', category: 'flower', brand: 'The Bouqs Co.', productLink: '#', tags: ['minimal', 'classic', 'sympathy'], colors: ['white', 'green'], price: 55, currency: 'USD' },
    { name: 'Garden Rose Mix', description: 'A vibrant garden mix of roses in blush and coral tones.', imageUrl: '/images/flower_image_3.jpg', category: 'flower', brand: 'FarmGirl Flowers', productLink: '#', tags: ['bold', 'garden', 'cheerful'], colors: ['coral', 'blush', 'green'], price: 72, currency: 'USD' },
    { name: 'Dried Lavender Bundle', description: 'Sustainably harvested French lavender tied with a linen ribbon.', imageUrl: '/images/flower_image_4.jpg', category: 'flower', brand: 'Terrain', productLink: '#', tags: ['minimal', 'dried', 'rustic'], colors: ['purple', 'sage'], price: 28, currency: 'USD' },
    { name: 'Sunflower Field Bunch', description: 'Bright sunflowers paired with wild daisies.', imageUrl: '/images/flower_image_5.jpg', category: 'flower', brand: 'UrbanStems', productLink: '#', tags: ['cheerful', 'summer', 'bold'], colors: ['yellow', 'white', 'green'], price: 48, currency: 'USD' },
    { name: 'Orchid Elegance', description: 'A single-stem phalaenopsis orchid in a minimalist pot.', imageUrl: '/images/flower_image_6.jpg', category: 'flower', brand: 'The Sill', productLink: '#', tags: ['elegant', 'minimal', 'modern'], colors: ['white', 'pink'], price: 45, currency: 'USD' },
    { name: 'Tulip Season Wrap', description: 'Seasonal Dutch tulips in soft pastels, wrapped in kraft paper.', imageUrl: '/images/flower_image_7.jpg', category: 'flower', brand: 'Bloom & Wild', productLink: '#', tags: ['spring', 'pastel', 'fresh'], colors: ['pink', 'peach', 'white'], price: 38, currency: 'USD' },
    { name: 'Tropical Heliconia', description: 'Exotic heliconias with monstera leaves for a statement piece.', imageUrl: '/images/flower_image_8.jpg', category: 'flower', brand: 'ProFlowers', productLink: '#', tags: ['tropical', 'bold', 'exotic'], colors: ['red', 'orange', 'green'], price: 85, currency: 'USD' },
    { name: 'Wildflower Meadow', description: 'A loose, natural arrangement inspired by wildflower meadows.', imageUrl: '/images/flower_image_9.jpg', category: 'flower', brand: 'FarmGirl Flowers', productLink: '#', tags: ['rustic', 'natural', 'romantic'], colors: ['purple', 'yellow', 'white'], price: 52, currency: 'USD' },
    { name: 'Classic Red Roses', description: 'Timeless long-stem red roses — the ultimate gesture of love.', imageUrl: '/images/flower_image_10.jpg', category: 'flower', brand: 'Venus ET Fleur', productLink: '#', tags: ['classic', 'romantic', 'elegant'], colors: ['red', 'green'], price: 95, currency: 'USD' },
    { name: 'Blush Peony Posy', description: 'Soft blush peonies in a delicate hand-tied posy.', imageUrl: '/images/flower_image_1.jpg', category: 'flower', brand: 'Terrain', productLink: '#', tags: ['romantic', 'pastel', 'spring'], colors: ['blush', 'cream'], price: 42, currency: 'USD' },
    { name: 'Succulent Garden Box', description: 'A curated box of five rare succulents in terracotta pots.', imageUrl: '/images/flower_image_2.jpg', category: 'flower', brand: 'The Sill', productLink: '#', tags: ['minimal', 'modern', 'long-lasting'], colors: ['green', 'sage'], price: 60, currency: 'USD' },
    { name: 'Cherry Blossom Branches', description: 'Delicate sakura branches for a zen-inspired centerpiece.', imageUrl: '/images/flower_image_3.jpg', category: 'flower', brand: 'UrbanStems', productLink: '#', tags: ['elegant', 'spring', 'zen'], colors: ['pink', 'white'], price: 68, currency: 'USD' },
    { name: 'Dahlia Sunset', description: 'Rich dahlias in warm sunset tones — peach, coral, and amber.', imageUrl: '/images/flower_image_4.jpg', category: 'flower', brand: 'Bloom & Wild', productLink: '#', tags: ['bold', 'autumn', 'warm'], colors: ['peach', 'coral', 'amber'], price: 58, currency: 'USD' },
    { name: 'Eucalyptus Wreath', description: 'Fresh eucalyptus wreath with a calming, natural scent.', imageUrl: '/images/flower_image_5.jpg', category: 'flower', brand: 'Terrain', productLink: '#', tags: ['natural', 'minimal', 'home'], colors: ['green', 'sage'], price: 75, currency: 'USD' },
    { name: 'Ranunculus Petals', description: 'Layered ranunculus in creamy yellows and soft pinks.', imageUrl: '/images/flower_image_6.jpg', category: 'flower', brand: 'FarmGirl Flowers', productLink: '#', tags: ['romantic', 'spring', 'layered'], colors: ['yellow', 'pink', 'cream'], price: 50, currency: 'USD' },
    { name: 'Protea Statement', description: 'Bold king protea with dried grasses for a sculptural arrangement.', imageUrl: '/images/flower_image_7.jpg', category: 'flower', brand: 'The Bouqs Co.', productLink: '#', tags: ['bold', 'sculptural', 'modern'], colors: ['pink', 'brown', 'green'], price: 78, currency: 'USD' },
    { name: 'Hydrangea Cloud', description: 'Oversized hydrangea heads in soft blue and lavender.', imageUrl: '/images/flower_image_8.jpg', category: 'flower', brand: 'UrbanStems', productLink: '#', tags: ['elegant', 'classic', 'soft'], colors: ['blue', 'lavender', 'white'], price: 62, currency: 'USD' },
    { name: 'Anemone Noir', description: 'Striking black-centered anemones with white petals.', imageUrl: '/images/flower_image_9.jpg', category: 'flower', brand: 'Venus ET Fleur', productLink: '#', tags: ['modern', 'dramatic', 'elegant'], colors: ['white', 'black'], price: 55, currency: 'USD' },
    { name: 'Rose Garden Basket', description: 'An overflowing basket of garden roses in mixed pastels.', imageUrl: '/images/flower_image_10.jpg', category: 'flower', brand: 'ProFlowers', productLink: '#', tags: ['garden', 'romantic', 'pastel'], colors: ['pink', 'peach', 'white'], price: 88, currency: 'USD' },
    { name: 'Jasmine Vine', description: 'Fragrant star jasmine vine in a hanging ceramic planter.', imageUrl: '/images/flower_image_1.jpg', category: 'flower', brand: 'The Sill', productLink: '#', tags: ['natural', 'fragrant', 'elegant'], colors: ['white', 'green'], price: 35, currency: 'USD' },
    { name: 'Freesia Burst', description: 'Colourful freesias that fill any room with sweet fragrance.', imageUrl: '/images/flower_image_3.jpg', category: 'flower', brand: 'Bloom & Wild', productLink: '#', tags: ['cheerful', 'fragrant', 'spring'], colors: ['yellow', 'purple', 'white'], price: 40, currency: 'USD' },
    { name: 'Lotus Blossom', description: 'Sacred lotus in a hand-thrown ceramic bowl — serene beauty.', imageUrl: '/images/flower_image_5.jpg', category: 'flower', brand: 'Terrain', productLink: '#', tags: ['zen', 'minimal', 'elegant'], colors: ['pink', 'white'], price: 70, currency: 'USD' },
    { name: 'Magnolia Branch', description: 'Single magnolia branch — simple, elegant, timeless.', imageUrl: '/images/flower_image_7.jpg', category: 'flower', brand: 'UrbanStems', productLink: '#', tags: ['minimal', 'classic', 'spring'], colors: ['white', 'pink', 'brown'], price: 32, currency: 'USD' },
  ];

  const items = await feedRepo.save(feedData);
  console.log(`  ✓ Created ${items.length} feed items`);

  // ── Connections (matching frontend mock) ──
  const connections = await connRepo.save([
    // Accepted
    { userId: diep.id, friendId: sarah.id, status: 'accepted', initiatedBy: diep.id },
    { userId: diep.id, friendId: alex.id, status: 'accepted', initiatedBy: alex.id },
    { userId: diep.id, friendId: maya.id, status: 'accepted', initiatedBy: diep.id },
    { userId: diep.id, friendId: jwinter.id, status: 'accepted', initiatedBy: jwinter.id },
    // Pending incoming
    { userId: diep.id, friendId: lily.id, status: 'pending', initiatedBy: lily.id },
    { userId: diep.id, friendId: emma.id, status: 'pending', initiatedBy: emma.id },
    { userId: diep.id, friendId: noah.id, status: 'pending', initiatedBy: noah.id },
    { userId: diep.id, friendId: chloe.id, status: 'pending', initiatedBy: chloe.id },
    // Pending outgoing
    { userId: diep.id, friendId: lucas.id, status: 'pending', initiatedBy: diep.id },
  ]);

  console.log(`  ✓ Created ${connections.length} connections`);

  // ── Print summary ──
  console.log('\n🌿 Seed complete!');
  console.log(`   Main user ID: ${diep.id}`);
  console.log(`   Use this ID as x-user-id header for API calls.\n`);

  await ds.destroy();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
