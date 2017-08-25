require('underscore');
var chai = require('chai');
var uuid = require('uuid');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var fetchUserProfile = require('./slack-login').fetchUserProfile;

var expect = chai.expect;
var fetchUserProfile = SlackLogin.fetchUserProfile;
var providerKey = 'slack';

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
    user: {
      id: userId,
      name: name,
      email: email
    },
    team: {
      id: tenantId
    }
  }
}

function getData(userId, tenantId, name, email, accessToken) {
  return {
    input: getCtx(userId, tenantId, name, email),
    expected: getExpected(userId, tenantId, name, email, accessToken)
  }
}

describe('slack-login', function() {

  describe('provider specific', function() {

    describe('happy paths', function() { });

    describe('sad paths', function() {

       it('should fail gracefully when missing user', function(testCallback) {
         var tkn = uuid();
         var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
         var ctx = data.input;
         delete ctx.user
         var cb = function(error, actual) {
           expect(error).to.exist;
           expect(error.message).to.equal('BC-SLK-0001: Missing user')
           expect(actual).to.be.null;
           testCallback();
         }

         fetchUserProfile(tkn, ctx, cb);
       });

          it('should fail gracefully when missing team', function(testCallback) {
            var tkn = uuid();
            var data = getData(undefined, 'tenantId', 'name', 'email', tkn);
            var ctx = data.input;
            delete ctx.team
            var cb = function(error, actual) {
              expect(error).to.exist;
              expect(error.message).to.equal('BC-SLK-0002: Missing tenant')
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
