const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require("fs");
const fetch = require('node-fetch');

router.get('/', (request, response) => {
  response.render("standard.ejs");
});

router.get('/error', (request, response) => {
  response.render("error.ejs");
});

router.get('/standard', (request, response) => {
  response.render("standard.ejs");
});


router.get('/custom', (request, response) => {
  if(request.query.filename != "") {
    data = fs.readFileSync('./temp/' + request.query.filename, 'utf8');
    try {
      fs.unlinkSync('./temp/' + request.query.filename)
      console.log('./temp/' + request.query.filename + " removed");
    } catch(err) {
      console.error(err)
    }
    response.render("custom.ejs", {data : data});
  }
  else
    response.redirect("/error")
});




router.post('/stix/generate', (request, response) => {
  tmp = JSON.parse(JSON.stringify(stixTableJson));
  paramList = JSON.parse(request.body.paramList);
  for(i = 0; i < paramList.length; i++)
    paramList[i] = paramList[i].trim();
  paramList = paramList.filter(item => item);
  filteredObjectList = extractStixFromParams(paramList);
  if(filteredObjectList.length > 0) {
    tmp.objects = filteredObjectList;
    random = getRandom();
    filename = 'tmp-custom-' + random + '.json';
    fs.writeFileSync('./temp/' + filename, JSON.stringify(tmp));
    response.redirect("/custom?filename=" + filename);
  } else {
    response.render("noStixError.ejs")
  }
});





function extractStixFromParams(paramList) {
  filteredObjectList = [];
  if(paramList.length > 0){
    objectList = [];
    identityList = [];
    tmp = JSON.parse(JSON.stringify(stixTableJson));
    // console.log(paramList);

    for(i = 0; i < tmp.objects.length; i++) {
      if(tmp.objects[i].type == "identity") {
        identityList.push(tmp.objects[i].id);
      } else if(tmp.objects[i].type == "vulnerability") {
        for(j = 0; j < paramList.length; j++){
          if(tmp.objects[i].description.toLowerCase().includes(paramList[j].toLowerCase()) || tmp.objects[i].labels.includes(paramList[j])){
            objectList.push(tmp.objects[i].id);
          }
        }
      } else if(tmp.objects[i].type != "relationship") {
        for(j = 0; j < paramList.length; j++){
          if(tmp.objects[i].description.toLowerCase().includes(paramList[j].toLowerCase())) {
            objectList.push(tmp.objects[i].id);
          }
        }
      }
    }

    for(i = 0; i < tmp.objects.length; i++) {
      if(tmp.objects[i].type == "relationship") {
        if(objectList.includes(tmp.objects[i].source_ref)){
          objectList.push(tmp.objects[i].id);
          objectList.push(tmp.objects[i].target_ref);
        } else if (objectList.includes(tmp.objects[i].target_ref)) {
          objectList.push(tmp.objects[i].id);
          objectList.push(tmp.objects[i].source_ref);
        }
      }
    }

    if(objectList.length > 0) {
      objectList.push(identityList);

      for(i = 0; i < tmp.objects.length; i++) {
        if(objectList.includes(tmp.objects[i].id))
          filteredObjectList.push(tmp.objects[i]);
      }
    }
  }
  return filteredObjectList;
}

function getRandom() {
  random = Math.random() + "";
  random = random.substring(2, random.length);
  return random;
}




module.exports = router;
