import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  LLAMA_API_KEY: process.env.LLAMA_API_KEY,
  CERTIFER_API_KEY: process.env.CERTIFER_API_KEY,
  AI_MODEL: process.env.AI_MODEL || "llama-3.3-70b-versatile",
};
