const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/initiate', authMiddleware, chatController.initiateChat);
router.post('/message', authMiddleware, chatController.sendMessage);
router.get('/messages/:recipientCodename', authMiddleware, chatController.getMessages);

module.exports = router;