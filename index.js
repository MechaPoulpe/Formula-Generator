//-----------------------------------------------//
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var gen = require('./gen.js')
//-----------------------------------------------//

io.on('connection', function(socket){
    console.log('Connection OK');
    socket.on('data', function(data){
        gen.main(data, socket);
      });
  });

http.listen(8000, function(){
  console.log('listening on *:8000');
});