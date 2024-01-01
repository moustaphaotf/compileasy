var express = require('express');
var router = express.Router();

/* Compile code sent by the user */
router.post('/', function(req, res, next) {
  console.log(req.body);
  res.status(200).json({message: "We will compile soon !"});
});

module.exports = router;