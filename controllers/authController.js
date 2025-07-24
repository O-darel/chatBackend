const authService = require('../services/authService');
const { signupSchema, loginSchema, resetPasswordSchema } = require('../schemas/authSchema');

class AuthController {
  async signup(req, res, next) {
    try {
      signupSchema.parse(req.body);
      const user = await authService.signup(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      loginSchema.parse(req.body);
      const { token, user } = await authService.login(req.body);
      res.json({ token, user });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      resetPasswordSchema.parse(req.body);
      await authService.resetPassword(req.body);
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();