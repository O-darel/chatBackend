const userService = require('../services/userService');
const { updateProfileSchema } = require('../schemas/userSchema');

class UserController {

    async getProfile(req, res, next) {
    try {
      const profile=await userService.getUserProfile(req.user.id)
      console.log(profile)
      res.json(profile || {});
    } catch (error) {
      next(error);
    }
  }


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