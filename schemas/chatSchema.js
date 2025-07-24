const { z } = require('zod');

const messageSchema = z.object({
  recipientCodename: z.string().min(3).max(50),
  content: z.string().min(1),
});

module.exports = { messageSchema };