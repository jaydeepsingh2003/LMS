import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getVideoById = async (id: string) => {
  return await prisma.video.findUnique({
    where: { id },
    include: {
      section: {
        include: {
          subject: true,
        },
      },
    },
  });
};

export const getVideoProgress = async (userId: bigint, videoId: string) => {
  return await prisma.videoProgress.findUnique({
    where: {
      user_id_video_id: {
        user_id: userId,
        video_id: videoId,
      },
    },
  });
};

export const upsertVideoProgress = async (data: {
  userId: bigint;
  videoId: string;
  lastPosition: number;
  isCompleted: boolean;
}) => {
  return await prisma.videoProgress.upsert({
    where: {
      user_id_video_id: {
        user_id: data.userId,
        video_id: data.videoId,
      },
    },
    update: {
      last_position_seconds: data.lastPosition,
      is_completed: data.isCompleted,
      completed_at: data.isCompleted ? new Date() : null,
    },
    create: {
      user_id: data.userId,
      video_id: data.videoId,
      last_position_seconds: data.lastPosition,
      is_completed: data.isCompleted,
      completed_at: data.isCompleted ? new Date() : null,
    },
  });
};
export const getAllVideos = async (limit: number = 20) => {
  return await prisma.video.findMany({
    take: limit,
    orderBy: { created_at: 'desc' },
    include: {
      section: {
        include: {
          subject: true,
        },
      },
    },
  });
};
