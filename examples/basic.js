'use strict';

var restify = require('restify');
var joi = require('joi');
var validator = require('../index');
var server = restify.createServer();

server.use(restify.bodyParser());
server.use(restify.queryParser());
server.use(validator());

server.post({
  path: '/article/:id',
  validations: {
    params: {
      id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
    },
    body: {
      param1: joi.string().required(),
      param2: joi.string().email(),
      param3: joi.string().uri()
    },
    query: {
      param4: joi.string()
    }
  }
}, function (req, res) {
  console.log(req.params, req.body, req.query);
  res.send(200);
});

server.listen(3000);
