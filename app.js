var express = require('express');
var routes = require('./routes');
var path = require('path');
var less = require('less-middleware'); 
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var LocalStorage = require('node-localstorage').LocalStorage;
var ls = new LocalStorage('./boards');
// all environments
app.set('port', process.env.PORT || 2000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(less({src: __dirname + '/public', compress: false}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket) {
  
  socket.on('load', function (data) {
    var name = data.name || 'default';
    socket.emit('settings', { name: name, settings: JSON.parse(ls.getItem(name)) });
  });

  socket.on('save', function (data) {
    var name = data.name || 'default';
    if(data.settings){
      ls.setItem(name, JSON.stringify(data.settings));
      //broadcast update to all other sockets
    }
    else {
      socket.emit('save', {err: 'invalid settings'});
    }
  });

});

