import { registerRoute } from '@/Backend/routes/authRoutes.js';

export async function POST(req) {
  return await registerRoute(req);
} 