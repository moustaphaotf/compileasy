var express = require('express');
var router = express.Router();
const judge0URL = process.env.JUDGE0_URL;

router.get('/', async function(req, res, next) {
  const response = await fetch(`${judge0URL}/languages`);
  const data = await response.json();
  res.status(200).json(data);
});

module.exports = router;