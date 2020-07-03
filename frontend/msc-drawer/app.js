const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
var fs = require("fs");

const messagesController = require('./controllers/api/messages.js');
const exportController = require('./controllers/api/export.js');
const homeController = require('./controllers/app/home.js');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('MongoDB connected successfully!');
});



app.set('views', [__dirname + '/views', __dirname + '/visualizer']);
app.use('/app', express.static('visualizer'));
app.set('view engine', 'ejs');
//app.use('/public', express.static('public'));
app.use('/script', express.static('script'));
app.use('/css', express.static('css'));
app.use('/temp', express.static('temp'));



app.use('/api', messagesController);
app.use('/api', exportController);


const router = express.Router();
router.get('/', (request, response) => {
  response.redirect('/app');
});
app.use('/', router);

app.use('/app', homeController);


app.set('port', (process.env.SERVER_PORT || 5000));

app.use(function (req, res, next) {
  console.log()
  res.status(404).redirect("/app/error");
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
