var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Chat-API'
  })
});

module.exports = router;
