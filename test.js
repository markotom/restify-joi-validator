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
        param4: joi.number().valid([1,2,3])
      },
      queries: {
        param1: joi.string().valid(['foo', 'bar', 'meh']),
        param2: joi.string().email().required(),
        param3: joi.number().required()
      }
    }
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

  it('should return errors when attempting send wrong parameters', function () {
    // Set schema
    this.req.route.validations = { params: this.schemas.params };
    // Set params
    this.req.params = {
      // param1: jane@doe.com, << required parameter missing...
      param2: 'this is not a valid uri',
      param3: 'this is not a valid email',
      param4: 'this is not valid value',
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
});
