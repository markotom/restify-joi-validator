'use strict';

var assert = require('assert');
var validator = require('./index');
var sinon = require('sinon');
var joi = require('joi');

describe('Middleware', function () {
  beforeEach(function () {
    this.next = sinon.spy();
    this.res = { send: sinon.spy() };
    this.req = { route: { url: '/foo' } };
    this.schemas = {
      params: {
        param1: joi.string().required(),
        param2: joi.string().uri(),
        param3: joi.string().email(),
        param4: joi.number().valid([1,2,3]),
        param5: joi.string().default('Default value')
      },
      body: {
        param1: joi.string().valid(['foo', 'bar', 'meh']),
        param2: joi.string().email().required(),
        param3: joi.number().required(),
        param4: joi.string().default('Default value')
      }
    };
  });

  it('should be a function', function () {
    assert.equal(typeof validator, 'function');
  });

  it('should returns a function as middleware', function () {
    assert.equal(typeof validator(), 'function');
  });

  it('should work without defining schema validations', function () {
    validator()(this.req, this.res, this.next);
    assert(this.next.calledOnce);
  });

  it('should return errors when attempting send wrong query params', function () {
    this.req.route.validations = { params: this.schemas.params };
    this.req.params = {
      // param1: 'jane@doe.com', << required parameter missing...
      param2: 'this is not a valid uri',
      param3: 'this is not a valid email',
      param4: 'this is not valid value',
      param5: 'Another value',
      wrongParam: 'there is no parameter in the schema named as `wrongParam`'
    };

    validator()(this.req, this.res, this.next);

    assert(this.res.send.calledOnce);
    assert(this.res.send.calledWith(400));
    assert(this.res.send.args[0][1]);
    assert.equal(typeof this.res.send.args[0][1], 'object');
    assert.equal(typeof this.res.send.args[0][1].status, 'string');
    assert(this.res.send.args[0][1].errors);
    assert.equal(typeof this.res.send.args[0][1].errors, 'object');
  });

  it('should pass the query parameter validations', function () {
    this.req.route.validations = { params: this.schemas.params };
    this.req.params = {
      param1: 'Required parameter',
      param2: 'http://www.google.com',
      param3: 'jane@doe.com',
      param4: 2
    };

    validator()(this.req, this.res, this.next);

    assert(this.res.send.notCalled);
    assert(this.res.send.neverCalledWith(400));
    assert(this.next.calledOnce);
    assert.equal(this.req.params.param5, 'Default value');
  });

  it('should return errors when attempting send wrong body params', function () {
    this.req.route.validations = { body: this.schemas.body };
    this.req.body = {
      param1: 'invalid',
      // param2: 'john@doe.com', // << required param missing
      // param3: 100, // << required param missing
      param4: 'Another value',
      wrongParam: 'there is no parameter in the schema named as `wrongParam`'
    };

    validator()(this.req, this.res, this.next);

    assert(this.res.send.calledOnce);
    assert(this.res.send.calledWith(400));
    assert(this.res.send.args[0][1]);
    assert.equal(typeof this.res.send.args[0][1], 'object');
    assert.equal(typeof this.res.send.args[0][1].status, 'string');
    assert(this.res.send.args[0][1].errors);
    assert.equal(typeof this.res.send.args[0][1].errors, 'object');
  });

  it('should pass the body parameter validations', function () {
    this.req.route.validations = { body: this.schemas.body };
    this.req.body = {
      param1: 'meh',
      param2: 'john@doe.com',
      param3: 100
    };

    validator()(this.req, this.res, this.next);

    assert(this.res.send.notCalled);
    assert(this.res.send.neverCalledWith(400));
    assert(this.next.calledOnce);
    assert.equal(this.req.body.param4, 'Default value');
  });
});
