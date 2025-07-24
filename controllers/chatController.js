const chatService = require('../services/chatService');
const { messageSchema } = require('../schemas/chatSchema');

class ChatController {
  async initiateChat(req, res, next) {
    try {
      const { recipientCodename } = req.body;
      const session = await chatService.initiateChat(req.user.id, recipientCodename);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req, res, next) {
    try {
      messageSchema.parse(req.body);
      const message = await chatService.sendMessage(req.user.id, req.body.recipientCodename, req.body.content);
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  async getMessages(req, res, next) {
    try {
      const { recipientCodename } = req.params;
      const messages = await chatService.getMessages(req.user.id, recipientCodename);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatController();