import { PrismaClient } from '@prisma/client';
import { getPlaylistData } from '../src/utils/youtube.js';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const FEATURED_PLAYLISTS = [
  { id: 'PLhQjrBD2T382hIW-isO77Prleux82nKSc', category: 'Computer Science' }, // Harvard CS50
  { id: 'PL4CUpEskL4uL_Wre2vXvG_m-EsqC_uXfT', category: 'Engineering' }, // React Tutorials
  { id: 'PLZPZgb0eg77_6f5yT5C0N2X6U-Igh8Nee', category: 'Design' }, // Modern UI Design
];

async function seedFeatured() {
  console.log('🌟 Seeding Featured YouTube Subjects...');

  for (const pl of FEATURED_PLAYLISTS) {
    try {
      console.log(`📡 Fetching playlist: ${pl.id}...`);
      const data = await getPlaylistData(pl.id);

      // Check if exists
      const existing = await prisma.subject.findFirst({ where: { title: data.title } });
      if (existing) {
        console.log(`⏩ Subject already exists: ${data.title}`);
        await prisma.subject.update({ where: { id: existing.id }, data: { is_featured: true } });
        continue;
      }

      await prisma.subject.create({
        data: {
          title: data.title,
          slug: `${data.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now().toString().slice(-4)}`,
          description: data.description,
          category: pl.category,
          is_published: true,
          is_featured: true,
          sections: {
            create: {
              title: "Course Content",
              order_index: 1,
              videos: {
                create: data.videos.map((v, i) => ({
                  title: v.title,
                  description: v.description,
                  youtube_url: `https://www.youtube.com/watch?v=${v.id}`,
                  order_index: i + 1,
                  duration_seconds: v.duration || 600,
                }))
              }
            }
          }
        }
      });
      console.log(`✅ Created Featured Subject: ${data.title}`);
    } catch (e: any) {
      console.error(`❌ Failed to seed ${pl.id}:`, e.message);
    }
  }

  console.log('✨ Seed Complete!');
}

seedFeatured()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
