var dotenv = require('dotenv').config(),
    faunadb = require('faunadb'),
    bcrypt = require('bcrypt'),
    q = faunadb.query;
  
let Client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

