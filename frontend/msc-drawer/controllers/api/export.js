const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var Message = require('../../models/messages');

router.get('/export/:sessionId', (request, response) => {
  Message.find({sessionId : request.params.sessionId})
  .then(results => {
    response.json(results);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  });
});

router.get('/post', (request, response) => {
  Message.find()
  .then(results => {
    response.json(results);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  });
});




module.exports = router;
