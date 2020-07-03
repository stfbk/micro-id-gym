const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var Message = require('../../models/messages');

router.get('/', (request, response) => {
  response.render("login.ejs");
});

router.get('/error', (request, response) => {
  response.render("error.ejs");
});

router.post('/msc', (request, response) => {
  // response.redirect("public/msc.html");
  if(request.body.sessionId != "")
    response.render("msc.ejs", {sessionId : request.body.sessionId});
  else
    response.render("login.ejs");
});

router.get('/message/:messageId', (request, response) => {
  if(request.params.messageId != "") {
    Message.findOne({_id : request.params.messageId})
    .then(result => {
      console.log(result);
      response.render("messageDetails.ejs", result);
    })
    .catch(error => {
      console.log(error);
      response.redirect("/app/error")
    });
  } else {
    response.redirect("/");
  }

});

module.exports = router;
