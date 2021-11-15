var express = require('express');
var config = require('./app');
var path = require("path");
var app = express();
require('dotenv').config();

app = config(app);
app.set("port", process.env.PORT || 5000);


//  Server
var server = app.listen(app.get("port"), function () {
  console.log("Server up: http://localhost:" + app.get("port"));
});