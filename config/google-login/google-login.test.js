require('underscore');
var chai = require('chai');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var fetchUserProfile = require('./google-login').fetchUserProfile;

var expect = chai.expect;
var providerKey = 'google';

function getExpected(userId, tenantId) {
  return {
    pro: providerKey,
    uid: userId,
    tid: tenantId
  }
}

/**
 *    TODO: Update this to return the same structure as the
 *          OAuth SaaS provider.
 */
function getCtx(userId, tenantId) {
  return {
    "token_type": "Bearer",
    "expires_in": 3600,
    "id_token": jwt.sign(
      {
        "azp": "527985049325-thcejvsobpgql0fhg21rpgu3c2d8p7dv.apps.googleusercontent.com",
        "aud": "527985049325-thcejvsobpgql0fhg21rpgu3c2d8p7dv.apps.googleusercontent.com",
        "sub": userId,
        "hd": tenantId,
        "email": "david.esposito@bettercloud.com",
        "email_verified": true,
        "at_hash": "2gOXFVHcw0Y-sEwQIWrREw",
        "iss": "https://accounts.google.com",
        "iat": 1503693497,
        "exp": 1503697097,
        "name": "David Esposito",
        "picture": "https://lh3.googleusercontent.com/-ytGeDlV1er4/AAAAAAAAAAI/AAAAAAAAAB0/FXCZESHLe2A/s96-c/photo.jpg",
        "given_name": "David",
        "family_name": "Esposito",
        "locale": "en"
      },
      '<test-secret>'
    )
  }
}

function getData(userId, tenantId) {
  return {
    input: getCtx(userId, tenantId),
    expected: getExpected(userId, tenantId)
  }
}

describe('google-login', function() {

  describe('provider specific', function() {

    describe('happy paths', function() { });

    describe('sad paths', function() {

      it('should fail gracefully when id token is missing', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId');
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
        var data = getData(undefined, 'tenantId');
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
        var data = getData('userId', 'tenantId');
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
        var data = getData(undefined, 'tenantId');
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
        var data = getData(undefined, 'tenantId');
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
        var data = getData(null, 'tenantId');
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
        var data = getData('userId', undefined);
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
        var data = getData('userId', undefined);
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
