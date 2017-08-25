require('underscore');
var chai = require('chai');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var fetchUserProfile = require('./azure-login').fetchUserProfile;

var expect = chai.expect;
var providerKey = 'azure';

function getExpected(userId, tenantId, name, email, accessToken) {
  return {
    pro: providerKey,
    uid: userId,
    tid: tenantId,
    name: name,
    email: email
  }
}

/**
 *    TODO: Update this to return the same structure as the
 *          OAuth SaaS provider.
 */
function getCtx(userId, tenantId, name, email) {
  return {
    id_token: jwt.sign(
      {
        "aud": "28309bfc-6c2c-4904-9e3c-858b5141c30f",
        "iss": "https://login.microsoftonline.com/e4afb9bd-db36-45d5-a0ec-ebff00364482/v2.0",
        "iat": 1503696545,
        "nbf": 1503696545,
        "exp": 1503700445,
        "aio": "ATQAy/8EAAAA21+UoX+4NsYhaxo/EThN6vknGQpdfxaWCC0Syv6Gs985mh4Lmj6zPcTgL0jqjVOb",
        "name": name,
        "oid": userId,
        "preferred_username": email,
        "sub": "zGvygs8EVIDxliPJ-ZV7Ho-egTbO-O43oqOK9O4GCJs",
        "tid": tenantId,
        "ver": "2.0"
      },
      '<secret>'
    )
  }
}

function getData(userId, tenantId, name, email, accessToken) {
  return {
    input: getCtx(userId, tenantId, name, email),
    expected: getExpected(userId, tenantId, name, email, accessToken)
  }
}

describe('azure-login', function() {

  describe('provider specific', function() {

    describe('happy paths', function() { });

    describe('sad paths', function() {

      it('should fail gracefully when missing id token', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
        var ctx = data.input;
        delete ctx.id_token
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-AZU-0000: Invalid missing id token')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when invalid id token format', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
        var ctx = data.input;
        ctx.id_token = 'Not a valid JWT'
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-AZU-0001: Invalid id token format')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

    });

  });

  describe('common OAuth', function() {

    describe('happy paths', function() {

      it('should return all fields when the full user is presented', function(testCallback) {
        var tkn = uuid();
        var data = getData('userId', 'tenantId', 'name', 'email', tkn, tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when missing email', function(testCallback) {
        var tkn = uuid();
        var data = getData('userId', 'tenantId', 'name', undefined, tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when email is null', function(testCallback) {
        var tkn = uuid();
        var data = getData('userId', 'tenantId', 'name', null, tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when missing name', function(testCallback) {
        var tkn = uuid();
        var data = getData('userId', 'tenantId', undefined, 'email', tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when name is null', function(testCallback) {
        var tkn = uuid();
        var data = getData('userId', 'tenantId', null, 'email', tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

    });

    describe('sad paths', function() {

      it('should fail gracefully when missing authentication information', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
        var ctx = null;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0000: Invalid missing authentication information')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when missing user id', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0001: Missing user ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when user id is null', function(testCallback) {
        var tkn = uuid();
        var data = getData(null, 'tenantId', 'name', 'email', tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0001: Missing user ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when missing tenant id', function(testCallback) {
        var tkn = uuid();
        var data = getData('userId', undefined, 'name', 'email', tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0002: Missing tenant ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when tenant id is null', function(testCallback) {
        var tkn = uuid();
        var data = getData('userId', undefined, 'name', 'email', tkn);
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0002: Missing tenant ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

    });

  });

});
