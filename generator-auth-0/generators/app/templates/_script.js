// generated with yo auth-0 v<%= version %>
exports.fetchUserProfile = function(accessToken, ctx, cb) {
  // var _ = require('lodash');
  // var jwt = require('jsonwebtoken');
  // var request = require('request');
  if (!ctx) {
    cb(new Error('BC-OA-0000: Invalid missing authentication information'), null)
    return;
  }

  var uid = ctx.userId;
  var tid = ctx.tenantId;

  if (!uid) {
    cb(new Error('BC-OA-0001: Missing user ID'), null)
  } else if (!tid) {
    cb(new Error('BC-OA-0002: Missing tenant ID'), null)
  } else {
    var profile = {
      pro: '<%= provider %>',
      uid: uid,
      tid: tid
    };
    cb(null, profile);
  }
}
