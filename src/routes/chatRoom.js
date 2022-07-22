var express = require('express');
var router = express.Router()
var { verifyToken } = require('../middlewares/auth')
var { sendMessage, createChatRoom, addUserToChatRoom, getChatRoomById, getChatRooms, markMessageAsRead, getChatRoomForUser } = require('../controllers/chatRoom')


router.post('/create-room', verifyToken, createChatRoom)
router.post('/send-message', verifyToken, sendMessage)
router.post('/add-to-chat-room/:chatRoomId', verifyToken, addUserToChatRoom)
router.get('/get-chat-room/:chatRoomId', verifyToken, getChatRoomById)
router.get('/chat-rooms', verifyToken, getChatRooms)
router.get('/chat-rooms-for-user/:userId', verifyToken, getChatRoomForUser)
router.patch('/:messageId/mark-read', verifyToken, markMessageAsRead)

module.exports = router; // Export the router