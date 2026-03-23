import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Clean existing data
  await prisma.videoProgress.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.video.deleteMany({});
  await prisma.section.deleteMany({});
  await prisma.subject.deleteMany({});

  console.log('🧹 Purged existing data.');

  // 2. Sample Subject: Full-Stack Web Development
  const subject1 = await prisma.subject.create({
    data: {
      title: 'Full-Stack Engineering Masterclass',
      slug: 'fullstack-engineering-masterclass',
      category: 'Engineering',
      description: 'Master modern web development from high-fidelity UI to scalable backend architectures.',
      is_published: true,
      sections: {
        create: [
          {
            title: 'Foundations of Modern Web',
            order_index: 1,
            videos: {
              create: [
                {
                  title: 'Introduction into Modern Ecosystem',
                  youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  order_index: 1,
                  duration_seconds: 600,
                  description: 'An overview of the current state of web engineering.'
                },
                {
                  title: 'Next.js 15 & React 19 Architecture',
                  youtube_url: 'https://www.youtube.com/watch?v=728iT94_l0M',
                  order_index: 2,
                  duration_seconds: 1200,
                  description: 'Deep dive into server components and streaming.'
                }
              ]
            }
          },
          {
            title: 'Scalable Backend Systems',
            order_index: 2,
            videos: {
              create: [
                {
                  title: 'Prisma & Database Optimization',
                  youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  order_index: 1,
                  duration_seconds: 900,
                  description: 'Building type-safe database layers.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  // 3. Sample Subject: AI-Powered Product Design
  const subject2 = await prisma.subject.create({
    data: {
      title: 'AI-Powered UI/UX Design',
      slug: 'ai-ui-ux-design',
      category: 'Design',
      description: 'Leveraging Generative AI to accelerate your design-to-code workflow.',
      is_published: true,
      sections: {
        create: [
          {
            title: 'The Future of Interfaces',
            order_index: 1,
            videos: {
              create: [
                {
                  title: 'Generative UI with Llama 3.3',
                  youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                  order_index: 1,
                  duration_seconds: 750,
                  description: 'How to use AI to generate stunning user interfaces.'
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log(`✅ Seed finished! Created ${subject1.title} and ${subject2.title}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
