import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: { email: string; password_hash: string; name: string }) => {
  return await prisma.user.create({
    data,
  });
};

export const findUserById = async (id: bigint) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
