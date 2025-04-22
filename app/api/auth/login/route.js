import { loginRoute } from '@/Backend/routes/authRoutes.js';

export async function POST(req) {
  return await loginRoute(req);
} 