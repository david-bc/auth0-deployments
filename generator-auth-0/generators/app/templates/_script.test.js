require('underscore');
var chai = require('chai');
var uuid = require('uuid');
var SlackLogin = require('./<%= name %>');

var expect = chai.expect;
var fetchUserProfile = SlackLogin.fetchUserProfile;
var providerKey = '<%= name %>';

function getExpected(userId, tenantId, name, email, accessToken) {
  return {
    pro: providerKey,
    //ac: accessToken, // TODO: should this connector return the token?
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
    userId: userId,
    tenantId: tenantId,
    name: name,
    email: email
  }
}

function getData(userId, tenantId, name, email, accessToken) {
  return {
    input: getCtx(userId, tenantId, name, email),
    expected: getExpected(userId, tenantId, name, email, accessToken)
  }
}

describe('<%= name %>', function() {

  describe('provider specific', function() {

    describe('happy paths', function() {

      /**
       *    TODO: Add happy path tests
       */
      it('should be replaced with real tests', function(testCallback) {
        throw new Error("placeholder test should be replaced");
      });

    });

    describe('sad paths', function() {

      /**
       *    TODO: Add sad path tests (graceful failure)
       */
      it('should be replaced with real tests', function(testCallback) {
        throw new Error("placeholder test should be replaced");
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
