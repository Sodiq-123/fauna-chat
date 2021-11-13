var express = require('express');
var router = express.Router();
var { createUser, loginUser, getAllUsers, getUserById } = require('../controllers/users')

router.post('/create', createUser)
router.post('/login', loginUser)
router.get('/all', getAllUsers)
router.get('/:id', getUserById)


module.exports = router;
