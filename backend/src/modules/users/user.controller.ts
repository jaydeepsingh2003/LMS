import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';

/**
 * Performance-Optimized Profile Controller
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = BigInt((req as any).user.userId);
    
    // Batch fetch core user data and certificates
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        certificates: {
          include: { subject: true }
        }
      }
    });

    if (!user) return res.status(404).json({ error: 'Identity not found in node cluster.' });

    // 1. Fetch all enrollments with required metadata
    const enrollments = await prisma.enrollment.findMany({
      where: { user_id: userId },
      include: {
        subject: {
          include: {
            sections: { include: { videos: { select: { id: true } } } }
          }
        }
      }
    });

    // 2. Fetch all completed videos for this user in a single pass
    const completedVideoCounts = await prisma.videoProgress.groupBy({
      by: ['video_id'],
      where: { 
        user_id: userId, 
        is_completed: true,
        video: { section: { subject_id: { in: enrollments.map(e => e.subject_id) } } }
      },
      _count: { video_id: true }
    });

    // Strategy: Map subject identities to their completed video count
    // This avoids the N+1 query problem scaling with enrollments
    const progressMap = enrollments.reduce((acc: any, e) => {
      const subjectVideos = e.subject.sections.flatMap(s => s.videos.map(v => v.id));
      const completedCount = completedVideoCounts.filter(p => subjectVideos.includes(p.video_id)).length;
      
      acc[e.subject_id] = {
        total: subjectVideos.length,
        completed: completedCount
      };
      return acc;
    }, {});

    const enrollmentData = enrollments.map((e) => {
      const { total, completed } = progressMap[e.subject_id] || { total: 0, completed: 0 };
      return {
        subjectId: e.subject_id.toString(),
        title: e.subject.title,
        progress: total > 0 ? (completed / total) * 100 : 0,
        completedVideos: completed,
        totalVideos: total
      };
    });

    res.json({
      user: { 
        ...user, 
        id: user.id.toString(),
        certificates: user.certificates.map((c: any) => ({ 
          ...c, 
          user_id: c.user_id.toString(),
          subject_id: c.subject_id.toString() 
        }))
      },
      enrollments: enrollmentData
    });

  } catch (error: any) {
    console.error('❌ [UserController] Profile failure:', error.message);
    res.status(500).json({ error: "Master retrieval link severed.", details: error.message });
  }
};
