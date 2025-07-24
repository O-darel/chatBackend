const { z } = require('zod');

const updateProfileSchema = z.object({
  codename: z.string().min(3).max(50),
});

module.exports = { updateProfileSchema };