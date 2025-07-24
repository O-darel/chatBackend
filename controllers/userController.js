const userService = require('../services/userService');
const { updateProfileSchema } = require('../schemas/userSchema');

class UserController {
  async updateProfile(req, res, next) {
    try {
      updateProfileSchema.parse(req.body);
      const updatedProfile = await userService.updateProfile(req.user.id, req.body);
      res.json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();