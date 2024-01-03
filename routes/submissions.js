var express = require('express');
var router = express.Router();
const judge0URL = process.env.JUDGE0_URL;

/* Compile code sent by the user */
router.post('/', async function(req, res, next) {
  const source_code = req.body.code;
  const language_id = req.body.lang;

  // Now send data to Judge0 for compiling
  const body = { 
    source_code, 
    language_id 
  };

  const response = await fetch(`${judge0URL}/submissions`, { 
    body : JSON.stringify(body) ,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }
  });
  const data = await response.json();
  console.log(data)
  res.status(response.status).json(data);
});


router.get('/:token_id', async function(req, res, next) {
  const token_id = req.params.token_id;

  // Get the data from the token_id
  const response = await fetch(`${judge0URL}/submissions/${token_id}`);
  const data = await response.json();
  console.log(data);
  res.status(response.status).json(data);
});


module.exports = router;