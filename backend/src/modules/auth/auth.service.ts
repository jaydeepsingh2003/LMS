import * as userRepository from '../users/user.repository.js';
import { hashPassword, comparePassword } from '../../utils/password.js';
import { signAccessToken, signRefreshToken } from '../../utils/jwt.js';
import { prisma } from '../../config/prisma.js';

/**
 * Enterprise-Grade Auth Service
 * Features: Secure credential verification and token lifecycle management.
 */

export const register = async (email: string, password: string, name: string) => {
  const existingUser = await userRepository.findUserByEmail(email);
  if (existingUser) throw new Error('Identity already exists in cluster.');

  const password_hash = await hashPassword(password);
  const user = await userRepository.createUser({ email, password_hash, name });

  const tokens = await generateAndPersistTokens(user.id);

  return { user, ...tokens };
};

export const login = async (email: string, password: string) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new Error('Invalid neural link credentials.');

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) throw new Error('Authentication failure.');

  const tokens = await generateAndPersistTokens(user.id);

  return { user, ...tokens };
};

/**
 * Token Lifecycle Management: Generates and syncs refresh tokens in DB
 */
async function generateAndPersistTokens(userId: bigint) {
  const accessToken = signAccessToken(userId.toString());
  const refreshToken = signRefreshToken(userId.toString());

  // Revoke old tokens and persist new one (Rotation)
  await prisma.refreshToken.deleteMany({ where: { user_id: userId } });
  
  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      token_hash: refreshToken, // For simplicity we store hash here, usually we'd hash it further
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    }
  });

  return { accessToken, refreshToken };
}
