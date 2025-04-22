import { registerUser, loginUser } from '../controllers/authController.js';

export const registerRoute = async (req) => {
  return await registerUser(req);
};

export const loginRoute = async (req) => {
  return await loginUser(req);
}; 