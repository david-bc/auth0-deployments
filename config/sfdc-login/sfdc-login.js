// generated with yo auth-0 v0.1.3
exports.fetchUserProfile = function(accessToken, ctx, cb) {
  var _ = require('lodash');
  // var jwt = require('jsonwebtoken');
  // var request = require('request');
  if (!ctx) {
    cb(new Error('BC-OA-0000: Invalid missing authentication information'), null)
    return;
  } else if (!ctx.id) {
    cb(new Error('BC-SFDC-0000: Invalid missing identifier'), null)
    return;
  }

  var ptn = /^https:\/\/login\.salesforce\.com\/id\/([0-9a-zA-Z]*)\/([0-9a-zA-Z]*)$/
  var match = ptn.exec(ctx.id)

  if (!match) {
    cb(new Error('BC-SFDC-0001: Invalid identifier format'), null)
    return;
  }

  var uid = match[2];
  var tid = match[1];

  if (!_.isString(uid) || uid.length === 0) {
    cb(new Error('BC-OA-0001: Missing user ID'), null)
  } else if (!_.isString(tid) || tid.length === 0) {
    cb(new Error('BC-OA-0002: Missing tenant ID'), null)
  } else {
    var profile = {
      pro: 'salesforce',
      uid: uid,
      tid: tid
    };
    cb(null, profile);
  }
}
