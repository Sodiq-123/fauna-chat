var express = require('express');
var router = express.Router();
var { deleteUser, deleteMessageById, deleteRoomById } = require('../controllers/delete')



router.delete('/:id', deleteUser)
// router.delete('/', deleteRoomById)
// router.delete('/', deleteMessageById)

module.exports = router;