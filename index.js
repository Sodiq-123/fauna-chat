var express = require('express');
var config = require('./app');
var path = require("path");
require('dotenv').config();
var app = express();
var socketio = require('socket.io')
var WebSockets = require('./src/utils/webSockets')

app = config(app);
app.set("port", process.env.PORT || 5000);


// WebSocket connection
global.io = socketio(server)
global.io.on('connection', WebSockets.connection)

//  Server
var server = app.listen(app.get("port"), function () {
  console.log("Server up: http://localhost:" + app.get("port"));
});