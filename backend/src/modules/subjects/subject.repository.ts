import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSubjects = async () => {
  return await prisma.subject.findMany({
    where: { is_published: true },
    include: {
      _count: {
        select: {
          sections: true,
        }
      },
      sections: {
        select: {
          _count: {
            select: {
              videos: true,
            }
          }
        }
      }
    }
  });
};

export const getSubjectBySlug = async (slug: string) => {
  return await prisma.subject.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order_index: 'asc' },
        include: {
          videos: {
            orderBy: { order_index: 'asc' },
          },
        },
      },
    },
  });
};

export const getSubjectTree = async (subjectId: string) => {
  return await prisma.subject.findUnique({
    where: { id: subjectId },
    include: {
      sections: {
        orderBy: { order_index: 'asc' },
        include: {
          videos: {
            orderBy: { order_index: 'asc' },
          },
        },
      },
    },
  });
};
