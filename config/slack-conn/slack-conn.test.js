require('underscore');
var chai = require('chai');
var uuid = require('uuid');
var SlackLogin = require('./slack-conn');

var expect = chai.expect;
var fetchUserProfile = SlackLogin.fetchUserProfile;
var providerKey = 'slack-conn';

function getExpected(userId, tenantId, name, email, accessToken) {
  return {
    pro: providerKey,
    ac: accessToken,
    uid: userId,
    tid: tenantId,
    name: name
  }
}

/**
 *    TODO: Update this to return the same structure as the
 *          OAuth SaaS provider.
 */
function getCtx(userId, tenantId, name, email) {
  return {
    user_id: userId,
    team_id: tenantId,
    name: name
  }
}

function getData(userId, tenantId, name, email, accessToken) {
  return {
    input: getCtx(userId, tenantId, name, email),
    expected: getExpected(userId, tenantId, name, email, accessToken)
  }
}

describe('slack-conn', function() {

  describe('provider specific', function() {

    describe('happy paths', function() { });

    describe('sad paths', function() { });

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
