import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  POSTMARK_SERVER_TOKEN: z.string().min(1, 'POSTMARK_SERVER_TOKEN is required'),
  POSTMARK_FROM_EMAIL: z.string().email('POSTMARK_FROM_EMAIL must be a valid email'),
  POSTMARK_STREAM: z.string().min(1, 'POSTMARK_STREAM is required'),
  CONTACT_TO_EMAIL: z.string().email('CONTACT_TO_EMAIL must be a valid email'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_PUBLIC_BUCKET: z.string().min(1, 'SUPABASE_PUBLIC_BUCKET is required'),
});

export type Env = z.infer<typeof envSchema>;