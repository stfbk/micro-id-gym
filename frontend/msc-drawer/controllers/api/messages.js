const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var Message = require('../../models/messages');


router.get('/message/:sessionId', (request, response) => {
  Message.find({sessionId : request.params.sessionId}).sort({created_at: 1})
  .then(result => {
    response.json(result);
    // console.log(result);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  });
});

router.post('/message', (request, response) => {
  message = new Message();
  message.sessionId = request.body.sessionId;
  message.from = request.body.from;
  message.to = request.body.to;
  message.label = request.body.label;
  if(request.body.headers == '')
    request.body.headers = [];
  if(request.body.params == '')
    request.body.params = [];
  try{
    message.headers = JSON.parse(request.body.headers);
  } catch(e) {
    console.log("Error " +  e + "\nIn message " + request.body.label + " on headers values \n" + request.body.headers);
    message.headers = request.body.headers || [];
  }
  try{
    message.params = JSON.parse(request.body.params);
  } catch(e) {
    console.log("Error " +  e + "\nIn message " + request.body.label + " on params values \n" + request.body.params);
    message.params = request.body.params || [];
  }

  message.body = request.body.body || "";
  if(request.body.created_at)
    message.created_at = request.body.created_at;
  if(request.body.read_only)
    message.read_only = request.body.read_only;

  message.save()
  .catch(function(error){
    console.log(error);
    response.send(error);
    response.end();
  });
  response.send('Message added');
  // console.log("Message added");
  // console.log(request.body);
});

router.delete('/message/:sessionId', (request, response) => {
  Message.deleteMany({sessionId : request.params.sessionId, read_only : 'false'})
  .catch(error => {
    response.send(error);
    response.end();
  });
  response.send('Messages deleted');
});


router.get('/message/:sessionId/host/:hostName', (request, response) => {
  Message.find({sessionId : request.params.sessionId, $where: "(this.from == '" + request.params.hostName + "') || (this.to == '" + request.params.hostName + "')" }).sort({created_at: 1})
  .then(result => {
    response.json(result);
    // console.log(result);
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  });
});


router.get('/host/:sessionId', (request, response) => {
  Message.find({sessionId : request.params.sessionId}).sort({created_at: 1})
  .then(result => {
    hostList = [];
    for(i = 0; i < result.length; i++) {
      if(result[i].from == "User Agent")
        hostList.push(result[i].to);
      else
        hostList.push(result[i].from);
    }
    hostList =  [...new Set(hostList)];
    response.json({hostList: hostList});
  })
  .catch(error => {
    console.log(error);
    res.send(error);
  });
});


router.delete('/clean', (request, response) => {
  if(request.body.password == "msc_MicroID_FBK"){
    Message.deleteMany()
    .catch(error => {
      response.send(error);
      response.end();
    });
    response.send('All messages deleted');
  } else {
    response.send('The parameter is not correct. Please try again.');
  }
});


module.exports = router;
