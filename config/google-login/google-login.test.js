require('underscore');
var chai = require('chai');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var fetchUserProfile = require('./google-login').fetchUserProfile;

var expect = chai.expect;
var fetchUserProfile = SlackLogin.fetchUserProfile;
var providerKey = 'google';

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
    "token_type": "Bearer",
    "expires_in": 3600,
    "id_token": jwt.sign(
      {
        "azp": "527985049325-thcejvsobpgql0fhg21rpgu3c2d8p7dv.apps.googleusercontent.com",
        "aud": "527985049325-thcejvsobpgql0fhg21rpgu3c2d8p7dv.apps.googleusercontent.com",
        "sub": userId,
        "hd": tenantId,
        "email": email,
        "email_verified": true,
        "at_hash": "2gOXFVHcw0Y-sEwQIWrREw",
        "iss": "https://accounts.google.com",
        "iat": 1503693497,
        "exp": 1503697097,
        "name": name,
        "picture": "https://lh3.googleusercontent.com/-ytGeDlV1er4/AAAAAAAAAAI/AAAAAAAAAB0/FXCZESHLe2A/s96-c/photo.jpg",
        "given_name": "David",
        "family_name": "Esposito",
        "locale": "en"
      },
      '<test-secret>'
    )
  }
}

function getData(userId, tenantId, name, email, accessToken) {
  return {
    input: getCtx(userId, tenantId, name, email),
    expected: getExpected(userId, tenantId, name, email, accessToken)
  }
}

describe('google-login', function() {

  describe('provider specific', function() {

    describe('happy paths', function() { });

    describe('sad paths', function() {

      it('should fail gracefully when id token is missing', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
        var ctx = data.input;
        delete ctx.id_token;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-GOO-0000: Invalid missing id token')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when id token is not an object', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
        var ctx = data.input;
        ctx.id_token = 'probably not a valid jwt value';
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-GOO-0001: Invalid id token format')
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
