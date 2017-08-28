// generated with yo auth-0 v0.1.1
exports.fetchUserProfile = function(accessToken, ctx, cb) {
  var _ = require('lodash');
  var jwt = require('jsonwebtoken');
  // var request = require('request');
  if (!ctx) {
    cb(new Error('BC-OA-0000: Invalid missing authentication information'), null)
    return;
  }

  if (!ctx.id_token) {
    cb(new Error('BC-GOO-0000: Invalid missing id token'), null)
    return;
  }

  var payload = jwt.decode(ctx.id_token);

  if (!_.isPlainObject(payload)) {
    cb(new Error('BC-GOO-0001: Invalid id token format'), null)
  } else if (!payload.sub) {
    cb(new Error('BC-OA-0001: Missing user ID'), null)
  } else if (!payload.hd) {
    cb(new Error('BC-OA-0002: Missing tenant ID'), null)
  } else {
    cb(null, {
      pro: 'google',
      uid: payload.sub,
      tid: payload.hd
    });
  }
}
