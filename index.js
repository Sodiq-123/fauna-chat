var express = require('express');
var config = require('./app');
var path = require("path");
require('dotenv').config();
var app = express();

app = config(app);
app.set("port", process.env.PORT || 5000);

//  Server
var server = app.listen(app.get("port"), function () {
  console.log("Server up: http://localhost:" + app.get("port"));
});