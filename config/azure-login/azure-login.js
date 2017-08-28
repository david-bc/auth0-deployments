// generated with yo auth-0 v0.1.2
exports.fetchUserProfile = function(accessToken, ctx, cb) {
  var _ = require('lodash');
  var jwt = require('jsonwebtoken');
  // var request = require('request');
  if (!ctx) {
    cb(new Error('BC-OA-0000: Invalid missing authentication information'), null)
    return;
  } else if (!ctx.id_token) {
    cb(new Error('BC-AZU-0000: Invalid missing id token'), null)
    return;
  }

  var token = jwt.decode(ctx.id_token);

  if (!_.isPlainObject(token)) {
    cb(new Error('BC-AZU-0001: Invalid id token format'), null)
    return;
  }

  var uid = token.oid;
  var tid = token.tid;

  if (!uid) {
    cb(new Error('BC-OA-0001: Missing user ID'), null)
  } if (!tid) {
    cb(new Error('BC-OA-0002: Missing tenant ID'), null)
  } else {
    var profile = {
      pro: 'azure',
      uid: uid,
      tid: tid
    };
    cb(null, profile);
  }
}
