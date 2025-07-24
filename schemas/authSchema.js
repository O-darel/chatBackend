const { z } = require('zod');

const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8),
});

module.exports = { signupSchema, loginSchema, resetPasswordSchema };