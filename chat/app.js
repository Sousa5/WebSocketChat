var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var index = require('./routes/index');
var chat = require('./routes/chat');
var Primus = require('primus');


var app = express();
var server = http.createServer(app).listen(8000);
var primus = new Primus(server,{transformer: 'websockets'});

console.log("Server is listening at port " + server.address().port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public'));

app.use('/', index);
app.use('/chat', chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// Function to generate random number to index array
function generateValue() {
  return parseInt(Math.random() * 10);
}

var arr = ["Hello","How are you?","Hello World","NodeJS","websockets","SLB","JavaScript","Programming","Fine","Games"];

primus.on('connection', function(spark) {
  spark.on("data", function(data) {
      spark.write("Server Received: " + data);
      spark.write("Server Response: " + arr[generateValue()]);
  }); 
});

primus.on('disconnection',function(spark) {
      console.log("Connection is closed!");
})
module.exports = app;
