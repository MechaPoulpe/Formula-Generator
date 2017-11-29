//-----------------------------------------------//
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var gen = require('./gen.js')
//-----------------------------------------------//


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.htm');
});

io.on('connection', function(socket){
    console.log('Connection OK');
    socket.on('data', function(data){
        gen.main(data, socket);
      });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});