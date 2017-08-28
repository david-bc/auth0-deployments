require('underscore');
var chai = require('chai');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var fetchUserProfile = require('./sfdc-login').fetchUserProfile;

var expect = chai.expect;
var providerKey = 'salesforce';

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
    "signature": "gFNR2+nRGxItY2ItPy6eH0eYxp6vhSNXhRGFWDK6Fdg=",
    "scope": "openid id",
    "id_token": '<some jwt value>',
    "instance_url": "https://na59.salesforce.com",
    "id": "https://login.salesforce.com/id/" + _.defaultTo(tenantId, '') +
        "/" + _.defaultTo(userId, ''),
    "token_type": "Bearer",
    "issued_at": "1503698679556"
  }
}

function getData(userId, tenantId) {
  return {
    input: getCtx(userId, tenantId),
    expected: getExpected(userId, tenantId)
  }
}

describe('sfdc-login', function() {

  describe('provider specific', function() {

    describe('happy paths', function() { });

    describe('sad paths', function() {

      it('should fail gracefully when missing identifier', function(testCallback) {
        var tkn = uuid();
        var data = getData(undefined, 'tenantId');
        var ctx = data.input;
        delete ctx.id
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-SFDC-0000: Invalid missing identifier')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

        it('should fail gracefully when malformed identifier', function(testCallback) {
          var tkn = uuid();
          var data = getData(undefined, 'tenantId');
          var ctx = data.input;
          ctx.id = 'testing :)'
          var cb = function(error, actual) {
            expect(error).to.exist;
            expect(error.message).to.equal('BC-SFDC-0001: Invalid identifier format')
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
