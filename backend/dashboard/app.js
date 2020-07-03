const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


const dashboardController = require('./controllers/dashboard.js');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/script', express.static('script'));
app.use('/css', express.static('css'));
global.appRoot = path.resolve(__dirname);
console.log(global.appRoot);



app.use('/', dashboardController);


app.set('port', 2020);

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
