import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';

export const registerRoute = async (req) => {
  return await registerUser(req);
};

export const loginRoute = async (req) => {
  return await loginUser(req);
};

export const forgotPasswordRoute = async (req) => {
  return await forgotPassword(req);
};

export const resetPasswordRoute = async (req) => {
  return await resetPassword(req);
}; 