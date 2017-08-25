require('underscore');
var chai = require('chai');
var SlackLogin = require('../slack-login/slack-login');

var expect = chai.expect;
var fetchUserProfile = SlackLogin.fetchUserProfile;
var providerKey = 'slack';

function getExpected(userId, tenantId, name, email) {
  return {
    pro: providerKey,
    uid: userId,
    tid: tenantId,
    name: name,
    email: email
  }
}

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

function getData(userId, tenantId, name, email) {
  return {
    input: getCtx(userId, tenantId, name, email),
    expected: getExpected(userId, tenantId, name, email)
  }
}

describe('slack-login', function() {

  describe('common OAuth', function() {

    describe('happy paths', function() {

      it('should return all fields when the full user is presented', function(testCallback) {
        var data = getData('userId', 'tenantId', 'name', 'email');
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when missing email', function(testCallback) {
        var data = getData('userId', 'tenantId', 'name', undefined);
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when email is null', function(testCallback) {
        var data = getData('userId', 'tenantId', 'name', null);
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when missing name', function(testCallback) {
        var data = getData('userId', 'tenantId', undefined, 'email');
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.be.null;
          expect(actual).to.deep.equal(data.expected)
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should not fail when name is null', function(testCallback) {
        var data = getData('userId', 'tenantId', null, 'email');
        var tkn = '';
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

      it('should fail gracefully when missing user id', function(testCallback) {
        var data = getData(undefined, 'tenantId', 'name', 'email');
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0000: Missing user ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when user id is null', function(testCallback) {
        var data = getData(null, 'tenantId', 'name', 'email');
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0000: Missing user ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when missing tenant id', function(testCallback) {
        var data = getData('userId', undefined, 'name', 'email');
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0001: Missing tenant ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when tenant id is null', function(testCallback) {
        var data = getData('userId', undefined, 'name', 'email');
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-OA-0001: Missing tenant ID')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

    });

  });

  describe('provider specific', function() {

    describe('sad paths', function() {

      it('should fail gracefully when missing user', function(testCallback) {
        var data = getData('userId', 'tenantId', 'name', 'email');
        delete data.input.user;
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-SLK-0000: Missing User Object')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

      it('should fail gracefully when missing team', function(testCallback) {
        var data = getData('userId', 'tenantId', 'name', 'email');
        delete data.input.team;
        var tkn = '';
        var ctx = data.input;
        var cb = function(error, actual) {
          expect(error).to.exist;
          expect(error.message).to.equal('BC-SLK-0001: Missing Team/Tenant Object')
          expect(actual).to.be.null;
          testCallback();
        }

        fetchUserProfile(tkn, ctx, cb);
      });

    });

  });

});
