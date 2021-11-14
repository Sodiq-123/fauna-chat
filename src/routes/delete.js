var express = require('express');
var router = express.Router();
var { verifyToken } = require('../middlewares/auth')
var { deleteUser, deleteMessageById, deleteRoomById } = require('../controllers/delete')



router.delete('/user/:id', verifyToken, deleteUser)
router.delete('/room/:roomId', verifyToken, deleteRoomById)
router.delete('/message/:messageId', verifyToken, deleteMessageById)

module.exports = router;