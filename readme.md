Restify Joi Validator
===============
>Validator for [Restify](http://mcavage.me/node-restify) using [Joi](https://github.com/hapijs/joi).

[![Build Status](https://travis-ci.org/markotom/restify-joi-validator.svg?branch=master)](https://travis-ci.org/markotom/restify-joi-validator)
[![npm version](https://badge.fury.io/js/restify-joi-validator.svg)](http://badge.fury.io/js/restify-joi-validator)

#  Install

```js
$ npm install restify-joi-validator --save
```

# Usage

```js
var restify = require('restify');
var joi = require('joi');
var validator = require('restify-joi-validator');
var server = restify.createServer();

server.use(restify.bodyParser());
// Add restify validator
server.use(validator());
```

# Example

```js
server.get({
  path: '/article/:id',
  validations: {
    params: {
      id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
    },
    body: {
      param1: joi.string().required(),
      param2: joi.string().email(),
      param3: joi.string().uri()
    }
  }
}, function (req, res, next) {
  console.log(req.body, req.params);
  res.send(200);
});
```

## License

The MIT License (MIT)

Copyright (c) 2015 Marco Godínez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
