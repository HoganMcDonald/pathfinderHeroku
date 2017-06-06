//requires
var express = require('express');
var app = express();
var bodyPArser = require('body-parser');
var path = require('path');

//globals
var port = process.env.PORT || 7575;

//uses
app.use(express.static('public'));
app.use(bodyPArser.urlencoded({
  extended: true
}));

//spin up server
app.listen(port, function() {
  console.log('server up at ', port);
});

//send index
app.get('/', function(req, res) {
  res.sendFile(path.resolve('views/index.html'));
});
