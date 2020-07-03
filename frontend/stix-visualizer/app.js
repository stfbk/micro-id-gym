const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
var fs = require("fs");

const stixController = require('./controllers/stix.js');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.set('views', [__dirname + '/views', __dirname + '/visualizer']);
app.use('/', express.static('visualizer'));
app.set('view engine', 'ejs');
app.use('/temp', express.static('temp'));




app.use('/', stixController);


app.set('port', (process.env.SERVER_PORT || 5555));

app.use(function (req, res, next) {
  console.log()
  res.status(404).redirect("/error");
});


var stixTable = fs.readFileSync("SAML_Table_Filter_distinct.json");
global.stixTableJson = JSON.parse(stixTable);


app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
